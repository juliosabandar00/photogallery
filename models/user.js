'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;
  class User extends Model {
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [4, 200]
      },
      unique: {
        args: true,
        msg: 'Username is already taken'
      }
    },
    password: {
      type: DataTypes.STRING,
      notEmpty: true,
      validate: {
        len: [6, 200]
      }
    }
  }, { sequelize })
  User.associate = function (models) {
    User.belongsToMany(models.Image, { through: models.ImageUser })
  };
  return User;
};