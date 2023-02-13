//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  postTitle : String,
  postBody: String
});

const Post = mongoose.model("Post", postSchema);



let initialPost1 = {
  postTitle : "First post",
  postBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae metus faucibus, blandit arcu et, fringilla nulla. Vestibulum at sem sem. Aliquam tempus aliquam orci, sit amet molestie nisl luctus at. Ut eu metus lectus. Duis vitae molestie sem, sed dignissim dolor. Nam fringilla lobortis leo non scelerisque. Sed pellentesque ipsum a consectetur blandit. Etiam commodo eros mi, ut consectetur eros placerat at. Etiam sit amet consequat mauris. Donec non luctus erat. Sed ligula orci, congue sit amet interdum et, semper nec mi. Curabitur semper, urna vitae convallis tincidunt, orci lectus pellentesque purus, quis eleifend ex nibh tincidunt felis. Donec in purus accumsan, imperdiet libero eget, pellentesque elit. Morbi sagittis nisi ut leo posuere, quis consequat nibh eleifend. Proin nec quam ultrices, semper metus in, blandit elit."
}

let initialPost2 = {
  postTitle : "Second post",
  postBody: "Sed elementum mauris eget placerat condimentum. Aenean at mi nulla. Integer quis felis elit. Fusce non vestibulum eros. Mauris augue mi, sollicitudin et tortor eu, vulputate vestibulum lacus. Morbi luctus, ligula eget mattis accumsan, tortor enim semper nulla, molestie laoreet libero velit ac nisi. Vestibulum tristique rutrum porta. Curabitur dignissim velit eget efficitur dapibus. Quisque tincidunt ex id justo tincidunt molestie sed tempor enim. Phasellus quis risus vestibulum, luctus tellus at, tempor nisi. Donec pulvinar purus eu augue convallis, sit amet posuere velit iaculis. Nam libero turpis, ornare nec mauris maximus, bibendum placerat mauris. Vivamus lacus mi, pellentesque vel volutpat nec, molestie ac lorem. Pellentesque molestie lorem eget quam dapibus, ac malesuada sapien mollis. Duis in tortor ut erat tincidunt porttitor a sed augue."
}

app.get("/", (req, res)=>{

  Post.find((err, posts)=>{
    if(!err){
      if(posts.length === 0){
        Post.insertMany([initialPost1, initialPost2], (err)=>{
          if(!err){
            console.log("Success insert many")
          }
        })

        res.redirect("/");
      }

      res.render("home", {homeStartingContent : homeStartingContent, posts : posts});

    }
  })

  

  

})

app.get("/about", (req, res)=>{
  res.render("about", {aboutContent : aboutContent});
})

app.get("/contact", (req, res)=>{
  res.render("contact", {contactContent : contactContent});
})

app.get("/compose", (req, res)=>{
  res.render("compose");
})


app.post("/compose", (req, res)=>{
  
  const post = new Post({
    postTitle : _.capitalize(req.body.postTitle),
    postBody : req.body.postBody
  });

  post.save();

  res.redirect("/")


})


//Dinamicki URL za pojedinacne postove
app.get("/posts/:postTitle", (req, res)=>{
  //Ovako pristupam pojedinacnom dinamicnom parametru
  console.log(req.params.postTitle)


  Post.findOne({postTitle:req.params.postTitle}, (err, post)=>{
    if(!err){
      res.render("post", {postTitle : post.postTitle, postBody : post.postBody})
    }
  })

})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
