/* models/user_list.js */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user_list",
    {
      uid: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      auth_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
