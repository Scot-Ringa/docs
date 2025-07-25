// when updating to typescript,
// update links in content/contributing as well

import parse from '@/frame/lib/read-frontmatter'
import { allVersions } from '@/versions/lib/all-versions'
import { allTools } from '@/tools/lib/all-tools'
import { getDeepDataByLanguage } from '@/data-directory/lib/get-data'

const layoutNames = [
  'default',
  'graphql-explorer',
  'product-landing',
  'product-guides',
  'release-notes',
  'inline',
  'category-landing',
  false,
]

// DEPRECATED: Use 'contentType' instead of 'type' for new content.
// 'type' exists on ~40% of files but is used only for internal analytics.
// Migration tool: src/content-render/scripts/add-content-type.ts
const guideTypes = ['overview', 'quick_start', 'tutorial', 'how_to', 'reference', 'rai']

// As of July 2025, use 'contentType' rather than 'type'.
export const contentTypesEnum = [
  'get-started',
  'concepts',
  'how-tos',
  'reference',
  'tutorials',
  'homepage', // Only applies to the sole 'content/index.md' file (the homepage).
  'landing', // Only applies to 'content/<product>/index.md' files (product landings).
  'rai', // Only applies to files that live in directories with 'responsible-use' in the name.
  'other', // Everything else.
]

export const schema = {
  type: 'object',
  required: ['title', 'versions'],
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      translatable: true,
    },
    shortTitle: {
      type: 'string',
      translatable: true,
    },
    intro: {
      type: 'string',
      translatable: true,
    },
    product: {
      type: 'string',
      translatable: true,
    },
    permissions: {
      type: 'string',
      translatable: true,
    },
    // true by default on articles, false on all other content
    showMiniToc: {
      type: 'boolean',
    },
    // This frontmatter property is deprecated. Despite what `miniTocMaxHeadingLevel` says, the max level of mini TOC is *always* 2. See github/docs-engineering#2701.
    miniTocMaxHeadingLevel: {
      deprecated: true,
      type: 'number',
      default: 2,
      minimum: 2,
      maximum: 4,
    },
    subcategory: {
      type: 'boolean',
    },
    // allow hidden articles under `early-access`
    hidden: {
      type: 'boolean',
    },
    // specify whether an Early Access article should not have a header notice
    noEarlyAccessBanner: {
      type: 'boolean',
    },
    // specify whether an Early Access product should have a table of contents
    // (EA categories and subcategories have them by default, but products don't)
    earlyAccessToc: {
      type: 'boolean',
    },
    layout: {
      type: ['string', 'boolean'],
      enum: layoutNames,
      errorMessage: 'must be the filename of an existing layout file, or `false` for no layout',
    },
    redirect_from: {
      type: 'array',
    },
    allowTitleToDifferFromFilename: {
      type: 'boolean',
    },
    introLinks: {
      type: 'object',
    },
    authors: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    examples_source: {
      type: 'string',
    },
    effectiveDate: {
      type: 'string',
    },
    featuredLinks: {
      type: 'object',
      properties: {
        gettingStarted: {
          type: 'array',
          items: { type: 'string' },
        },
        startHere: {
          type: 'array',
          items: { type: 'string' },
        },
        guideCards: {
          type: 'array',
          items: { type: 'string' },
        },
        popular: {
          type: 'array',
          items: { type: 'string' },
        },
        // allows you to use an alternate heading for the popular column
        popularHeading: {
          type: 'string',
          translatable: true,
        },
        videos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              href: {
                type: 'string',
              },
            },
          },
        },
        // allows you to use an alternate heading for the videos column
        videosHeading: {
          type: 'string',
        },
      },
    },
    // Shown in `product-landing.html` "What's new" section
    changelog: {
      type: 'object',
      properties: {
        label: { type: 'string' },
        prefix: { type: 'string' },
      },
    },
    // DEPRECATED: Use 'contentType' instead of 'type' for new content.
    // 'type' exists on ~40% of files but is used only for internal analytics.
    // Migration tool: src/content-render/scripts/add-content-type.ts
    type: {
      type: 'string',
      enum: guideTypes,
    },
    // As of July 2025, use 'contentType' rather than 'type'.
    contentType: {
      type: 'string',
      enum: contentTypesEnum,
    },
    topics: {
      type: 'array',
    },
    includeGuides: {
      type: 'array',
    },
    learningTracks: {
      type: 'array',
    },
    // Used in `product-landing.html`
    beta_product: {
      type: 'boolean',
    },
    // Show in `product-landing.html`
    product_video: {
      type: 'string',
    },
    // Show in `product-landing.html`
    product_video_transcript: {
      type: 'string',
    },
    interactive: {
      type: 'boolean',
    },
    communityRedirect: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        href: {
          type: 'string',
        },
      },
    },
    // Platform-specific content preference
    defaultPlatform: {
      type: 'string',
      enum: ['mac', 'windows', 'linux'],
    },
    // Tool-specific content preference, the list of tools are kept in
    // make it easier to update in a single place
    defaultTool: {
      type: 'string',
      enum: Object.keys(allTools),
    },
    // Child groups specified on top-level TOC
    childGroups: {
      type: 'array',
    },
    // Child links specified on any TOC page
    children: {
      type: 'array',
    },
    // External products specified on the homepage
    externalProducts: {
      type: 'object',
      required: ['electron'],
      properties: {
        electron: {
          type: 'object',
          required: ['id', 'name', 'href', 'external'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            href: { type: 'string', format: 'url' },
            external: { type: 'boolean' },
          },
        },
      },
    },
    // whether or not the page is mirrored by an experimental page
    hasExperimentalAlternative: {
      type: 'boolean',
    },
    // Translation metadata properties added during the translation process,
    // we don't use these properties ourselves.
    'ms.openlocfilehash': {
      type: 'string',
    },
    'ms.sourcegitcommit': {
      type: 'string',
    },
    'ms.translationtype': {
      type: 'string',
    },
    'ms.contentlocale': {
      type: 'string',
    },
    'ms.lasthandoff': {
      type: 'string',
    },
    'ms.locfileid': {
      type: 'string',
    },
    autogenerated: {
      type: 'string',
      enum: ['audit-logs', 'codeql-cli', 'github-apps', 'graphql', 'rest', 'webhooks'],
    },
    // START category-landing tags
    category: {
      type: 'array',
    },
    complexity: {
      type: 'array',
    },
    industry: {
      type: 'array',
    },
    octicon: {
      type: 'string',
    },
    // END category landing tags
    // Custom sidebar link for category pages
    sidebarLink: {
      type: 'object',
      required: ['text', 'href'],
      properties: {
        text: {
          type: 'string',
          translatable: true,
        },
        href: {
          type: 'string',
        },
      },
    },
    // Spotlight configuration for category landing pages
    spotlight: {
      type: 'array',
      items: {
        type: 'object',
        required: ['article', 'image'],
        properties: {
          article: {
            type: 'string',
            description: 'Path to the article to spotlight',
          },
          image: {
            type: 'string',
            description: 'Path to image for the spotlight card',
          },
        },
        additionalProperties: false,
      },
      description: 'Array of articles to feature in the spotlight section',
    },
  },
}

