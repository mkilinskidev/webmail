'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	moment = require('moment'),
	
	DateUtils = require('%PathToCoreWebclientModule%/js/utils/Date.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
	
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	AlertPopup = require('%PathToCoreWebclientModule%/js/popups/AlertPopup.js'),
	ConfirmPopup = require('%PathToCoreWebclientModule%/js/popups/ConfirmPopup.js'),
	
	CalendarUtils = require('modules/%ModuleName%/js/utils/Calendar.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js'),
	CalendarCache = require('modules/%ModuleName%/js/Cache.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js'),

	CSimpleEditableView = require('modules/%ModuleName%/js/views/CSimpleEditableView.js'),
	CLinkPopupEditableView = require('modules/%ModuleName%/js/views/CLinkPopupEditableView.js')
;

/**
 * @constructor
 */
function CEditEventPopup()
{
	CAbstractPopup.call(this);
	
	this.modified = false;
	this.isPublic = App.isPublic();
	this.isEditable = ko.observable(false);
	this.isEditableReminders = ko.observable(false);
	this.selectedCalendarIsShared = ko.observable(false);
	this.selectedCalendarIsEditable = ko.observable(false);
	this.selectedCalendarIsSubscribed = ko.observable(false);

	this.callbackSave = null;
	this.callbackDelete = null;
	this.timeFormatMoment = 'HH:mm';
	this.dateFormatMoment = 'MM/DD/YYYY';
	this.dateFormatDatePicker = 'mm/dd/yy';
	this.ampmTimeFormat = ko.observable(false);

	this.calendarId = ko.observable(null);
	this.id = ko.observable(null);
	this.uid = ko.observable(null);
	this.recurrenceId = ko.observable(null);
	this.allEvents = ko.observable(Enums.CalendarEditRecurrenceEvent.AllEvents);

	this.isMyEvent = ko.observable(false);

	this.startDom = ko.observable(null);
	this.endDom = ko.observable(null);
	this.repeatEndDom = ko.observable(null);

	this.yearlyDayText = ko.observable('');
	this.monthlyDayText = ko.observable('');

	this.subject = ko.observable('').extend({'disableLinebreaks': true});

	this.linkPopupEditableView = new CLinkPopupEditableView();
	this.descriptionView = new CSimpleEditableView({
		isEditableObservable: this.isEditable,
		autosizeTriggerObservable: this.autosizeTrigger,
		linkPopupEditableView: this.linkPopupEditableView,
		allowEditLinks: true,
		placeholderText: TextUtils.i18n('%MODULENAME%/LABEL_DESCRIPTION')
	});
	this.locationView = new CSimpleEditableView({
		isEditableObservable: this.isEditable,
		autosizeTriggerObservable: this.autosizeTrigger,
		linkPopupEditableView: this.linkPopupEditableView,
		allowEditLinks: false,
		placeholderText: TextUtils.i18n('%MODULENAME%/LABEL_LOCATION')
	});

	this.lockSelectStartEndDate = ko.observable(false);
	
	this.startDate = ko.observable('');
	this.startTime = ko.observable('');
	this.startTime.subscribe(function () {
		this.selectStartDate();
	}, this);
	this.allDay = ko.observable(false);
	this.allDay.subscribe(function () {
		if (!this.allDay())
		{
			this.setActualTime();
		}
	}, this);

	this.endDate = ko.observable('');
	this.endTime = ko.observable('');
	this.endTime.subscribe(function () {
		this.selectEndDate();
	}, this);

	this.repeatEndDate = ko.observable('');

	this.isEvOneDay = ko.observable(true);
	this.isEvOneTime = ko.observable(true);

	this.isRepeat = ko.observable(false);

	this.allowSetPrivateEvent = ko.observable(false);
	this.isPrivateEvent = ko.observable(false);

	this.repeatPeriodOptions = ko.observableArray(this.getDisplayedPeriods());
	this.repeatWeekIntervalOptions = ko.observableArray([1, 2, 3, 4]);
	this.defaultAlarms = ko.observableArray([5, 10, 15, 30, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 1080, 1440, 2880, 4320, 5760, 10080, 20160]);
	this.alarmOptions = ko.observableArray([]);
	this.timeOptions = ko.observableArray(CalendarUtils.getTimeListStepHalfHour((UserSettings.timeFormat() !== Enums.TimeFormat.F24) ? 'hh:mm A' : 'HH:mm'));
	UserSettings.timeFormat.subscribe(function () {
		this.timeOptions(CalendarUtils.getTimeListStepHalfHour((UserSettings.timeFormat() !== Enums.TimeFormat.F24) ? 'hh:mm A' : 'HH:mm'));
	}, this);

	this.displayedAlarms = ko.observableArray([]);
	this.displayedAlarms.subscribe(function () {
		this.disableAlarms();
	}, this);

	this.excluded = ko.observable(false);
	this.repeatPeriod = ko.observable(Enums.CalendarRepeatPeriod.None);
	this.repeatPeriod.subscribe(function (iRepeatPeriod) {
		this.setDayOfWeek();
		this.isRepeat(!!iRepeatPeriod);
	}, this);
	this.repeatInterval = ko.observable(1);
	this.repeatCount = ko.observable(null);
	this.repeatWeekNum = ko.observable(null);

	this.weekMO = ko.observable(false);
	this.weekTU = ko.observable(false);
	this.weekWE = ko.observable(false);
	this.weekTH = ko.observable(false);
	this.weekFR = ko.observable(false);
	this.weekSA = ko.observable(false);
	this.weekSU = ko.observable(false);

	this.always = ko.observable(1);

	this.appointment = ko.observable(false);
	this.attendees = ko.observableArray([]);
	this.attenderStatus = ko.observable(0);
	this.owner = ko.observable('');
	this.organizer = ko.observable('');

	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.whomAnimate = ko.observable('');
	this.guestAutocompleteItem = ko.observable(null);
	this.guestAutocomplete = ko.observable('');
	this.guestEmailFocus = ko.observable(false);
	this.guestAutocomplete.subscribe(function (sItem) {
		if (sItem === '')
		{
			this.guestAutocompleteItem(null);
		}
	}, this);

	this.condition = ko.observable('');

	this.autosizeTrigger = ko.observable(true);

	this.calendars = null;

	this.calendarsList = ko.observableArray([]);
	this.calendarColor = ko.observable('');
	this.selectedCalendarId = ko.observable('');
	this.selectedCalendarName = ko.observable('');
	this.selectedCalendarId.subscribe(function (sValue) {
		if (sValue)
		{
			var oCalendar = this.calendars.getCalendarById(sValue);
			
			this.owner(oCalendar.owner());
			this.selectedCalendarName(oCalendar.name());
			this.selectedCalendarIsShared(oCalendar.isShared());
			this.selectedCalendarIsEditable(oCalendar.isEditable() && !oCalendar.subscribed());
			this.selectedCalendarIsSubscribed(oCalendar.subscribed());
			this.changeCalendarColor(sValue);

			// isShared - only if shared to me
			// isSharedToAll - shared to me and shared by me
			// shares - shared to me and shared by me
			this.allowSetPrivateEvent(Settings.AllowPrivateEvents && !oCalendar.isShared() && !oCalendar.isSharedToAll());
		}
	}, this);
	
	this.subjectFocus = ko.observable(false);

	this.dateEdit = ko.observable(false);
	this.repeatEdit = ko.observable(false);
	this.guestsEdit = ko.observable(false);
	this.isEditForm = ko.computed(function () {
		return !!this.id();
	}, this);

	this.callbackAttendeeActionDecline = null;
	
	this.additionalButtonControllers = ko.observableArray([]);
	App.broadcastEvent('%ModuleName%::RegisterEditEventController', {
		register: (controller, place) => {
			if (place === 'AdditionalButton') {
				this.additionalButtonControllers.push(controller);
			}
		},
		view: this
	});


	this.bAllowAppointments = Settings.AllowAppointments;
	this.bAllowTasks = Settings.AllowTasks;

	this.eventType = ko.observable('VEVENT');
	this.status = ko.observable(false);
	this.isTask = ko.observable(false);
	this.isTaskApp = ko.observable(false);
	this.withDate = ko.observable(true);

	this.isTask.subscribe(function(value) {
		this.eventType(value ? 'VTODO' : 'VEVENT');
	}, this);

	this.allChanges = ko.computed(function () {
		this.subject();
		this.descriptionView.dataHtml();
		this.locationView.dataHtml();
		this.isRepeat();
		this.allDay();
		this.repeatPeriod();
		this.repeatInterval();
		this.repeatCount();
		this.repeatWeekNum();
		this.startDate();
		this.startTime();
		this.endDate();
		this.endTime();
		this.repeatEndDate();
		this.displayedAlarms();
		this.weekMO();
		this.weekTU();
		this.weekWE();
		this.weekTH();
		this.weekFR();
		this.weekSA();
		this.weekSU();
		this.always();
		this.attendees();
		this.selectedCalendarId();
		this.status();
		this.isTask();
		this.withDate();
		this.isPrivateEvent();
		
		this.modified = true;
	}, this);

	this.aReminderPhrase = TextUtils.i18n('%MODULENAME%/INFO_REMINDER').split('%');

	this.isAppointmentButtonsVisible = ko.observable(false);
}

_.extendOwn(CEditEventPopup.prototype, CAbstractPopup.prototype);

CEditEventPopup.prototype.PopupTemplate = '%ModuleName%_EditEventPopup';

/**
 * @param {Object} oElement
 * @param {Function} fSelect
 */
CEditEventPopup.prototype.createDatePickerObject = function (oElement, fSelect)
{
	$(oElement).datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		monthNames: DateUtils.getMonthNamesArray(),
		dayNamesMin: TextUtils.i18n('COREWEBCLIENT/LIST_DAY_NAMES_MIN').split(' '),
		nextText: '',
		prevText: '',
		firstDay: Settings.WeekStartsOn,
		showOn: 'both',
		buttonText: ' ',
		dateFormat: this.dateFormatDatePicker,
		onSelect: fSelect
	});

	$(oElement).mousedown(function() {
		$('#ui-datepicker-div').toggle();
	});
};

