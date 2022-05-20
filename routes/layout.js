//import library penting
const express = require("express");
const bodyParser = require("body-parser");
const md5 = require("md5");
const axios = require('axios');


//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const { deleteUser } = require("../utils/user");
const tb_member = model.tb_member;



//halamn home
app.get('/', async (req,res) => {

    //cek untuk auth
    console.log("auth untuk login ---------->")

    let {transaksi} = await axios.get('http://localhost:8080/transaksi')
        .then(resp => {return resp.data})

    console.log(transaksi);

    let banyakTransaksi = transaksi.length
    let {user} = await axios.get('http://localhost:8080/user')
        .then(resp => {return resp.data})

    let {outlet} = await axios.get('http://localhost:8080/outlet')
        .then(resp => {return resp.data})

    let {paket} = await axios.get('http://localhost:8080/paket')
        .then(resp => {return resp.data})
    
    res.render('home',{
        extractScripts: true,
        layout: "../layouts/main",
        title: "halaman home",
        transaksi,
        banyakTransaksi,
        banyakOutlet : outlet.length,
        banyakPaket : paket.length,
        banyakUser : user.length,
        activeLink : "home",
        session: req.session,
    });
});


//halaman user
app.get('/user', async(req,res)=> {
    let {user} = await  axios.get('http://localhost:8080/user')
        .then(resp=> {return resp.data})

    res.render('user', {
        layout: "../layouts/main",
        title: 'halaman user',
        extractScripts: true,
        user,
        session: req.session,
        activeLink: "user"
    })
})


//halaman member
app.get('/member', async(req,res) => {
    let {member} = await axios('http://localhost:8080/member')
        .then(resp => {return resp.data})
    
    res.render('member',{
        layout: "../layouts/main",
        extractScripts: true,
        title: "halaman member",
        member,
        session: req.session,
        activeLink: "member"
    })
})

//halaman outlet
app.get('/outlet', async(req,res)=> {

    let {outlet,msg : err} = await axios('http://localhost:8080/outlet')
        .then(resp => {return resp.data})
        .catch(msg => msg)
    console.log(outlet)

    if(err){
        res.json({err})
    }else{
        res.render('outlet',{
            layout: "../layouts/main",
            extractScripts: true,
            title: "halaman outlet",
            outlet,
            session: req.session,
            activeLink: "outlet"
        })
    }
})

//halaman paket
app.get('/paket', async(req,res) => {
    let {paket, msg: errPaket} = await axios('http://localhost:8080/paket')
        .then(resp => resp.data)
        .catch(msg => msg)
    console.log([paket,errPaket])

    let {outlet, msg:  errOutlet} = await axios('http://localhost:8080/outlet')
        .then(resp => resp.data)
        .catch(msg => msg)

        //cek error dulu
    if(errPaket){
        res.send(errPaket)
    }else if(errOutlet){
        res.send(errOutlet)
    }else{
        // res.json({paket,outlet})
        console.log("kirimm data!!!")
        res.render('paket',{
            layout: "../layouts/main",
            title: "halaman paket",
            extractScripts: true,
            paket,
            outlet,
            session: req.session,
            activeLink: "paket"
        })
    }
})


//untuk transaksi
app.get('/transaksi', async (req,res) => {
    let {transaksi, msg} = await axios.get('http://localhost:8080/transaksi')
        .then(resp => resp.data)
        .catch(msg => msg)

    if(msg){
        res.json({msg})
    }else{
        console.log("data transaksi dikirim!!!!! =================================================================")
        res.render('transaksi',{
            layout: "../layouts/main",
            title: "halaman transaksi",
            extractScripts: true,
            transaksi,
            session: req.session,
            activeLink: "transaksi"
        })
    }
})


// untuk tambah data (layout) ====================================================================================

//karena saya malas maka saya menjadikan jenis data yang diubah menjadi params
app.get("/create/:tb", async(req,res)=> {
    let jenisData = req.params.tb;
    let ly = jenisData; //layout yang akan digunakan

    try {

        let {paket} = await axios.get('http://localhost:8080/paket').then(resp => resp.data);
        let {outlet} = await axios.get('http://localhost:8080/outlet').then(resp => resp.data);
        let {user} = await axios.get('http://localhost:8080/user').then(resp => resp.data);
        let {member} = await axios.get('http://localhost:8080/member').then(resp => resp.data);

        res.render(`form-tambah-${ly}`,{
            layout: "../layouts/main",
            extractScripts:true,
            title: `halaman ${ly}`,
            activeLink: ly,
            paket,
            outlet,
            user,
            member,
            session: req.session,
        })
    } catch (error) {
        res.json({error})
    }
})


