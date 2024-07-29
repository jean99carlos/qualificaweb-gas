const path = require('path');
const GasPlugin = require('gas-webpack-plugin');

const config = {
  context: path.resolve(__dirname, 'src/ts'),
  entry: {
    teste:'./global.ts',
  },
  output: {
    path: path.resolve(__dirname, 'src/server'),
    filename: 'private.js',
    clean:false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  plugins: [
    new GasPlugin()
  ]
};
 
module.exports = config