CEditEventPopup.prototype.initializeDatePickers = function ()
{
	this.createDatePickerObject(this.startDom(), this.selectStartDate.bind(this));
	this.createDatePickerObject(this.endDom(), this.selectEndDate.bind(this));
	this.createDatePickerObject(this.repeatEndDom(), function (sNewValue) {
		this.repeatEndDate(sNewValue);
	}.bind(this));

	this.startDom().datepicker('option', 'dateFormat', this.dateFormatDatePicker);
	this.endDom().datepicker('option', 'dateFormat', this.dateFormatDatePicker);
	this.repeatEndDom().datepicker('option', 'dateFormat', this.dateFormatDatePicker);
};

/**
 * @param {Object} oParameters
 */
CEditEventPopup.prototype.onOpen = function (oParameters)
{
	this.linkPopupEditableView.onOpen();

	var
		owner = App.getUserPublicId(),
		oEndMomentDate = null,
		oStartMomentDate = null,
		sAttendee = '',
		oCalendar = null,
		sCalendarOwner = '',
		oToday = moment()
	;

	this.withDate(!!oParameters.Start && !!oParameters.End);

	if (!oParameters.Start && !oParameters.End)
	{
		if (oToday.minutes() > 30)
		{
			oToday.add(60 - oToday.minutes(), 'minutes');
		}
		else
		{
			oToday.minutes(30);
		}
		oToday
			.seconds(0)
			.milliseconds(0);	
		oParameters.Start = oToday;
		oParameters.End = oToday.clone().add(30, 'minutes');
	}
	oEndMomentDate = oParameters.End ? oParameters.End.clone() : null;
	oStartMomentDate = oParameters.Start ? oParameters.Start.clone() : null;
	
	this.iDiffInMinutes = null;

	this.eventType(oParameters.Type || 'VEVENT');
	this.isTask(this.eventType() === 'VTODO');

	this.calendarId(oParameters.SelectedCalendar);
	this.calendars = oParameters.Calendars;

	oCalendar = this.calendars.getCalendarById(this.calendarId());
	if (oCalendar)
	{
		sCalendarOwner = oCalendar.owner();
	}

	this.callbackSave = oParameters.CallbackSave;
	this.callbackDelete = oParameters.CallbackDelete;
	this.callbackAttendeeActionDecline = oParameters.CallbackAttendeeActionDecline;

	this.timeFormatMoment = oParameters.TimeFormat;
	this.dateFormatMoment = Utils.getDateFormatForMoment(oParameters.DateFormat);
	this.dateFormatDatePicker = CalendarUtils.getDateFormatForDatePicker(oParameters.DateFormat);
	
	this.ampmTimeFormat(UserSettings.timeFormat() !== Enums.TimeFormat.F24);
	
	this.initializeDatePickers();
	
	this.allDay(oParameters.AllDay);
	
	if (oStartMomentDate)
	{
		this.setStartDate(oStartMomentDate, true);
		this.startTime(oStartMomentDate.format(this.timeFormatMoment));
	}
	if (oEndMomentDate && this.allDay())
	{
		oEndMomentDate.subtract(1, 'days');
	}
	if (!oEndMomentDate && oStartMomentDate)
	{
		oEndMomentDate = oStartMomentDate;
	}
	if (oEndMomentDate)
	{
		this.setEndDate(oEndMomentDate, true);
		this.endTime(oEndMomentDate.format(this.timeFormatMoment));
	}

	if (this.calendars)
	{
		this.calendarsList(
			_.filter(
				this.calendars.collection(),
				function(oItem){ 
					return oItem.isEditable() && !oItem.subscribed(); 
				}
			)
		);
	}
	this.selectedCalendarId(oParameters.SelectedCalendar);
	this.selectedCalendarId.valueHasMutated();

	this.changeCalendarColor(this.selectedCalendarId());
	
	// parameters for event editing only (not for creating)
	this.id(oParameters.ID || null);
	this.uid(oParameters.Uid || null);
	this.recurrenceId(oParameters.RecurrenceId || null);
	
	this.subject(oParameters.Subject || '');
	
	this.status(oParameters.Status || false);
	this.locationView.setPlain(oParameters.Location);
	this.descriptionView.setHtml(oParameters.Description);
	this.allEvents(oParameters.AllEvents || Enums.CalendarEditRecurrenceEvent.AllEvents);
	
	this.isTaskApp(oParameters.IsTaskApp || false);

	this.populateAlarms(oParameters.Alarms);

	this.organizer(Types.pString(oParameters.Organizer));

	this.appointment(oParameters.Appointment);

	this.attendees(oParameters.Attendees || []);

	if ($.isFunction(App.getAttendee))
	{
		sAttendee = App.getAttendee(this.attendees());
	}

	this.isMyEvent(sAttendee !== owner && (owner === oParameters.Owner || owner === sCalendarOwner));
	this.editableSwitch(this.selectedCalendarIsShared(), this.selectedCalendarIsEditable(), this.isMyEvent(), this.selectedCalendarIsSubscribed());

	this.setCurrentAttenderStatus(sAttendee, oParameters.Attendees || []);

	this.owner(oParameters.Owner || owner);

	this.guestAutocomplete('');

	this.excluded(oParameters.Excluded || false);
	this.repeatRuleParse(oParameters.RRule || null);

	if (this.id() === null)
	{
		this.subjectFocus(true);
	}

	this.autosizeTrigger.notifySubscribers(true);
	
	this.modified = false;

	this.isAppointmentButtonsVisible(this.appointment() && this.selectedCalendarIsEditable() && _.find(this.attendees(), function(oAttendee){ return oAttendee.email === owner; }));

	this.isPrivateEvent(!!oParameters.IsPrivate);
};

