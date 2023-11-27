require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
const PORT = 3997;
const configureDB = require('./config/db');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { uuid } = require('uuidv4')
const usersCltr = require('./app/controllers/userController')
const creatorCltr = require('./app/controllers/creatorController')
const contentCltr = require('./app/controllers/contentController')
const subscriptionCltr = require('./app/controllers/subscriptionPlanController')
const subscribersCltr = require('./app/controllers/subscribersController')
const paymentController = require('./app/helpers/payment-integration');
const paymentStatusController = require('./app/controllers/paymentStatusController');
const authenticateUser = require('./app/middlewares/authentication');
const authorization = require('./app/middlewares/authorization');
const mailer = require('./app/controllers/nodemailer')
const { checkSchema } = require('express-validator');
const creatorValidation = require('../back-end/app/helpers/creatorValidation');

const upload = require('./upload');
const usersCtrl = require("./app/controllers/userController");
const app = express();
app.use(express.json());
app.use(cors());
configureDB();
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('uploads'))


// const multerStorage = multer.diskStorage(
//   {destination:(req,file,cb)=>{
//   cb(null,'public/images')},
//   filename:(req,file,cb)=>{
//       const ext = file.mimetype.split("/")[1]
//       cb(null,`${file.fieldname}-${Date.now()}.${ext}`)
//   }
// })

// const multerFilter = (req,file,cb)=>{
//   const allowedMimeTypes = ['image/jpeg','image/jpg','image/png','video/mp3','video/mp4', 'video/quicktime']
//   if(allowedMimeTypes.includes(file.mimetype)){
//       return cb(null,true)
//   }
//   else{
//       return cb(new Error("Upload only jpeg/jpg/png files only"))
//   }
// }

// const upload = multer({
//   storage:multerStorage,
//   fileFilter:multerFilter
// })

// Your existing routes and middleware definitions

//Basic API calls.
app.post('/api/users/register', usersCltr.register);
app.post('/api/users/login', usersCltr.login);
app.get('/api/users/account', authenticateUser, usersCltr.account);
app.get('/api/users', usersCltr.getAllUsers);
app.delete('/api/user/:id', authenticateUser, authorization, usersCltr.delete);
app.post('/api/fetchuser/:id',usersCtrl.fetchAccount)

//creator routes

// app.post('/api/creator', upload.single('fileType'), authenticateUser, creatorCltr.create);

app.post('/api/creator', checkSchema(creatorValidation), authenticateUser, creatorCltr.create);
//Would have to work with this api. get the creator id and then proceed. 
app.get('/api/creator', authenticateUser, creatorCltr.showOne);
app.post('/api/fetchprofile',creatorCltr.fetchProfile)
app.get('/api/creators', authenticateUser, authorization, creatorCltr.show);
app.put('/api/creator/:id', authenticateUser, creatorCltr.update);
app.post('/api/creator/follow', creatorCltr.followers)
app.post('/api/creator/unfollow', creatorCltr.unFollow)
app.delete('/api/creator/:id', authenticateUser, authorization, creatorCltr.delete);

// content api routes
app.post('/api/content/create', upload.single('fileType'), authenticateUser, contentCltr.create)
app.get('/api/content', contentCltr.showAll);
app.get('/content-all', authenticateUser, authorization, contentCltr.allContent);
app.get('/content/:id', authenticateUser, contentCltr.showOne);
app.put('/api/content/:id', authenticateUser, contentCltr.update)
app.delete('/api/content/:id', authenticateUser, contentCltr.contentDelete)
app.delete('/content-delete-admin/:id', authenticateUser, authorization, contentCltr.deleteContent);
//make a delete content function for admin purpose.
app.put('/api/post/like', authenticateUser, contentCltr.addLike)
app.put('/api/post/unlike', authenticateUser, contentCltr.removeLike)
app.post('/api/comments', authenticateUser, contentCltr.comment)
app.put('/api/comment', authenticateUser, contentCltr.updateComment);
app.delete('/api/comments/:contentId/:commentId', authenticateUser, contentCltr.delete);

// Subscription plans
app.post('/api/subscribePlans', authenticateUser, subscriptionCltr.create);
//This will also need changes. 
app.get('/api/subscriptionPlans', authenticateUser, subscriptionCltr.showPlan);
app.put('/api/subscription/update/:id', authenticateUser, subscriptionCltr.update)
app.delete('/api/subscription-plans/:id', authenticateUser, subscriptionCltr.delete)

//subscribers 
app.get('/api/subscribers', authenticateUser, subscribersCltr.getSubscribers);
app.post('/api/allSubscribers', subscribersCltr.getAllSubscribers)
app.get('/subscribers-name', authenticateUser, subscribersCltr.getNames);
app.get('/subscribers/:id', authenticateUser, subscribersCltr.specificSubscribers);
app.post('/api/subscriber', authenticateUser, subscribersCltr.subscribe)
app.put('/api/unSubscribe', authenticateUser, subscribersCltr.unSubscribe)

//payment http methods.
app.get('/payment-get-data', paymentController.getData);
app.post('/payment-checkout', authenticateUser, paymentController.checkout);
app.get('/payment-session-info', authenticateUser, paymentController.getSession);

//Payment-Status APIs.
app.put('/payment-update-status', authenticateUser, paymentStatusController.updateStatus);
app.post('/api/nodemailer', mailer.create)


app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
