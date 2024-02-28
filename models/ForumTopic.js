import mongoose from "mongoose";

const forumTopicSchema = new mongoose.Schema({
    name: String,
    description: String,
    createdAt: Date,
    author: String,
    magnetLink: String,
    torrentLink: String,
    thanks: [{
        name: String,
        date: Date
    }]
});

const ForumTopic = mongoose.model("forum_topics", forumTopicSchema)

export default ForumTopic;