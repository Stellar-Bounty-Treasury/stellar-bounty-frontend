import {
  Horizon,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  Keypair,
  StrKey,
  Contract,
  Address,
  nativeToScVal,
  rpc,
} from '@stellar/stellar-sdk';
import { isConnected, getAddress, signTransaction } from '@stellar/freighter-api';

export function isValidStellarAddress(address: string): boolean {
  return typeof address === 'string' && address.length === 56 && address.startsWith('G') && StrKey.isValidEd25519PublicKey(address);
}

export const TESTNET_HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const TESTNET_PASSPHRASE = Networks.TESTNET;
export const EXPLORER_BASE_URL = 'https://stellar.expert/explorer/testnet/tx';
export const CONTRACT_EXPLORER_BASE_URL = 'https://stellar.expert/explorer/testnet/contract';
export const SOROBAN_CONTRACT_ID =
  import.meta.env.VITE_SOROBAN_CONTRACT_ID || 'CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52';
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
export const ESCROW_VAULT_ADDRESS =
  import.meta.env.VITE_ESCROW_VAULT_ADDRESS || 'GD6DQE75KKO6Y3SA76IXGQH2GFFUULPUTQUQ3LXIPRDJ66K2UUGDF2DN';

export const horizonServer = new Horizon.Server(TESTNET_HORIZON_URL);
export const sorobanServer = new rpc.Server(SOROBAN_RPC_URL);

export interface SubmitResult {
  successful: boolean;
  hash: string;
  ledger?: number;
  explorerUrl: string;
}

