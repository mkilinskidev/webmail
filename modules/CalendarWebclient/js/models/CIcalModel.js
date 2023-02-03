'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),

	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),

	Ajax = require('modules/%ModuleName%/js/Ajax.js'),
	CalendarCache = require('modules/%ModuleName%/js/Cache.js'),

	HeaderItemView = (!App.isNewTab() && !App.isMobile()) ? require('modules/%ModuleName%/js/views/HeaderItemView.js') : null,

	MainTab = App.isNewTab() && window.opener ? window.opener.MainTabCalendarMethods : null
;

/**
 * @constructor
 * @param {Object} oRawIcal
 * @param {string} sAttendee
 */
function CIcalModel(oRawIcal, sAttendee)
{
	this.oRawIcal = oRawIcal;

	this.uid = ko.observable(Types.pString(oRawIcal.Uid));
	this.lastModification = ko.observable(true);
	this.sSequence = Types.pInt(oRawIcal.Sequence);
	this.file = ko.observable(Types.pString(oRawIcal.File));
	this.attendee = ko.observable(Types.pString(oRawIcal.Attendee));
	this.organizer = ko.observable(Types.pString(oRawIcal.Organizer));
	this.attendeeList = ko.observable(Types.pArray(oRawIcal.AttendeeList));
	this.attendeeListText = ko.computed(function () {
		if (this.attendeeList().length === 1 && this.attendeeList()[0] === this.attendee()) {
			return '';
		}
		return this.attendeeList().join(', ');
	}, this);
	this.summary = ko.observable(Types.pString(oRawIcal.Summary));
	this.type = ko.observable(Types.pString(oRawIcal.Type));
	this.location = ko.observable(Types.pString(oRawIcal.Location));
	// description shouldn't be HTML encoded because it prepared as HTML on server side
	this.description = ko.observable(Types.pString(oRawIcal.Description).replace(/\r/g, '').replace(/\n/g,"<br />"));
	this.when = ko.observable(Types.pString(oRawIcal.When));
	this.calendarId = ko.observable(Types.pString(oRawIcal.CalendarId));
	this.calendarId.subscribe(function () {
		// change oRawIcal so that the calendarId will be correct in a new tab
		this.oRawIcal.CalendarId = this.calendarId();
	}, this);

	CalendarCache.addIcal(this);

	this.icalType = ko.observable('');
	this.icalConfig = ko.observable('');
	this.type.subscribe(function () {
		// change oRawIcal so that the type will be correct in a new tab
		this.oRawIcal.Type = this.type();
		this.parseType();
	}, this);
	this.icalType.subscribe(function () {
		if (this.attendee() === '' && this.icalType() !== Enums.IcalType.Reply) {
			this.attendee(sAttendee);
		}
	}, this);
	this.isAppointmentActionInProgress = ko.observable(false);

	this.isRequestType = ko.computed(function () {
		return this.icalType() === Enums.IcalType.Request;
	}, this);
	this.isCancelType = ko.computed(function () {
		return this.icalType() === Enums.IcalType.Cancel;
	}, this);
	this.cancelDecision = ko.observable('');
	this.isReplyType = ko.computed(function () {
		return this.icalType() === Enums.IcalType.Reply;
	}, this);
	this.replyDecision = ko.observable('');
	this.isSaveType = ko.computed(function () {
		return this.icalType() === Enums.IcalType.Save;
	}, this);
	this.isJustSaved = ko.observable(false);

	this.isAccepted = ko.computed(function () {
		return this.icalConfig() === Enums.IcalConfig.Accepted;
	}, this);
	this.isDeclined = ko.computed(function () {
		return this.icalConfig() === Enums.IcalConfig.Declined;
	}, this);
	this.isTentative = ko.computed(function () {
		return this.icalConfig() === Enums.IcalConfig.Tentative;
	}, this);

	this.getCalendars = function () {
		return _.filter(CalendarCache.calendars(), function (oCalendar) {
			return !oCalendar.readonly;
		})
	};

	this.calendars = ko.observableArray(this.getCalendars());

	if (this.calendars().length === 0) {
		var fCalSubscription = CalendarCache.calendars.subscribe(function (val) {
			this.calendars(this.getCalendars());
			this.selectedCalendarId(Types.pString(oRawIcal.CalendarId));
			fCalSubscription.dispose();
		}, this);
	}

	this.selectedCalendarId = ko.observable(Types.pString(oRawIcal.CalendarId));

	this.chosenCalendarName = ko.computed(function () {
		var oFoundCal = null;

		if (this.calendarId() !== '')
		{
			oFoundCal = _.find(this.calendars(), function (oCal) {
				return oCal.id === this.calendarId();
			}, this);
		}

		return oFoundCal ? oFoundCal.name : '';
	}, this);

	this.calendarIsChosen = ko.computed(function () {
		return this.chosenCalendarName() !== '';
	}, this);

	this.visibleCalendarDropdown = ko.computed(function () {
		return !this.calendarIsChosen() && this.calendars().length > 1 && (this.isRequestType() || this.isSaveType());
	}, this);

	this.visibleCalendarName = ko.computed(function () {
		return this.calendarIsChosen();
	}, this);

	this.firstCalendarName = ko.computed(function () {
		return this.calendars()[0] ? this.calendars()[0].name : '';
	}, this);

	this.visibleFirstCalendarName = ko.computed(function () {
		return this.calendars().length === 1 && !this.calendarIsChosen();
	}, this);

	this.visibleCalendarRow = ko.computed(function () {
		return this.attendee() !== '' && (this.visibleCalendarDropdown() || this.visibleCalendarName() || this.visibleFirstCalendarName());
	}, this);

	this.visibleRequestButtons = ko.computed(function () {
		return this.isRequestType() && this.attendee() !== '';
	}, this);

	// animation of buttons turns on with delay
	// so it does not trigger when placing initial values
	this.animation = ko.observable(false);

	this.parseType();
}

