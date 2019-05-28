const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash  = require('connect-flash');
const multer = require('multer');


const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI ='mongodb://localhost:27017/test_node_maximilliam_mongoose';

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

const fileStroge = multer.diskStorage({
  destination:function (req,file,cb){
    cb(null, 'images')},
  filename:function (req,file,cb){
    cb(null, new Date().toISOString()+'-'+file.originalname)
  }
});

const fileFilter =  function(req,file, cb){
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
    cb(null,true)
  }else{
    cb(null, false)
  }
}


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStroge, fileFilter}).single('image'))  // in form, we use name='image'

app.use(express.static(path.join(__dirname, 'public')));

// artinya, klw ada path di html menggunakan `/images`
// maka menuju folder ini
app.use('/images',express.static(path.join(__dirname, 'images')));


app.use(
  session({
    secret: 'my secret', 
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
  // locals here artinya `locals variable` yg bisa diakses oleh view
  // dan hanya exist in view when we render
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('err')
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      // throw new Error('rr')

      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      // use next araound the error
      next(new Error(err))
    });
});



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

// error handling middleware
app.use((error, req, res, next) =>{
  // res.status(error.httpStatusCode).render(....)
  // res.redirect('/500')

  // if we use redirect, it can be infinity loop error
  // so, we jut use render page
  res.status(500).render('500', {
    pageTitle: 'Errorr',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
})

mongoose
  .connect(MONGODB_URI)
  .then(result => {
      console.log('server running on port 3000')
       app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });