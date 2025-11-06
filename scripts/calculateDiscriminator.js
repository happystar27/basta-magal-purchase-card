const crypto = require('crypto');

/**
 * Calculate Anchor instruction discriminator
 * The discriminator is the first 8 bytes of SHA256("global:<instruction_name>")
 */
function getInstructionDiscriminator(instructionName) {
  const hash = crypto.createHash('sha256')
    .update(`global:${instructionName}`)
    .digest();
  
  return hash.slice(0, 8);
}

// Calculate for all instructions in your IDL
const instructions = [
  'initialize',
  'setToken2022Mint',
  'purchaseWithSol',
  'withdrawSol'
];

console.log('='.repeat(60));
console.log('Anchor Instruction Discriminators');
console.log('='.repeat(60));
console.log('');

instructions.forEach(name => {
  const discriminator = getInstructionDiscriminator(name);
  const hex = discriminator.toString('hex');
  const array = Array.from(discriminator).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ');
  
  console.log(`${name}:`);
  console.log(`  Hex:   ${hex}`);
  console.log(`  Array: [${array}]`);
  console.log('');
});

console.log('='.repeat(60));
console.log('Copy the correct discriminator values to your frontend code');
console.log('='.repeat(60));

