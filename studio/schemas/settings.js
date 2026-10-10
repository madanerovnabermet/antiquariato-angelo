import { defineType, defineField } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Контакты и часы работы',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Телефон (как показывать)', type: 'string', description: '+39 366 184 2412' }),
    defineField({ name: 'whatsapp', title: 'Номер WhatsApp (только цифры)', type: 'string', description: '393661842412',
      validation: (r) => r.regex(/^\d{8,15}$/, { name: 'digits' }).error('Только цифры, с кодом страны, без +') }),
    defineField({ name: 'instagram', title: 'Ссылка Instagram', type: 'url' }),
    defineField({ name: 'tiktok', title: 'Ссылка TikTok', type: 'url' }),
    defineField({ name: 'street', title: 'Улица и дом', type: 'string' }),
    defineField({ name: 'city', title: 'Индекс и город', type: 'string' }),
    defineField({ name: 'hoursIt', title: 'Часы работы (IT)', type: 'string', description: 'Lun–Sab 11:00–20:00' }),
    defineField({ name: 'hoursEn', title: 'Часы работы (EN)', type: 'string', description: 'Mon–Sat 11:00–20:00' }),
    defineField({ name: 'closedIt', title: 'Выходной (IT)', type: 'string', description: 'Domenica chiuso' }),
    defineField({ name: 'closedEn', title: 'Выходной (EN)', type: 'string', description: 'Closed on Sunday' }),
  ],
  preview: { prepare: () => ({ title: 'Контакты и часы работы' }) },
})