CIcalModel.prototype.parseType = function ()
{
	var
		aTypeParts = this.type().split('-'),
		sType = aTypeParts.shift(),
		sFoundType = _.find(Enums.IcalType, function (sIcalType) {
			return sType === sIcalType;
		}, this),
		sConfig = aTypeParts.join('-'),
		sFoundConfig = _.find(Enums.IcalConfig, function (sIcalConfig) {
			return sConfig === sIcalConfig;
		}, this)
	;

	if (sType !== sFoundType)
	{
		sType = Enums.IcalType.Save;
	}
	this.icalType(sType);

	if (sConfig !== sFoundConfig)
	{
		sConfig = Enums.IcalConfig.NeedsAction;
	}
	this.icalConfig(sConfig);

	this.fillDecisions();
};

CIcalModel.prototype.fillDecisions = function ()
{
	this.cancelDecision(TextUtils.i18n('%MODULENAME%/INFO_CANCELED_APPOINTMENT', {'SENDER': App.currentAccountEmail()}));

	if (this.attendee() === '') {
		this.replyDecision('');
	} else {
		const textReplacer = {
			'ATTENDEE': this.attendee()
		};
		switch (this.icalConfig()) {
			case Enums.IcalConfig.Accepted:
				this.replyDecision(TextUtils.i18n('%MODULENAME%/INFO_ACCEPTED_APPOINTMENT', textReplacer));
				break;
			case Enums.IcalConfig.Declined:
				this.replyDecision(TextUtils.i18n('%MODULENAME%/INFO_DECLINED_APPOINTMENT', textReplacer));
				break;
			case Enums.IcalConfig.Tentative:
				this.replyDecision(TextUtils.i18n('%MODULENAME%/INFO_TENTATIVELY_ACCEPTED_APPOINTMENT', textReplacer));
				break;
		}
	}
};

CIcalModel.prototype.acceptAppointment = function ()
{
	if (!this.isAppointmentActionInProgress()) {
		this.calendarId(this.selectedCalendarId());
		this.changeAndSaveConfig(Enums.IcalConfig.Accepted);
	}
};

CIcalModel.prototype.tentativeAppointment = function ()
{
	if (!this.isAppointmentActionInProgress()) {
		this.calendarId(this.selectedCalendarId());
		this.changeAndSaveConfig(Enums.IcalConfig.Tentative);
	}
};

CIcalModel.prototype.declineAppointment = function ()
{
	if (!this.isAppointmentActionInProgress()) {
		this.calendarId('');
		this.selectedCalendarId('');
		this.changeAndSaveConfig(Enums.IcalConfig.Declined);
	}
};

