const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Module, { foreignKey: 'courseId' });
      Course.belongsTo(models.User, { foreignKey: 'instructorId', as: 'instructor' });
      Course.hasMany(models.Enrollment, { foreignKey: 'courseId' });
      Course.belongsToMany(models.User, { 
        through: models.Enrollment,
        foreignKey: 'courseId',
        otherKey: 'userId',
        as: 'students'
      });
    }
  }

  Course.init({
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructorId: {
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
    modelName: 'Course',
  });

  return Course;
};