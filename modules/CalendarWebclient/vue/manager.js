import settings from '../../CalendarWebclient/vue/settings'

export default {
  moduleName: 'CalendarWebclient',

  requiredModules: ['Calendar'],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'calendar',
        tabTitle: 'CALENDARWEBCLIENT.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'calendar', component: () => import('./components/CalendarAdminSettings') },
        ],
      },
    ]
  },
}
