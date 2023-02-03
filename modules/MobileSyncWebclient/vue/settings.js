import _ from 'lodash'

import typesUtils from 'src/utils/types'

class MobileSyncSettings {
  constructor (appData) {
    const mobileSyncWebclientData = typesUtils.pObject(appData.Dav)
    this.externalHostNameOfDAVServer = typesUtils.pString(mobileSyncWebclientData?.ExternalHostNameOfDAVServer)
  }

  saveMobileSyncSettings ({ ExternalHostNameOfDAVServer }) {
    this.externalHostNameOfDAVServer = ExternalHostNameOfDAVServer
  }
}

let settings = null

export default {
  init (appData) {
    settings = new MobileSyncSettings(appData)
  },
  saveMobileSyncSettings (data) {
    settings.saveMobileSyncSettings(data)
  },
  getMobileSyncSettings () {
    return {
      ExternalHostNameOfDAVServer: settings.externalHostNameOfDAVServer
    }
  },

}