/**
 * @param {string} sId
 */
CEditEventPopup.prototype.changeCalendarColor = function (sId)
{
	if ($.isFunction(this.calendars.getCalendarById))
	{
		var oCalendar = this.calendars.getCalendarById(sId);
		if (oCalendar)
		{
			this.calendarColor('');
			this.calendarColor(oCalendar.color());
		}
	}
};

CEditEventPopup.prototype.onIsTaskClick = function ()
{
	this.eventType(this.eventType() === 'VTODO' ? 'VEVENT' : 'VTODO');
};

CEditEventPopup.prototype.onSaveClick = function ()
{
	if (this.subject() === '')
	{
		Popups.showPopup(AlertPopup, [TextUtils.i18n('%MODULENAME%/ERROR_SUBJECT_BLANK'),
			_.bind(function () {
				this.subjectFocus(true);
			}, this)]);
	}
	else
	{
		if (this.callbackSave)
		{
			var
				iPeriod = Types.pInt(this.repeatPeriod()),
				sDate = '',
				iUnixDate = null,
				iInterval = 0,
				oStart = moment(this.getDateTime(this.startDom(), this.startTime())),
				oEnd = moment(this.getDateTime(this.endDom(), this.endTime())),
				oEventData = {
					calendarId: this.calendarId(),
					newCalendarId: this.selectedCalendarId(),
					id: this.id(),
					uid: this.uid(),
					recurrenceId: this.recurrenceId(),
					allEvents:  this.allEvents(),
					subject: this.subject(),
					title: CalendarUtils.getTitleForEvent(this.subject(), this.descriptionView.getPlain()),
					allDay: this.allDay(),
					location: this.locationView.getPlain(),
					description: this.descriptionView.getHtml(),
					alarms: this.getAlarmsArray(this.displayedAlarms()),
					attendees: this.attendees(),
					owner: this.owner(),
					modified: this.modified,
					type: this.eventType(),
					status: this.status(),
					withDate: this.withDate(),
					isPrivate: this.allowSetPrivateEvent() && this.isPrivateEvent()
				},
				iAlways = Types.pInt(this.always())
			;
			
			if (this.allDay())
			{
				oEnd.add(1, 'days');
			}
			
			oEventData.start = oStart;
			oEventData.end = oEnd;

			if (iPeriod)
			{
				sDate = this.repeatEndDom().datepicker('getDate');
				iUnixDate = sDate ? moment(sDate).unix() : null;
				iInterval = this.repeatInterval();

				if (iPeriod === Enums.CalendarRepeatPeriod.Daily && iAlways === Enums.CalendarAlways.Disable)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 2,
						interval: 1,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Weekly && iAlways === Enums.CalendarAlways.Disable)
				{
					this.setDayOfWeek();

					oEventData.rrule = {
						byDays: this.getDays(),
						count: null,
						end: 2,
						interval: iInterval,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Monthly)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 0,
						interval: 1,
						period: iPeriod,
						until: null,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Yearly)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 0,
						interval: 1,
						period: iPeriod,
						until: null,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Daily && iAlways === Enums.CalendarAlways.Enable)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 3,
						interval: 1,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Weekly && iAlways === Enums.CalendarAlways.Enable)
				{
					this.setDayOfWeek();

					oEventData.rrule = {
						byDays: this.getDays(),
						count: null,
						end: 3,
						interval: iInterval,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
			}

			this.callbackSave(oEventData);
		}

		this.closePopup();
	}
};

