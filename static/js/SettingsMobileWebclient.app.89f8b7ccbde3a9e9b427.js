(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[58],{

/***/ "kdpN":
/*!**************************************************!*\
  !*** ./modules/SettingsWebclient/js/Settings.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "xG9w"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	HashModuleName: 'settings',
	
	TabsOrder: ['common', 'mail', 'mail-accounts', 'contacts', 'calendar', 'files', 'mobilesync', 'outlooksync', 'helpdesk', 'openpgp'],
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['SettingsWebclient'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.TabsOrder = Types.pArray(oAppDataSection.TabsOrder, this.TabsOrder);
		}
	}
};


/***/ }),

/***/ "qrIc":
/*!************************************************************!*\
  !*** ./modules/SettingsWebclient/js/views/SettingsView.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "xG9w"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "QaF5"),
	CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),
	
	Settings = __webpack_require__(/*! modules/SettingsWebclient/js/Settings.js */ "kdpN"),
	
	$html = $('html')
;

/**
 * @constructor
 */
function CSettingsView()
{
	CAbstractScreenView.call(this, 'SettingsWebclient');
	
	this.tabs = ko.observableArray([]);
	
	this.currentTab  = ko.observable(null);
	
	App.subscribeEvent('OpenSettingTab', _.bind(function (oParams) {
		this.changeTab(oParams.Name);
	}, this));
	App.broadcastEvent('SettingsWebclient::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CSettingsView.prototype, CAbstractScreenView.prototype);

CSettingsView.prototype.ViewTemplate = 'SettingsWebclient_SettingsView';
CSettingsView.prototype.ViewConstructorName = 'CSettingsView';

/**
 * Registers settings tab.
 * 
 * @param {function} fGetTabView Function that returns settings tab view object.
 * @param {string} sTabName Tab name is used in hash string to rout to this tab.
 * @param {string} sTabTitle Tab title is used in the list of tabs in navigation menu.
 */
CSettingsView.prototype.registerTab = function (fGetTabView, sTabName, sTabTitle) {
	var
		iLastIndex = Settings.TabsOrder.length,
		oView = fGetTabView(),
		oTab = _.findWhere(this.tabs(), {'name': sTabName})
	;
	
	if (!_.isEmpty(oView))
	{
		oView.SettingsTabName = sTabName;
		oView.SettingsTabTitle = sTabTitle;
		if (oTab)
		{
			if (_.isArray(oTab.sections))
			{
				_.each(oTab.sections, function (oSection) {
					oView.addSettingsSection(oSection);
				});
				delete oTab.sections;
			}
			oTab.view = oView;
		}
	}
	
	if (!oTab)
	{
		this.tabs.push({
			view: oView,
			name: sTabName
		});
	}
	
	this.tabs(_.sortBy(this.tabs(), function (oTab) {
		var iIndex = _.indexOf(Settings.TabsOrder, oTab.name);
		return iIndex !== -1 ? iIndex : iLastIndex;
	}));
};

CSettingsView.prototype.registerTabSection = function (fGetSectionView, sTabName) {
	var
		oTab = _.findWhere(this.tabs(), {'name': sTabName}),
		oSection = fGetSectionView()
	;

	if (oTab)
	{
		oTab.view.addSettingsSection(oSection);
	}
	else
	{
		this.registerTab(function () { return { visible: ko.observable(false) }; }, sTabName, '');
		oTab = _.findWhere(this.tabs(), {'name': sTabName});
		if (oTab)
		{
			if (!_.isArray(oTab.sections))
			{
				oTab.sections = [];
			}
			oTab.sections.push(oSection);
		}
	}
	
};

/**
 * Checks if there are changes in Settings screen.
 * @returns {Boolean}
 */
CSettingsView.prototype.hasUnsavedChanges = function ()
{
	var oCurrentTab = this.currentTab();
	return oCurrentTab && oCurrentTab.view && _.isFunction(oCurrentTab.view.hasUnsavedChanges) && oCurrentTab.view.hasUnsavedChanges();
};

/**
 * Discards changes in Settings screen.
 */
CSettingsView.prototype.discardChanges = function ()
{
	var oCurrentTab = this.currentTab();
	if (oCurrentTab && oCurrentTab.view && _.isFunction(oCurrentTab.view.revert))
	{
		oCurrentTab.view.revert();
	}
};

CSettingsView.prototype.onShow = function ()
{
	$html.addClass('non-adjustable');
};

CSettingsView.prototype.onHide = function ()
{
	var oCurrentTab = this.currentTab();
	if (oCurrentTab && _.isFunction(oCurrentTab.view.hide))
	{
		oCurrentTab.view.hide(function () {}, function () {});
	}
	$html.removeClass('non-adjustable');
};

/**
 * @param {Array} aParams
 */
CSettingsView.prototype.onRoute = function (aParams)
{
	var
		sNewTabName = aParams.shift(),
		oCurrentTab = this.currentTab(),
		oNewTab = _.find(this.tabs(), function (oTab) {
			return oTab.name === sNewTabName;
		}),
		fShowNewTab = function () {
			if (oNewTab)
			{
				if (_.isFunction(oNewTab.view.showTab))
				{
					oNewTab.view.showTab(aParams);
				}
				this.currentTab(oNewTab);
				if (oNewTab.name !== sNewTabName)
				{
					Routing.replaceHashDirectly([Settings.HashModuleName, oNewTab.name]);
				}
			}
		}.bind(this),
		fRevertRouting = _.bind(function () {
			if (oCurrentTab)
			{
				Routing.replaceHashDirectly([Settings.HashModuleName, oCurrentTab.name]);
			}
		}, this),
		bShow = true
	;
	
	if (oCurrentTab && sNewTabName === oCurrentTab.name)
	{
		if (_.isFunction(oCurrentTab.view.showTab))
		{
			oCurrentTab.view.showTab(aParams);
		}
		return;
	}
	
	if (oNewTab && oNewTab.view.visible && !oNewTab.view.visible())
	{
		oNewTab = _.find(this.tabs(), function (oTab) {
			return !oTab.view.visible || oTab.view.visible();
		});
	}
	
	if (oNewTab)
	{
		if (oCurrentTab && _.isFunction(oCurrentTab.view.hide))
		{
			oCurrentTab.view.hide(fShowNewTab, fRevertRouting);
			bShow = false;
		}
	}
	else if (!oCurrentTab)
	{
		oNewTab = _.find(this.tabs(), function (oTab) {
			return !oTab.view.visible || oTab.view.visible();
		});
	}
	
	if (bShow)
	{
		fShowNewTab();
	}
};

/**
 * @param {string} sTabName
 */
CSettingsView.prototype.changeTab = function (sTabName)
{
	Routing.setHash([Settings.HashModuleName, sTabName]);
};

/**
 * @param {Array} aAddHash
 */
CSettingsView.prototype.setAddHash = function (aAddHash)
{
	Routing.setHash(_.union([Settings.HashModuleName, this.currentTab() ? this.currentTab().name : ''], aAddHash));
};

module.exports = new CSettingsView();


/***/ }),

/***/ "rzp2":
/*!*******************************************************!*\
  !*** ./modules/SettingsMobileWebclient/js/manager.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

module.exports = function (oAppData) {
	var
		ko = __webpack_require__(/*! knockout */ "0h2I"),
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5")
	;
	
	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				var SettingsView = __webpack_require__(/*! modules/SettingsWebclient/js/views/SettingsView.js */ "qrIc");
				var $html = $('html');
				SettingsView.ViewTemplate = 'SettingsMobileWebclient_SettingsView';
				SettingsView.appsDom = null;
				SettingsView.showApps = ko.observable(false);
				SettingsView.onShow = function ()
				{
					$html.addClass('non-adjustable');
					if (this.appsDom === null)
					{
						this.appsDom = $('#apps-list');
						this.appsDom.on('click', function () {
							this.showApps(false);
						}.bind(this));

						this.showApps.subscribe(function (value) {
							$('body').toggleClass('with-panel-right-cover', value);
						}, this);
					}
				};
			}
		};
	}
	
	return null;
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "EVdn")))

/***/ })

}]);