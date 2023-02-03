'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),
	Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Browser = require('%PathToCoreWebclientModule%/js/Browser.js'),
	CAbstractScreenView = require('%PathToCoreWebclientModule%/js/views/CAbstractScreenView.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js'),

	$html = $('html')
;

/**
 * @constructor
 */
function CMainView()
{
	CAbstractScreenView.call(this, '%ModuleName%');

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
		return this.loading() ? TextUtils.i18n('%MODULENAME%/ACTION_SIGNUP_IN_PROGRESS') : TextUtils.i18n('%MODULENAME%/ACTION_SIGNUP');
	}, this);

	this.signupCommand = Utils.createCommand(this, this.signup, this.canTrySignup);

	this.shake = ko.observable(false).extend({'autoResetToFalse': 800});
	this.beforeButtonsControllers = ko.observableArray([]);
	App.broadcastEvent('AnonymousUserForm::PopulateBeforeButtonsControllers', { ModuleName: '%ModuleName%', RegisterBeforeButtonsController: this.registerBeforeButtonsController.bind(this) });
	
	this.welcomeText = ko.observable('');
	App.subscribeEvent('ShowWelcomeSignupText', _.bind(function (oParams) {
		this.welcomeText(oParams.WelcomeText);
		this.login(oParams.UserName);
		this.enableLoginEdit(false);
	}, this));
	App.broadcastEvent('%ModuleName%::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CMainView.prototype, CAbstractScreenView.prototype);

CMainView.prototype.ViewTemplate = '%ModuleName%_MainView';
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
		App.broadcastEvent('AnonymousUserForm::PopulateFormSubmitParameters', { Module: '%ModuleName%', Parameters: oParameters });
		
		if (this.validateForm(sLogin, sPassword, sConfirmPassword))
		{
			this.loading(true);
			Ajax.send('%ModuleName%', 'Signup', oParameters, this.onSignupResponse, this);
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
		Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_SIGNUP_FAILED'));
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
