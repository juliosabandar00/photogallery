'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;
  class ImageUser extends Model{};
  ImageUser.init({
    ImageId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    Vote: DataTypes.BOOLEAN
  }, { sequelize })
  ImageUser.associate = function(models) {
    ImageUser.belongsTo(models.Image);
    ImageUser.belongsTo(models.User);
  };
  return ImageUser;
};