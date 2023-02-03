'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
* @constructor
*/
function CAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
	
	/* Editable fields */
	this.loginLogo = ko.observable(Settings.LoginLogo);
	this.tabsbarLogo = ko.observable(Settings.TabsbarLogo);
	/*-- Editable fields */
}

_.extendOwn(CAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_AdminSettingsView';

CAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.loginLogo(),
		this.tabsbarLogo()
	];
};

CAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.loginLogo(Settings.LoginLogo);
	this.tabsbarLogo(Settings.TabsbarLogo);
};

CAdminSettingsView.prototype.getParametersForSave = function ()
{
	var oParameters = {
		'LoginLogo': this.loginLogo(),
		'TabsbarLogo': this.tabsbarLogo()
	};
	if (Types.isPositiveNumber(this.iTenantId)) // branding is shown for particular tenant
	{
		oParameters.TenantId = this.iTenantId;
	}
	return oParameters;
};

/**
 * Applies saved values to the Settings object.
 * 
 * @param {Object} oParameters Parameters which were saved on the server side.
 */
CAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	if (!Types.isPositiveNumber(this.iTenantId))
	{
		Settings.update(oParameters);
	}
};

CAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '' || sEntityType === 'Tenant');
	this.iTenantId = iEntityId;
};

CAdminSettingsView.prototype.onRouteChild = function (aParams)
{
	this.requestPerTenantSettings();
};

CAdminSettingsView.prototype.requestPerTenantSettings = function ()
{
	if (Types.isPositiveNumber(this.iTenantId))
	{
		this.loginLogo('');
		this.tabsbarLogo('');
		Ajax.send(Settings.ServerModuleName, 'GetSettings', { 'TenantId': this.iTenantId }, function (oResponse) {
			if (oResponse.Result)
			{
				this.loginLogo(oResponse.Result.LoginLogo);
				this.tabsbarLogo(oResponse.Result.TabsbarLogo);
				this.updateSavedState();
			}
		}, this);
	}
	else
	{
		this.revertGlobalValues();
	}
};

module.exports = new CAdminSettingsView();
