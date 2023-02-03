import settings from '../../BrandingWebclient/vue/settings'

import BrandingAdminSettingsPerTenant from './components/BrandingAdminSettingsPerTenant'

export default {
  moduleName: 'BrandingWebclient',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'branding',
        tabTitle: 'BRANDINGWEBCLIENT.ADMIN_SETTINGS_TAB_LABEL',
        tabRouteChildren: [
          { path: 'branding', component: () => import('./components/BrandingAdminSettings') },
        ],
      },
    ]
  },

  getAdminTenantTabs () {
    return [
      {
        tabName: 'branding',
        tabTitle: 'BRANDINGWEBCLIENT.ADMIN_SETTINGS_TAB_LABEL',
        tabRouteChildren: [
          { path: 'id/:id/branding', component: BrandingAdminSettingsPerTenant },
          { path: 'search/:search/id/:id/branding', component: BrandingAdminSettingsPerTenant },
          { path: 'page/:page/id/:id/branding', component: BrandingAdminSettingsPerTenant },
          { path: 'search/:search/page/:page/id/:id/branding', component: BrandingAdminSettingsPerTenant },
        ],
      }
    ]
  },
}
