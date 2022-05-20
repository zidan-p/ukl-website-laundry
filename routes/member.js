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
const tb_member = model.tb_member;

// function utilities
let duplicateCheck = async (nama) => {
    try {
        let duplikat = await tb_member.findAll({where: {nama: nama}});
        if(duplikat[0]) return true;
        return false;
    } catch (error) {
        return error;
    }
}



//daftar member
app.get('/', async (req,res) => {
    await tb_member.findAll()
        .then((result) =>{
            res.json({
                member: result
            })
        })
        .catch((err) => {
            res.json({
                msg: err
            })
        })
});

//daftar member dengan id
app.get('/:id', async (req,res) => {
    await tb_member.findOne({
        where: {id: req.params.id}
    })
        .then((result) =>{
            res.json({
                member: result,
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


//tambah member
app.post('/', async (req, res) => {
    if(await duplicateCheck(req.body.nama)){
        res.json({msg: "ada name yang sama"})
    }else{
        let data = {
            nama: req.body.nama,
            alamat: req.body.alamat,
            jenis_kelamin: req.body.jenis_kelamin,
            tlp: req.body.tlp
        }
        await tb_member.create(data)
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

});


//edit member
app.put('/:id', async (req, res) => {
    if(await duplicateCheck(req.body.nama) && (req.body.nama != req.body.namaLama)){
        res.json({msg: "ada username yang sama"})
    }else{
        let data = {
            nama: req.body.nama,
            alamat: req.body.alamat,
            jenis_kelamin: req.body.jenis_kelamin,
            tlp: req.body.tlp
        }
        await tb_member.update(data, {where :{id: req.params.id}})
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

    }
    
});


//hapus member
app.delete('/:id', async (req,res) => { //jangan lupa untuk memberika fungsi untuk menghapus data2 lain
    await tb_member.destroy({where: {id: req.params.id}})
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

