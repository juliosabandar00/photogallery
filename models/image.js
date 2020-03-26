'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize;
  const Model = Sequelize.Model;
  class Image extends Model{
    get score() {
      return this.likes - this.dislikes;
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
    },
    likes : DataTypes.INTEGER,
    dislikes : DataTypes.INTEGER
  }, 
  { 
    sequelize,
    hooks: {
      beforeCreate: (image, option) => {
        image.likes = 0;
        image.dislikes = 0;
      }
    }
  })
  Image.associate = function(models) {
    Image.belongsToMany(models.User, {through : models.ImageUser})
  };
  return Image;
};