module.exports = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: ['en', 'de'],
  keysManager: {
    fileFormat: 'json', // or 'pot'
    addMissingKeys: true,
    defaultValue: '',
    interpolation: ['[[', ']]']
  }
};
