import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { item } from './studio/schemas/item.js'
import { settings } from './studio/schemas/settings.js'
import { CATEGORIES } from './studio/categories.js'

// The admin panel ("Studio") lives at https://antiquariatoangelo.com/studio.
// Who may write is decided by Sanity's server (project members), not by this file.
export default defineConfig({
  name: 'antiquariato-angelo',
  title: 'Antiquariato Angelo',
  projectId: '9mmua44p',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Antiquariato Angelo').items([
          S.listItem().title('Все предметы').child(S.documentTypeList('item').title('Все предметы').defaultOrdering([{ field: 'added', direction: 'desc' }])),
          S.listItem().title('По категориям').child(
            S.list().title('Категории').items(CATEGORIES.map((c) =>
              S.listItem().title(c.title).child(
                S.documentList().title(c.title).schemaType('item').filter('_type == "item" && category == $c').params({ c: c.value })
              )))),
          S.listItem().title('Новые поступления').child(S.documentList().title('Новые поступления').schemaType('item').filter('_type == "item" && newArrival == true')),
          S.listItem().title('Проданные').child(S.documentList().title('Проданные').schemaType('item').filter('_type == "item" && status == "sold"')),
          S.divider(),
          S.listItem().title('Контакты и часы работы').id('settings').child(S.document().schemaType('settings').documentId('settings')),
        ]),
    }),
  ],
  schema: {
    types: [item, settings],
    templates: (prev) => prev.filter((t) => t.schemaType !== 'settings'),   // only one settings document
  },
  document: {
    actions: (prev, ctx) => (ctx.schemaType === 'settings' ? prev.filter((a) => !['delete', 'duplicate', 'unpublish'].includes(a.action)) : prev),
  },
})
