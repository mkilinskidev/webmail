import { i18n } from 'boot/i18n'
import store from 'src/store'

import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'

class LicenseSettings {
  constructor (appData) {
    const licensingData = typesUtils.pObject(appData.Licensing)
    this.licenseKey = typesUtils.pString(licensingData.LicenseKey)

    const licensingWebclientData = typesUtils.pObject(appData.LicensingWebclient)
    this.permanentKeyLink = typesUtils.pString(licensingWebclientData.PermanentKeyLink)
    this.trialKeyLink = typesUtils.pString(licensingWebclientData.TrialKeyLink)
  }
}

let settings = null

export default {
  init (appData) {
    settings = new LicenseSettings(appData)
    if (settings.licenseKey === '' && store.getters['user/isUserSuperAdmin']) {
      notification.showError(i18n.tc('LICENSINGWEBCLIENT.ERROR_LICENSE_KEY_MISSING'), 0)
    }
  },

  getLicenseSettings () {
    return {
      licenseKey: settings.licenseKey,
      permanentKeyLink: settings.permanentKeyLink,
      trialKeyLink: settings.trialKeyLink
    }
  },
}
