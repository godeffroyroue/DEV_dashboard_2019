/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    service_weather: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'User'
  });
};
