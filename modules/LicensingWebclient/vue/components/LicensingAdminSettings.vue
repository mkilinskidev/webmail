<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5">{{ $t('LICENSINGWEBCLIENT.HEADING_SETTINGS_TAB') }}</div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-lg">
            <div class="col-10">
              <q-item-label caption>
                {{ $t('LICENSINGWEBCLIENT.LABEL_LICENSING_HINT') }}
              </q-item-label>
            </div>
          </div>
          <div class="row q-mb-sm">
            <div class="col-2">{{ $t('LICENSINGWEBCLIENT.LABEL_LICENSING_KEY') }}</div>
            <div class="col-5 q-ml-md textarea">
              <q-input outlined dense bg-color="white" input-class="textarea" type="textarea" v-model="key"/>
            </div>
          </div>
          <div class="row q-my-md" v-if="showTrialKeyHint">
            <q-item-label caption>
            <div class="col-9" v-html="trialKeyHint"/>
            </q-item-label>
          </div>
          <div class="row q-my-md" v-if="permanentKeyHint !== ''">
            <q-item-label caption>
              <div class="col-9" v-html="permanentKeyHint" />
            </q-item-label>
          </div>
          <div class="row q-mb-md">
            <div class="col-2" v-t="'LICENSINGWEBCLIENT.LABEL_LICENSING_USERS_NUMBER'" />
            <div class="col-5 q-ml-md"><b>{{ userCount }}</b></div>
          </div>
          <div class="row">
            <div class="col-2" v-t="'LICENSINGWEBCLIENT.LABEL_LICENSING_TYPE'" />
            <div class="col-5 q-ml-md"><b>{{ licenseType }}</b></div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
               :label="$t('COREWEBCLIENT.ACTION_SAVE')"
               @click="save"/>
      </div>
    </div>
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section >
          {{$t('LICENSINGWEBCLIENT.INFO_LICENSE_KEY_CHANGED')}}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn unelevated no-caps dense :ripple="false" color="primary" :label="$t('COREWEBCLIENT.ACTION_OK')"
                 v-close-popup @click="reloadUI" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading style="justify-content: flex-start;" :showing="saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

import settings from '../../../LicensingWebclient/vue/settings'

export default {
  name: 'Licensing',

  data () {
    return {
      key: '',
      userCount: 0,
      saving: false,
      licenseType: '',
      trialKeyHint: '',
      permanentKeyHint: '',
      showTrialKeyHint: false,
      showDialog: false,
    }
  },

  mounted () {
    this.getLicenseInfo()
    this.getTotalUsersCount()
    this.populate()
  },

  beforeRouteLeave (to, from, next) {
    this.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    getLicenseInfo () {
      webApi.sendRequest({
        moduleName: 'Licensing',
        methodName: 'GetLicenseInfo',
      }).then(result => {
        if (result) {
          switch (result.Type) {
            case 0:
              this.licenseType = this.$t('LICENSINGWEBCLIENT.LABEL_TYPE_UNLIM')
              break
            case 1:
              this.licenseType = this.$tc('LICENSINGWEBCLIENT.LABEL_TYPE_PERMANENT_PLURAL', result.Count, { COUNT: result.Count })
              break
            case 2:
              this.licenseType = this.$tc('LICENSINGWEBCLIENT.LABEL_TYPE_DOMAINS_PLURAL', result.Count, { COUNT: result.Count })
              break
            case 4:
              if (result.ExpiresIn < 1) {
                this.licenseType = this.$t('LICENSINGWEBCLIENT.LABEL_TYPE_OUTDATED_INFO')
              }
              break
            case 3:
            case 10:
              this.licenseType = result.Type === 3
                ? this.$tc('LICENSINGWEBCLIENT.LABEL_TYPE_ANNUAL_PLURAL', result.Count, { COUNT: result.Count })
                : this.$t('LICENSINGWEBCLIENT.LABEL_TYPE_TRIAL')
              if (result.ExpiresIn !== '*') {
                if (result.ExpiresIn > 0) {
                  this.licenseType += this.$tc('LICENSINGWEBCLIENT.LABEL_TYPE_EXPIRES_IN_PLURAL', result.ExpiresIn, { DAYS: result.ExpiresIn })
                } else {
                  this.licenseType += this.$t('LICENSINGWEBCLIENT.LABEL_TYPE_EXPIRED') + ' ' + this.$t('LICENSINGWEBCLIENT.LABEL_TYPE_OUTDATED_INFO')
                }
              }
              break
          }
        } else {
          this.licenseType = this.$t('LICENSINGWEBCLIENT.LABEL_TYPE_NOT_SET')
        }
      })
    },
    getTotalUsersCount () {
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'GetTotalUsersCount',
      }).then(result => {
        if (result !== false) {
          this.userCount = result
        }
      })
    },

    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      const data = settings.getLicenseSettings()
      return this.key !== data.licenseKey
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.populate()
    },

    populate () {
      const data = settings.getLicenseSettings()
      this.key = data.licenseKey
      this.trialKeyHint = data.trialKeyLink ? this.$tc('LICENSINGWEBCLIENT.LABEL_LICENSING_TRIAL_KEY_HINT', data.trialKeyLink, { LINK: data.trialKeyLink }) : ''
      this.permanentKeyHint = data.permanentKeyLink ? this.$tc('LICENSINGWEBCLIENT.LABEL_LICENSING_PERMANENT_KEY_HINT', data.permanentKeyLink, { LINK: data.permanentKeyLink }) : ''
      this.showTrialKeyHint = data.licenseKey === '' && this.trialKeyHint !== ''
    },

    save () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          LicenseKey: this.key,
        }
        webApi.sendRequest({
          moduleName: 'Licensing',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
            const data = settings.getLicenseSettings()
            if (this.key !== data.licenseKey) {
              this.showDialog = true
            }
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    },

    reloadUI () {
      window.location.reload()
    },
  }
}
</script>

<style scoped lang="scss">
::v-deep a {
  text-decoration: none;
  color: darken($primary, 20%);
}
::v-deep a:hover {
  text-decoration: underline;
}
</style>
