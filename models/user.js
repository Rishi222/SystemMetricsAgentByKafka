const { DataTypes, Model } = require("sequelize");                     // here i import the sequelize module for database connection properties access.
const sequelize = require("../config/mysqldb");                 // here i connect the sql database.
const bcrypt = require("bcrypt");                        // here i import the bcrypt module for password hashing.    

class User extends Model {                          // this is use to compare the password
  async isValidPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(                              // here i define the user model with the properties with the help of sequelize module
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("producer", "consumer", "admin"),
      defaultValue: "producer",
    },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {                            // here the hook is use to hash the password before create or update the user password
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;
