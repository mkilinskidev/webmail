(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[48],{

/***/ "L1t5":
/*!*******************************************!*\
  !*** ./modules/MailSignup/js/Settings.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "xG9w"),

	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'MailSignup',
	HashModuleName: 'signup',

	CustomLogoUrl: '',
	InfoText: '',
	BottomInfoHtmlText: '',
	DomainList: [],

	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['MailSignup'];

		if (!_.isEmpty(oAppDataSection))
		{
			var aDomainList = Types.pArray(oAppDataSection.DomainList, this.DomainList);

			this.ServerModuleName = Types.pString(oAppDataSection.ServerModuleName, this.ServerModuleName);
			this.HashModuleName = Types.pString(oAppDataSection.HashModuleName, this.HashModuleName);
			this.CustomLogoUrl = Types.pString(oAppDataSection.CustomLogoUrl, this.CustomLogoUrl);
			this.InfoText = Types.pString(oAppDataSection.InfoText, this.InfoText);
			this.BottomInfoHtmlText = Types.pString(oAppDataSection.BottomInfoHtmlText, this.BottomInfoHtmlText);
			this.DomainList = Types.isNonEmptyArray(aDomainList) ? aDomainList : ['no domain set'];
		}
	}
};


/***/ }),

/***/ "WNT9":
/*!******************************************!*\
  !*** ./modules/MailSignup/js/manager.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		
		Settings = __webpack_require__(/*! modules/MailSignup/js/Settings.js */ "L1t5"),
		
		bAnonimUser = App.getUserRole() === Enums.UserRole.Anonymous
	;

	Settings.init(oAppData);

	if (!App.isPublic() && bAnonimUser)
	{
		if (App.isMobile())
		{
			return {
				/**
				 * Returns signup view screen as is.
				 */
				getSignupScreenView: function () {
					return __webpack_require__(/*! modules/MailSignup/js/views/MainView.js */ "i2mW");
				},

				getHashModuleName: function () {
					return Settings.HashModuleName;
				}
			};
		}
		else
		{
			return {
				/**
				 * Returns signup view screen.
				 */
				getScreens: function () {
					var oScreens = {};
					oScreens[Settings.HashModuleName] = function () {
						return __webpack_require__(/*! modules/MailSignup/js/views/MainView.js */ "i2mW");
					};
					return oScreens;
				}
			};
		}
	}

	return null;
};


/***/ }),

/***/ "i2mW":
/*!*************************************************!*\
  !*** ./modules/MailSignup/js/views/MainView.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "xG9w"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "HLSX"),
	CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	
	Settings = __webpack_require__(/*! modules/MailSignup/js/Settings.js */ "L1t5"),

	$html = $('html')
;

/**
 * @constructor
 */
