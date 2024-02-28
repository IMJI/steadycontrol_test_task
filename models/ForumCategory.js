import mongoose from "mongoose";

const forumCategorySchema = new mongoose.Schema({
    name: String,
    link: String,
    children: [mongoose.ObjectId]
});

const ForumCategory = mongoose.model("forum_category", forumCategorySchema)

export default ForumCategory;