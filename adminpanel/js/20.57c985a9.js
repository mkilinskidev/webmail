(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[20],{"86ed":function(t,e,n){"use strict";var s=n("970b"),a=n.n(s),i=n("5bc3"),o=n.n(i),r=n("b2f5"),c=n.n(r),l=n("6bfe"),d=function(){function t(e){a()(this,t);var n=l["a"].pObject(e.S3Filestorage);c.a.isEmpty(n)||(this.accessKey=l["a"].pString(n.AccessKey),this.secretKey=l["a"].pString(n.SecretKey),this.region=l["a"].pString(n.Region),this.host=l["a"].pString(n.Host),this.bucketPrefix=l["a"].pString(n.BucketPrefix))}return o()(t,[{key:"saveS3FilestorageSettings",value:function(t){var e=t.accessKey,n=t.secretKey,s=t.region,a=t.host,i=t.bucketPrefix;this.accessKey=e,this.secretKey=n,this.region=s,this.host=a,this.bucketPrefix=i}}]),t}(),g=null;e["a"]={init:function(t){g=new d(t)},saveS3FilestorageSettings:function(t){g.saveS3FilestorageSettings(t)},getS3FilestorageSettings:function(){return{accessKey:g.accessKey,secretKey:g.secretKey,region:g.region,host:g.host,bucketPrefix:g.bucketPrefix}}}},"99f8":function(t,e,n){"use strict";n.r(e);n("c7fe"),n("3119"),n("8da0"),n("b5bb"),n("a2b7");var s=n("86ed"),a=n("4360"),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-scroll-area",{staticClass:"full-height full-width"},[n("div",{staticClass:"q-pa-lg "},[n("div",{staticClass:"row q-mb-md"},[n("div",{directives:[{name:"t",rawName:"v-t",value:"S3FILESTORAGE.HEADING_SETTINGS_TAB",expression:"'S3FILESTORAGE.HEADING_SETTINGS_TAB'"}],staticClass:"col text-h5"})]),n("q-card",{staticClass:"card-edit-settings",attrs:{flat:"",bordered:""}},[n("q-card-section",[n("div",{staticClass:"row q-mb-md"},[n("div",{directives:[{name:"t",rawName:"v-t",value:"S3FILESTORAGE.LABEL_REGION",expression:"'S3FILESTORAGE.LABEL_REGION'"}],staticClass:"col-2 q-my-sm"}),n("div",{staticClass:"col-5"},[n("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.save.apply(null,arguments)}},model:{value:t.region,callback:function(e){t.region=e},expression:"region"}})],1)]),n("div",{staticClass:"row q-mb-md"},[n("div",{staticClass:"col-2 q-my-sm"}),n("div",{staticClass:"col-8"},[n("q-item-label",{attrs:{caption:""}},[t._v("\n              "+t._s(t.$t("S3FILESTORAGE.INFO_REGION"))+"\n            ")])],1)]),n("div",{staticClass:"row q-mb-md"},[n("div",{directives:[{name:"t",rawName:"v-t",value:"S3FILESTORAGE.LABEL_HOST",expression:"'S3FILESTORAGE.LABEL_HOST'"}],staticClass:"col-2 q-my-sm"}),n("div",{staticClass:"col-5"},[n("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.save.apply(null,arguments)}},model:{value:t.host,callback:function(e){t.host=e},expression:"host"}})],1)]),n("div",{staticClass:"row q-mb-md"},[n("div",{staticClass:"col-2 q-my-sm"}),n("div",{staticClass:"col-8"},[n("q-item-label",{attrs:{caption:""}},[t._v("\n              "+t._s(t.$t("S3FILESTORAGE.INFO_HOST"))+"\n            ")])],1)]),n("div",{staticClass:"row q-mb-xl"},[n("div",{staticClass:"col-2 q-my-sm"}),n("div",{staticClass:"col-5"},[n("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:t.$t("S3FILESTORAGE.BUTTON_TEST_CONNECTION")},on:{click:t.testConnection}})],1)])])],1),n("div",{staticClass:"q-pt-md text-right"},[n("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:t.$t("COREWEBCLIENT.ACTION_SAVE")},on:{click:t.save}})],1)],1),n("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:t.loading||t.saving}},[n("q-linear-progress",{attrs:{query:""}})],1)],1)},o=[],r=n("4245"),c=n("21ac"),l=n("6bfe"),d=n("e539"),g={name:"S3FilestorageAdminSettingsPerTenant",data:function(){return{saving:!1,loading:!1,tenant:null,region:"",host:"",testingConnection:!1}},computed:{tenantId:function(){return this.$store.getters["tenants/getCurrentTenantId"]},allTenants:function(){return this.$store.getters["tenants/getTenants"]}},watch:{allTenants:function(){this.populate()}},beforeRouteLeave:function(t,e,n){this.doBeforeRouteLeave(t,e,n)},mounted:function(){this.loading=!1,this.saving=!1,this.populate()},methods:{hasChanges:function(){var t;if(this.loading)return!1;var e=l["a"].pObject(null===(t=this.tenant)||void 0===t?void 0:t.completeData);return this.region!==e["S3Filestorage::Region"]||this.host!==e["S3Filestorage::Host"]},revertChanges:function(){var t,e=l["a"].pObject(null===(t=this.tenant)||void 0===t?void 0:t.completeData);this.region=e["S3Filestorage::Region"],this.host=e["S3Filestorage::Host"]},populate:function(){var t=this.$store.getters["tenants/getTenant"](this.tenantId);t&&(void 0!==t.completeData["S3Filestorage::Region"]?(this.tenant=t,this.region=t.completeData["S3Filestorage::Region"],this.host=t.completeData["S3Filestorage::Host"]):this.getSettings())},save:function(){var t=this;if(!this.saving){this.saving=!0;var e={TenantId:this.tenantId,Region:this.region,Host:this.host};d["a"].sendRequest({moduleName:"S3Filestorage",methodName:"UpdateS3Settings",parameters:e}).then((function(n){if(t.saving=!1,n){var s={"S3Filestorage::Region":e.Region,"S3Filestorage::Host":e.Host};t.$store.commit("tenants/setTenantCompleteData",{id:t.tenantId,data:s}),c["a"].showReport(t.$t("COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS"))}else c["a"].showError(t.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED"))}),(function(e){t.saving=!1,c["a"].showError(r["a"].getTextFromResponse(e,t.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED")))}))}},getSettings:function(){var t=this;this.loading=!0;var e={TenantId:this.tenantId};d["a"].sendRequest({moduleName:"S3Filestorage",methodName:"GetSettings",parameters:e}).then((function(e){if(t.loading=!1,e){var n={"S3Filestorage::Region":l["a"].pString(e.Region),"S3Filestorage::Host":l["a"].pString(e.Host)};t.$store.commit("tenants/setTenantCompleteData",{id:t.tenantId,data:n})}}),(function(t){c["a"].showError(r["a"].getTextFromResponse(t))}))},testConnection:function(){var t=this;if(!this.testingConnection){this.testingConnection=!0;var e={Region:this.region,Host:this.host,TenantId:this.tenantId};d["a"].sendRequest({moduleName:"S3Filestorage",methodName:"TestConnection",parameters:e}).then((function(e){t.testingConnection=!1,!0===e?c["a"].showReport(t.$t("S3FILESTORAGE.REPORT_CONNECT_SUCCESSFUL")):c["a"].showError(t.$t("S3FILESTORAGE.ERROR_CONNECT_FAILED"))}),(function(e){t.testingConnection=!1,c["a"].showError(r["a"].getTextFromResponse(e,t.$t("S3FILESTORAGE.ERROR_CONNECT_FAILED")))}))}}}},u=g,h=n("2877"),S=n("4983"),m=n("f09f"),p=n("a370"),E=n("27f9"),v=n("0170"),f=n("9c40"),T=n("74f7"),C=n("6b1d"),R=n("eebe"),I=n.n(R),b=Object(h["a"])(u,i,o,!1,null,"100e66ff",null),F=b.exports;I()(b,"components",{QScrollArea:S["a"],QCard:m["a"],QCardSection:p["a"],QInput:E["a"],QItemLabel:v["a"],QBtn:f["a"],QInnerLoading:T["a"],QLinearProgress:C["a"]});e["default"]={moduleName:"S3Filestorage",requiredModules:[],init:function(t){s["a"].init(t)},getAdminSystemTabs:function(){return[{tabName:"s3-filestorage",tabTitle:"S3FILESTORAGE.LABEL_SETTINGS_TAB",tabRouteChildren:[{path:"s3-filestorage",component:function(){return n.e(40).then(n.bind(null,"b1a5"))}}]}]},getAdminTenantTabs:function(){var t=a["a"].getters["user/isUserSuperAdmin"];return t?[{tabName:"s3-filestorage",tabTitle:"S3FILESTORAGE.LABEL_SETTINGS_TAB",tabRouteChildren:[{path:"id/:id/chat",component:F},{path:"search/:search/id/:id/chat",component:F},{path:"page/:page/id/:id/chat",component:F},{path:"search/:search/page/:page/id/:id/chat",component:F}]}]:[]}}}}]);