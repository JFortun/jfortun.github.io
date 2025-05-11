let translations = {};

async function fetchTranslation(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang} translations`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        return {};
    }
}

function getBrowserLanguage() {
    const language = navigator.language;
    return language.startsWith('es') ? 'es' : 'en';
}

async function setLanguage(lang) {
    if (!translations[lang]) {
        translations[lang] = await fetchTranslation(lang);
    }

    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (translations[lang][key]) {
            element.setAttribute('alt', translations[lang][key]);
        }
    });

    document.getElementById('language-selector').value = lang;
}

document.addEventListener('DOMContentLoaded', async () => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const defaultLanguage = savedLanguage || getBrowserLanguage();

    const languages = ['en', 'es'];
    const loadPromises = languages.map(async lang => {
        translations[lang] = await fetchTranslation(lang);
    });

    await Promise.all(loadPromises);

    await setLanguage(defaultLanguage);

    document.getElementById('language-selector').addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
});
