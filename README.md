# gatsby-plugin-generate-i18n-navigation

Generate i18n navigation from site config JSON

## Installing

```bash
npm install --dev vanska/gatsby-plugin-generate-i18n-navigation
```

## Plugin configuration

Add plugin in to `gatsby-config.js`.

```js
plugins: [
  {
    resolve: `gatsby-local-plugin-generate-navigation`,
    options: {
      i18nLocalesDir: I18N_LOCALES_DIR,
      siteConfigPath: SITE_CONFIG_PATH,
    },
  },
]
```

## Locales JSON format

File content for `./locales/en.json`.

```js
{
  "namespace": {
    "slug": "articles-english",
  }
}
```

## Local package development with yalc

```bash
npm run yalc-watch
cd ../destination-project
yalc link tiny-i18n
```