CEditEventPopup.prototype.onEscHandler = function ()
{
	if (this.dateEdit())
	{
		this.dateEdit(false);
	}
	else
	{
		this.closePopup();
	}
};

CEditEventPopup.prototype.onClose = function ()
{
	this.linkPopupEditableView.onClose();
	this.hideAll();
	this.cleanAll();
};

CEditEventPopup.prototype.hideAll = function ()
{
	this.dateEdit(false);
	this.repeatEdit(false);
	this.guestsEdit(false);
};

CEditEventPopup.prototype.cleanAll = function ()
{
	if (this.isTask())
	{
		this.withDate(false);
	}
	else
	{
		this.withDate(true);
	}
	this.isTask(false);
	this.subject('');
	this.descriptionView.setHtml('');
	this.locationView.setPlain('');
	this.isRepeat(false);
	this.allDay(false);
	this.repeatPeriod(Enums.CalendarRepeatPeriod.None);
	this.repeatInterval(1);
	this.repeatCount(null);
	this.repeatWeekNum(null);
	this.startDate('');
	this.startTime('');
	this.endDate('');
	this.endTime('');
	this.repeatEndDate('');
	this.displayedAlarms([]);
	this.weekMO(false);
	this.weekTU(false);
	this.weekWE(false);
	this.weekTH(false);
	this.weekFR(false);
	this.weekSA(false);
	this.weekSU(false);
	this.attendees([]);
	this.always(1);
	this.selectedCalendarId('');
	this.isPrivateEvent(false);

	this.attendees([]);
};

CEditEventPopup.prototype.onDeleteClick = function ()
{
	if (this.callbackDelete)
	{
		var
			oEventData = {
				calendarId: this.selectedCalendarId(),
				id: this.id(),
				uid: this.uid(),
				recurrenceId: this.recurrenceId(),
				allEvents:  this.allEvents(),
				subject: this.subject(),
				title: CalendarUtils.getTitleForEvent(this.subject(), this.descriptionView.getPlain()),
				start: moment(this.getDateTime(this.startDom(), this.startTime())),
				end: moment(this.getDateTime(this.endDom(), this.endTime())),
				allDay: this.allDay(),
				location: this.locationView.getPlain(),
				description: this.descriptionView.getHtml()
			}
		;

		this.callbackDelete(oEventData);
	}
	this.closePopup();
};

