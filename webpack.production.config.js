module.exports = {
  entry:[
    __dirname + '/src/js/'
  ],
  output:{
    path: __dirname + '/static/',
    filename:'bundle.js'
  },
  module:{
    loaders:[
      {test: /\.js$/, exclude:/node_modules/, loaders:['babel']},
      {test: /\.css$/, exclude:/node_modules/, loaders:['style!css']}
    ]
  }
}
