//import library penting
const express = require("express");
const bodyParser = require("body-parser");
const md5 = require("md5");



//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const tb_user = model.tb_user;

// function utilities
let duplicateCheck = async (nama) => {
    try {
        let duplikat = await tb_user.findAll({where: {username: nama}});
        if(duplikat.length > 0){ return true;}
        else{
            return false;
        }
    } catch (error) {
        return error;
    }
}



//daftar user dengan id tertentu
app.get('/:idUser', async (req,res) => {
    let idUser = req.params.idUser
    console.log("mencari user dengan id " + idUser)
    await tb_user.findOne({
        where : {id : idUser},
        include:["outlet"]
    })
        .then((result) =>{
            res.json({
                user: result,
                berhasil: true
            })
        })
        .catch((err) => {
            res.json({
                msg: err,
                berhasil : false
            })
        })
});

//dadftar user 
app.get('/', async (req,res) => {
    await tb_user.findAll({
        include:["outlet"]
    })
        .then((result) =>{
            res.json({
                user: result
            })
        })
        .catch((err) => {
            res.json({
                msg: err
            })
        })
});


//tambah user
app.post('/', async (req, res) => {

    let duplikat = await tb_user.findAll({where: {username: req.body.username}})
        .then(resp =>{
            console.log(resp)
            return resp;
        })


    if(await duplicateCheck(req.body.username)){
        console.log("ini adalah await")
        res.json({msg: "ada username yang sama", err: await duplicateCheck(req.body.username)})
    }else{
        
        //saya menyeraha untuk membuat validasi username
        //setiap saya menggunakan fungsi validasi, nilai yang di baca pada statement if selalu trua
        //sangat2 an**NG
        //SOLVED
        //ternyata masalahnya ada padda asyc await, saya belum menambahai await pada fungsi untuk cek duplikat
        console.log('data akan dimasukan ----------------')
        let data = {
            nama: req.body.nama,
            username: req.body.username, //jangan lupa untuk divalidasi
            password: md5(req.body.password),
            id_outlet: parseInt(req.body.id_outlet), 
            role: req.body.role
        }
        await tb_user.create(data)
            .then(result => {
                res.json({
                    result, 
                    msg: "data berhasil ditambahlan",
                    berhasil: true
                })
            })
            .catch(err => {
                res.json({
                    err, 
                    msg: "data gagal ditambahlan",
                    berhasil: false
                })
            })   
    }

    // if(await duplicateCheck(req.body.username)){
    //     console.log('hahahahahahaha')
    // }


    // let dep = await duplicateCheck(req.body.username);
    // res.json( {body: req.body})

});


//edit user
app.put('/:id', async (req, res) => { //jangan lupa untuk memberika fungsi untuk menghapus data2 lain
    let data = {}
    if(await duplicateCheck(req.body.username) && !(req.body.username == req.body.usernameLama)){
        res.json({msg: "ada username yang sama"})
        return false
    }else if(req.body.password.length == 0){
        data = {
            nama: req.body.nama,
            username: req.body.username, //jangan lupa untuk divalidasi
            id_outlet: req.body.id_outlet, 
            role: req.body.role
        }
    }else{
        data = {
            nama: req.body.nama,
            username: req.body.username, //jangan lupa untuk divalidasi
            password: md5(req.body.password),
            id_outlet: req.body.id_outlet, 
            role: req.body.role
        }
    }
    await tb_user.update(data, {where :{id: req.params.id}})
        .then((result) => {
            res.json({
                result, 
                msg: "data berhasil diubah",
                berhasil: true
            })
        })
        .catch(err => {
            res.json({
                err, 
                msg: "data berhasil diubah",
                berhasil: false
            })
        })

});


//hapus user
app.delete('/:id', async (req,res) => {
    await tb_user.destroy({where: {id: req.params.id}})
        .then((result) => {
            res.json({
                result,
                msg: "data berhasil dihapus",
                berhasil: true
            })
        })
        .catch(err => {
            res.json({
                err,
                msg: "data gagal dihapus",
                berhasil: true
            })
        })
});


module.exports = app;

