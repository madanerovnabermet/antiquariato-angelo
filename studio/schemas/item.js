import { defineType, defineField } from 'sanity'
import { CATEGORIES } from '../categories.js'

const bi = (name, title, opts = {}) =>
  defineField({
    name, title, type: 'object', options: { columns: 2 }, ...opts,
    fields: [
      { name: 'it', title: 'Italiano', type: opts.long ? 'text' : 'string', rows: 4 },
      { name: 'en', title: 'English', type: opts.long ? 'text' : 'string', rows: 4 },
    ],
  })

export const item = defineType({
  name: 'item',
  title: 'Предмет',
  type: 'document',
  groups: [
    { name: 'main', title: 'Основное', default: true },
    { name: 'photos', title: 'Фото' },
    { name: 'details', title: 'Характеристики' },
  ],
  fields: [
    defineField({
      name: 'status', title: 'Статус', type: 'string', group: 'main', initialValue: 'draft',
      description: 'Черновик не виден на сайте. «Снять с публикации» = вернуть в черновик.',
      options: { layout: 'radio', direction: 'horizontal', list: [
        { title: 'Черновик · Bozza', value: 'draft' },
        { title: 'Опубликовано · Disponibile', value: 'available' },
        { title: 'Продано · Venduto', value: 'sold' },
      ] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'newArrival', title: 'Показать в «Новых поступлениях» на главной', type: 'boolean', group: 'main', initialValue: false }),
    defineField({ name: 'ref', title: 'Артикул', type: 'string', group: 'main', description: 'Например AA-0020', validation: (r) => r.required() }),
    defineField({
      name: 'category', title: 'Категория', type: 'string', group: 'main',
      options: { list: CATEGORIES }, validation: (r) => r.required(),
    }),
    bi('name', 'Название', { group: 'main', validation: (r) => r.custom((v) => (v && v.it ? true : 'Нужно хотя бы итальянское название')) }),
    defineField({
      name: 'slug', title: 'Адрес страницы', type: 'slug', group: 'main',
      description: 'Нажмите «Generate» — адрес создастся из итальянского названия.',
      options: { source: (doc) => (doc.name && doc.name.it) || doc.ref, maxLength: 80 },
      validation: (r) => r.required(),
    }),
    bi('desc', 'Описание', { group: 'main', long: true }),
    defineField({ name: 'added', title: 'Дата поступления', type: 'date', group: 'main', initialValue: () => new Date().toISOString().slice(0, 10) }),

    defineField({
      name: 'mainPhoto', title: 'Главное фото', type: 'image', group: 'photos',
      description: 'Показывается в каталоге. Лучше на однотонном фоне; сайт сам положит его на бежевую подложку.',
      options: { hotspot: true }, validation: (r) => r.required(),
    }),
    defineField({ name: 'gallery', title: 'Другие фото', type: 'array', group: 'photos', of: [{ type: 'image', options: { hotspot: true } }], options: { layout: 'grid' } }),
    bi('alt', 'Описание фото для незрячих и Google (необязательно)', { group: 'photos' }),

    defineField({ name: 'author', title: 'Автор / мастер', type: 'string', group: 'details' }),
    defineField({ name: 'dimensions', title: 'Размеры', type: 'string', group: 'details', description: 'Например 28 × 18 cm' }),
    bi('material', 'Материал', { group: 'details' }),
    bi('era', 'Эпоха', { group: 'details' }),
    bi('condition', 'Состояние', { group: 'details' }),
    defineField({
      name: 'priceInternal', title: 'Цена (только для вас, на сайте НЕ показывается)', type: 'string', group: 'details',
      description: 'На сайте всегда «Prezzo su richiesta».',
    }),
  ],
  orderings: [{ title: 'Новые сверху', name: 'addedDesc', by: [{ field: 'added', direction: 'desc' }] }],
  preview: {
    select: { it: 'name.it', ref: 'ref', status: 'status', media: 'mainPhoto' },
    prepare: ({ it, ref, status, media }) => ({
      title: it || 'Без названия',
      subtitle: `${ref || '—'} · ${{ draft: 'Черновик', available: 'Опубликовано', sold: 'Продано' }[status] || ''}`,
      media,
    }),
  },
})
