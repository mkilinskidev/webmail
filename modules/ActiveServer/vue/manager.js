import settings from './settings'
import store from 'src/store'

import ActiveSyncAdminSettingsPerUser from './components/ActiveSyncAdminSettingsPerUser'

export default {
  moduleName: 'ActiveServer',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'activeserver',
        tabTitle: 'ACTIVESERVER.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'activeserver', component: () => import('./components/ActiveSyncAdminSettings') },
        ],
      },
    ]
  },

  getAdminUserTabs () {
    const isUserSuperAdmin = store.getters['user/isUserSuperAdmin']
    if (isUserSuperAdmin) {
      return [
        {
          tabName: 'activeserver',
          tabTitle: 'ACTIVESERVER.LABEL_SETTINGS_TAB',
          tabRouteChildren: [
            { path: 'id/:id/activeserver', component: ActiveSyncAdminSettingsPerUser },
            { path: 'search/:search/id/:id/activeserver', component: ActiveSyncAdminSettingsPerUser },
            { path: 'page/:page/id/:id/activeserver', component: ActiveSyncAdminSettingsPerUser },
            { path: 'search/:search/page/:page/id/:id/activeserver', component: ActiveSyncAdminSettingsPerUser },
          ],
        }
      ]
    } else {
      return []
    }
  },
}
