'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),

	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),

	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass'),

	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
* @constructor
*/
function CFilesAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.sEntityType = '';
	this.iEntityId = 0;

	this.isNoEntity = ko.observable(false);
	this.isTenantEntity = ko.observable(false);
	this.isUserEntity = ko.observable(false);

	this.allowEditUserSpaceLimitMb = ko.observable(true);
	this.allowEditTenantSpaceLimitMb = ko.observable(true);
	this.allocatedSpace = ko.observable(0);
	this.visibleCorporate  = ko.computed(function () {
		return Settings.ShowCorporateFilesAdminSection && !this.isUserEntity();
	}, this);

	/* Editable fields */
	this.enableUploadSizeLimit = ko.observable(Settings.EnableUploadSizeLimit);
	this.uploadSizeLimitMb = ko.observable(Settings.UploadSizeLimitMb);

	this.userSpaceLimitMb = ko.observable(Settings.UserSpaceLimitMb);
	this.tenantSpaceLimitMb = ko.observable(Settings.TenantSpaceLimitMb);
	this.corporateSpaceLimitMb = ko.observable(Settings.CorporateSpaceLimitMb);
	/*-- Editable fields */
	
	this.isPersonalSaving = ko.observable(false);
	this.isCorporateSaving = ko.observable(false);
}

_.extendOwn(CFilesAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CFilesAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_FilesAdminSettingsView';

CFilesAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.enableUploadSizeLimit(),
		this.uploadSizeLimitMb(),
		this.tenantSpaceLimitMb(),
		this.userSpaceLimitMb(),
		this.corporateSpaceLimitMb()
	];
};

CFilesAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.enableUploadSizeLimit(Settings.EnableUploadSizeLimit);
	this.uploadSizeLimitMb(Settings.UploadSizeLimitMb);

	this.userSpaceLimitMb(Settings.UserSpaceLimitMb);
	this.tenantSpaceLimitMb(Settings.TenantSpaceLimitMb);
	this.corporateSpaceLimitMb(Settings.CorporateSpaceLimitMb);
};

CFilesAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'EnableUploadSizeLimit': this.enableUploadSizeLimit(),
		'UploadSizeLimitMb': Types.pInt(this.uploadSizeLimitMb()),
		'UserSpaceLimitMb': Types.pInt(this.userSpaceLimitMb())
	};
};

/**
 * Applies saved values to the Settings object.
 *
 * @param {Object} oParameters Parameters which were saved on the server side.
 */
CFilesAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	Settings.updateAdmin(oParameters.EnableUploadSizeLimit, oParameters.UploadSizeLimitMb);
};

/**
 * Sets access level for the view via entity type and entity identifier.
 * This view is visible only for empty entity type.
 *
 * @param {string} sEntityType Current entity type.
 * @param {number} iEntityId Indentificator of current intity.
 */
CFilesAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.sEntityType = sEntityType;
	this.iEntityId = (sEntityType === 'User' || sEntityType === 'Tenant') ? iEntityId : 0;

	this.visible(sEntityType === '' || sEntityType === 'Tenant' || sEntityType === 'User');
	this.isNoEntity(sEntityType === '');
	this.isTenantEntity(sEntityType === 'Tenant');
	this.isUserEntity(sEntityType === 'User');
};

CFilesAdminSettingsView.prototype.onRouteChild = function (aParams)
{
	if (this.sEntityType === 'Tenant' || this.sEntityType === 'User')
	{
		this.requestPerEntitytSettings();

		this.allowEditTenantSpaceLimitMb(App.getUserRole() === Enums.UserRole.SuperAdmin);
	}
};

CFilesAdminSettingsView.prototype.requestPerEntitytSettings = function ()
{
	if (Types.isPositiveNumber(this.iEntityId))
	{
		Ajax.send(Settings.ServerModuleName, 'GetSettingsForEntity', { 'EntityType': this.sEntityType, 'EntityId': this.iEntityId }, function (oResponse) {
			if (oResponse.Result)
			{
				this.userSpaceLimitMb(Types.pInt(oResponse.Result.UserSpaceLimitMb));
				this.tenantSpaceLimitMb(Types.pInt(oResponse.Result.TenantSpaceLimitMb));

				if (oResponse.Result.AllowEditUserSpaceLimitMb !== undefined)
				{
					this.allowEditUserSpaceLimitMb(Types.pBool(oResponse.Result.AllowEditUserSpaceLimitMb));
				}
				if (oResponse.Result.AllocatedSpace !== undefined)
				{
					this.allocatedSpace(Types.pInt(oResponse.Result.AllocatedSpace));
				}

				this.updateSavedState();
			}
			else
			{
				this.revertGlobalValues();
				this.allocatedSpace(0);
				Api.showErrorByCode(oResponse);
			}
		}, this);
	}
	else
	{
		this.revertGlobalValues();
		this.allocatedSpace(0);
	}
};

CFilesAdminSettingsView.prototype.savePersonal = function ()
{
	if (!_.isFunction(this.validateBeforeSave) || this.validateBeforeSave())
	{
		var oParameters = {
			'EntityType': this.sEntityType,
			'EntityId': Types.pInt(this.iEntityId),
			'UserSpaceLimitMb': Types.pInt(this.userSpaceLimitMb()),
			'TenantSpaceLimitMb': Types.pInt(this.tenantSpaceLimitMb())
		};
		if (this.sEntityType === 'Tenant')
		{
			oParameters.TenantId = oParameters.EntityId;
		}
		this.isPersonalSaving(true);
		Ajax.send(
			this.sServerModule, 'UpdateSettingsForEntity', oParameters,
			function (oResponse, oRequest) {
				this.isPersonalSaving(false);
				this.onResponse(oResponse, oRequest);
			},
			this
		);
	}
};

CFilesAdminSettingsView.prototype.saveCorporate = function ()
{
	var oParameters = {
		'SpaceLimitMb': Types.pInt(this.corporateSpaceLimitMb())
	};
	if (this.sEntityType === 'Tenant')
	{
		oParameters.TenantId = Types.pInt(this.iEntityId);
	}
	this.isCorporateSaving(true);
	Ajax.send(
		'CorporateFiles', 'UpdateSettings', oParameters,
		function (oResponse, oRequest) {
			this.isCorporateSaving(false);
			this.onResponse(oResponse, oRequest);
		},
		this
	);
};

CFilesAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	if (typeof oParameters.EntityType !== 'undefined' && oParameters.EntityType === ''
		&& typeof oParameters.UserSpaceLimitMb !== 'undefined'
		&& typeof oParameters.TenantSpaceLimitMb !== 'undefined'
	)
	{
		Settings.UserSpaceLimitMb = oParameters.UserSpaceLimitMb;
		Settings.TenantSpaceLimitMb = oParameters.TenantSpaceLimitMb;
	}
};

module.exports = new CFilesAdminSettingsView();
