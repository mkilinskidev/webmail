'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	CJua = require('%PathToCoreWebclientModule%/js/CJua.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CImportCalendarPopup()
{
	CAbstractPopup.call(this);
	
	this.fCallback = null;
	
	this.oJua = null;
	this.allowDragNDrop = ko.observable(false);
	
	this.importing = ko.observable(false);

	this.color	= ko.observable('');
	this.calendarId	= ko.observable('');
	
	this.importButtonDom	= ko.observable(null);
}

_.extendOwn(CImportCalendarPopup.prototype, CAbstractPopup.prototype);

CImportCalendarPopup.prototype.PopupTemplate = '%ModuleName%_ImportCalendarPopup';

/**
 * @param {Function} fCallback
 * @param {Object} oCalendar
 */
CImportCalendarPopup.prototype.onOpen = function (fCallback, oCalendar)
{
	if ($.isFunction(fCallback))
	{
		this.fCallback = fCallback;
	}
	if (oCalendar)
	{
		this.color(oCalendar.color ? oCalendar.color() : '');
		this.calendarId(oCalendar.id ? oCalendar.id : '');
	}
};

/**
 * @param {Object} $oViewModel
 */
CImportCalendarPopup.prototype.onBind = function ($oViewModel)
{
	var self = this;
	this.oJua = new CJua({
		'action': '?/Api/',
		'name': 'jua-uploader',
		'queueSize': 1,
		'clickElement': this.importButtonDom(),
		'hiddenElementsPosition': UserSettings.IsRTL ? 'right' : 'left',
		'disableAjaxUpload': false,
		'disableDragAndDrop': true,
		'disableMultiple': true,
		'hidden': _.extendOwn({
			'Module': Settings.ServerModuleName,
			'Method': 'UploadCalendar',
			'Parameters':  function () {
				return JSON.stringify({
					'CalendarID': self.calendarId()
				});
			}
		}, App.getCommonRequestParameters())
	});

	this.oJua
		.on('onStart', _.bind(this.onFileUploadStart, this))
		.on('onComplete', _.bind(this.onFileUploadComplete, this))
	;
	
	this.allowDragNDrop(this.oJua.isDragAndDropSupported());
};

CImportCalendarPopup.prototype.onFileUploadStart = function ()
{
	this.importing(true);
};

/**
 * @param {string} sFileUid
 * @param {boolean} bResponseReceived
 * @param {Object} oResponse
 */
CImportCalendarPopup.prototype.onFileUploadComplete = function (sFileUid, bResponseReceived, oResponse)
{
	var bError = !bResponseReceived || !oResponse || !oResponse.Result;

	this.importing(false);
	
	if (!bError)
	{
		this.fCallback();
		this.closePopup();
	}
	else
	{
		if (oResponse && oResponse.ErrorCode && oResponse.ErrorCode === Enums.Errors.IncorrectFileExtension)
		{
			Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_FILE_NOT_ICS'));
		}
		else
		{
			Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_FILE'));
		}
	}
};

module.exports = new CImportCalendarPopup();
