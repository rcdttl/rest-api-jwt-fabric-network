/* models/history.js */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "jwt_hist",
    {
      uid: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      jwt: {
        type: DataTypes.TEXT(),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: true,
    }
  );
};
