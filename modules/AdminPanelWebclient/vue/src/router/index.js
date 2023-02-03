import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import core from 'src/core'
import modulesManager from 'src/modules-manager'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  let routesAdded = false
  Router.beforeEach((to, from, next) => {
    core.init().then(() => {
      if (!routesAdded) {
        modulesManager.getPages().forEach(page => {
          const routeData = { name: page.pageName, path: page.pagePath, component: page.pageComponent }
          if (page.pageChildren) {
            routeData.children = page.pageChildren
          }
          Router.addRoute(page.pageName, routeData)
        })
        routesAdded = true
        next(to.path)
        return
      }

      const correctedPath = modulesManager.correctPathForUser(to.matched, to.path)
      if (to.path !== correctedPath) {
        next(correctedPath)
        return
      }
      next()
    }, (error) => {
      console.log('core.init reject', error)
    })
  })

  return Router
}
