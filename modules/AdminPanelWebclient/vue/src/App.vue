<template>
  <div id="q-app">
    <router-view />
    <UnsavedChangesDialog ref="unsavedChangesDialog" />
  </div>
</template>
<script>
import Vue from 'vue'
import _ from 'lodash'

import types from 'src/utils/types'

import modulesManager from 'src/modules-manager'

import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'

Vue.mixin({
  methods: {
    _getParentComponent: function (sComponentName) {
      let oComponent = null
      let oParent = this.$parent
      while (oParent && !oComponent) {
        if (oParent.$options.name === sComponentName) {
          oComponent = oParent
        }
        oParent = oParent.$parent
      }
      return oComponent
    },
    doBeforeRouteLeave: function (to, from, next) {
      const oAppComponent = this._getParentComponent('App')
      const oUnsavedChangesDialog = oAppComponent ? oAppComponent.$refs.unsavedChangesDialog : null

      if (_.isFunction(this.hasChanges) && this.hasChanges() && _.isFunction(oUnsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
        oUnsavedChangesDialog.openConfirmDiscardChangesDialog(() => {
          if (this.revertChanges) {
            this.revertChanges()
          }
          next()
        })
      } else {
        next()
      }
    },
  }
})

export default {
  name: 'App',

  components: {
    UnsavedChangesDialog,
  },

  data() {
    return {
    }
  },

  meta () {
    return {
      title: this.siteName
    }
  },

  computed: {
    isUserSuperAdminOrTenantAdmin: function () {
      return this.$store.getters['user/isUserSuperAdminOrTenantAdmin']
    },
    siteName: function () {
      return this.$store.getters['main/getSiteName']
    },
  },

  watch: {
    isUserSuperAdminOrTenantAdmin: function () {
      const currentRoute = this.$router.currentRoute
      const currentPath = currentRoute?.path
      const matchedRoutes = types.pArray(currentRoute?.matched)
      const correctedPath = modulesManager.correctPathForUser(matchedRoutes)
      if (matchedRoutes.length > 0 && currentPath !== correctedPath) {
        this.$router.push(correctedPath)
      }
    },
  },

  methods: {
    setRoute () {
      const currentPath = this.$router.currentRoute && this.$router.currentRoute.path ? this.$router.currentRoute.path : ''
      const newPath = this.isUserSuperAdminOrTenantAdmin ? '/system' : '/'
      if (currentPath !== newPath) {
        this.$router.push({ path: newPath })
      }
    }
  },

  mounted () {
    if (!window.frameElement) {
      window.document.getElementsByTagName('body')[0].classList.add('body-backgroud')
    }
  },
}
</script>

<style lang="scss">
.body-backgroud {
  background: #1998a4 no-repeat 0 0 / cover url("~assets/background.jpg");
}
</style>