export const stellar = {
  /**
   * Fetches native XLM balance for an address directly from Stellar Testnet Horizon.
   */
  async getXlmBalance(address: string): Promise<number> {
    try {
      const account = await horizonServer.loadAccount(address);
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
    } catch (err: any) {
      if (err.name === 'NotFoundError' || err.response?.status === 404) {
        return 0; // Account not yet funded on Testnet
      }
      throw new Error(`Failed to load Stellar account: ${err.message || err}`);
    }
  },

  /**
   * Request 10,000 testnet XLM from Stellar Friendbot for an address.
   */
  async fundWithFriendbot(address: string): Promise<boolean> {
    const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Friendbot funding failed: ${body}`);
    }
    return true;
  },

  /**
   * Checks if Freighter extension is installed and available.
   */
  async isFreighterInstalled(): Promise<boolean> {
    try {
      const result = await isConnected();
      return !!result;
    } catch {
      return false;
    }
  },

  /**
   * Retrieves public key/address from Freighter wallet.
   */
  async getFreighterAddress(): Promise<string> {
    const res = await getAddress();
    if (!res || !res.address) {
      throw new Error('No address returned from Freighter wallet.');
    }
    return res.address;
  },

  /**
   * Builds and submits a REAL Stellar Testnet escrow transaction.
   * If a contractId is provided, attempts to invoke the Soroban `fund_bounty` escrow contract.
   * Otherwise routes payment to the verified escrow destination.
   * If a secretKey is passed, signs directly with Keypair (ideal for dev/testing).
   * Otherwise prompts Freighter wallet for signature.
   */
  async submitContributionPayment(
    senderAddress: string,
    destinationAddress: string,
    amountXlm: string | number,
    secretKey?: string,
    contractId?: string
  ): Promise<SubmitResult> {
    // 1. Load account sequence number from Testnet Horizon
    const senderAccount = await horizonServer.loadAccount(senderAddress);

    // 2. Fetch network fee stats
    const feeStats = await horizonServer.feeStats().catch(() => null);
    const baseFee = feeStats?.fee_charged?.max || '1000';

    // 3. If contractId or Soroban contract address, attempt on-chain Soroban escrow call first
    const targetContract = contractId || (destinationAddress.startsWith('C') ? destinationAddress : null);
    if (targetContract) {
      try {
        const contract = new Contract(targetContract);
        const stroops = BigInt(Math.round(Number(amountXlm) * 10000000));
        const rawSorobanTx = new TransactionBuilder(senderAccount, {
          fee: baseFee,
          networkPassphrase: TESTNET_PASSPHRASE,
        })
          .addOperation(
            contract.call(
              'fund_bounty',
              new Address(senderAddress).toScVal(),
              nativeToScVal(1, { type: 'u64' }),
              nativeToScVal(stroops, { type: 'i128' })
            )
          )
          .setTimeout(30)
          .build();

        // Simulate on Soroban RPC to acquire footprint and resource fee estimates
        const simRes = await sorobanServer.simulateTransaction(rawSorobanTx);
        if (rpc.Api.isSimulationSuccess(simRes)) {
          const preparedTx = rpc.assembleTransaction(rawSorobanTx, simRes).build();
          let signedSorobanTx: any;
          if (secretKey) {
            const signerKeypair = Keypair.fromSecret(secretKey);
            preparedTx.sign(signerKeypair);
            signedSorobanTx = preparedTx;
          } else {
            const signRes = await signTransaction(preparedTx.toXDR(), {
              networkPassphrase: TESTNET_PASSPHRASE,
            });
            if (signRes?.signedTxXdr) {
              signedSorobanTx = TransactionBuilder.fromXDR(signRes.signedTxXdr, TESTNET_PASSPHRASE);
            }
          }

          if (signedSorobanTx) {
            const sendRes = await sorobanServer.sendTransaction(signedSorobanTx);
            if (sendRes.status === 'PENDING') {
              let getRes = await sorobanServer.getTransaction(sendRes.hash);
              while (getRes.status === 'NOT_FOUND') {
                await new Promise((r) => setTimeout(r, 1000));
                getRes = await sorobanServer.getTransaction(sendRes.hash);
              }
              if (getRes.status === 'SUCCESS') {
                return {
                  successful: true,
                  hash: sendRes.hash,
                  ledger: getRes.ledger,
                  explorerUrl: `${EXPLORER_BASE_URL}/${sendRes.hash}`,
                };
              }
            }
          }
        }
      } catch (sorobanErr: any) {
        console.warn('Soroban contract escrow execution failed, falling back to vault payment:', sorobanErr?.message || sorobanErr);
      }
    }

    // 4. Standard escrow payment transaction to verified escrow vault
    const targetDestination = destinationAddress.startsWith('C') ? ESCROW_VAULT_ADDRESS : destinationAddress;
    const tx = new TransactionBuilder(senderAccount, {
      fee: baseFee,
      networkPassphrase: TESTNET_PASSPHRASE,
    })
      .addOperation(
        Operation.payment({
          destination: targetDestination,
          asset: Asset.native(),
          amount: amountXlm.toString(),
        })
      )
      .setTimeout(30)
      .build();

    let signedTx: any;

    if (secretKey) {
      // Direct Keypair signing
      const signerKeypair = Keypair.fromSecret(secretKey);
      tx.sign(signerKeypair);
      signedTx = tx;
    } else {
      // Freighter wallet signing
      const signRes = await signTransaction(tx.toXDR(), {
        networkPassphrase: TESTNET_PASSPHRASE,
      });

      if (!signRes || !signRes.signedTxXdr) {
        throw new Error('Transaction was rejected by the wallet user.');
      }
      signedTx = TransactionBuilder.fromXDR(signRes.signedTxXdr, TESTNET_PASSPHRASE);
    }

    // 5. Submit to Stellar Testnet Horizon
    const response = await horizonServer.submitTransaction(signedTx);

    if (!response.successful) {
      throw new Error('Stellar transaction submission failed on network ledger.');
    }

    return {
      successful: true,
      hash: response.hash,
      ledger: response.ledger,
      explorerUrl: `${EXPLORER_BASE_URL}/${response.hash}`,
    };
  },
};
