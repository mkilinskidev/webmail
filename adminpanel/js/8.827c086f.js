(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{1003:function(e,t,s){},"56ef0":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-scroll-area",{staticClass:"full-height full-width"},[s("div",{staticClass:"q-pa-lg "},[s("div",{staticClass:"row q-mb-md"},[s("div",{staticClass:"col text-h5"},[e._v(e._s(e.$t("LICENSINGWEBCLIENT.HEADING_SETTINGS_TAB")))])]),s("q-card",{staticClass:"card-edit-settings",attrs:{flat:"",bordered:""}},[s("q-card-section",[s("div",{staticClass:"row q-mb-lg"},[s("div",{staticClass:"col-10"},[s("q-item-label",{attrs:{caption:""}},[e._v("\n              "+e._s(e.$t("LICENSINGWEBCLIENT.LABEL_LICENSING_HINT"))+"\n            ")])],1)]),s("div",{staticClass:"row q-mb-sm"},[s("div",{staticClass:"col-2"},[e._v(e._s(e.$t("LICENSINGWEBCLIENT.LABEL_LICENSING_KEY")))]),s("div",{staticClass:"col-5 q-ml-md textarea"},[s("q-input",{attrs:{outlined:"",dense:"","bg-color":"white","input-class":"textarea",type:"textarea"},model:{value:e.key,callback:function(t){e.key=t},expression:"key"}})],1)]),e.showTrialKeyHint?s("div",{staticClass:"row q-my-md"},[s("q-item-label",{attrs:{caption:""}},[s("div",{staticClass:"col-9",domProps:{innerHTML:e._s(e.trialKeyHint)}})])],1):e._e(),""!==e.permanentKeyHint?s("div",{staticClass:"row q-my-md"},[s("q-item-label",{attrs:{caption:""}},[s("div",{staticClass:"col-9",domProps:{innerHTML:e._s(e.permanentKeyHint)}})])],1):e._e(),s("div",{staticClass:"row q-mb-md"},[s("div",{directives:[{name:"t",rawName:"v-t",value:"LICENSINGWEBCLIENT.LABEL_LICENSING_USERS_NUMBER",expression:"'LICENSINGWEBCLIENT.LABEL_LICENSING_USERS_NUMBER'"}],staticClass:"col-2"}),s("div",{staticClass:"col-5 q-ml-md"},[s("b",[e._v(e._s(e.userCount))])])]),s("div",{staticClass:"row"},[s("div",{directives:[{name:"t",rawName:"v-t",value:"LICENSINGWEBCLIENT.LABEL_LICENSING_TYPE",expression:"'LICENSINGWEBCLIENT.LABEL_LICENSING_TYPE'"}],staticClass:"col-2"}),s("div",{staticClass:"col-5 q-ml-md"},[s("b",[e._v(e._s(e.licenseType))])])])])],1),s("div",{staticClass:"q-pt-md text-right"},[s("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:e.$t("COREWEBCLIENT.ACTION_SAVE")},on:{click:e.save}})],1)],1),s("q-dialog",{model:{value:e.showDialog,callback:function(t){e.showDialog=t},expression:"showDialog"}},[s("q-card",[s("q-card-section",[e._v("\n        "+e._s(e.$t("LICENSINGWEBCLIENT.INFO_LICENSE_KEY_CHANGED"))+"\n      ")]),s("q-card-actions",{attrs:{align:"right"}},[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:e.$t("COREWEBCLIENT.ACTION_OK")},on:{click:e.reloadUI}})],1)],1)],1),s("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:e.saving}},[s("q-linear-progress",{attrs:{query:""}})],1)],1)},i=[],n=s("4245"),E=s("21ac"),o=s("e539"),r=s("7b5d"),c={name:"Licensing",data:function(){return{key:"",userCount:0,saving:!1,licenseType:"",trialKeyHint:"",permanentKeyHint:"",showTrialKeyHint:!1,showDialog:!1}},mounted:function(){this.getLicenseInfo(),this.getTotalUsersCount(),this.populate()},beforeRouteLeave:function(e,t,s){this.doBeforeRouteLeave(e,t,s)},methods:{getLicenseInfo:function(){var e=this;o["a"].sendRequest({moduleName:"Licensing",methodName:"GetLicenseInfo"}).then((function(t){if(t)switch(t.Type){case 0:e.licenseType=e.$t("LICENSINGWEBCLIENT.LABEL_TYPE_UNLIM");break;case 1:e.licenseType=e.$tc("LICENSINGWEBCLIENT.LABEL_TYPE_PERMANENT_PLURAL",t.Count,{COUNT:t.Count});break;case 2:e.licenseType=e.$tc("LICENSINGWEBCLIENT.LABEL_TYPE_DOMAINS_PLURAL",t.Count,{COUNT:t.Count});break;case 4:t.ExpiresIn<1&&(e.licenseType=e.$t("LICENSINGWEBCLIENT.LABEL_TYPE_OUTDATED_INFO"));break;case 3:case 10:e.licenseType=3===t.Type?e.$tc("LICENSINGWEBCLIENT.LABEL_TYPE_ANNUAL_PLURAL",t.Count,{COUNT:t.Count}):e.$t("LICENSINGWEBCLIENT.LABEL_TYPE_TRIAL"),"*"!==t.ExpiresIn&&(t.ExpiresIn>0?e.licenseType+=e.$tc("LICENSINGWEBCLIENT.LABEL_TYPE_EXPIRES_IN_PLURAL",t.ExpiresIn,{DAYS:t.ExpiresIn}):e.licenseType+=e.$t("LICENSINGWEBCLIENT.LABEL_TYPE_EXPIRED")+" "+e.$t("LICENSINGWEBCLIENT.LABEL_TYPE_OUTDATED_INFO"));break}else e.licenseType=e.$t("LICENSINGWEBCLIENT.LABEL_TYPE_NOT_SET")}))},getTotalUsersCount:function(){var e=this;o["a"].sendRequest({moduleName:"Core",methodName:"GetTotalUsersCount"}).then((function(t){!1!==t&&(e.userCount=t)}))},hasChanges:function(){var e=r["a"].getLicenseSettings();return this.key!==e.licenseKey},revertChanges:function(){this.populate()},populate:function(){var e=r["a"].getLicenseSettings();this.key=e.licenseKey,this.trialKeyHint=e.trialKeyLink?this.$tc("LICENSINGWEBCLIENT.LABEL_LICENSING_TRIAL_KEY_HINT",e.trialKeyLink,{LINK:e.trialKeyLink}):"",this.permanentKeyHint=e.permanentKeyLink?this.$tc("LICENSINGWEBCLIENT.LABEL_LICENSING_PERMANENT_KEY_HINT",e.permanentKeyLink,{LINK:e.permanentKeyLink}):"",this.showTrialKeyHint=""===e.licenseKey&&""!==this.trialKeyHint},save:function(){var e=this;if(!this.saving){this.saving=!0;var t={LicenseKey:this.key};o["a"].sendRequest({moduleName:"Licensing",methodName:"UpdateSettings",parameters:t}).then((function(t){if(e.saving=!1,!0===t){E["a"].showReport(e.$t("COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS"));var s=r["a"].getLicenseSettings();e.key!==s.licenseKey&&(e.showDialog=!0)}else E["a"].showError(e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED"))}),(function(t){e.saving=!1,E["a"].showError(n["a"].getTextFromResponse(t,e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED")))}))}},reloadUI:function(){window.location.reload()}}},l=c,L=(s("e04a"),s("2877")),N=s("4983"),I=s("f09f"),C=s("a370"),T=s("0170"),_=s("27f9"),d=s("9c40"),p=s("24e8"),u=s("4b7e"),m=s("74f7"),v=s("6b1d"),S=s("7f67"),h=s("eebe"),y=s.n(h),B=Object(L["a"])(l,a,i,!1,null,"7aeceddf",null);t["default"]=B.exports;y()(B,"components",{QScrollArea:N["a"],QCard:I["a"],QCardSection:C["a"],QItemLabel:T["a"],QInput:_["a"],QBtn:d["a"],QDialog:p["a"],QCardActions:u["a"],QInnerLoading:m["a"],QLinearProgress:v["a"]}),y()(B,"directives",{ClosePopup:S["a"]})},e04a:function(e,t,s){"use strict";s("1003")}}]);