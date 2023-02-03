import _ from 'lodash'

import typesUtils from 'src/utils/types'

class BrandingSettings {
  constructor (appData) {
    const brandingWebclientData = typesUtils.pObject(appData.BrandingWebclient)
    if (!_.isEmpty(brandingWebclientData)) {
      this.loginLogo = brandingWebclientData.LoginLogo
      this.tabsbarLogo = brandingWebclientData.TabsbarLogo
    }
  }

  saveBrandingsSettings ({ loginLogo, tabsbarLogo }) {
    this.loginLogo = loginLogo
    this.tabsbarLogo = tabsbarLogo
  }
}

let settings = null

export default {
  init (appData) {
    settings = new BrandingSettings(appData)
  },
  saveBrandingsSettings (data) {
    settings.saveBrandingsSettings(data)
  },
  getBrandingsSettings () {
    return {
      loginLogo: settings?.loginLogo,
      tabsbarLogo: settings?.tabsbarLogo,
    }
  },

}
