require("dotenv").config();
const { client, wallet, address, chainId, PRIVATE_KEY } = require('./greenfield-config');
const cors = require('cors');
const express = require("express");
const { VisibilityType, RedundancyType } = require('@bnb-chain/greenfield-js-sdk');
const Long = require('long');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());

// Helper function to calculate checksums
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

// Helper function to read an object from Greenfield
async function readObject(bucketName, objectName) {
  try {
    const response = await client.object.getObject(bucketName, objectName);
    return JSON.parse(response.body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Invalid JSON in object ${objectName} from bucket ${bucketName}`);
      return null;
    } else if (error.message.includes('Object does not exist')) {
      console.log(`Object ${objectName} does not exist in bucket ${bucketName}`);
      return null;
    } else {
      console.error(`Error reading object ${objectName} from bucket ${bucketName}:`, error);
      return null;
    }
  }
}

// Helper function to create or update an object in Greenfield
async function createOrUpdateObject(bucketName, objectName, data) {
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

  try {
    // First, try to create the object
    const createObjectTx = await client.object.createObject(createObjectParams);
    const simulateInfo = await createObjectTx.simulate({ denom: 'BNB' });
    const broadcastResult = await createObjectTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(simulateInfo.gasLimit),
      gasPrice: simulateInfo.gasPrice,
      payer: address,
      granter: '',
      privateKey: PRIVATE_KEY,
    });

    if (broadcastResult.code === 0) {
      console.log(`Object ${objectName} created successfully in bucket ${bucketName}`);
    } else {
      throw new Error(`Failed to create object: ${broadcastResult.message}`);
    }
  } catch (error) {
    // If the object already exists, try to update it
    if (error.message.includes('Object already exists')) {
      try {
        const updateObjectTx = await client.object.updateObject({
          ...createObjectParams,
          operator: address,
        });
        const simulateInfo = await updateObjectTx.simulate({ denom: 'BNB' });
        const broadcastResult = await updateObjectTx.broadcast({
          denom: 'BNB',
          gasLimit: Number(simulateInfo.gasLimit),
          gasPrice: simulateInfo.gasPrice,
          payer: address,
          granter: '',
          privateKey: PRIVATE_KEY,
        });

        if (broadcastResult.code === 0) {
          console.log(`Object ${objectName} updated successfully in bucket ${bucketName}`);
        } else {
          throw new Error(`Failed to update object: ${broadcastResult.message}`);
        }
      } catch (updateError) {
        console.error(`Error updating object ${objectName} in bucket ${bucketName}:`, updateError);
        return false;
      }
    } else {
      console.error(`Error creating object ${objectName} in bucket ${bucketName}:`, error);
      return false;
    }
  }

  return true;
}

// Get all Categories
app.get("/api/v1/categories", async (req, res) => {
  try {
    const categories = await readObject('aquari-forum-categories', 'all-categories.json');
    res.status(200).json({
      status: "success",
      results: categories ? categories.length : 0,
      data: { categories: categories || [] },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get all Forums
app.get("/api/v1/forums", async (req, res) => {
  try {
    const forums = await readObject('aquari-forum-forums', 'all-forums.json');
    res.status(200).json({
      status: "success",
      results: forums ? forums.length : 0,
      data: { forums: forums || [] },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get all threads of all forums
app.get("/api/v1/topics", async (req, res) => {
  try {
    const topics = await readObject('aquari-forum-topics', 'all-topics.json');
    res.status(200).json({
      status: "success",
      results: topics ? topics.length : 0,
      data: { topics: topics || [] },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get all Posts
app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await readObject('aquari-forum-posts', 'all-posts.json');
    res.status(200).json({
      status: "success",
      results: posts ? posts.length : 0,
      data: { posts: posts || [] },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create a New Thread
app.post("/api/v1/topics", async (req, res) => {
  try {
    let topics = await readObject('aquari-forum-topics', 'all-topics.json');
    if (!topics) {
      topics = [];
    }
    const newTopic = {
      topic_id: topics.length + 1,
      forum_id: req.body.forum_id,
      user_id: req.body.user_id,
      title: req.body.title,
      creation_date: new Date().toISOString(),
    };
    topics.push(newTopic);
    const success = await createOrUpdateObject('aquari-forum-topics', 'all-topics.json', topics);
    if (success) {
      res.status(201).json({
        status: "Success",
        data: { topic: newTopic }
      });
    } else {
      res.status(500).json({ error: "Failed to create new topic" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create a New Post
app.post("/api/v1/posts", async (req, res) => {
  try {
    let posts = await readObject('aquari-forum-posts', 'all-posts.json');
    if (!posts) {
      posts = [];
    }
    const newPost = {
      post_id: posts.length + 1,
      topic_id: req.body.topic_id,
      user_id: req.body.user_id,
      content: req.body.content,
      creation_date: new Date().toISOString(),
    };
    posts.push(newPost);
    const success = await createOrUpdateObject('aquari-forum-posts', 'all-posts.json', posts);
    if (success) {
      res.status(201).json({
        status: "Success",
        data: { post: newPost }
      });
    } else {
      res.status(500).json({ error: "Failed to create new post" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get the Count of Number of Threads in Forum Category
app.get("/api/v1/operations/count-threads", async (req, res) => {
  try {
    const topics = await readObject('aquari-forum-topics', 'all-topics.json') || [];
    const count = topics.filter(topic => topic.forum_id === parseInt(req.query.forum_id)).length;
    res.status(200).json(count);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get the Count of Number of Posts in a Forum Category
app.get("/api/v1/operations/count-forum-posts", async (req, res) => {
  try {
    if (!req.query.topic_id) {
      return res.status(400).json({ error: "topic_id is required" });
    }
    const posts = await readObject('aquari-forum-posts', 'all-posts.json') || [];
    const count = posts.filter(post => post.topic_id === parseInt(req.query.topic_id)).length;
    res.status(200).json(count);
  } catch (err) {
    console.error("Error in count-forum-posts:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Route to update views count
app.get("/api/v1/operations/increment-views", async (req, res) => {
  try {
    if (!req.query.topic_id) {
      return res.status(400).json({ error: "topic_id is required" });
    }
    let topics = await readObject('aquari-forum-topics', 'all-topics.json') || [];
    const topicIndex = topics.findIndex(topic => topic.topic_id === parseInt(req.query.topic_id));
    if (topicIndex === -1) {
      return res.status(404).json({ error: "Topic not found" });
    }
    topics[topicIndex].views = (topics[topicIndex].views || 0) + 1;
    const success = await createOrUpdateObject('aquari-forum-topics', 'all-topics.json', topics);
    if (success) {
      res.status(200).json({ views: topics[topicIndex].views });
    } else {
      res.status(500).json({ error: "Failed to update views" });
    }
  } catch (err) {
    console.error("Error in Incrementing Views:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Route to get view count of thread
app.get("/api/v1/operations/get-views", async (req, res) => {
  try {
    if (!req.query.topic_id) {
      return res.status(400).json({ error: "topic_id is required" });
    }
    const topics = await readObject('aquari-forum-topics', 'all-topics.json') || [];
    const topic = topics.find(topic => topic.topic_id === parseInt(req.query.topic_id));
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }
    res.status(200).json({ views: topic.views || 0 });
  } catch (err) {
    console.error("Error in Sending # of Views:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get the Count of Number of Posts in a Forum Category
app.get("/api/v1/operations/count-all-posts", async (req, res) => {
  try {
    const topics = await readObject('aquari-forum-topics', 'all-topics.json') || [];
    const posts = await readObject('aquari-forum-posts', 'all-posts.json') || [];
    const forumTopics = topics.filter(topic => topic.forum_id === parseInt(req.query.forum_id));
    const count = posts.filter(post => forumTopics.some(topic => topic.topic_id === post.topic_id)).length;
    res.status(200).json(count);
  } catch (err) {
    console.error(err);
    res.status(500).json(-1);
  }
});

// Get the Latest Forum Post Date
app.get("/api/v1/operations/forum-latest-date", async (req, res) => {
  try {
    const topics = await readObject('aquari-forum-topics', 'all-topics.json') || [];
    const posts = await readObject('aquari-forum-posts', 'all-posts.json') || [];
    const forumTopics = topics.filter(topic => topic.forum_id === parseInt(req.query.forum_id));
    const forumPosts = posts.filter(post => forumTopics.some(topic => topic.topic_id === post.topic_id));
    const latestDate = forumPosts.reduce((latest, post) => {
      return post.creation_date > latest ? post.creation_date : latest;
    }, "1970-01-01T00:00:00.000Z");
    res.status(200).json({ max: latestDate });
  } catch (err) {
    console.error(err);
    res.status(500).json(-1);
  }
});

// Get the Latest Topic Post Date
app.get("/api/v1/operations/topics-latest-date", async (req, res) => {
  try {
    const posts = await readObject('aquari-forum-posts', 'all-posts.json') || [];
    const topicPosts = posts.filter(post => post.topic_id === parseInt(req.query.topic_id));
    const latestDate = topicPosts.reduce((latest, post) => {
      return post.creation_date > latest ? post.creation_date : latest;
    }, "1970-01-01T00:00:00.000Z");
    res.status(200).json({ max: latestDate });
  } catch (err) {
    console.error(err);
    res.status(500).json(-1);
  }
});

const port = process.env.PORT || 3005;

const server = app.listen(port, () => {
  console.log(`Aquari Server is up and listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});