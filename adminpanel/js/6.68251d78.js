(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{"051b":function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("main-layout",[s("q-splitter",{staticClass:"full-height full-width",attrs:{"after-class":e.showTabs?"":"q-splitter__right-panel",limits:[10,30]},scopedSlots:e._u([{key:"before",fn:function(){return[s("div",{staticClass:"flex column full-height"},[s("q-toolbar",{staticClass:"col-auto q-py-sm list-border"},[s("div",{staticClass:"flex"},[s("q-btn",{attrs:{flat:"",color:"grey-8",size:"mg","no-wrap":"",disable:0===e.checkedIds.length},on:{click:e.askDeleteCheckedUsers}},[s("trash-icon"),s("span",[e._v(e._s(e.countLabel))]),s("q-tooltip",[e._v("\n                "+e._s(e.$t("COREWEBCLIENT.ACTION_DELETE"))+"\n              ")])],1),e.allowCreateUser?s("q-btn",{attrs:{flat:"",color:"grey-8",size:"mg"},on:{click:e.routeCreateUser}},[s("add-icon"),s("q-tooltip",[e._v("\n                "+e._s(e.$t("ADMINPANELWEBCLIENT.ACTION_CREATE_ENTITY_USER"))+"\n              ")])],1):e._e(),e.allTenantGroups.length>0&&e.isUserSuperAdmin?s("span",[s("q-btn-dropdown",{attrs:{flat:"",color:"grey-8",size:"mg",disable:0===e.checkedOrSelectedUsersIds.length||0===e.groups.length},scopedSlots:e._u([{key:"label",fn:function(){return[s("add-to-group-icon"),s("q-tooltip",[e._v("\n                    "+e._s(e.$t("ADMINPANELWEBCLIENT.ACTION_ADD_USER_TO_GROUP"))+"\n                  ")])]},proxy:!0}],null,!1,808102495)},[s("q-list",e._l(e.groups,(function(t){return s("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],key:t.id,attrs:{clickable:""},on:{click:function(s){return e.addUsersToGroup(t.id)}}},[s("q-item-section",[s("q-item-label",[e._v(e._s(t.name))])],1)],1)})),1)],1),s("q-btn",{attrs:{flat:"",color:"grey-8",size:"mg",disable:e.disableRemoveFromGroup},on:{click:e.removeFromGroup}},[s("remove-from-group-icon"),s("q-tooltip",[e._v("\n                  "+e._s(e.$t("ADMINPANELWEBCLIENT.ACTION_REMOVE_USER_FROM_GROUP"))+"\n                ")])],1)],1):e._e(),e._l(e.filters,(function(t){return s(t,{key:t.name,tag:"component",on:{"filter-selected":e.routeFilter,"filter-filled-up":e.populateFiltersGetParameters,"allow-create-user":e.handleAllowCreateUser}})}))],2)]),s("standard-list",{ref:"userList",staticClass:"col-grow list-border",attrs:{items:e.userItems,selectedItem:e.selectedUserId,loading:e.loadingUsers,search:e.search,page:e.page,pagesCount:e.pagesCount,noItemsText:"ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_USER",noItemsFoundText:"ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_FOUND_USER"},on:{route:e.route,check:e.afterCheck},scopedSlots:e._u([{key:"right-icon",fn:function(){return[s("q-item-section",{attrs:{side:""}},[s("span",{staticClass:"me"},[e._v(e._s(e.$t("ADMINPANELWEBCLIENT.LABEL_ITS_ME")))])])]},proxy:!0}])})],1)]},proxy:!0},{key:"after",fn:function(){return[e.showTabs?s("q-splitter",{staticClass:"full-height full-width",attrs:{"after-class":"q-splitter__right-panel",limits:[10,30]},scopedSlots:e._u([{key:"before",fn:function(){return[s("q-list",[s("div",[s("q-item",{class:""===e.selectedTab?"bg-selected-item":"",attrs:{clickable:""},on:{click:function(t){return e.route(e.selectedUserId)}}},[s("q-item-section",[s("q-item-label",{directives:[{name:"t",rawName:"v-t",value:"ADMINPANELWEBCLIENT.LABEL_COMMON_SETTINGS_TAB",expression:"'ADMINPANELWEBCLIENT.LABEL_COMMON_SETTINGS_TAB'"}],attrs:{lines:"1"}})],1)],1),s("q-separator")],1),e._l(e.tabs,(function(t){return s("div",{key:t.tabName},[-1===t.hideTabForSelectedUserRoles.indexOf(e.selectedUserRole)?[s("q-item",{class:e.selectedTab===t.tabName?"bg-selected-item":"",attrs:{clickable:""},on:{click:function(s){return e.route(e.selectedUserId,t.tabName)}}},[s("q-item-section",[s("q-item-label",{attrs:{lines:"1"}},[e._v(e._s(e.$t(t.tabTitle)))])],1)],1),s("q-separator")]:e._e()],2)})),s("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:e.deleting}},[s("q-linear-progress",{attrs:{query:""}})],1)],2)]},proxy:!0},{key:"after",fn:function(){return[s("router-view",{attrs:{deletingIds:e.deletingIds,createMode:e.createMode},on:{"no-user-found":e.handleNoUserFound,"user-created":e.handleCreateUser,"cancel-create":e.route,"delete-user":e.askDeleteUser}})]},proxy:!0}],null,!1,3518898907),model:{value:e.tabsSplitterWidth,callback:function(t){e.tabsSplitterWidth=t},expression:"tabsSplitterWidth"}}):e._e(),e.showTabs?e._e():s("router-view",{attrs:{deletingIds:e.deletingIds,createMode:e.createMode},on:{"no-user-found":e.handleNoUserFound,"user-created":e.handleCreateUser,"cancel-create":e.route,"delete-user":e.askDeleteUser}})]},proxy:!0}]),model:{value:e.listSplitterWidth,callback:function(t){e.listSplitterWidth=t},expression:"listSplitterWidth"}},[s("ConfirmDialog",{ref:"confirmDialog"})],1)],1)},i=[],n=s("c973"),a=s.n(n),o=(s("96cf"),s("4de4"),s("d3b7"),s("7db0"),s("d81d"),s("ac1f"),s("841c"),s("1276"),s("a15b"),s("2ef0")),l=s.n(o),u=s("4245"),c=s("21ac"),d=s("6bfe"),h=s("e539"),p=s("11cb"),f=s("0091"),I=s("83d6"),g=s("713b"),m=s("96ec"),E=s("2287"),v=s("2e52"),U=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",version:"1.1",viewBox:"0 0 32 32",height:"32",width:"32"}},[s("path",{attrs:{d:"M 23.490234,4.3671875 C 23.145826,4.3725766 22.870687,4.655577 22.875,5 v 8.941406 l -3.382812,-3.382812 c -0.117451,-0.120866 -0.278733,-0.189182 -0.447266,-0.189453 -0.559896,10e-4 -0.836127,0.681088 -0.435547,1.072265 l 4.472656,4.47461 c 0.244193,0.244632 0.640573,0.244632 0.884766,0 l 4.474609,-4.47461 C 29.092665,10.853679 28.146321,9.9073348 27.558594,10.558594 L 24.125,13.992188 V 5 C 24.129408,4.6479298 23.842289,4.3616939 23.490234,4.3671875 Z M 8.4375,7.875 C 7.0987689,7.875 5.875,8.8549776 5.875,10.263672 V 16 c -2.091e-4,0.03005 0.00175,0.06008 0.00586,0.08984 l -0.00781,8.419922 c -1e-6,6.51e-4 -1e-6,0.0013 0,0.002 -5.382e-4,0.01497 -5.382e-4,0.02995 0,0.04492 v 0.002 0.123047 c -0.0011,0.09228 0.018239,0.18366 0.056641,0.267578 C 6.1070849,25.620696 6.7188837,26.125 7.4414062,26.125 H 8 20 c 0.04189,9.42e-4 0.08377,-0.0023 0.125,-0.0098 1.151538,-0.05057 2.047983,-0.777348 2.556641,-1.794922 0.01459,-0.02321 0.02764,-0.04735 0.03906,-0.07227 0.0055,-0.01091 0.01074,-0.02199 0.01563,-0.0332 l 0.0098,-0.02344 c 1e-6,-6.51e-4 1e-6,-0.0013 0,-0.002 l 2.251953,-5.554687 c 0.178188,-0.419544 -0.138133,-0.882579 -0.59375,-0.869141 -0.251126,0.0073 -0.473472,0.164258 -0.564453,0.398437 l -2.25586,5.558594 C 21.195456,24.534351 20.772063,24.875 20,24.875 H 8.9921875 l 3.4492185,-9.75 H 16 c 0.845202,0.01195 0.845202,-1.261953 0,-1.25 h -3.900391 c -0.02714,-0.0044 -0.05454,-0.007 -0.08203,-0.0078 -0.148207,-0.0036 -0.292886,0.0455 -0.408203,0.138671 -0.121284,0.09356 -0.203992,0.228393 -0.232422,0.378907 l -3.6171884,10.22655 c -0.00422,0.01096 -0.00812,0.02203 -0.011719,0.0332 C 7.7095712,24.776018 7.5916698,24.875 7.4414062,24.875 7.2578983,24.875 7.1230469,24.740976 7.1230469,24.556641 L 7.1308594,15.625 c 4.01e-4,-0.03135 -0.00156,-0.06269 -0.00586,-0.09375 V 10.263672 C 7.125,9.530342 7.6382071,9.125 8.4375,9.125 h 3.125 c 0.413535,0 0.761749,0.1240195 0.982422,0.2988281 0.220673,0.1748086 0.330078,0.3744622 0.330078,0.6718749 0,0.806179 0.374452,1.389317 0.767578,1.675781 0.393126,0.286465 0.814453,0.330079 0.814453,0.330078 0.829475,0.08469 0.956428,-1.159445 0.126953,-1.24414 0,0 -0.0877,-0.01018 -0.205078,-0.0957 C 14.261532,10.676187 14.125,10.569525 14.125,10.095703 14.125,9.4251032 13.80089,8.8260066 13.320312,8.4453125 12.839737,8.0646184 12.219965,7.875 11.5625,7.875 Z"}})])},b=[],T={name:"AddToGroup"},C=T,N=s("2877"),_=Object(N["a"])(C,U,b,!1,null,"8d2ca3a2",null),L=_.exports,R=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 32 32",version:"1.1"}},[s("path",{attrs:{d:"m 19.783203,5.2441406 c -0.559896,0.00104 -0.836129,0.6810885 -0.435547,1.0722656 l 3.226563,3.2265626 -3.226563,3.2265622 c -0.651229,0.587729 0.295084,1.534042 0.882813,0.882813 l 3.226562,-3.226563 3.226563,3.226563 c 0.587728,0.651243 1.534055,-0.295086 0.882812,-0.882813 L 24.339844,9.5429688 27.566406,6.3164062 c 0.407085,-0.3971266 0.115381,-1.0874107 -0.453125,-1.0722656 -0.162409,0.0049 -0.316526,0.072855 -0.429687,0.1894532 L 23.457031,8.6601562 20.230469,5.4335938 C 20.113018,5.3127279 19.951736,5.244412 19.783203,5.2441406 Z M 8.4375,7.875 C 7.0987775,7.875 5.875,8.8549723 5.875,10.263672 V 16 c -2.091e-4,0.03005 0.00175,0.06008 0.00586,0.08984 l -0.00781,8.419922 c -1e-6,6.51e-4 -1e-6,0.0013 0,0.002 -5.382e-4,0.01497 -5.382e-4,0.02995 0,0.04492 v 0.002 0.123047 c -9.157e-4,0.08871 0.017061,0.17659 0.052734,0.257812 C 6.0995919,25.616051 6.7152324,26.125 7.4414062,26.125 H 8 20 c 0.04189,9.42e-4 0.08377,-0.0023 0.125,-0.0098 1.151538,-0.05057 2.047992,-0.777352 2.556641,-1.794922 0.01459,-0.02321 0.02764,-0.04735 0.03906,-0.07227 0.0055,-0.01091 0.01074,-0.02199 0.01563,-0.0332 l 0.0098,-0.02344 c 1e-6,-6.51e-4 1e-6,-0.0013 0,-0.002 l 2.251953,-5.554687 c 0.178188,-0.419544 -0.138133,-0.882579 -0.59375,-0.869141 -0.251126,0.0073 -0.473472,0.164258 -0.564453,0.398437 l -2.25586,5.558594 C 21.195471,24.53433 20.772063,24.875 20,24.875 H 8.9921875 l 3.4492185,-9.75 H 16 c 0.845196,0.01195 0.845196,-1.261947 0,-1.25 h -3.900391 c -0.02714,-0.0044 -0.05454,-0.007 -0.08203,-0.0078 -0.148207,-0.0036 -0.292886,0.0455 -0.408203,0.138671 -0.121284,0.09356 -0.203992,0.228393 -0.232422,0.378907 L 7.7597656,24.611328 c -0.00422,0.01096 -0.00812,0.02203 -0.011719,0.0332 C 7.7095712,24.776018 7.59167,24.875 7.4414062,24.875 7.2578878,24.875 7.1230469,24.740997 7.1230469,24.556641 L 7.1308594,15.625 c 4.01e-4,-0.03135 -0.00156,-0.06269 -0.00586,-0.09375 V 10.263672 C 7.125,9.5303453 7.6382225,9.125 8.4375,9.125 h 3.125 c 0.413535,0 0.761749,0.1240193 0.982422,0.2988281 0.220673,0.1748089 0.330078,0.3744622 0.330078,0.6718749 0,0.806178 0.374452,1.389316 0.767578,1.675781 0.393126,0.286465 0.814453,0.330078 0.814453,0.330078 0.829475,0.08469 0.956428,-1.159445 0.126953,-1.24414 0,0 -0.0877,-0.01017 -0.205078,-0.0957 C 14.261532,10.676187 14.125,10.569525 14.125,10.095703 14.125,9.4251032 13.80089,8.8260069 13.320312,8.4453125 12.839737,8.0646181 12.219965,7.875 11.5625,7.875 Z"}})])},S=[],A={name:"RemoveFromGroup"},w=A,k=Object(N["a"])(w,R,S,!1,null,"4c686fb3",null),D=k.exports,O=s("952a"),$=s("81c5"),P={},F={name:"Domains",components:{MainLayout:g["a"],ConfirmDialog:m["a"],StandardList:E["a"],AddIcon:v["a"],AddToGroupIcon:L,RemoveFromGroupIcon:D,TrashIcon:O["a"]},data:function(){return{users:[],selectedUserId:0,loadingUsers:!1,totalCount:0,search:"",page:1,limit:I["a"].getEntitiesPerPage(),userItems:[],checkedIds:[],allowCreateUser:!0,justCreatedId:0,deletingIds:[],selectedGroupId:-1,tabs:[],selectedTab:"",listSplitterWidth:d["a"].pInt(localStorage.getItem("users-list-splitter-width"),20),tabsSplitterWidth:d["a"].pInt(localStorage.getItem("users-tabs-splitter-width"),20),filters:[],currentFiltersRoutes:{},filtersGetParameters:{}}},computed:{currentTenantId:function(){return this.$store.getters["tenants/getCurrentTenantId"]},pagesCount:function(){return Math.ceil(this.totalCount/this.limit)},countLabel:function(){var e=this.checkedIds.length;return e>0?e:""},totalCountText:function(){return this.$tc("ADMINPANELWEBCLIENT.LABEL_USERS_COUNT",this.totalCount,{COUNT:this.totalCount})},showTabs:function(){return this.tabs.length>0&&this.selectedUserId>0},deleting:function(){return-1!==this.deletingIds.indexOf(this.selectedUserId)},createMode:function(){var e=this.$route.path.indexOf("/create");return-1!==e&&e===this.$route.path.length-7},allTenantGroups:function(){var e=this.$store.getters["groups/getGroups"],t=d["a"].pArray(e[this.currentTenantId]);return t.filter((function(e){return!e.isTeam}))},groups:function(){var e=this.selectedGroupId;return this.allTenantGroups.filter((function(t){return t.id!==e}))},checkedOrSelectedUsersIds:function(){return this.checkedIds.length>0?this.checkedIds:0!==this.selectedUserId?[this.selectedUserId]:[]},disableRemoveFromGroup:function(){var e=this,t=this.allTenantGroups.find((function(t){return t.id===e.selectedGroupId}));return!t||this.checkedOrSelectedUsersIds.length<=0},selectedUserRole:function(){var e=this,t=this.users.find((function(t){return t.id===e.selectedUserId})),s=t&&t.role;return s||P.NormalUser},isUserSuperAdmin:function(){return this.$store.getters["user/isUserSuperAdmin"]},userRole:function(){return this.$store.getters["user/getUserRole"]}},watch:{currentTenantId:function(){"/users"!==this.$route.path&&this.route(),this.populate()},$route:function(e,t){this.parseRoute()},users:function(){var e=this.$store.getters["user/getUserPublicId"];this.userItems=this.users.map((function(t){return{id:t.id,title:t.publicId,checked:!1,showRightIcon:t.publicId===e}}))},allowCreateUser:function(){!this.allowCreateUser&&this.createMode&&this.$router.push("/users")},listSplitterWidth:function(e){localStorage.setItem("users-list-splitter-width",e)},tabsSplitterWidth:function(e){localStorage.setItem("users-tabs-splitter-width",e)}},mounted:function(){P=$["a"].getUserRoles(),this.populateFilters(),this.populateTabs(),this.populate(),this.parseRoute()},methods:{parseRoute:function(){if(this.createMode)this.selectedUserId=0;else{var e,t,s,r,i,n,a,o,l=d["a"].pString(null===(e=this.$route)||void 0===e||null===(t=e.params)||void 0===t?void 0:t.search),u=d["a"].pPositiveInt(null===(s=this.$route)||void 0===s||null===(r=s.params)||void 0===r?void 0:r.page);this.search===l&&this.page===u&&0===this.justCreatedId||(this.search=l,this.page=u,this.populate());var c=d["a"].pNonNegativeInt(null===(i=this.$route)||void 0===i||null===(n=i.params)||void 0===n?void 0:n.id);this.selectedUserId!==c&&(this.selectedUserId=c),this.selectedGroupId=d["a"].pInt(null===(a=this.$route)||void 0===a||null===(o=a.params)||void 0===o?void 0:o.group);var h=this.$route.path.split("/"),p=h.length>0?h[h.length-1]:"",f=this.tabs.find((function(e){return e.tabName===p}));this.selectedTab=f?f.tabName:""}},handleAllowCreateUser:function(e){e.tenantId===this.currentTenantId&&(this.allowCreateUser=e.allowCreateUser)},populateFilters:function(){this.filters=f["a"].getFiltersForUsers()},populateTabs:function(){this.tabs=f["a"].getAdminEntityTabs("getAdminUserTabs").map((function(e){return{tabName:e.tabName,tabTitle:e.tabTitle,hideTabForSelectedUserRoles:void 0!==e.hideTabForSelectedUserRoles?e.hideTabForSelectedUserRoles:[]}}))},populateFiltersGetParameters:function(e){var t=l.a.extend(l.a.clone(this.filtersGetParameters),e);l.a.isEqual(t,this.filtersGetParameters)||(this.filtersGetParameters=t,this.populate())},populate:function(){var e=this;this.loadingUsers=!0,p["a"].getUsers(this.currentTenantId,this.filtersGetParameters,this.search,this.page,this.limit).then((function(t){var s=t.users,r=t.totalCount,i=t.tenantId,n=t.filtersGetParameters,a=void 0===n?{}:n,o=t.page,u=void 0===o?1:o,c=t.search,d=void 0===c?"":c;i===e.currentTenantId&&l.a.isEqual(a,e.filtersGetParameters)&&u===e.page&&d===e.search&&(e.users=s,e.totalCount=r,e.loadingUsers=!1,e.justCreatedId&&s.find((function(t){return t.id===e.justCreatedId}))&&(e.route(e.justCreatedId),e.justCreatedId=0))}))},getFiltersRoute:function(){var e=l.a.map(this.currentFiltersRoutes,(function(e,t){return void 0!==e?t+"/"+e:""})),t=l.a.filter(e,(function(e){return""!==e}));return t.length>0?"/"+t.join("/"):""},routeFilter:function(e){this.currentFiltersRoutes[e.routeName]!==e.routeValue&&(this.currentFiltersRoutes[e.routeName]=e.routeValue,this.route())},route:function(){var e,t,s,r,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=(null===(e=this.$refs)||void 0===e||null===(t=e.userList)||void 0===t?void 0:t.enteredSearch)||"",o=""!==a?"/search/".concat(a):"",l=(null===(s=this.$refs)||void 0===s||null===(r=s.userList)||void 0===r?void 0:r.selectedPage)||1;this.search!==a&&(l=1);var u=l>1?"/page/".concat(l):"",c=i>0?"/id/".concat(i):"",d=""!==n?"/".concat(n):"",h="/users"+this.getFiltersRoute()+o+u+c+d;h!==this.$route.path&&this.$router.push(h)},routeCreateUser:function(){this.$router.push("/users"+this.getFiltersRoute()+"/create")},handleCreateUser:function(e){this.justCreatedId=e,this.route(),this.populate()},afterCheck:function(e){this.checkedIds=e},handleNoUserFound:function(){c["a"].showError(this.$t("ADMINPANELWEBCLIENT.ERROR_USER_NOT_FOUND")),this.route(),this.populate()},askDeleteUser:function(e){this.askDeleteUsers([e])},askDeleteCheckedUsers:function(){this.askDeleteUsers(this.checkedIds)},askDeleteUsers:function(e){var t,s;if(l.a.isFunction(null===this||void 0===this||null===(t=this.$refs)||void 0===t||null===(s=t.confirmDialog)||void 0===s?void 0:s.openDialog)){var r=1===e.length?this.users.find((function(t){return t.id===e[0]})):null,i=r?r.publicId:"";this.$refs.confirmDialog.openDialog({title:i,message:this.$tc("ADMINPANELWEBCLIENT.CONFIRM_DELETE_USER_PLURAL",e.length),okHandler:this.deleteUsers.bind(this,e)})}},deleteUsers:function(e){var t=this;this.deletingIds=e,this.loadingUsers=!0,h["a"].sendRequest({moduleName:"Core",methodName:"DeleteUsers",parameters:{IdList:e,DeletionConfirmedByAdmin:!0}}).then((function(s){if(t.deletingIds=[],t.loadingUsers=!1,!0===s){var r,i,n,a;c["a"].showReport(t.$tc("ADMINPANELWEBCLIENT.REPORT_DELETE_ENTITIES_USER_PLURAL",e.length));var o=-1!==e.indexOf(t.selectedUserId),u=(null===(r=t.$refs)||void 0===r||null===(i=r.userList)||void 0===i?void 0:i.selectedPage)||1,d=t.users.length===e.length&&u>1;d&&l.a.isFunction(null===(n=t.$refs)||void 0===n||null===(a=n.userList)||void 0===a?void 0:a.decreasePage)?t.$refs.userList.decreasePage():o?(t.route(),t.populate()):t.populate()}else c["a"].showError(t.$tc("ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL",e.length))}),(function(s){t.deletingIds=[],t.loadingUsers=!1,c["a"].showError(u["a"].getTextFromResponse(s,t.$tc("ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL",e.length)))}))},addUsersToGroup:function(e){this.checkedOrSelectedUsersIds.length>0&&this.$store.dispatch("groups/addUsersToGroup",{tenantId:this.currentTenantId,groupId:e,usersIds:this.checkedOrSelectedUsersIds})},removeFromGroup:function(){var e=this;return a()(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!(e.checkedOrSelectedUsersIds.length>0)){t.next=3;break}return t.next=3,e.$store.dispatch("groups/removeUsersFromGroup",{tenantId:e.currentTenantId,groupId:e.selectedGroupId,usersIds:e.checkedOrSelectedUsersIds,callback:e.populate.bind(e)});case 3:case"end":return t.stop()}}),t)})))()}}},G=F,M=(s("23b0"),s("8562")),q=s("65c6"),x=s("9c40"),y=s("05c0"),B=s("f20b"),W=s("1c1c"),Q=s("66e5"),j=s("4074"),V=s("0170"),H=s("eb85"),z=s("74f7"),Z=s("6b1d"),J=s("4e73"),Y=s("7f67"),K=s("eebe"),X=s.n(K),ee=Object(N["a"])(G,r,i,!1,null,null,null);t["default"]=ee.exports;X()(ee,"components",{QSplitter:M["a"],QToolbar:q["a"],QBtn:x["a"],QTooltip:y["a"],QBtnDropdown:B["a"],QList:W["a"],QItem:Q["a"],QItemSection:j["a"],QItemLabel:V["a"],QSeparator:H["a"],QInnerLoading:z["a"],QLinearProgress:Z["a"],QMenu:J["a"]}),X()(ee,"directives",{ClosePopup:Y["a"]})},"23b0":function(e,t,s){"use strict";s("5574")},5574:function(e,t,s){}}]);