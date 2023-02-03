<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'BRANDINGWEBCLIENT.HEADING_SETTINGS_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2 q-mt-sm" v-t="'BRANDINGWEBCLIENT.LOGIN_LOGO_URL_LABEL'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="loginLogoUrl"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 q-mt-sm" v-t="'BRANDINGWEBCLIENT.TABSBAR_LOGO_URL_LABEL'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="tabsBarLogoUrl"/>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pa-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
               :label="$t('COREWEBCLIENT.ACTION_SAVE')"
               @click="save"/>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="loading || saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import types from 'src/utils/types'
import webApi from 'src/utils/web-api'

export default {
  name: 'BrandingAdminSettingPerTenant',

  data () {
    return {
      loginLogoUrl: '',
      tabsBarLogoUrl: '',
      saving: false,
      loading: false,
      tenant: null
    }
  },

  computed: {
    tenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    allTenants () {
      return this.$store.getters['tenants/getTenants']
    }
  },

  watch: {
    allTenants () {
      this.populate()
    },
  },

  mounted () {
    this.loading = false
    this.saving = false
    this.populate()
  },

  beforeRouteLeave (to, from, next) {
    this.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      if (this.loading) {
        return false
      }

      const tenantCompleteData = types.pObject(this.tenant?.completeData)
      return this.loginLogoUrl !== tenantCompleteData['BrandingWebclient::LoginLogo'] ||
          this.tabsBarLogoUrl !== tenantCompleteData['BrandingWebclient::TabsbarLogo']
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
      const tenant = this.$store.getters['tenants/getTenant'](this.tenantId)
      if (tenant) {
        if (tenant.completeData['BrandingWebclient::LoginLogo'] !== undefined) {
          this.tenant = tenant
          this.loginLogoUrl = tenant.completeData['BrandingWebclient::LoginLogo']
          this.tabsBarLogoUrl = tenant.completeData['BrandingWebclient::TabsbarLogo']
        } else {
          this.getSettings()
        }
      }
    },

    save () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          LoginLogo: this.loginLogoUrl,
          TabsbarLogo: this.tabsBarLogoUrl,
          TenantId: this.tenantId
        }
        webApi.sendRequest({
          moduleName: 'BrandingWebclient',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            const data = {
              'BrandingWebclient::LoginLogo': parameters.LoginLogo,
              'BrandingWebclient::TabsbarLogo': parameters.TabsbarLogo,
            }
            this.$store.commit('tenants/setTenantCompleteData', { id: this.tenantId, data })
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    },

    getSettings () {
      this.loading = true
      const parameters = {
        TenantId: this.tenantId
      }
      webApi.sendRequest({
        moduleName: 'BrandingWebclient',
        methodName: 'GetSettings',
        parameters,
      }).then(result => {
        this.loading = false
        if (result) {
          const data = {
            'BrandingWebclient::LoginLogo': types.pString(result.LoginLogo),
            'BrandingWebclient::TabsbarLogo': types.pString(result.TabsbarLogo),
          }
          this.$store.commit('tenants/setTenantCompleteData', { id: this.tenantId, data })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
