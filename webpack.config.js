// ...existing code...

module.exports = {
  // ...existing code...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/assets/images/logo-no-bg-small.png',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    // ...existing code...
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/sitemap.xml', to: '' },
        { from: 'src/robots.txt', to: '' },
        { from: 'src/manifest.json', to: '' }
      ]
    })
  ],
  // ...existing code...
};
