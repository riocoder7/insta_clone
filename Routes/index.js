var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const passport_local = require("passport-local");
passport.use(new passport_local(userModel.authenticate()));
const uploads = require("./multer");
const post = require('./post');




router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.post("/sineup", (req,res)=>{
   const userdata = new userModel ({
    username:req.body.username,
    email:req.body.email,
    name:req.body.name,
    passport:req.body.password,

  });
  userModel.register(userdata,req.body.password).then((registereduser)=>{
    passport.authenticate("local") (req,res, ()=>{
      res.redirect("/profile");

    })

  })
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
}),(req,res)=>{

});



const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
    
  res.redirect("/login");

}


router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/login', async function(req, res) {
  res.render('login', {footer: false});

});

router.get('/feed',isAuthenticated, async function(req, res) {
  const post = await postModel.find().populate('users');
  console.log(post);
  res.render('feed', {footer: true,post});
});

router.get('/like/post/:id',isAuthenticated,async function(req, res) {
  const user = await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.find({_id:req.params.id});


  if( post.likes.IndexOf("user._id")=== -1  ){
    post.likes.push(user._id); 
  
  }
  else{
    post.likes.splice(post.likes.indexOf(user._id), 1); 

  }

  await post.save();
  res.redirect("/feed");

});


router.get('/profile',isAuthenticated, async function (req, res) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate("posts");

console.log(user);

  res.render('profile', {footer: true,user});
});

router.get('/search',isAuthenticated, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit',isAuthenticated, function(req, res) {
  res.render('edit', {footer: true});
});

router.get('/upload',isAuthenticated, function(req, res) {
  res.render('upload', {footer: true});
});



router.post("/uploads_profile_img",isAuthenticated,uploads.single('file'), async( req,res)=>{
 
  const user_login = await userModel.findOneAndUpdate(
  {username:req.session.passport.user}, {username:req.body.username,bio:req.body.bio,name:req.body.name},{new:true});
if(req.file){
  
    user_login.profile_photo= req.file.filename;
 }
 await user_login.save();
 res.redirect("/profile");

});



router.post('/upload_post',isAuthenticated, uploads.single("post"), async function(req, res) {

  const user = await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    picture:req.file.filename,
    caption:req.body.caption,
    users:user._id,
  });

  user.posts.push(post._id);
  await user.save();

  res.redirect('/profile');
  // console.log(user)
  // console.log(post);

});





module.exports = router;