// returns a list of deprecated properties
export const deprecatedProperties = Object.keys(schema.properties).filter((prop) => {
  return schema.properties[prop].deprecated
})

const featureVersionsProp = {
  feature: {
    type: ['string', 'array'],
    enum: Object.keys(getDeepDataByLanguage('features', 'en')),
    items: {
      type: 'string',
    },
    errorMessage:
      'must be the name (or names) of a feature that matches "filename" in data/features/_filename_.yml',
  },
}

const semverRange = {
  type: 'string',
  format: 'semver',
  // This is JSON pointer syntax with ajv so we can specify the bad version
  // in the error message.
  // eslint-disable-next-line no-template-curly-in-string
  errorMessage: 'Must be a valid SemVer range: ${0}',
}

schema.properties.versions = {
  type: ['object', 'string'], // allow a '*' string to indicate all versions
  additionalProperties: false, // don't allow any versions in FM that aren't defined in lib/all-versions
  properties: Object.values(allVersions).reduce((acc, versionObj) => {
    acc[versionObj.plan] = semverRange
    acc[versionObj.shortName] = semverRange
    return acc
  }, featureVersionsProp),
}

export function frontmatter(markdown, opts = {}) {
  const defaults = {
    schema,
  }

  return parse(markdown, Object.assign({}, defaults, opts))
}

// attach the schema object so it can be `require`d elsewhere.
frontmatter.schema = schema

export default frontmatter