/**
 * @param {Object} oModel
 * @param {Object} oEv
 */
CEditEventPopup.prototype.showDates = function (oModel, oEv)
{
	oEv.stopPropagation();
	this.dateEdit(!this.dateEdit());
};

CEditEventPopup.prototype.showGuests = function ()
{
	if (this.attendees().length > 0)
	{
		var
			sConfirm = TextUtils.i18n('%MODULENAME%/CONFIRM_REMOVE_ALL_ATTENDEES'),
			fAction = _.bind(function (bResult) {
				if (bResult)
				{
					this.guestsEdit(false);
					this.guestEmailFocus(false);
					this.attendees([]);
				}
			}, this)
		;

		Popups.showPopup(ConfirmPopup, [sConfirm, fAction]);

	}
	else
	{
		this.guestsEdit(!this.guestsEdit());
		this.guestEmailFocus(!this.guestEmailFocus());
	}
};

CEditEventPopup.prototype.onAddGuestClick = function ()
{
	var
		oGuestAutocompleteItem = this.guestAutocompleteItem(),
		sGuestAutocomplete = this.guestAutocomplete(),
		oItem = oGuestAutocompleteItem || {name: '', email: sGuestAutocomplete},
		bIsInvited = _.any(this.attendees(), function (oEl) {
			return oEl.email === oItem.email;
		})
	;

	if (oItem.email === '')
	{
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_EMAIL_BLANK'));
	}
	else if (oItem.email === this.owner())
	{
		this.recivedAnim(true);
	}
	else if (bIsInvited)
	{
		this.recivedAnim(true);
	}
	else
	{
		this.attendees.push(
			{
				status: 0,
				name: oItem.name,
				email: oItem.email
			}
		);
	}

	this.whomAnimate(oItem.email);
	this.guestAutocomplete('');

	this.guestEmailFocus(true);
};

/**
 * @param {Array} aAlarms
 */
CEditEventPopup.prototype.populateAlarms = function (aAlarms)
{
	if (aAlarms)
	{
		this.alarmOptions(this.getDisplayedAlarms(_.union(this.defaultAlarms(), aAlarms)));
		this.displayedAlarms(this.getDisplayedAlarms(aAlarms));
	}
	else
	{
		this.alarmOptions(this.getDisplayedAlarms(this.defaultAlarms()));
	}
};

/**
 * @param {Array} aMinutes
 */
CEditEventPopup.prototype.getDisplayedAlarms = function (aMinutes)
{
	var aDisplayedAlarms = [];

	if (aMinutes)
	{
		_.each(aMinutes, function (iMinutes, iIdx) {
			var
				koAlarm = this['alarm' + iMinutes] = ko.observable(iMinutes),
				sText = ''
			;
			
			koAlarm.subscribe(function () {
				//alarm observable value not actual
				this.disableAlarms();
				this.modified = true;
			}, this);

			if (iMinutes > 0 && iMinutes < 60)
			{
				sText = (TextUtils.i18n('COREWEBCLIENT/LABEL_MINUTES_PLURAL', {'COUNT': iMinutes}, null, iMinutes));
			}
			else if (iMinutes >= 60 && iMinutes < 1440)
			{
				sText = (TextUtils.i18n('%MODULENAME%/LABEL_HOURS_PLURAL', {'COUNT': iMinutes / 60}, null, iMinutes / 60));
			}
			else if (iMinutes >= 1440 && iMinutes < 10080)
			{
				sText = (TextUtils.i18n('%MODULENAME%/LABEL_DAYS_PLURAL', {'COUNT': iMinutes / 1440}, null, iMinutes / 1440));
			}
			else
			{
				sText = (TextUtils.i18n('%MODULENAME%/LABEL_WEEKS_PLURAL', {'COUNT': iMinutes / 10080}, null, iMinutes / 10080));
			}

			aDisplayedAlarms.push({
				'value': iMinutes,
				'alarm': koAlarm,
				'text': sText,
				'isDisabled': false
			});

		}, this);
	}

	return _.sortBy(aDisplayedAlarms, function(oAlarm){ return oAlarm.value; });
};

CEditEventPopup.prototype.getDisplayedPeriods = function ()
{
	return [
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_REPEAT_NEVER'),
			value: 0
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_REPEAT_DAILY'),
			value: 1
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_REPEAT_WEEKLY'),
			value: 2
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_REPEAT_MONTHLY'),
			value: 3
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_REPEAT_YEARLY'),
			value: 4
		}
	];
};

/**
 * @param {Array} aDisplayedAlarms
 */
CEditEventPopup.prototype.getAlarmsArray = function (aDisplayedAlarms)
{
	var aAlarms = [];

	_.each(aDisplayedAlarms, function (oAlarm, iIdx) {
		aAlarms.push(oAlarm.alarm());
	}, this);

	return _.sortBy(aAlarms, function (num) {return -num;});
};

CEditEventPopup.prototype.addFirstAlarm = function ()
{
	if (!this.displayedAlarms().length)
	{
		this.displayedAlarms(this.getDisplayedAlarms([this.alarmOptions()[0].value]));
	}
	else
	{
		var
			sConfirm = TextUtils.i18n('%MODULENAME%/CONFIRM_REMOVE_ALL_ALARMS'),
			fAction = _.bind(function (bResult) {
				if (bResult)
				{
					this.displayedAlarms.removeAll();
				}
			}, this)
		;

		Popups.showPopup(ConfirmPopup, [sConfirm, fAction]);
	}
};

