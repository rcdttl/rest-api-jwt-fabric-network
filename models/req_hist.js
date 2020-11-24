/* models/history.js */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "req_hist",
    {
      jwt: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
