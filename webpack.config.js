const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
     loginPage: './src/login.ts',
     indexPage: './src/index.ts',
     homePage: './src/home.ts',
     textConnPage: './src/textconn/textconn.ts',
     textConnEdtPage: './src/textconn/textconnedt.ts',
     jdbcConnEdtPage: './src/jdbcconn/jdbcconnedt.ts',
     jdbcConnPage: './src/jdbcconn/jdbcconn.ts',

     taskDefPage: './src/taskdef.ts',
     taskDefEdtClassNamePage: './src/taskdefedt/classname.ts',
     taskDefEdtPage: './src/taskdefedt/basic.ts',
     taskDefEdtPropertiesPage: './src/taskdefedt/properties.ts',
     taskDefEdtSubTaskPage: './src/taskdefedt/task.ts',

     procDefPage: './src/processdef.ts',
     procDefEdtPage: './src/procdefedt/basic.ts',
     procDefEdtVarPage: './src/procdefedt/var.ts',
     procDefEdtTaskPage: './src/procdefedt/task.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    static:  {
      directory: path.join(__dirname, 'dist')
    },
    proxy: {
      '/tasks-svc' : 'http://localhost:8080/'
    },
    compress: true,
    port: 9000
  },
  /*
  plugins: [
    new webpack.ProvidePlugin({
    'window.jQuery': 'jquery'
  })
  ],*/

  externals: {
    jquery: 'jQuery',
  },

  resolve: {fallback: {
    "assert": false,
    "fs": false,
    "tls": false,
    "net": false,
    "path": false,
    "zlib": false,
    "http": false,
    "https": false,
    "stream": false,
    "crypto": false,
    "crypto-browserify": false},
      // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      /*
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            include: path.resolve(__dirname, './node_modules/bootstrap-icons/font/fonts'),
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'webfonts',
                    publicPath: '../webfonts',
                },
            }
      },
      */
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      /*
      {
        test: /sudoku-deep-solver\.worker\.ts$/i,
        loader: "worker-loader",
        options: {
          filename: "sudoku.worker.js",
        },
      },
      {
        test: /solitaire-deep-solver\.worker\.ts$/i,
        loader: "worker-loader",
        options: {
          filename: "solitaire.worker.js",
        },
      },
      */

      {
        test: /\.ts$/,
        use: [{
            loader: 'ts-loader',
            options: {
                configFile: "tsconfig.json"
            }
        }],
        exclude: /node_modules/,
      },

      /*
      {
          test: /\.worker\.ts$/,
          use: { loader: 'worker-loader' }
      }
      */
      /*
      {
        test: /solitaire\-deep\-solver\-worker\.js$/i,
        loader: "worker-loader",
        options: {
          filename: "pippo.worker.js",
        },
      }
      */
      /*{
      test: /\.html$/,
      exclude: /node_modules/,
      use: {loader: 'html-loader'}
      }*/
    ],
  },
};