CEditEventPopup.prototype.addAlarm = function ()
{
	var
		oDisplayedAlarm,
		aSortedAlarms,
		iMinutes = 0
	;

	aSortedAlarms = _.sortBy(this.displayedAlarms(), function (oAlarm) {return oAlarm.alarm();});

	_.each(aSortedAlarms, function (oAlarm) {

		var nAlarmMinutes = oAlarm.alarm();

		if (nAlarmMinutes !== 5 && iMinutes <= 5)
		{
			iMinutes = 5;
		}
		else if (nAlarmMinutes !== 10 && iMinutes <= 10)
		{
			iMinutes = 10;
		}
		else if (nAlarmMinutes !== 15 && iMinutes <= 15)
		{
			iMinutes = 15;
		}
		else if (nAlarmMinutes !== 30 && iMinutes <= 30)
		{
			iMinutes = 30;
		}
		else if (nAlarmMinutes !== 1440 && iMinutes <= 1440)
		{
			iMinutes = 1440;
		}
	});

	oDisplayedAlarm = this.getDisplayedAlarms([iMinutes])[0];

	this['alarm' + iMinutes] = ko.observable(iMinutes);
	this.displayedAlarms.push(oDisplayedAlarm);
};

/**
 * @param {Object} oItem
 */
CEditEventPopup.prototype.removeAlarm = function (oItem)
{
	this.displayedAlarms.remove(oItem);
};

/**
 * @param {Object} oItem
 */
CEditEventPopup.prototype.removeGuest = function (oItem)
{
	this.attendees.remove(oItem);
};

CEditEventPopup.prototype.disableAlarms = function ()
{
	_.each(this.alarmOptions(), function (oAlarm, iIdx) {
		oAlarm.isDisabled = _.any(this.displayedAlarms(), function (oItem) {
			return oItem.alarm() === oAlarm.value;
		});
	}, this);

	this.alarmOptions.valueHasMutated();
};

/**
 * @param {object} oRequest
 * @param {function} fResponse
 */
CEditEventPopup.prototype.autocompleteCallback = function (oRequest, fResponse)
{
	const
		suggestParameters = {
			exceptEmail: this.owner()
		},
		autocompleteCallback = ModulesManager.run(
			'ContactsWebclient', 'getSuggestionsAutocompleteCallback', [suggestParameters]
		)
	;

	if (_.isFunction(autocompleteCallback))
	{
		this.guestAutocompleteItem(null);
		autocompleteCallback(oRequest, fResponse);
	}
};

/**
 * @param {Object} oRepeatRule
 */
CEditEventPopup.prototype.repeatRuleParse = function (oRepeatRule)
{
	var allEvents = this.allEvents();

	this.repeatEndDom().datepicker('option', 'minDate', this.getDateTime(this.endDom()));

	if(oRepeatRule && allEvents === Enums.CalendarEditRecurrenceEvent.AllEvents)
	{
		if (oRepeatRule.until)
		{
			var 
				localUntill = new Date(oRepeatRule.until * 1000),
				utcUntil = new Date(localUntill.getUTCFullYear(), localUntill.getUTCMonth(), localUntill.getUTCDate(),  localUntill.getUTCHours(), localUntill.getUTCMinutes(), localUntill.getUTCSeconds());
			;

			this.repeatEndDom().datepicker('setDate', utcUntil);
		}

		if (oRepeatRule.byDays.length)
		{
			_.each(oRepeatRule.byDays, function (sItem) {
				this['week' + sItem](true);
			}, this);
		}
		this.repeatPeriod(oRepeatRule.period);
		this.repeatInterval(oRepeatRule.interval);
		this.repeatCount(oRepeatRule.count);
		this.repeatWeekNum(oRepeatRule.weekNum);
		this.always(oRepeatRule.end === 3 ? 1 : 0);
	}
};

CEditEventPopup.prototype.getDays = function ()
{
	var aDays = [];

	if (this.weekMO()) {aDays.push('MO');}
	if (this.weekTU()) {aDays.push('TU');}
	if (this.weekWE()) {aDays.push('WE');}
	if (this.weekTH()) {aDays.push('TH');}
	if (this.weekFR()) {aDays.push('FR');}
	if (this.weekSA()) {aDays.push('SA');}
	if (this.weekSU()) {aDays.push('SU');}

	return aDays;
};

CEditEventPopup.prototype.onMainPanelClick = function ()
{
	if (this.dateEdit())
	{
		this.dateEdit(false);
	}
};

/**
 * @param {string} sDate
 */
CEditEventPopup.prototype.getDateWithoutYearIfMonthWord = function (sDate)
{
	var
		aDate = sDate.split(' '),
		oNowMoment = moment(),
		oNowYear = oNowMoment.format('YYYY')
	;
	
	if (aDate.length === 3 && oNowYear === aDate[2])
	{
		return aDate[0] + ' ' + aDate[1];
	}
	return sDate;
};

/**
 * @param {Object} oMomentDate
 * @param {boolean} bChangeInDatepicker
 */
CEditEventPopup.prototype.setStartDate = function (oMomentDate, bChangeInDatepicker)
{
	if (bChangeInDatepicker)
	{
		this.startDom().datepicker('setDate', oMomentDate.toDate());
	}
	this.startDate(this.getDateWithoutYearIfMonthWord($(this.startDom()).val()));
	
	this.yearlyDayText(TextUtils.i18n('%MODULENAME%/LABEL_REPEAT_YEARLY_DAYMONTH', {'DAYMONTH': oMomentDate.format(this.getDateMonthFormat())}));
	this.monthlyDayText(TextUtils.i18n('%MODULENAME%/LABEL_REPEAT_MONTHLY_DAY', {'DAY': oMomentDate.format('DD')}));
};

