(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[18],{2755:function(t,s,e){"use strict";var n=e("970b"),o=e.n(n),i=e("5bc3"),p=e.n(i),r=e("b2f5"),a=e.n(r),u=e("6bfe"),d=function(){function t(s){o()(this,t);var e=s.MailChangePasswordPoppassdPlugin;a.a.isEmpty(e)||(this.host=u["a"].pString(e.Host),this.port=u["a"].pInt(e.Port),this.supportedServers=u["a"].pString(e.SupportedServers))}return p()(t,[{key:"savePoppassdSettings",value:function(t){var s=t.host,e=t.port,n=t.supportedServers;this.host=s,this.port=e,this.supportedServers=n}}]),t}(),S=null;s["a"]={init:function(t){S=new d(t)},savePoppassdSettings:function(t){S.savePoppassdSettings(t)},getPoppassdSettings:function(){return{host:S.host,port:S.port,supportedServers:S.supportedServers}}}},f305:function(t,s,e){"use strict";e.r(s);e("c7fe"),e("3119"),e("8da0"),e("b5bb"),e("a2b7");var n=e("2755");s["default"]={moduleName:"MailChangePasswordPoppassdPlugin",requiredModules:["MailWebclient"],init:function(t){n["a"].init(t)},getAdminSystemTabs:function(){return[{tabName:"poppassd",tabTitle:"MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_POPPASSD_SETTINGS_TAB",tabRouteChildren:[{path:"poppassd",component:function(){return e.e(36).then(e.bind(null,"c4f8"))}}]}]}}}}]);