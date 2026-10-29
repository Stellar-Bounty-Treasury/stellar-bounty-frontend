const fs = require('fs');
const path = require('path');

const tomlFile = path.resolve(__dirname, '../public/.well-known/stellar.toml');
console.log('Validating SEP-0001 stellar.toml file at:', tomlFile);

if (!fs.existsSync(tomlFile)) {
  console.error('stellar.toml does not exist!');
  process.exit(1);
}

const content = fs.readFileSync(tomlFile, 'utf8');

const requiredSections = [
  'VERSION=',
  '[DOCUMENTATION]',
  'ORG_NAME=',
  '[NETWORK]',
  'HORIZON_URL=',
  '[[CONTRACTS]]',
  '[[CURRENCIES]]',
];

let valid = true;
for (const section of requiredSections) {
  if (!content.includes(section)) {
    console.error('Missing required section or key:', section);
    valid = false;
  }
}

if (valid) {
  console.log('stellar.toml conforms to SEP-0001 specification.');
  process.exit(0);
} else {
  process.exit(1);
}