CEditEventPopup.prototype.selectStartDate = function ()
{
	if (!this.lockSelectStartEndDate() && this.startDate() && this.endDate())
	{
		this.lockSelectStartEndDate(true);
		
		var
			oStartDate = this.getDateTime(this.startDom(), this.startTime()),
			oStartMomentDate = moment(oStartDate),
			
			oEndDate = this.getDateTime(this.endDom(), this.endTime()),
			oEndMomentDate = moment(oEndDate)
		;
		
		if (Types.isNumber(this.iDiffInMinutes))
		{
			oEndMomentDate = oStartMomentDate.clone().add(this.iDiffInMinutes, 'minutes');
			oEndDate = oEndMomentDate.toDate();
			this.setEndDate(oEndMomentDate, true);
			this.endTime(oEndMomentDate.format(this.timeFormatMoment));
		}
		
		if (oEndMomentDate.diff(oStartMomentDate, 'minutes') < 0)
		{
			this.setEndDate(oStartMomentDate, true);
			this.endTime(oStartMomentDate.format(this.timeFormatMoment));
		}

		this.isEvOneDay(oEndMomentDate.diff(oStartMomentDate, 'days') === 0);
		this.isEvOneTime(oEndMomentDate.diff(oStartMomentDate, 'minutes') === 0);
		
		this.setStartDate(oStartMomentDate, false);
		this.startTime(oStartMomentDate.format(this.timeFormatMoment));
		
		this.lockSelectStartEndDate(false);
	}
};

/**
 * @return {string}
 */
CEditEventPopup.prototype.getDateMonthFormat = function ()
{
	var sDateMonthFormat = this.dateFormatMoment.slice(0,-5);
	
	if ($.inArray(sDateMonthFormat, ['MM/DD', 'DD/MM', 'DD MMMM']) === -1)
	{
		sDateMonthFormat = 'MM/DD';
	}
	
	return sDateMonthFormat;
};

/**
 * @param {Object} oMomentDate
 * @param {boolean} bChangeInDatepicker
 */
CEditEventPopup.prototype.setEndDate = function (oMomentDate, bChangeInDatepicker)
{
	if (bChangeInDatepicker)
	{
		this.endDom().datepicker('setDate', oMomentDate.toDate());
	}
	this.endDate(this.getDateWithoutYearIfMonthWord($(this.endDom()).val()));
};

CEditEventPopup.prototype.selectEndDate = function ()
{
	if (!this.lockSelectStartEndDate() && this.endDate() && this.startDate())
	{
		this.lockSelectStartEndDate(true);
		
		var
			oStartDate = this.getDateTime(this.startDom(), this.startTime()),
			oStartMomentDate = moment(oStartDate),
			
			oEndDate = this.getDateTime(this.endDom(), this.endTime()),
			oEndMomentDate = moment(oEndDate)
		;
		
		this.iDiffInMinutes = oEndMomentDate.diff(oStartMomentDate, 'minutes');
		
		if (this.iDiffInMinutes < 0)
		{
			this.setStartDate(oEndMomentDate, true);
			this.startTime(oEndMomentDate.format(this.timeFormatMoment));
			this.iDiffInMinutes = 0;
		}

		this.isEvOneDay(oEndMomentDate.diff(oStartMomentDate, 'days') === 0);
		this.isEvOneTime(oEndMomentDate.diff(oStartMomentDate, 'minutes') === 0);

		this.setEndDate(oEndMomentDate, false);
		this.endTime(oEndMomentDate.format(this.timeFormatMoment));
		this.repeatEndDom().datepicker('option', 'minDate', oEndDate);

		if (!this.isRepeat())
		{
			this.repeatEndDom().datepicker('setDate', oEndMomentDate.add(7, 'days').toDate());
		}
		
		this.lockSelectStartEndDate(false);
	}
};

/**
 * @param {Object} oInput
 * @param {string} sTime
 * @return {Date}
 */
CEditEventPopup.prototype.getDateTime = function (oInput, sTime)
{
	sTime = sTime ? moment(sTime, this.timeFormatMoment).format('HH:mm') : '';
	
	var
		oDate = oInput.datepicker('getDate'),
		aTime = sTime ? sTime.split(':') : []
	;
	
	//in some cases aTime is a current time (it happens only once after page loading), in this case oDate is null, so code falls. 
	// the checking if oDate is not null is necessary
	if (aTime.length === 2 && oDate !== null) 
	{
		oDate.setHours(aTime[0]);
		oDate.setMinutes(aTime[1]);
	}

	return oDate;
};

