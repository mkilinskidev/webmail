(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{"1e23":function(t,n,a){"use strict";var e=a("970b"),i=a.n(e),o=a("5bc3"),s=a.n(o),r=a("b2f5"),l=a.n(r),g=a("6bfe"),d=function(){function t(n){i()(this,t);var a=g["a"].pObject(n.BrandingWebclient);l.a.isEmpty(a)||(this.loginLogo=a.LoginLogo,this.tabsbarLogo=a.TabsbarLogo)}return s()(t,[{key:"saveBrandingsSettings",value:function(t){var n=t.loginLogo,a=t.tabsbarLogo;this.loginLogo=n,this.tabsbarLogo=a}}]),t}(),c=null;n["a"]={init:function(t){c=new d(t)},saveBrandingsSettings:function(t){c.saveBrandingsSettings(t)},getBrandingsSettings:function(){var t,n;return{loginLogo:null===(t=c)||void 0===t?void 0:t.loginLogo,tabsbarLogo:null===(n=c)||void 0===n?void 0:n.tabsbarLogo}}}},2681:function(t,n,a){"use strict";a.r(n);a("c7fe"),a("3119"),a("8da0"),a("b5bb"),a("a2b7");var e=a("1e23"),i=function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("q-scroll-area",{staticClass:"full-height full-width"},[a("div",{staticClass:"q-pa-lg "},[a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"BRANDINGWEBCLIENT.HEADING_SETTINGS_TAB",expression:"'BRANDINGWEBCLIENT.HEADING_SETTINGS_TAB'"}],staticClass:"col text-h5"})]),a("q-card",{staticClass:"card-edit-settings",attrs:{flat:"",bordered:""}},[a("q-card-section",[a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"BRANDINGWEBCLIENT.LOGIN_LOGO_URL_LABEL",expression:"'BRANDINGWEBCLIENT.LOGIN_LOGO_URL_LABEL'"}],staticClass:"col-2 q-mt-sm"}),a("div",{staticClass:"col-5"},[a("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},model:{value:t.loginLogoUrl,callback:function(n){t.loginLogoUrl=n},expression:"loginLogoUrl"}})],1)]),a("div",{staticClass:"row"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"BRANDINGWEBCLIENT.TABSBAR_LOGO_URL_LABEL",expression:"'BRANDINGWEBCLIENT.TABSBAR_LOGO_URL_LABEL'"}],staticClass:"col-2 q-mt-sm"}),a("div",{staticClass:"col-5"},[a("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},model:{value:t.tabsBarLogoUrl,callback:function(n){t.tabsBarLogoUrl=n},expression:"tabsBarLogoUrl"}})],1)])])],1),a("div",{staticClass:"q-pa-md text-right"},[a("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:t.$t("COREWEBCLIENT.ACTION_SAVE")},on:{click:t.save}})],1)],1),a("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:t.loading||t.saving}},[a("q-linear-progress",{attrs:{query:""}})],1)],1)},o=[],s=a("4245"),r=a("21ac"),l=a("6bfe"),g=a("e539"),d={name:"BrandingAdminSettingPerTenant",data:function(){return{loginLogoUrl:"",tabsBarLogoUrl:"",saving:!1,loading:!1,tenant:null}},computed:{tenantId:function(){return this.$store.getters["tenants/getCurrentTenantId"]},allTenants:function(){return this.$store.getters["tenants/getTenants"]}},watch:{allTenants:function(){this.populate()}},mounted:function(){this.loading=!1,this.saving=!1,this.populate()},beforeRouteLeave:function(t,n,a){this.doBeforeRouteLeave(t,n,a)},methods:{hasChanges:function(){var t;if(this.loading)return!1;var n=l["a"].pObject(null===(t=this.tenant)||void 0===t?void 0:t.completeData);return this.loginLogoUrl!==n["BrandingWebclient::LoginLogo"]||this.tabsBarLogoUrl!==n["BrandingWebclient::TabsbarLogo"]},revertChanges:function(){this.populate()},populate:function(){var t=this.$store.getters["tenants/getTenant"](this.tenantId);t&&(void 0!==t.completeData["BrandingWebclient::LoginLogo"]?(this.tenant=t,this.loginLogoUrl=t.completeData["BrandingWebclient::LoginLogo"],this.tabsBarLogoUrl=t.completeData["BrandingWebclient::TabsbarLogo"]):this.getSettings())},save:function(){var t=this;if(!this.saving){this.saving=!0;var n={LoginLogo:this.loginLogoUrl,TabsbarLogo:this.tabsBarLogoUrl,TenantId:this.tenantId};g["a"].sendRequest({moduleName:"BrandingWebclient",methodName:"UpdateSettings",parameters:n}).then((function(a){if(t.saving=!1,!0===a){var e={"BrandingWebclient::LoginLogo":n.LoginLogo,"BrandingWebclient::TabsbarLogo":n.TabsbarLogo};t.$store.commit("tenants/setTenantCompleteData",{id:t.tenantId,data:e}),r["a"].showReport(t.$t("COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS"))}else r["a"].showError(t.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED"))}),(function(n){t.saving=!1,r["a"].showError(s["a"].getTextFromResponse(n,t.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED")))}))}},getSettings:function(){var t=this;this.loading=!0;var n={TenantId:this.tenantId};g["a"].sendRequest({moduleName:"BrandingWebclient",methodName:"GetSettings",parameters:n}).then((function(n){if(t.loading=!1,n){var a={"BrandingWebclient::LoginLogo":l["a"].pString(n.LoginLogo),"BrandingWebclient::TabsbarLogo":l["a"].pString(n.TabsbarLogo)};t.$store.commit("tenants/setTenantCompleteData",{id:t.tenantId,data:a})}}))}}},c=d,L=a("2877"),b=a("4983"),u=a("f09f"),h=a("a370"),p=a("27f9"),B=a("9c40"),m=a("74f7"),v=a("6b1d"),T=a("eebe"),E=a.n(T),N=Object(L["a"])(c,i,o,!1,null,"7a785749",null),f=N.exports;E()(N,"components",{QScrollArea:b["a"],QCard:u["a"],QCardSection:h["a"],QInput:p["a"],QBtn:B["a"],QInnerLoading:m["a"],QLinearProgress:v["a"]});n["default"]={moduleName:"BrandingWebclient",requiredModules:[],init:function(t){e["a"].init(t)},getAdminSystemTabs:function(){return[{tabName:"branding",tabTitle:"BRANDINGWEBCLIENT.ADMIN_SETTINGS_TAB_LABEL",tabRouteChildren:[{path:"branding",component:function(){return a.e(29).then(a.bind(null,"2842"))}}]}]},getAdminTenantTabs:function(){return[{tabName:"branding",tabTitle:"BRANDINGWEBCLIENT.ADMIN_SETTINGS_TAB_LABEL",tabRouteChildren:[{path:"id/:id/branding",component:f},{path:"search/:search/id/:id/branding",component:f},{path:"page/:page/id/:id/branding",component:f},{path:"search/:search/page/:page/id/:id/branding",component:f}]}]}}}}]);