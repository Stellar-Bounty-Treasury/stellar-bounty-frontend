import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { formatAddress, formatXlm } from '../utils/formatters';

export interface LeaderboardEntry {
  address: string;
  completed_bounties: number;
  total_earned_xlm: number;
  rank: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, isLoading }) => {
  return (
    <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Trophy size={20} color="#facc15" />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Top Bounty Contributors</h3>
      </div>

      {isLoading ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Loading leaderboard...</div>
      ) : entries.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>No contributors ranked yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '8px 4px' }}>Rank</th>
              <th style={{ padding: '8px 4px' }}>Contributor</th>
              <th style={{ padding: '8px 4px', textAlign: 'center' }}>Bounties</th>
              <th style={{ padding: '8px 4px', textAlign: 'right' }}>Total Earned</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item, idx) => (
              <tr key={item.address} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '8px 4px', fontWeight: 700, color: idx === 0 ? '#facc15' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7f32' : 'var(--text-muted)' }}>
                  #{item.rank || idx + 1}
                </td>
                <td style={{ padding: '8px 4px', fontFamily: 'monospace', color: '#fff' }}>
                  {formatAddress(item.address)}
                </td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: '#38bdf8' }}>
                  {item.completed_bounties}
                </td>
                <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 600, color: '#34d399' }}>
                  {formatXlm(item.total_earned_xlm)} XLM
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
