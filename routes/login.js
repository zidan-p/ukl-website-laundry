//import library penting
const express = require("express");
const bodyParser = require("body-parser");



//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const md5 = require("md5");
const axios = require('axios');


//import model
const model = require("../models/index");
const tb_user = model.tb_user;


//untuk layout
app.get('/', async (req, res) => {
    res.render("login", {
        layout: false
    })
})


//untuk proses login
app.post('/', async (req,res) => {

    let {username, password} = req.body;
    console.log(req.body)
    //cari user
    await tb_user.findAll({
        include:["outlet"],
        where: {username : username}
    })
        .then(resp => {
            //cek
            console.log(resp);
            console.log(resp.length == 1);


            if(resp.length == 1){
                //cek password
                dt = resp[0];
                if(md5(password) == dt.password){
                    //set session
                    console.log("login ===========================> ")
                    req.session.isLogin = true;
                    req.session.idUser = dt.id;
                    req.session.namaUser = dt.nama;
                    req.session.namaOutlet = dt.outlet.nama;
                    req.session.username = dt.username;
                    req.session.role = dt.role;
                    console.log(req.session)
                    
                    //render ke halaman home
                    res.redirect('/app/');
                }else{
                    res.render('login', {layout:false, msg: "password salah"})
                }
            }else if(resp.length > 1){
                res.json({msg: "ada lebih dari 1 username yang sama, lebih baik cek kembali "})

            }else{
                res.render('login',{ layout: false, msg: "username tidak ada"} )
                console.log("mencapai else terakhir")
                
            }

        })
        .catch(err => res.json({err}))

})
module.exports = app;

