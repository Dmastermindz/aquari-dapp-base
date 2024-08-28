// verify-greenfield-config.js
const { client, PRIVATE_KEY } = require('./greenfield-config');

async function verifyConfig() {
  try {
    console.log('Verifying Greenfield configuration...');
    const address = client.account.privateToAddress(PRIVATE_KEY);
    console.log('Derived address:', address);
    
    const balance = await client.account.getAccount(address);
    console.log('Account balance:', balance);
    
    console.log('Configuration appears to be valid.');
  } catch (error) {
    console.error('Error verifying configuration:', error.message);
  }
}

verifyConfig();
