// Fix random ESLint lerna-linked packages errors
module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
    config.resolve.alias.set('#', require('path').resolve(__dirname, 'src/rest'))
  },
  define: {},
  optimizeDeps: {
    exclude: [
      'bcrypt',
      'debug',
      'cors',
      'postgres',
      'express',
      'express-session'
    ]
  }
}
