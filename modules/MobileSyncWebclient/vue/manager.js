import settings from '../../MobileSyncWebclient/vue/settings'

export default {
  moduleName: 'MobileSyncWebclient',

  requiredModules: ['Dav'],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'mobilesync',
        tabTitle: 'MOBILESYNCWEBCLIENT.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'mobilesync', component: () => import('./components/MobileSyncAdminSettings') },
        ],
      },
    ]
  },
}
