//import
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); //digubaka untuk bisa mengaksisi data yang di re
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const PORT = 8080;

//implementasi
//implementasi library
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayout); //<- menggunakan ejs layouts
app.use(express.static('views')); //untuk menjadi sebuah direktori menjadi setatis // untuk menggunakan data post
app.use(express.urlencoded({extended : true})); // untuk menggunakan data post


//menggunakan session
app.use(cookieParser('secret'));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash()); //midlleware untuk flash


//untuk autentikasi
let auth = require("./middlewares/auth");

//untuk logout
app.get('/logout', async (req, res)=>{
    req.session.destroy(() => {
        console.log('log out ---------->')
        res.redirect('/login')
    })
})

//end poin untuk login
const login = require('./routes/login');
app.use('/login',auth.auth_hasLogin,login);

//end poinnt user
const user = require('./routes/user');
app.use('/user', user);

//end poit member
const member = require('./routes/member');
app.use('/member',  member);

//end point outlet
const outlet = require("./routes/outlet");
app.use('/outlet',  outlet);

//end point paket
const paket = require('./routes/paket');
app.use('/paket',  paket);

//end point transaksi
const transaksi = require('./routes/transaksi');
app.use('/transaksi', transaksi);


//end point layout
const hal = require('./routes/layout');
app.use('/app', auth.auth_Login, hal);


//untuk halaman tidak ditemukan
app.use('/', (req, res) =>{
  res.status(404);
  res.render('404', {
    layout: '../layouts/main',
    extractScripts: true,
    showfooter: "none",
    title: "halaman tidak ditemukan",
    activeLink: null,
    session: req.session
  })
})


app.listen(PORT, () => {
    console.log(`listening in http://localhost:`+ PORT);
});