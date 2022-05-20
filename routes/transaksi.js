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
const tb_db = model.tb_transaksi; //menggunakan tabel transaksi
const tb_detail_transaksi = model.tb_detail_transaksi; //menggunakan tabel detail transaksi

// function utilities
const toSqlDatetime = (inputDate) => { //diisi dengan object tanggal => tosqlDatetime(new Date)
    const date = new Date(inputDate)
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ')
}


//daftar transaksi
app.get('/', async (req,res) => {

    //cek untuk auth
    console.log('cek auth untuk transaksi ------------->')

    await tb_db.findAll({
        include:["member", "outlet",
        {
            model: tb_detail_transaksi,
            as:'detail_transaksi',
            include:['paket']
        }
    ]
    })
        .then((result) =>{
            res.json({
                transaksi: result
            })
        })
        .catch((err) => {
            res.json({
                msg: err
            })
        })
});



//daftar transaksi dengan
app.get('/:id', async (req,res) => {
    await tb_db.findOne({
        where: {id: req.params.id},
        include:["member", "outlet",
        {
            model: tb_detail_transaksi,
            as:'detail_transaksi',
            include:['paket']
        }
    ]
    })
        .then((result) =>{
            res.json({
                transaksi: result,
                berhasil: true
            })
        })
        .catch((err) => {
            res.json({
                msg: err,
                berhasil : true
            })
        })
});



//daftar transaksi berdassarkan id_member
app.get('/member/:id_member', async (req, res) => {
    await tb_db.findAll({
        where: {id_member: req.params.id_member},
        include: [
            "member",
            {
                model: tb_detail_transaksi,
                as: 'detail_transaksi',
                include: ['paket']
            }
        ]
    
    })
        .then((result) => {
            res.json({
                transaksi: result
            })
        })
} )


//tambah transaksi
app.post('/', async (req, res) => {
    let {detail_transaksi, ...data} = {...req.body}; //menggunakan detructering assignment

    //bermain dengan tanggal
    let tanggal = new Date()
    data.kode_invoice = `INV-${tanggal.getUTCFullYear()}${tanggal.getUTCMonth()}${tanggal.getUTCDate()}`;
    data.tgl = toSqlDatetime(tanggal);

    //set tanggal untuk batas waktu
    tanggal.setDate(tanggal.getDate() + 5);//batas waktu adalah 5 hari
    data.batas_waktu = toSqlDatetime(tanggal);

    //set data tgl bayar
    if(data.dibayar == "belum_dibayar"){
        data.tgl_bayar = '0000-00-00';
    }


    await tb_db.create(data)
        .then(result => { //result ini berisi data yang dibuat

            //barulah membaut data detai transaksi
            id_transaksi = result.id;
            detail_transaksi.forEach(element => {
                element.id_transaksi = id_transaksi
            });
            tb_detail_transaksi.bulkCreate(detail_transaksi)
                .then(() => {
                    res.json({
                        result, 
                        msg: "data berhasil ditambahlan",
                        berhasil: true
                    })
                })
                .catch(err=>{
                    res.json({
                        err, 
                        msg: "data gagal ditambahlan",
                        berhasil: false
                    })
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


//edit transaksi(lebih bisa di sebut update status bayar)
app.put('/:id', async (req, res) => {

    let id_transaksi = req.params.id;

    //cek apakh yang dikirim adalah pembayaran
    //dikomendulu karen date dijavascript itu membingungkan
    
    // let tgl_bayar;
    // if(req.body.dibayar = "dibayar"){
    //     tgl_bayar = toSqlDatetime(new Date());
    // }
    // let data = {
    //     tgl_bayar: tgl_bayar ? tgl_bayar : '00-00-00',//sama saja -> apakah ada tanggal bayar? jika ada gunakan, jika tidak isi niali null
    //     status: req.body.status,
    //     dibayar:  req.body.dibayar ?? "belum_dibayar" //sama saja
    // }

    let {qty, ...dataBody} = req.body;
    let data = {
        tgl_bayar: dataBody.tgl_bayar,
        batas_waktu : dataBody.batas_waktu,
        tgl : dataBody.tgl,
        biaya_tambahan : parseInt(dataBody.biaya_tambahan),
        diskon: parseInt(dataBody.diskon)/100,
        pajak: parseInt(dataBody.pajak),
        status: dataBody.status,
        dibayar: dataBody.dibayar,
        id_user: dataBody.id_user
    }




    await tb_db.update(data, {where :{id: req.params.id}})
        .then( async (result) => {

            //melakukan update detail transaksi
            let detail = await tb_detail_transaksi.findAll({where : { id_transaksi : id_transaksi}});
            detail.forEach( async (dt,i)=> {
                await tb_detail_transaksi.update({qty: qty[i]}, {where : {id : dt.id}})
            })

            res.json({
                result,
                msg: "data telah diubah",
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


//hapus transaksi
app.delete('/:id', async (req,res) => {//jangan lupa untuk memberika fungsi untuk menghapus data2 lain

    try {
        let result1 = await tb_detail_transaksi.destroy({where: {id_transaksi: req.params.id}});
        let result2 = await tb_db.destroy({where: {id: req.params.id}});
        res.json({
            result: { ...result1, ...result2 },
            msg: "data berhasil dihapus",
            berhasil: true
        })
        
    } catch (err) {
        res.json({
            err,
            msg: "data gagal dihapus",
            berhasil: false
        })
    }
});


module.exports = app;



