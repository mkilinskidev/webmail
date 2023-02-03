(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[34],{

/***/ "AeMD":
/*!*********************************************************!*\
  !*** ./modules/TenantAdminPanelWebclient/js/manager.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		$ = __webpack_require__(/*! jquery */ "EVdn"),

		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),

		Settings = __webpack_require__(/*! modules/TenantAdminPanelWebclient/js/Settings.js */ "Rjvo"),
		
		HeaderItemView = null
	;
	
	Settings.init(oAppData);
	
	var sAppHash = Settings.HashModuleName; 
	
	if (App.getUserRole() === Enums.UserRole.TenantAdmin)
	{
		return {
			/**
			 * Returns list of functions that are return module screens.
			 * 
			 * @returns {Object}
			 */
			getScreens: function ()
			{
				var oScreens = {};
				
				oScreens[sAppHash] = function () {
					return __webpack_require__(/*! modules/TenantAdminPanelWebclient/js/views/MainView.js */ "uUac");
				};
				
				return oScreens;
			},

			/**
			 * Returns object of header item view of the module.
			 * 
			 * @returns {Object}
			 */
			getHeaderItem: function ()
			{
				var 
					CHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "Ig+v"),
					oHeaderEntry = 	{};
				;

				if (HeaderItemView === null) {
					HeaderItemView = new CHeaderItemView(TextUtils.i18n('TENANTADMINPANELWEBCLIENT/LABEL_SETTINGS_TAB'));
				}
				oHeaderEntry = {
					item: HeaderItemView,
					name: sAppHash
				};
				
				return oHeaderEntry;
			}
		};
	}
	
	return null;
};


/***/ }),

/***/ "Ig+v":
/*!***********************************************************!*\
  !*** ./modules/CoreWebclient/js/views/CHeaderItemView.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "QaF5")
;

function CHeaderItemView(sLinkText)
{
	this.sName = '';
	
	this.visible = ko.observable(true);
	this.baseHash = ko.observable('');
	this.hash = ko.observable('');
	this.linkText = ko.observable(sLinkText);
	this.isCurrent = ko.observable(false);
	
	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.unseenCount = ko.observable(0);
	
	this.allowChangeTitle = ko.observable(false); // allows to change favicon and browser title when browser is inactive
	this.inactiveTitle = ko.observable('');
	
	this.excludedHashes = ko.observableArray([]);
}

CHeaderItemView.prototype.ViewTemplate = 'CoreWebclient_HeaderItemView';

CHeaderItemView.prototype.setName = function (sName)
{
	this.sName = sName.toLowerCase();
	if (this.baseHash() === '')
	{
		this.hash(Routing.buildHashFromArray([sName.toLowerCase()]));
		this.baseHash(this.hash());
	}
	else
	{
		this.hash(this.baseHash());
	}
};

module.exports = CHeaderItemView;


/***/ }),

/***/ "Rjvo":
/*!**********************************************************!*\
  !*** ./modules/TenantAdminPanelWebclient/js/Settings.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	ServerModuleName: 'TenantAdminPanelWebclient',
	HashModuleName: 'tenant-adminpanel',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
	}
};


/***/ }),

/***/ "uUac":
/*!****************************************************************!*\
  !*** ./modules/TenantAdminPanelWebclient/js/views/MainView.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "xG9w"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	
	CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),

	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a")
;

/**
 * View that is used as screen of the module. Inherits from CAbstractScreenView that has showing and hiding methods.
 * 
 * @constructor
 */
function CMainView()
{
	CAbstractScreenView.call(this, 'TenantAdminPanelWebclient');
	
	/**
	 * Text for displaying in browser title.
	 */
	this.browserTitle = ko.observable(TextUtils.i18n('TENANTADMINPANELWEBCLIENT/HEADING_BROWSER_TAB'));
	
	this.sFrameUrl = UrlUtils.getAppPath() + 'adminpanel';
	
	App.broadcastEvent('TenantAdminPanelWebclient::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CMainView.prototype, CAbstractScreenView.prototype);

CMainView.prototype.ViewTemplate = 'TenantAdminPanelWebclient_MainView';
CMainView.prototype.ViewConstructorName = 'CMainView';

module.exports = new CMainView();


/***/ })

}]);