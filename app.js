const path = require('path')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const db = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

/*testing code mysql2 */
// db.execute('select * from products')
//     .then(([products, datafields]) =>{
//         console.log(products[0]);
//     })
//     .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin',adminRoutes);
app.use(shopRoutes);

// bila path tidak match denga path
// yang sudah ada, maka ini yang dijalankan
app.use(errorController.get404);

app.listen(3000, ()=>console.log('server running in port 3000'));
