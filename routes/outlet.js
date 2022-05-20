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
const tb_db = model.tb_outlet; //menggunakan tabel outleet
const tb_paket = model.tb_paket;
const tb_transaksi = model.tb_transaksi;
const tb_user = model.tb_user;


// function utilities
let duplicateCheck = async (username) => { //tidak diguakan karena outlet sudah memiliki id
    let duplikat = await tb_db.findAll({where: {username: username}});
    if(duplikat[0]) return true;
    return false;
}



//daftar outlet
app.get('/', async (req,res) => {
    await tb_db.findAll(
        {
        include: [{
            model: tb_paket,
            as: 'paket'}]
        }
        )
        .then((result) =>{
            res.json({
                outlet: result
            })
        })
        .catch((err) => {
            res.json({
                msg: err
            })
        })
});

//outlet berdasarkan id
app.get('/:id', async (req,res) => {
    await tb_db.findOne(
        {
        where: {id : req.params.id},
        include: [{
            model: tb_paket,
            as: 'paket'}]
        }
        )
        .then((result) =>{
            res.json({
                outlet: result,
                berhasil: true
            })
        })
        .catch((err) => {
            res.json({
                msg: err,
                berhasil: false
            })
        })
});


//tambah outlet
app.post('/', async (req, res) => {
    let data = {
        nama: req.body.nama,
        alamat: req.body.alamat,
        tlp: req.body.tlp
    }
    await tb_db.create(data)
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

});


//edit outlet
app.put('/:id', async (req, res) => {
    let data = {
        nama: req.body.nama,
        alamat: req.body.alamat,
        tlp: req.body.tlp
    }
    await tb_db.update(data, {where :{id: req.params.id}})
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
                msg: "data gagal diubah",
                berhasil: false
            })
        })

});


//hapus outlet
app.delete('/:id', async (req,res) => { //jangan lupa untuk memberika fungsi untuk menghapus data2 lain
    let id = req.params.id;
    // let result1 = await tb_paket.update({id_outlet : null}, {where: {id_outlet : id}});
    // let result2 = await tb_transaksi.update({id_outlet : null}, {where: {id_outlet : id}});
    // let result3 = await tb_user.update({id_outlet : null}, {where: {id_outlet : id}});




    await tb_db.destroy({where: {id: req.params.id}})
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
                berhasil: false
            })
        })
});


module.exports = app;

