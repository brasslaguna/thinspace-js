
var webpack = require("webpack"),
    path = require("path");

module.exports = {

  context: __dirname,

  entry: {

    index: ["./index.js"]

  },

  module: {

    rules: [

      {

        loader: "babel-loader",

        options: {

          presets: ["babel-preset-es2015"]
        
        }

      }

    ]

  },

  output: {

    path: __dirname,

    filename: "build/[name].js"

  }

};