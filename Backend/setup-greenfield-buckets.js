// const { client, wallet, address, chainId } = require('./greenfield-config');

// const buckets = [
//   'aquari-forum-categories',
//   'aquari-forum-forums',
//   'aquari-forum-topics',
//   'aquari-forum-posts',
// ];

// async function getStorageProviders() {
//   try {
//     const spList = await client.sp.getStorageProviders();
//     console.log('Available storage providers:', spList);
//     return spList;
//   } catch (error) {
//     console.error('Error fetching storage providers:', error);
//     return [];
//   }
// }

// async function createSingleBucket(bucketName, primarySp) {
//   try {
//     console.log(`Attempting to create bucket: ${bucketName}`);
//     console.log('Using address:', address);
//     console.log('Primary SP:', primarySp);

//     const createBucketTx = await client.bucket.createBucket({
//       bucketName: bucketName.toString(),
//       creator: address,
//       primarySpAddress: primarySp.toString(),
//       visibility: 'public-read',
//       chargedReadQuota: '0',
//       paymentAddress: address,
//     },
//      {
//       signer: wallet,
//     });

//     console.log(`Create bucket transaction hash: ${createBucketTx.transactionHash}`);

//     // Wait for the transaction to be mined
//     const receipt = await createBucketTx.wait();
//     console.log(`Bucket ${bucketName} created successfully. Transaction receipt:`, receipt);
//   } catch (error) {
//     console.error(`Error creating bucket ${bucketName}:`, error.message);
//     console.error('Full error:', error);
//     if (error.stack) {
//       console.error('Error stack:', error.stack);
//     }
//   }
// }

// async function setupBuckets() {
//   console.log('Starting bucket setup...');
  
//   const spList = await getStorageProviders();
//   if (spList.length === 0) {
//     console.error('No storage providers available. Cannot create buckets.');
//     return;
//   }

//   // Select the first available storage provider
//   const primarySp = spList[0].operatorAddress;

//   for (const bucket of buckets) {
//     await createSingleBucket(bucket.toString(), primarySp);
//   }
//   console.log('Bucket setup completed.');
// }

// setupBuckets().catch(error => {
//   console.error('An error occurred during bucket setup:', error);
// });


//----------------V2----------------------------------//
// const { client, wallet, address, chainId } = require('./greenfield-config');
// const { ethers } = require('ethers');

// const buckets = [
//   'aquari-forum-categories',
//   'aquari-forum-forums',
//   'aquari-forum-topics',
//   'aquari-forum-posts'
// ];

// async function getStorageProviders() {
//   try {
//     const spList = await client.sp.getStorageProviders();
//     console.log('Available storage providers:', spList);
//     return spList;
//   } catch (error) {
//     console.error('Error fetching storage providers:', error);
//     return [];
//   }
// }

// async function createSingleBucket(bucketName, primarySp) {
//   try {
//     console.log(`Attempting to create bucket: ${bucketName}`);
//     console.log('Using address:', address);
//     console.log('Primary SP:', primarySp);

//     const bucketParams = {
//       bucketName: bucketName,
//       creator: address,
//       primarySpAddress: primarySp,
//       visibility: 'public-read',
//       chargedReadQuota: ethers.BigNumber.from(0),
//       paymentAddress: address,
//     };

//     console.log('Bucket creation parameters:', JSON.stringify(bucketParams, (key, value) =>
//       typeof value === 'bigint' ? value.toString() : value
//     ));

//     const createBucketTx = await client.bucket.createBucket(bucketParams, {
//       signer: wallet,
//     });

//     console.log(`Bucket creation result:`, createBucketTx);

//     if (createBucketTx && createBucketTx.transactionHash) {
//       console.log(`Bucket ${bucketName} created successfully. Transaction hash: ${createBucketTx.transactionHash}`);
//     } else {
//       console.log(`Bucket ${bucketName} creation initiated. Please check the Greenfield explorer for confirmation.`);
//     }
//   } catch (error) {
//     console.error(`Error creating bucket ${bucketName}:`, error.message);
//     console.error('Full error:', error);
//     if (error.stack) {
//       console.error('Error stack:', error.stack);
//     }
//   }
// }

// async function setupBuckets() {
//   console.log('Starting bucket setup...');
  
//   const spList = await getStorageProviders();
//   if (spList.length === 0) {
//     console.error('No storage providers available. Cannot create buckets.');
//     return;
//   }

//   // Select the first available storage provider
//   const primarySp = spList[0].operatorAddress;

//   for (const bucket of buckets) {
//     await createSingleBucket(bucket, primarySp);
//   }
//   console.log('Bucket setup completed.');
// }

// setupBuckets().catch(error => {
//   console.error('An error occurred during bucket setup:', error);
// });


//-----------V3---------------------//
const { client, wallet, address, chainId, PRIVATE_KEY } = require('./greenfield-config');
const { ethers } = require('ethers');
const { VisibilityType } = require('@bnb-chain/greenfield-js-sdk');

const buckets = [
  'aquari-forum-categories',
  'aquari-forum-forums',
  'aquari-forum-topics',
  'aquari-forum-posts'
];

async function getStorageProviders() {
  try {
    const spList = await client.sp.getStorageProviders();
    console.log('Available storage providers:', spList);
    return spList;
  } catch (error) {
    console.error('Error fetching storage providers:', error);
    return [];
  }
}

async function createSingleBucket(bucketName, primarySp) {
  try {
    console.log(`Attempting to create bucket: ${bucketName}`);
    console.log('Using address:', address);
    console.log('Primary SP:', primarySp);

    const bucketParams = {
      bucketName: bucketName,
      creator: address,
      primarySpAddress: primarySp,
      visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
      chargedReadQuota: ethers.BigNumber.from('0'),
      paymentAddress: address,
    };

    console.log('Bucket creation parameters:', JSON.stringify(bucketParams, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    // 1. Construct the transaction
    const createBucketTx = await client.bucket.createBucket(bucketParams);

    // 2. Simulate the transaction
    const simulateInfo = await createBucketTx.simulate({
      denom: 'BNB',
    });

    console.log('Simulation result:', simulateInfo);

    // 3. Broadcast the transaction
    const broadcastResult = await createBucketTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(simulateInfo.gasLimit),
      gasPrice: simulateInfo.gasPrice,
      payer: address,
      granter: '',
      privateKey: PRIVATE_KEY,
    });

    console.log(`Broadcast result:`, broadcastResult);

    if (broadcastResult.code === 0) {
      console.log(`Bucket ${bucketName} created successfully. Transaction hash: ${broadcastResult.transactionHash}`);
    } else {
      console.error(`Failed to create bucket ${bucketName}. Error code: ${broadcastResult.code}, message: ${broadcastResult.message}`);
    }
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error.message);
    console.error('Full error:', error);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
  }
}

async function setupBuckets() {
  console.log('Starting bucket setup...');
  
  const spList = await getStorageProviders();
  if (spList.length === 0) {
    console.error('No storage providers available. Cannot create buckets.');
    return;
  }

  // Select the first available storage provider
  const primarySp = spList[0].operatorAddress;

  for (const bucket of buckets) {
    await createSingleBucket(bucket, primarySp);
  }
  console.log('Bucket setup completed.');
}

setupBuckets().catch(error => {
  console.error('An error occurred during bucket setup:', error);
});