//untuk peroses pengolahan transaksi
app.post('/proses/create/transaksi', async (req,res) => {
    let data = req.body;
    let send = {
        id_outlet: 1,
        id_member : parseInt(data.id_member),
        tgl : data.tgl,
        batas_waktu: data.batas_waktu,
        tgl_bayar : data.tgl_bayar,
        biaya_tambahan : data.biaya_tambahan,
        diskon : parseFloat(data.diskon / 100),
        pajak : parseInt(data.pajak),
        status : data.status,
        dibayar : data.dibayar,
        id_user : 7,
        detail_transaksi : data.id_paket.map((pk,i) => {return {id_paket : parseInt(pk), qty : parseInt(data.qty[i])}})
    }
    // res.json(send);

    let {berhasil: succes,err} = await axios.post("http://localhost:8080/transaksi", send).then(resp => resp.data).catch(err => err);
    if(succes){
        res.redirect('/app/transaksi')
    }else{
        res.json({err})
    }

})

//untuk proses data yang lain
app.post('/proses/create/:tb', async (req,res) => {
    let tb = req.params.tb
    let data = req.body;

    let {result, berhasil: success, err, msg} = await axios.post(`http://localhost:8080/${tb}`, data)
        .then(resp => resp.data)
        .catch(err => err);

    console.log("proses tambah "+tb+ "--------------------------------------");
    if(success){
        res.redirect(`/app/${tb}`)
        // res.json({result})
    }else{
        res.json({err,msg})
    }
})


//untuk layout halaman edit
app.get("/update/:tb/:id", async (req,res) => {
    let tb = req.params.tb
    let id = req.params.id

    try {

        //untuk data pemilihan
        let {paket} = await axios.get('http://localhost:8080/paket').then(resp => resp.data);
        let {outlet} = await axios.get('http://localhost:8080/outlet').then(resp => resp.data);
        let {user} = await axios.get('http://localhost:8080/user').then(resp => resp.data);
        let {member} = await axios.get('http://localhost:8080/member').then(resp => resp.data);


        // {paket: paketId ,outlet : outletId ,user : userId,member : memberId, msg: err, berhasil} 
        //untuk mengambil data dengan id
        let data = await axios.get(`http://localhost:8080/${tb}/${id}`)
            .then(resp => resp.data)
            .catch(err => {
                console.log(err);
                return err
            })

        console.log({dt: data, br: data.berhasil});

        if(data.berhasil){
            res.render(`form-ubah-${tb}`,{
                layout: "../layouts/main",
                extractScripts: true,
                title: `halaman ubah ${tb}`,
                activeLink: tb,
                paket,
                outlet,
                user,
                member,
                data,
                session: req.session,
            })
        }else{
            res.json({error: data.msg})
        }
    } catch (error) {
        res.json({error})
    }
})


//untuk proses ubah data data yang lain
app.post('/proses/update/:tb/:id', async (req,res) => {
    let tb = req.params.tb
    let data = req.body;
    let id = req.params.id;

    let {result, berhasil: success, err, msg} = await axios.put(`http://localhost:8080/${tb}/${id}`, data)
        .then(resp => resp.data)
        .catch(err => err);

    console.log("proses ubah "+tb+ "--------------------------------------"+success+" "+`http://localhost:8080/${tb}/${id}`);
    if(success){
        res.redirect(`/app/${tb}`)
        // res.json({result})
    }else{
        res.json({err,msg})
    }
})

//untuk print
app.get('/print', async (req, res) => {
    let {msg, transaksi} = await axios.get(`http://localhost:8080/transaksi`)
        .then(result => {
            return result.data
        })
        .catch(err => {
            console.log(err);
            return err
        })

    if(msg == {}){
        res.json({msg})
    }else{
        res.render('print', {
            layout: false,
            transaksi,
            session : req.session
        })
    }
})

module.exports = app;