/**
 * @param {string} sConfig
 */
CIcalModel.prototype.changeAndSaveConfig = function (sConfig)
{
	if (this.icalConfig() !== sConfig)
	{
		if (sConfig !== Enums.IcalConfig.Declined || this.icalConfig() !== Enums.IcalConfig.NeedsAction)
		{
			this.showChanges();
		}

		this.changeConfig(sConfig);
		this.setAppointmentAction();
	}
};

/**
 * @param {string} sConfig
 */
CIcalModel.prototype.changeConfig = function (sConfig)
{
	this.type(this.icalType() + '-' + sConfig);
	if (MainTab)
	{
		MainTab.markIcalTypeByFile(this.file(), this.type(), this.cancelDecision(),
									this.replyDecision(), this.calendarId(), this.selectedCalendarId());
	}
	else
	{
		CalendarCache.markIcalTypeByFile(this.file(), this.type(), this.cancelDecision(),
									this.replyDecision(), this.calendarId(), this.selectedCalendarId());
	}
};

CIcalModel.prototype.markNeededAction = function ()
{
	this.calendarId('');
	this.selectedCalendarId('');
	this.changeConfig(Enums.IcalConfig.NeedsAction);
};

CIcalModel.prototype.markNotSaved = function ()
{
	this.calendarId('');
	this.selectedCalendarId('');
};

CIcalModel.prototype.markTentative = function ()
{
	this.changeConfig(Enums.IcalConfig.Tentative);
};

CIcalModel.prototype.markAccepted = function ()
{
	this.changeConfig(Enums.IcalConfig.Accepted);
};

CIcalModel.prototype.setAppointmentAction = function ()
{
	this.isAppointmentActionInProgress(true);
	Ajax.send(
		'SetAppointmentAction',
		{
			'AppointmentAction': this.icalConfig(),
			'CalendarId': this.selectedCalendarId(),
			'File': this.file(),
			'Attendee': this.attendee()
		},
		this.onSetAppointmentActionResponse,
		this,
		'CalendarMeetingsPlugin'
	);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CIcalModel.prototype.onSetAppointmentActionResponse = function (oResponse, oRequest)
{
	this.isAppointmentActionInProgress(false);
	if (!oResponse.Result)
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
	}
	else
	{
		this.markChanges();
	}
};

CIcalModel.prototype.addEvents = function ()
{
	Ajax.send('AddEventsFromFile', {
		'CalendarId': this.selectedCalendarId(),
		'File': this.file()
	}, this.onAddEventsFromFileResponse, this);

	this.isJustSaved(true);
	this.calendarId(this.selectedCalendarId());

	setTimeout(_.bind(function () {
		this.isJustSaved(false);
	}, this), 20000);

	this.showChanges();
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CIcalModel.prototype.onAddEventsFromFileResponse = function (oResponse, oRequest)
{
	if (!oResponse.Result)
	{
		this.isJustSaved(false);
		this.calendarId('');
		Api.showErrorByCode(oResponse);
	}
	else
	{
		if (_.isArray(oResponse.Result) && oResponse.Result.length > 0)
		{
			this.uid(oResponse.Result[0]);
		}
		this.markChanges();
	}
};

/**
 * @param {string} sEmail
 */
CIcalModel.prototype.updateAttendeeStatus = function (sEmail)
{
	if (this.icalType() === Enums.IcalType.Cancel || this.icalType() === Enums.IcalType.Reply)
	{
		Ajax.send('UpdateAttendeeStatus',
			{
				'File': this.file(),
				'FromEmail': sEmail
			},
			this.onUpdateAttendeeStatusResponse,
			this,
			'CalendarMeetingsPlugin'
		);
	}
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CIcalModel.prototype.onUpdateAttendeeStatusResponse = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		if (typeof oResponse.Result === 'string') {
			this.type(oResponse.Result);
		}
		this.showChanges();
		this.markChanges();
	}
};

CIcalModel.prototype.showChanges = function ()
{
	if (HeaderItemView)
	{
		HeaderItemView.recivedAnim(true);
	}
};

CIcalModel.prototype.markChanges = function ()
{
	if (MainTab)
	{
		MainTab.markCalendarChanged();
	}
	else
	{
		CalendarCache.calendarChanged(true);
	}
};

module.exports = CIcalModel;
