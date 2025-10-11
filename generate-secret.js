// Generate a secure session secret for production
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n=================================');
console.log('🔐 SECURE SESSION SECRET');
console.log('=================================');
console.log('\nYour secure session secret:');
console.log('\x1b[32m%s\x1b[0m', secret);
console.log('\n⚠️  IMPORTANT:');
console.log('- Copy this and add it to your deployment environment variables');
console.log('- Variable name: SESSION_SECRET');
console.log('- Never commit this to Git!');
console.log('- Keep it secure and private');
console.log('=================================\n');
