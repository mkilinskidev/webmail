import settings from '../../LicensingWebclient/vue/settings'

export default {
  moduleName: 'LicensingWebclient',

  requiredModules: ['Licensing'],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'licensing',
        tabTitle: 'LICENSINGWEBCLIENT.LABEL_LICENSING_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'licensing', component: () => import('./components/LicensingAdminSettings') },
        ],
      },
    ]
  },
}
