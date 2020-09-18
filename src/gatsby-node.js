const fs = require("fs")
const removeUndefinedProperties = require("./utils/removeUndefinedProperties")

exports.onCreateNode = async (
  {
    node,
    actions: { createNode, createParentChildLink },
    createNodeId,
    loadNodeContent,
    createContentDigest
  },
  pluginOptions
) => {
  // Combine make a new node with
  if (
    node.sourceInstanceName == "i18n-locales" &&
    node.internal.mediaType == "application/json"
  ) {
    const currentLanguage = node.name

    const siteConfig = JSON.parse(fs.readFileSync(pluginOptions.siteConfigPath))
    const siteConfigPages = siteConfig.pages

    // console.log("gatsby-plugin-transform-i18n-locales\n", currentLanguage, "siteConfigPages\n", siteConfigPages);

    // console.log("gatsby-plugin-transform-i18n-locales\n", "siteConfigJsonData\n", siteConfigJsonData);

    // console.log("gatsby-plugin-transform-i18n-locales found node: \n", node.name);

    const rawFileData = await loadNodeContent(node)
    const i18nResources = JSON.parse(rawFileData) // Parsed json files, need to be converted to nodes
    // console.log("gatsby-plugin-transform-i18n-locales\n", "parsedTranslationContent\n", parsedTranslationContent);

    // console.log("gatsby-plugin-transform-i18n-locales\n", currentLanguage, "parsedLocaleFileData\n", i18nResources)

    // Create nodes containing all navigation links by namespace
    const createNavigationLinkNode = obj => {
      // console.log(obj)

      createNode({
        id: createNodeId(
          `navigationLinkNode${node.name}${node.id}${obj.namespace}`
        ),
        parent: node.id,
        children: [],
        lang: currentLanguage,
        ...obj,
        internal: {
          contentDigest: createContentDigest(i18nResources),
          type: "NavigationLinks"
        }
      })
    }

    // Creates and array of all site pages for navigation
    const navigationArr = siteConfigPages
      .filter(page => page.navigation !== "hidden") // filter out hidden pages as per site-config
      .map(page => {
        const getChildItemsArr = (page, pagePath) =>
          page.children.map(item => {
            let itemPath = `${pagePath}/${i18nResources[item.name].slug}`

            let itemObj = {
              path: itemPath,
              title: `${i18nResources[item.name].title}`,
              children: Array.isArray(item.children)
                ? getChildItemsArr(item, itemPath)
                : null
            }

            createNavigationLinkNode({
              namespace: item.name,
              path: itemPath,
              title: `${i18nResources[item.name].title}`
            })

            return removeUndefinedProperties(itemObj)
          })

        let pagePath = `/${currentLanguage}/${i18nResources[page.name].slug}`

        let pageObj = {
          path: pagePath,
          title: `${i18nResources[page.name].title}`,
          children: Array.isArray(page.children)
            ? getChildItemsArr(page, pagePath)
            : null
        }

        createNavigationLinkNode({
          namespace: page.name,
          path: pagePath,
          title: `${i18nResources[page.name].title}`
        })

        // console.log(pageObj)

        return removeUndefinedProperties(pageObj)
      })

    // console.log(navigationArr)

    let newNodeObj = {
      id: createNodeId(`navigationNode${node.name}${node.id}`),
      parent: node.id,
      children: [],
      lang: currentLanguage,
      all: JSON.stringify(navigationArr),
      internal: {
        contentDigest: createContentDigest(navigationArr),
        type: "Navigation"
      }
    }

    createNode(newNodeObj)

    createParentChildLink({ parent: node, child: newNodeObj })
  }
}
