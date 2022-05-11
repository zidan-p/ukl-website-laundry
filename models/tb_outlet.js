'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_outlet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.tb_transaksi,{
        constraints: false,
        foreignKey: 'id_outlet'
      });
      this.hasMany(models.tb_paket,{
        constraints: false,
        foreignKey: 'id_outlet',
        as: 'paket'
      });
      this.hasMany(models.tb_user,{
        foreignKey: "id_outlet" // selalu buat ini supaya sequelize tidak otomatis menambahkan "idOutletid"
      });
    }
  }
  tb_outlet.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    tlp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_outlet',
  });
  return tb_outlet;
};