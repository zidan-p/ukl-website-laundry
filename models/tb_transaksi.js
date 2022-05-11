'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.tb_member,{
        constraints: false,
        foreignKey: 'id_member',
        as: 'member'
      });

      this.belongsTo(models.tb_outlet,{
        constraints: false,
        foreignKey: 'id_outlet',
        as: 'outlet'
      });

      this.belongsTo(models.tb_user, {
        constraints: false,
        foreignKey: 'id_user',
        as: 'user'
      })

      this.hasMany(models.tb_detail_transaksi,{
        constraints: false,
        foreignKey: 'id_transaksi',
        as: "detail_transaksi"
      });
    }
  }
  tb_transaksi.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_outlet: DataTypes.INTEGER,
    kode_invoice: DataTypes.STRING,
    id_member: DataTypes.STRING,
    tgl: DataTypes.DATE,
    batas_waktu: DataTypes.DATE,
    tgl_bayar: DataTypes.DATE,
    biaya_tambahan: DataTypes.INTEGER,
    diskon: DataTypes.DOUBLE,
    pajak: DataTypes.INTEGER,
    status: DataTypes.ENUM('baru', 'proses', 'selesai', 'diambil'),
    dibayar: DataTypes.ENUM('dibayar', 'belum_dibayar'),
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_transaksi',
  });
  return tb_transaksi;
};