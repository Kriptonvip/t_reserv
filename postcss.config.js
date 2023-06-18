module.exports = {
    plugins: [
      require('postcss-prefixer')({
        prefix: 'tt-reserv-', // Замените 'my-app-' на желаемый префикс
      }),
      // Другие плагины PostCSS, если есть
    ],
  };
  