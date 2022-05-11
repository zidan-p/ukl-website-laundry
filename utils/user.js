
//import 
const md5 = require('md5');


//import model
const models = require("../models/index");
const tb_user = models.tb_user;

let duplicateCheck = (username) => {
    let duplikat = tb_user.findAll({where: {username: username}});
    if(duplkat[0]) return true;
    return false;
}

let loadUsers = () => {
    let users = tb_user.findAll();
    return users;
}

let findUsers = (keyword) => {
    return tb_user.findAll({
        where: {
            nama: '%keyword%'
        }
    })
}

let deleteUser = async (idUser) => {
    let param = {
        id: idUser
    }
    let info;
    await tb_user.destroy({ where: param})
        .then((result) =>{info = {msg: "data berhasil dihapus", berhasil: true, result}})
        .catch(err => info = {msg: "data gagal dihapus", berhasil: false, err});
    
    return info;
}

let updateUser = async (body) => { //nanti harus direvisi, karena harus ada juga data yang dihapus / diganti, + harus menggunakan spread operatir untuk param
    let data = {
        nama: body.nama,
        username: body.username, //jangan lupa untuk divalidasi
        password: md5(body.password),
        id_outlet: body.id_outlet, 
        role: body.role
    }
    let param = {id: body.id}
    let info;
    try {
        info = await tb_user.update(data,{where: param})
    } catch (err) {
        info = err
    }
    return info;

}

let addUser = async (body) => {
    let data = {
        nama: body.nama,
        username: body.username, //jangan lupa untuk divalidasi
        password: md5(body.password),
        id_outlet: body.id_outlet, 
        role: body.role
    }
    let info;
    try {
        info = await tb_user.create(data);
    } catch (error) {
        info = error;
    }
    return info;
}

module.exports = {findUsers, loadUsers, addUser, updateUser, deleteUser, duplicateCheck};