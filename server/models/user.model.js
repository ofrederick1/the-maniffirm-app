const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Sequelize instance

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordhash: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM("admin", "subscriber"),
    allowNull: false,
    defaultValue: "admin",
  }
  // resetToken: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  // resetTokenExpiry: {
  //   type: DataTypes.DATE,
  //   allowNull: true,
  // },
});

module.exports = User;
