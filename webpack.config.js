// ...existing code...

module.exports = {
  // ...existing code...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/assets/images/logo-no-bg-small.png'
    }),
    // ...existing code...
  ],
  // ...existing code...
};
