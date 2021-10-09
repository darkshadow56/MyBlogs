//importing modules
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
let posts = [];
const homeStartingContent = "WELCOME TO MyBlogs.";
const aboutContent = "This is about us page ";
const contactContent = "This is contact us page for ";
const POST = process.env.POST || 3000;

//creating instance of express
const app = express();

//setting up view engine to render ejs
app.set("view engine", "ejs");

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Post reqs
app.post("/", (req, res) => {
  const blogPost = {
    title: req.body.title,
    blog: req.body.blog
  };
  posts.push(blogPost);
  res.redirect("/");
});

//Routes
app.get("/", (req, res) => {
  res.render("home", { homeInfo: homeStartingContent,
                     newBlogPost: posts });
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
  posts.forEach((post) => {
    const postTitle = _.lowerCase(post.title);
    if (fetchedPostTitle == postTitle) {
      res.render('post', {newBlogPostTitle: post.title, newBlogPostBlog: post.blog});
    }
  });
});

app.listen(POST, function () {
  console.log("Server started on port", POST);
});
