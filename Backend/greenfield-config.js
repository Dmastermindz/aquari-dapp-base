// const { Client } = require('@bnb-chain/greenfield-js-sdk');
// const client = Client.create('https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org', '5600');

// // Replace with your actual private key
// const PRIVATE_KEY = '89f97da58ab257d6194065d4713aa4350056cc04f4a193a59aae86adc385ca1d';

// module.exports = {client, PRIVATE_KEY}



const { ethers } = require('ethers');
const { Client } = require('@bnb-chain/greenfield-js-sdk');
require("dotenv").config();


// Replace with your actual private key
const PRIVATE_KEY = '';

const provider = new ethers.providers.JsonRpcProvider('https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org');
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const chainId = 5600; // Greenfield testnet chain ID

const address = wallet.address;

console.log('Wallet address:', address);
console.log('Private key length:', PRIVATE_KEY.length);

if (PRIVATE_KEY === 'your_private_key_here') {
  console.error('Warning: You are using the placeholder private key. Please replace it with your actual private key.');
}

const client = Client.create('https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org', chainId.toString());

module.exports = { client, wallet, address, chainId, PRIVATE_KEY };