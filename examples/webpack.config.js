const fs = require('fs')
const path = require('path')
const VuePlugin = require('vue-loader/lib/plugin')

module.exports = {
  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  mode: process.env.NODE_ENV || 'development',
  // devtool: 'cheap-module-eval-source-map',
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.js')
    
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      // entries[dir] = ['es6-promise/auto', entry]
      entries[dir] = [entry]
    }

    return entries
  }, {}),

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'ws-vue-preload': path.join(__dirname, '../dist/ws-vue-preload.esm')
    }
  },

  plugins: [new VuePlugin()]
};
