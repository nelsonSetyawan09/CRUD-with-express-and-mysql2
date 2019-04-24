const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5cc029c64b320512a0cf74f1')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb://localhost:27017/test_node_maximilliam_mongoose', {useNewUrlParser: true}
  )
  .then(() => {
    User.findOne()
      .then(user =>{
        if(!user){
          const user = new User({
            name: 'Citra',
            email: 'citra@test21.com',
            cart: {
              items:[]
           }
          });
          user.save();
        }
    })

    console.log('server run on port 3000')       
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
