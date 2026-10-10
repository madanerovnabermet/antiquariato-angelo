import { defineCliConfig } from 'sanity/cli'
export default defineCliConfig({
  api: { projectId: '9mmua44p', dataset: 'production' },
  project: { basePath: '/studio' },
  autoUpdates: false,
})
