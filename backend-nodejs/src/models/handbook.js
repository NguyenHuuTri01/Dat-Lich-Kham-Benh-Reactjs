"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class HandBook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    HandBook.init(
        {
            title: DataTypes.STRING,
            descriptionHTML: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "HandBook",
        }
    );
    return HandBook;
};