CEditEventPopup.prototype.setActualTime = function ()
{
	if (!this.lockSelectStartEndDate() && this.endDate() && this.startDate())
	{
		this.lockSelectStartEndDate(true);
		
		var
			oNowMomentDate = moment(),
			sNowTime = oNowMomentDate.format(this.timeFormatMoment),
			
			oStartDate = this.getDateTime(this.startDom(), sNowTime),
			oStartMomentDate = moment(oStartDate),
			
			oEndDate = this.getDateTime(this.endDom(), sNowTime),
			oEndMomentDate = moment(oEndDate)
		;
		
		if (oStartMomentDate.minutes() > 30)
		{
			oStartMomentDate.add((60 - oStartMomentDate.minutes()), 'minutes');
			oEndMomentDate.add((90 - oEndMomentDate.minutes()), 'minutes');
		}
		else
		{
			oStartMomentDate.add((30 - oStartMomentDate.minutes()), 'minutes');
			oEndMomentDate.add((60 - oEndMomentDate.minutes()), 'minutes');
		}
		
		this.iDiffInMinutes = oEndMomentDate.diff(oStartMomentDate, 'minutes');
		
		this.setStartDate(oStartMomentDate, true);
		this.startTime(oStartMomentDate.format(this.timeFormatMoment));
		
		this.setEndDate(oEndMomentDate, true);
		this.endTime(oEndMomentDate.format(this.timeFormatMoment));
		
		this.lockSelectStartEndDate(false);
	}
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CEditEventPopup.prototype.onSetAppointmentActionResponse = function (oResponse, oRequest)
{
	if (!oResponse.Result)
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
	}
};

/**
 * @param {string} sDecision
 */
CEditEventPopup.prototype.setAppointmentAction = function (sDecision)
{
	var
		iDecision = Enums.IcalConfigInt.NeedsAction,
		aAttendees = this.attendees(),
		sEmail = App.getAttendee ?	App.getAttendee(this.attendees()) :	'',
		oAttendee = _.find(this.attendees(), function(oAttendee){
			return oAttendee.email === sEmail; 
		}, this),
		oCalendar = this.calendars.getCalendarById(this.selectedCalendarId()),
		oParameters = {
			'AppointmentAction': sDecision,
			'CalendarId': this.selectedCalendarId(),
			'EventId': this.uid(),
			'Attendee': sEmail
		}
	;

	if (oAttendee)
	{
		switch (sDecision)
		{
			case Enums.IcalConfig.Accepted:
				iDecision = Enums.IcalConfigInt.Accepted;
				CalendarCache.markIcalAccepted(this.uid());
				break;
			case Enums.IcalConfig.Tentative:
				iDecision = Enums.IcalConfigInt.Tentative;
				CalendarCache.markIcalTentative(this.uid());
				break;
			case Enums.IcalConfig.Declined:
				iDecision = Enums.IcalConfigInt.Declined;
				CalendarCache.markIcalNonexistent(this.uid());
				break;
		}
		Ajax.send('SetAppointmentAction', oParameters, this.onSetAppointmentActionResponse, this, 'CalendarMeetingsPlugin');

		oAttendee.status = iDecision;
		this.attendees([]);
		this.attendees(aAttendees);
		this.setCurrentAttenderStatus(oAttendee.email, this.attendees());
		if (sDecision === Enums.IcalConfig.Declined && oCalendar && 
				this.callbackAttendeeActionDecline && $.isFunction(this.callbackAttendeeActionDecline))
		{
			this.callbackAttendeeActionDecline(oCalendar,  this.id());
			this.closePopup();
		}
	}
};

/**
 * @param {boolean} bShared
 * @param {boolean} bEditable
 * @param {boolean} bMyEvent
 * @param {boolean} bSubscrubed
 */
CEditEventPopup.prototype.editableSwitch = function (bShared, bEditable, bMyEvent, bSubscrubed = false)
{
	this.isEditable((bShared && bEditable || bMyEvent) && !bSubscrubed);
	this.isEditableReminders(bEditable);
};

/**
 * @param {string} sCurrentEmail
 * @param {Array} aAttendees
 */
CEditEventPopup.prototype.setCurrentAttenderStatus = function (sCurrentEmail, aAttendees)
{
	var oCurrentAttender = _.find(aAttendees, function(oAttender){ 
		return oAttender.email === sCurrentEmail; 
	});

	this.attenderStatus(oCurrentAttender ? oCurrentAttender.status : 0);
};

CEditEventPopup.prototype.getAttenderTextStatus = function (sStatus)
{
	switch (sStatus)
	{
		case 0:
			sStatus = TextUtils.i18n('%MODULENAME%/LABEL_ATTENDER_STATUS_PENDING');
			break;
		case 1:
			sStatus = TextUtils.i18n('%MODULENAME%/LABEL_ATTENDER_STATUS_ACCEPTED');
			break;
		case 2:
			sStatus = TextUtils.i18n('%MODULENAME%/LABEL_ATTENDER_STATUS_DECLINED');
			break;
		case 3:
			sStatus = TextUtils.i18n('%MODULENAME%/LABEL_ATTENDER_STATUS_TENTATIVE');
			break;
	}
	return sStatus;
};

CEditEventPopup.prototype.setDayOfWeek = function ()
{
	if (this.repeatPeriod() === Enums.CalendarRepeatPeriod.Weekly && !this.getDays().length)
	{
		var iDayOfWeek = this.getDateTime(this.startDom()).getUTCDay();
		
		switch (iDayOfWeek)
		{
			case 0:
				this.weekMO(true);
				break;
			case 1:
				this.weekTU(true);
				break;
			case 2:
				this.weekWE(true);
				break;
			case 3:
				this.weekTH(true);
				break;
			case 4:
				this.weekFR(true);
				break;
			case 5:
				this.weekSA(true);
				break;
			case 6:
				this.weekSU(true);
				break;
		}
	}
};

CEditEventPopup.prototype.switchTask = function (isTask)
{
	this.isTask(isTask);
};

module.exports = new CEditEventPopup();
