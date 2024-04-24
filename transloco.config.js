module.exports = {
    rootTranslationsPath: 'src/assets/i18n/',
    langs: ['en_US', 'de_DE', 'es_ES', 'fr_FR', 'pl_PL', 'ru_RU', 'uk_UA'],
    keysManager: {
        fileFormat: 'json', // or 'pot'
        addMissingKeys: true,
        defaultValue: '',
        interpolation: ['{{', '}}']
    }
};
