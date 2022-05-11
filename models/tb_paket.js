'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_paket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.tb_detail_transaksi,{
        constraints: false,
        foreignKey: 'id_paket'
      });
      this.belongsTo(models.tb_outlet, {
        foreignKey : 'id_outlet',
        as: "outlet"
      })
    }
  }
  tb_paket.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_outlet: DataTypes.INTEGER,
    jenis: DataTypes.ENUM('kiloan', 'selimut', 'bed_cover', 'kaos', 'lain'),
    nama_paket: DataTypes.STRING,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_paket',
  });
  return tb_paket;
};