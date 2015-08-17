DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
PRAGMA foreign_key = on;

CREATE TABLE topics (
id INTEGER PRIMARY KEY AUTOINCREMENT ,
username varchar,
title varchar,
post varchar
);

CREATE TABLE comments (
id INTEGER PRIMARY KEY AUTOINCREMENT,
comment varchar,
topics_id INTEGER,
FOREIGN KEY (topics_id) REFERENCES topics(id)
);

CREATE TABLE likes (
counter INTEGER,
like_topic_id INTEGER,
FOREIGN KEY (like_topic_id) REFERENCES topics(id)

);