require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
const PORT = 3997;
const configureDB = require('./config/db');
const multer = require('multer');
const usersCltr = require('./app/controllers/userController')
const creatorCltr = require('./app/controllers/creatorController')
const contentCltr = require('./app/controllers/contentController')
const subscriptionCltr = require('./app/controllers/subscriptionPlanController')
const subscribersCltr = require('./app/controllers/subscribersController')
const authenticateUser = require('./app/middlewares/authentication');
const authorization = require('./app/middlewares/authorization');

const app = express();
app.use(express.json());
app.use(cors());
configureDB();


const multerStorage = multer.diskStorage(
  {destination:(req,file,cb)=>{
  cb(null,'public/images')},
  filename:(req,file,cb)=>{
      const ext = file.mimetype.split("/")[1]
      cb(null,`${file.fieldname}-${Date.now()}.${ext}`)
  }
})

const multerFilter = (req,file,cb)=>{
  const allowedMimeTypes = ['image/jpeg','image/jpg','image/png','video/mp3','video/mp4', 'video/quicktime']
  if(allowedMimeTypes.includes(file.mimetype)){
      return cb(null,true)
  }
  else{
      return cb(new Error("Upload only jpeg/jpg/png files only"))
  }
}

const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
})

// Your existing routes and middleware definitions

app.post('/api/users/register', usersCltr.register);
app.post('/api/users/login', usersCltr.login);
app.get('/api/users/account', authenticateUser, usersCltr.account);
app.get('/api/users', usersCltr.getAllUsers);

//creator routes
app.post('/api/creator', upload.single('image'),authenticateUser, creatorCltr.create)
app.get('/api/creator', authenticateUser, creatorCltr.show);
app.put('/api/creator/:id', authenticateUser, creatorCltr.update);
app.post('/api/creator/follow', creatorCltr.followers)
app.post('/api/creator/unfollow', creatorCltr.unFollow)
app.delete('/api/creator/:id', authenticateUser, creatorCltr.delete);

// content api routes

app.post('/api/content/create',upload.single('content'), authenticateUser, contentCltr.create)
app.get('/api/content', contentCltr.showAll)
app.put('/api/content/:id', contentCltr.update)
app.post('/api/content/:id', contentCltr.delete)
app.post('/api/post/like', contentCltr.addLike)
app.post('/api/post/unlike', contentCltr.removeLike)

app.post('/api/comments', contentCltr.comment)
// app.delete('/api/comments', contentCltr.delete);
app.delete('/api/comments/:contentId/:commentId', contentCltr.delete);

// Subscription plans
app.post('/api/subscribePlans', subscriptionCltr.create)
app.put('/api/subscription/update/:id', subscriptionCltr.update)
app.delete('/api/subscription-plans/:id', subscriptionCltr.delete)

//subscribers 

app.post('/api/subscriber', subscribersCltr.subscribe)
app.delete('/api/unSubscribe', subscribersCltr.unSubscribe)

app.listen(PORT, () => {
    console.log('server is running on port', PORT);
});
