(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{"58c9":function(e,t,n){"use strict";var i=n("970b"),a=n.n(i),o=n("5bc3"),s=n.n(o),r=(n("f108"),n("b2f5")),c=n.n(r),p=n("6bfe"),u=function(){function e(t){a()(this,e);var n=p["a"].pObject(t.Dropbox);c.a.isEmpty(n)||(this.displayName=p["a"].pString(n.DisplayName),this.enableModule=p["a"].pBool(n.EnableModule),this.id=p["a"].pString(n.Id),this.name=p["a"].pString(n.Name),this.scopes=p["a"].pArray(n.Scopes),this.secret=p["a"].pString(n.Secret))}return s()(e,[{key:"saveDropboxSettings",value:function(e){var t=e.EnableModule,n=e.Id,i=e.Scopes,a=e.Secret;this.enableModule=t,this.id=n,this.scopes=i,this.secret=a}}]),e}(),b=null;t["a"]={init:function(e){b=new u(e)},saveDropboxSettings:function(e){b.saveDropboxSettings(e)},getDropboxSettings:function(){return{displayName:b.displayName,enableModule:b.enableModule,id:b.id,name:b.name,scopes:b.scopes,secret:b.secret}}}},"7ca6":function(e,t,n){"use strict";n.r(t);n("c7fe"),n("3119"),n("8da0"),n("b5bb"),n("a2b7");var i=n("58c9");t["default"]={moduleName:"Dropbox",requiredModules:[],init:function(e){i["a"].init(e)},getAdminSystemTabs:function(){return[{tabName:"dropbox",tabTitle:"DROPBOX.LABEL_SETTINGS_TAB",tabRouteChildren:[{path:"dropbox",component:function(){return Promise.all([n.e(0),n.e(32)]).then(n.bind(null,"eff1"))}}]}]}}}}]);