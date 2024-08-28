--Aquari Forums Schema----------------------------

-- Users table
CREATE TABLE users (
    user_id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Forums table
CREATE TABLE forums (
    forum_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(category_id),
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Topics table
CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    forum_id INTEGER REFERENCES forums(forum_id),
    user_id VARCHAR(100) REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0
);

-- Posts table
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(topic_id),
    user_id VARCHAR(100) REFERENCES users(user_id),
    content TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_edit_date TIMESTAMP
);

-- User Invitations Table
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    inviter_user_id VARCHAR(255) NOT NULL,
    invitee_user_id VARCHAR(255) NOT NULL,
    invitee_email VARCHAR(255) NOT NULL,
    invitee_wallet VARCHAR(255),
    invitation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bought_aquari BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (inviter_user_id) REFERENCES users(user_id),
    UNIQUE (invitee_user_id),
    UNIQUE (invitee_email)
);



------------ NOTES-----------

INSERT INTO categories (name, description) VALUES ('Off-Topic',' Your space for casual chats and random musings beyond the usual scope of Aquari. While our main focus remains on the organization, this area allows for a bit of fun and relaxation. Just keep it friendly and within reason—our mods are still watching!');

INSERT INTO forums (category_id, name, description) VALUES (3,'Travel & Our World','Whether youre a globetrotter, a weekend explorer, or someone planning their dream vacation, this is the perfect place to share your experiences and get inspired. Discuss destinations, travel tips, cultural insights, and must-see attractions.');

INSERT INTO topics (forum_id, user_id, title) VALUES (1,'clrasnuxs03okl50ffw28irrp','So how exactly do I "Cash Out"?');

INSERT INTO users (user_id, username, password, email) VALUES ('clrasnuxs03okl50ffw28irrp','Dmastermind','password123','cclarke98@gmail.com');

INSERT INTO posts (topic_id, user_id, content) VALUES (1,'clrasnuxs03okl50ffw28irrp','Before Aquari, I spent hours searching for reliable info and felt overwhelmed. Managing projects was tough without a centralized platform, leading to miscommunication. I missed out on a sense of community. Since joining, Aquaris organized content and intuitive interface have streamlined my work and connected me with like-minded individuals. It’s been transformative, and I can’t imagine going back.');





INSERT INTO users (user_id) VALUES ('clrasnuxs03okl50ffw28irrp','Dmastermind','password123','cclarke98@gmail.com');


INSERT INTO invitations (inviter_user_id, invitee_user_id, invitee_email) VALUES ('clrasnuxs03okl50ffw28irrp', 'clzpf161r00s9nn0x2wkyd7ci', 'cameronclarke98@gmail.com');


SELECT COUNT(*) AS threads FROM topics WHERE forum_id = 1;  --Count All Threads in a Forum

SELECT COUNT(*) AS posts FROM posts WHERE topic_id = 1;  --Count all Posts in a Thread

SELECT COUNT(*) AS posts FROM posts;  --Count all Posts on Aquari

SELECT COUNT(*) AS posts FROM posts;  --Count all Posts on a Forum (Come back Later need SQL JOIN FOR THIS)




--Joined Table Between Topics & Posts
SELECT topics.forum_id, topics.topic_id, posts.post_id, posts.user_id, posts.content, posts.creation_date FROM Topics 
JOIN posts ON topics.topic_id = posts.topic_id;

--Count total # of posts present inside a given Forum (Forum ID) (Usess Joined Table Topics & Posts as Template)
SELECT COUNT(*) FROM topics
JOIN posts ON topics.topic_id = posts.topic_id WHERE topics.forum_id = 1;

--Count total # of posts present on all of Aquari Forums
SELECT COUNT(*) FROM topics
JOIN posts ON topics.topic_id = posts.topic_id;

--Find Latest Post Date on a Given Aquari Forum
SELECT MAX(posts.creation_date) FROM topics 
JOIN posts ON topics.topic_id = posts.topic_id WHERE topics.forum_id = 1;