function CMainView()
{
	CAbstractScreenView.call(this, 'MailSignup');

	this.sCustomLogoUrl = Settings.CustomLogoUrl;
	this.sInfoText = Settings.InfoText;
	this.sBottomInfoHtmlText = Settings.BottomInfoHtmlText;
	this.aDomainList = ko.observableArray(Settings.DomainList);
	this.sSelectedDomain = ko.observable('');

	this.name = ko.observable('');
	this.enableNameEdit = ko.observable(true);
	this.login = ko.observable('');
	this.enableLoginEdit = ko.observable(true);
	this.password = ko.observable('');
	this.confirmPassword = ko.observable('');

	this.nameFocus = ko.observable(false);
	this.loginFocus = ko.observable(false);
	this.passwordFocus = ko.observable(false);
	this.confirmPasswordFocus = ko.observable(false);

	this.loading = ko.observable(false);

	this.canTrySignup = ko.computed(function () {
		return !this.loading();
	}, this);

	this.signupButtonText = ko.computed(function () {
		return this.loading() ? TextUtils.i18n('MAILSIGNUP/ACTION_SIGNUP_IN_PROGRESS') : TextUtils.i18n('MAILSIGNUP/ACTION_SIGNUP');
	}, this);

	this.signupCommand = Utils.createCommand(this, this.signup, this.canTrySignup);

	this.shake = ko.observable(false).extend({'autoResetToFalse': 800});
	this.beforeButtonsControllers = ko.observableArray([]);
	App.broadcastEvent('AnonymousUserForm::PopulateBeforeButtonsControllers', { ModuleName: 'MailSignup', RegisterBeforeButtonsController: this.registerBeforeButtonsController.bind(this) });
	
	this.welcomeText = ko.observable('');
	App.subscribeEvent('ShowWelcomeSignupText', _.bind(function (oParams) {
		this.welcomeText(oParams.WelcomeText);
		this.login(oParams.UserName);
		this.enableLoginEdit(false);
	}, this));
	App.broadcastEvent('MailSignup::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CMainView.prototype, CAbstractScreenView.prototype);

CMainView.prototype.ViewTemplate = 'MailSignup_MainView';
CMainView.prototype.ViewConstructorName = 'CMainView';

CMainView.prototype.onBind = function ()
{
	$html.addClass('non-adjustable-valign');
};

/**
 * Focuses login input after view showing.
 */
CMainView.prototype.onShow = function ()
{
	_.delay(_.bind(function(){
		if (this.login() === '')
		{
			this.loginFocus(true);
		}
	},this), 1);
};

/**
 * @param {string} sLogin
 * @param {string} sPassword
 * @param {string} sConfirmPassword
 * @returns {Boolean}
 */
CMainView.prototype.validateForm = function (sLogin, sPassword, sConfirmPassword)
{
	if (sLogin === '')
	{
		this.loginFocus(true);
		this.shake(true);
		return false;
	}
	if (sPassword === '')
	{
		this.passwordFocus(true);
		this.shake(true);
		return false;
	}
	if (sPassword !== '' && sPassword !== sConfirmPassword)
	{
		this.confirmPasswordFocus(true);
		this.shake(true);
		Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
		return false;
	}
	return true;
};

/**
 * Checks login input value and sends signup request to server.
 */
CMainView.prototype.signup = function ()
{
	if (!this.loading())
	{
		var
			sName = $.trim(this.name()),
			sLogin = $.trim(this.login()) + '@' + this.sSelectedDomain(),
			sPassword = $.trim(this.password()),
			sConfirmPassword = $.trim(this.confirmPassword()),
			oParameters = {
				'Name': sName,
				'Login': sLogin,
				'Password': sPassword				
			}
		;
		App.broadcastEvent('AnonymousUserForm::PopulateFormSubmitParameters', { Module: 'MailSignup', Parameters: oParameters });
		
		if (this.validateForm(sLogin, sPassword, sConfirmPassword))
		{
			this.loading(true);
			Ajax.send('MailSignup', 'Signup', oParameters, this.onSignupResponse, this);
		}
	}
};

/**
 * Receives data from the server. Shows error and shakes form if server has returned false-result.
 * Otherwise clears search-string if it don't contain "reset-pass", "invite-auth" and "oauth" parameters and reloads page.
 * 
 * @param {Object} oResponse Data obtained from the server.
 * @param {Object} oRequest Data has been transferred to the server.
 */
CMainView.prototype.onSignupResponse = function (oResponse, oRequest)
{
	if (false === oResponse.Result)
	{
		this.loading(false);
		this.shake(true);
		Api.showErrorByCode(oResponse, TextUtils.i18n('MAILSIGNUP/ERROR_SIGNUP_FAILED'));
	}
	else
	{
		App.setAuthToken(oResponse.Result.AuthToken);

		if (window.location.search !== '' &&
			UrlUtils.getRequestParam('reset-pass') === null &&
			UrlUtils.getRequestParam('invite-auth') === null &&
			UrlUtils.getRequestParam('oauth') === null)
		{
			UrlUtils.clearAndReloadLocation(Browser.ie8AndBelow, true);
		}
		else
		{
			UrlUtils.clearAndReloadLocation(Browser.ie8AndBelow, false);
		}
	}
};

/**
 * @param {Object} oComponent
 */
CMainView.prototype.registerBeforeButtonsController = function (oComponent)
{
	this.beforeButtonsControllers.push(oComponent);
};

module.exports = new CMainView();


/***/ })

}]);