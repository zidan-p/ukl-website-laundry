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
const tb_db = model.tb_paket; //menggunakan tabel paket

// function utilities
let duplicateCheck = async (username) => { //tidak diguakan karena outlet sudah memiliki id
    let duplikat = await tb_db.findAll({where: {username: username}});
    if(duplikat[0]) return true;
    return false;
}



//daftar paket
app.get('/', async (req,res) => {
    await tb_db.findAll({
        include: "outlet"
        })
        .then((result) =>{
            res.json({
                paket: result
            })
        })
        .catch((err) => {
            res.json({
                msg: err
            })
        })
});


//daftar paket berdasar id
app.get('/:id', async (req,res) => {
    await tb_db.findOne({
        where: {id : req.params.id},
        include: "outlet"
        })
        .then((result) =>{
            res.json({
                paket: result,
                berhasil: true
            })
        })
        .catch((err) => {
            res.json({
                msg: err,
                berhasi: false
            })
        })
});


//tambah paket
app.post('/', async (req, res) => {
    let data = {
        id_outlet: parseInt(req.body.id_outlet),
        jenis:  req.body.jenis,
        nama_paket: req.body.nama_paket,
        harga: parseInt(req.body.harga)
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
        id_outlet:  req.body.id_outlet,
        jenis:  req.body.jenis,
        nama_paket: req.body.nama_paket,
        harga:  req.body.harga
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
                msg: "data berhasil diubah",
                berhasil: false
            })
        })

});


//hapus outlet
app.delete('/:id', async (req,res) => { //jangan lupa untuk memberika fungsi untuk menghapus data2 lain
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
                berhasil: true
            })
        })
});


module.exports = app;

