const { client, wallet, address, chainId, PRIVATE_KEY } = require('./greenfield-config');
const { VisibilityType, RedundancyType } = require('@bnb-chain/greenfield-js-sdk');
const Long = require('long');
const crypto = require('crypto');

const buckets = [
  'aquari-forum-categories',
  'aquari-forum-forums',
  'aquari-forum-topics',
  'aquari-forum-posts'
];

const initialData = {
  'aquari-forum-categories': [],
  'aquari-forum-forums': [],
  'aquari-forum-topics': [],
  'aquari-forum-posts': []
};

function calculateChecksums(data) {
  const content = Buffer.from(JSON.stringify(data));
  const checksums = [];
  const chunkSize = Math.ceil(content.length / 7);

  for (let i = 0; i < 7; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, content.length);
    const chunk = content.slice(start, end);
    const hash = crypto.createHash('sha256').update(chunk).digest();
    checksums.push(new Uint8Array(hash));
  }

  return checksums;
}

async function initializeBucketData(bucketName, data) {
  try {
    console.log(`Initializing bucket: ${bucketName}`);

    const objectName = `all-${bucketName.split('-').pop()}.json`;
    const content = JSON.stringify(data);
    const checksums = calculateChecksums(data);

    const createObjectParams = {
      bucketName: bucketName,
      objectName: objectName,
      creator: address,
      visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
      contentType: 'application/json',
      redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
      payloadSize: Long.fromNumber(content.length),
      expectChecksums: checksums,
    };

    console.log('Create object parameters:', JSON.stringify(createObjectParams, (key, value) => {
      if (value instanceof Uint8Array) {
        return Buffer.from(value).toString('base64');
      }
      return value;
    }, 2));

    const createObjectTx = await client.object.createObject(createObjectParams);

    console.log('Create object transaction prepared');

    const simulateInfo = await createObjectTx.simulate({
      denom: 'BNB',
    });

    console.log('Simulation result:', simulateInfo);

    const broadcastResult = await createObjectTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(simulateInfo.gasLimit),
      gasPrice: simulateInfo.gasPrice,
      payer: address,
      granter: '',
      privateKey: PRIVATE_KEY,
    });

    console.log(`Broadcast result for ${bucketName}:`, broadcastResult);

    if (broadcastResult.code === 0) {
      console.log(`Initialized ${bucketName} with empty data. Object name: ${objectName}`);
    } else {
      console.error(`Failed to initialize ${bucketName}. Error code: ${broadcastResult.code}, message: ${broadcastResult.message}`);
    }
  } catch (error) {
    console.error(`Error initializing ${bucketName}:`, error.message);
    console.error('Full error:', error);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
  }
}

async function initializeAllBuckets() {
  console.log('Starting bucket initialization...');
  for (const [bucketName, data] of Object.entries(initialData)) {
    await initializeBucketData(bucketName, data);
  }
  console.log('Bucket initialization completed.');
}

initializeAllBuckets().catch(error => {
  console.error('An error occurred during bucket initialization:', error);
});