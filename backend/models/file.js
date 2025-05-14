const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.Module, { foreignKey: 'moduleId' });
    }
  }

  File.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'File',
  });

  return File;
};