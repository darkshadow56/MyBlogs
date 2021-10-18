//importing modules
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const mongoose = require('mongoose');
const homeStartingContent = "WELCOME TO MyBlogs.";
const aboutContent = "This is about us page ";
const contactContent = "This is contact us page for ";
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;
const EmptyMessage = 'It\'s Empty Here, Please Compose New Post';
const notEmptyMessage = 'Your Posts'

//Connecting to database
mongoose.connect(uri,{useNewUrlParser:true}, (err)=>{
  if(err){
    console.log(err);
  } else {
    console.log("Database Connected Successfully!")
  }
});

const blogSchema = ({
  title: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  }
});

const Blog = mongoose.model('Blog', blogSchema);

//creating instance of express
const app = express();

//setting up view engine to render ejs
app.set("view engine", "ejs");

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Post reqs

app.post('/deletePost', (req, res)=>{
  const postDeleteRequest = req.body.postDelete;
  console.log(postDeleteRequest);
  Blog.deleteOne({title: postDeleteRequest}, (err)=>{
    if (err){
      console.log(err);
    }else{
      console.log('Deleted Successfully!');
    }
  });
  res.redirect('/');
});

app.post("/", (req, res) => {
  const blogPost = {
    title: req.body.title,
    blog: req.body.blog
  };

const Post = new Blog({
  title: blogPost.title, 
  post: blogPost.blog
});
  Post.save(()=>{
    console.log("data inserted");
  });
  
  res.redirect("/");
});

//Routes
app.get("/", (req, res) => {
  Blog.find((err, foundPosts)=>{
    if(err){
      console.log(err);
    }else{
      if(foundPosts.length === 0){
        res.render("home", { homeInfo: homeStartingContent,
          newBlogPost: foundPosts, messageIfEmpty: EmptyMessage});  
      }else{
      res.render("home", { homeInfo: homeStartingContent,
        newBlogPost: foundPosts, messageIfEmpty: notEmptyMessage});
    }
  }
  });
  
});

app.get("/about", (req, res) => {
  res.render("about", { aboutInfo: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactInfo: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/post/:postName", (req, res) => {
  let fetchedPostTitle = _.lowerCase(req.params.postName);
Blog.find({}, (err, foundById)=>{
  if(err){
    console.log(err);
  }else{
    foundById.forEach((requestedPost) => {
      const postTitle = _.lowerCase(requestedPost.title);
      if (fetchedPostTitle == postTitle) {
        res.render('post', {newBlogPostTitle: requestedPost.title, newBlogPostBlog: requestedPost.post});
      }
    });
  }
})



 
});

app.listen(PORT, function () {
  console.log("Server started on port", PORT);
});
