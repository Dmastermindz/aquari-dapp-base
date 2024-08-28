// verify-greenfield-buckets.js
const { client, PRIVATE_KEY } = require('./greenfield-config');

const buckets = [
  'aquari-forum-categories',
  'aquari-forum-forums',
  'aquari-forum-topics',
  'aquari-forum-posts'
];

async function verifyBucket(bucketName) {
  try {
    console.log(`Checking bucket: ${bucketName}`);
    const response = await client.bucket.headBucket(bucketName);
    console.log(`Bucket ${bucketName} exists. Status: ${response.status}`);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`Bucket ${bucketName} does not exist.`);
    } else {
      console.error(`Error checking bucket ${bucketName}:`, error.message);
    }
    return false;
  }
}

async function verifyAllBuckets() {
  console.log('Starting bucket verification...');
  for (const bucket of buckets) {
    await verifyBucket(bucket);
  }
  console.log('Bucket verification completed.');
}

verifyAllBuckets().catch(error => {
  console.error('An error occurred during bucket verification:', error);
});