'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	moment = require('moment'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Storage = require('%PathToCoreWebclientModule%/js/Storage.js'),
	
	CalendarUtils = require('modules/%ModuleName%/js/utils/Calendar.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CCalendarModel()
{
	this.id = 0;
	this.sSyncToken = '';
	this.name = ko.observable('');
	this.description = ko.observable('');
	this.owner = ko.observable('');
	this.isDefault = false;
	this.isShared =  ko.observable(false);
	this.isSharedToAll = ko.observable(false);
	this.sharedToAllAccess = Enums.CalendarAccess.Read;
	this.isPublic = ko.observable(false);
	this.url = ko.observable('');
	this.davUrl = ko.observable('');
	this.exportUrl = ko.observable('');
	this.pubUrl = ko.observable('');
	this.shares = ko.observableArray([]);
	this.events = ko.observableArray([]);
	this.eventsCount = ko.computed(function() {
		return this.events().length;
	}, this);
	this.access = ko.observable(Enums.CalendarAccess.Write);
	
	this.color = ko.observable('');
	this.color.subscribe(function(){
		
		this.events(_.map(this.events(), function (oEvent) {
			oEvent.backgroundColor = oEvent.borderColor = this.color();
			return oEvent;
		}, this));
		
		this.name.valueHasMutated();

	}, this);
	
	this.active = ko.observable(true);
	
	this.startDateTime = 0;
	this.endDateTime = 0;
	this.canShare = ko.computed(function () {
			return (!this.isShared()
				|| (this.isShared()
					&& this.access() === Enums.CalendarAccess.Write
					&& this.shares().length !== 0)
				|| this.isOwner());
		}, this
	);
	this.bAllowShare = Settings.AllowShare;
	this.bAllowAppointments = Settings.AllowAppointments;
	
	this.subscribed = ko.observable(false);
	this.source = ko.observable('');
}

/**
 * @param {string} sColor
 * @returns {string}
 */
CCalendarModel.prototype.parseCssColor = function (sColor)
{
	var sCssColor = Types.pString(sColor);
	
	if (sCssColor.length > 7)
	{
		sCssColor = sCssColor.substr(0, 7);
	}
	else if (sCssColor.length > 4 && sCssColor.length < 7)
	{
		sCssColor = sCssColor.substr(0, 4);
	}
	
	if (sCssColor.length === 4)
	{
		sCssColor = sCssColor[0] + sCssColor[1] + sCssColor[1] + sCssColor[2] + sCssColor[2] + sCssColor[3] + sCssColor[3];
	}
	
	if (!sCssColor.match(/^#[A-Fa-f0-9]{6}$/i))
	{
		sCssColor = '#f09650';
	}
	
	return sCssColor;
};

/**
 * @param {Object} oData
 */
CCalendarModel.prototype.parse = function (oData)
{
	this.id = Types.pString(oData.Id);
	this.sSyncToken = oData.SyncToken;
	this.name(Types.pString(oData.Name));
	this.description(Types.pString(oData.Description));
	this.owner(Types.pString(oData.Owner));
	this.active(Storage.hasData(this.id) ? Storage.getData(this.id) : true);
	this.isDefault = !!oData.IsDefault;
	this.isShared(!!oData.Shared);
	this.isSharedToAll(!!oData.SharedToAll);
	this.sharedToAllAccess = oData.SharedToAllAccess;
	this.isPublic(!!oData.IsPublic);
	this.access(oData.Access);

	this.color(this.parseCssColor(oData.Color));
	this.url(Types.pString(oData.Url));
	this.exportUrl(UrlUtils.getAppPath() + '?calendar-download/' + Types.pString(oData.ExportHash));
	this.pubUrl(UrlUtils.getAppPath() + '?calendar-pub=' + Types.pString(oData.PubHash));
	this.shares(oData.Shares || []);
	
	_.each(oData.Events, function (oEvent) {
		this.addEvent(oEvent);
	}, this);

	this.subscribed(!!oData.Subscribed);
	this.source(oData.Source);
};

/**
 * @param {Object} oEvent
 */
CCalendarModel.prototype.updateEvent = function (oEvent)
{
	var bResult = false;
	if (oEvent)
	{
		this.removeEvent(oEvent.id);
		this.addEvent(oEvent);
	}
	
	return bResult;
};

/**
 * @param {Object} oEvent
 */
CCalendarModel.prototype.addEvent = function (oEvent)
{
	if (oEvent && !this.eventExists(oEvent.id))
	{
		this.events.push(this.parseEvent(oEvent));
	}
};

/**
 * @param {string} sId
 */
CCalendarModel.prototype.getEvent = function (sId)
{
	return _.find(this.events(), function (oEvent) { 
		return oEvent.id === sId;
	}, this);
};

/**
 * @param {string} sId
 * 
 * @return {boolean}
 */
CCalendarModel.prototype.eventExists = function (sId)
{
	return !!this.getEvent(sId);
};

/**
 * @param {Object} start
 * @param {Object} end
 */
CCalendarModel.prototype.getEvents = function (start, end)
{
	var aResult = _.filter(this.events(), function(oEvent){ 
		var 
			iStart = start.unix(),
			iEnd = end.unix(),
			iEventStart = moment.utc(oEvent.start).unix(),
			iEventEnd = moment.utc(oEvent.end).unix()
		;
		return iEventStart >= iStart && iEventEnd <= iEnd ||
				iEventStart <= iStart && iEventEnd >= iEnd ||
				iEventStart >= iStart && iEventStart <= iEnd ||
				iEventEnd <= iEnd && iEventEnd >= iStart 
		;
	}, this);
	
	return aResult || [];
};

/**
 * @param {string} sId
 */
CCalendarModel.prototype.removeEvent = function (sId)
{
	this.events(_.filter(this.events(), function(oEvent){ 
		return oEvent.id !== sId;
	}, this));
};

/**
 * @param {string} sUid
 * @param {boolean=} bSkipExcluded = false
 */
CCalendarModel.prototype.removeEventByUid = function (sUid, bSkipExcluded)
{
	this.events(_.filter(this.events(), function(oEvent){ 
		return oEvent.uid !== sUid || bSkipExcluded && oEvent.excluded;
	}, this));
};

CCalendarModel.prototype.removeEvents = function ()
{
	this.events([]);
};

/**
 * @param {Array} aEventIds
 * @param {number} start
 * @param {number} end
 */
CCalendarModel.prototype.expungeEvents = function (aEventIds, start, end, type)
{
	var aEventRemoveIds = [];
	_.each(this.getEvents(moment.unix(start), moment.unix(end)), function(oEvent) {
		if (!_.include(aEventIds, oEvent.id) && oEvent.type === type)
		{
			aEventRemoveIds.push(oEvent.id);
		}
	}, this);
	this.events(_.filter(this.events(), function(oEvent){
		return !_.include(aEventRemoveIds, oEvent.id);
	},this));
};

/**
 * @return {boolean}
 */
CCalendarModel.prototype.isEditable = function ()
{
	return this.access() !== Enums.CalendarAccess.Read;
};

/**
 * @return {boolean}
 */
CCalendarModel.prototype.isOwner = function ()
{
	return App.getUserPublicId() === this.owner();
};

CCalendarModel.prototype.parseEvent = function (oEvent)
{
	oEvent.title = CalendarUtils.getTitleForEvent(oEvent.subject, oEvent.description);
	oEvent.editable = oEvent.appointment ? false : true;
	oEvent.backgroundColor = oEvent.borderColor = this.color();
	if (!_.isArray(oEvent.className))
	{
		var className = oEvent.className;
		oEvent.className = [className];
	}
	if (this.access() === Enums.CalendarAccess.Read)
	{
		oEvent.className.push('fc-event-readonly');
		oEvent.editable = false;
	}
	else
	{
		oEvent.className = _.filter(oEvent.className, function(sItem){ 
			return sItem !== 'fc-event-readonly'; 
		});
		if (this.subscribed()) {
			oEvent.editable = false;
		}
	}
	if (oEvent.rrule && !oEvent.excluded)
	{
		oEvent.className.push('fc-event-repeat');
	}
	else
	{
		oEvent.className = _.filter(oEvent.className, function(sItem){ 
			return sItem !== 'fc-event-repeat'; 
		});		
	}
	if (Types.isNonEmptyArray(oEvent.attendees) && this.bAllowAppointments)
	{
		oEvent.className.push('fc-event-appointment');
	}
	else
	{
		oEvent.className = _.filter(oEvent.className, function(sItem){ 
			return sItem !== 'fc-event-appointment'; 
		});		
	}
	if (oEvent.isPrivate && App.getUserPublicId() !== oEvent.owner) {
		oEvent.editable = false;
	}
	if (oEvent.isPrivate) {
		oEvent.className.push('fc-event-private');
	} else {
		oEvent.className = _.filter(oEvent.className, function(sItem){ 
			return sItem !== 'fc-event-private'; 
		});
	}
	return oEvent;
};

CCalendarModel.prototype.reloadEvents = function ()
{
	this.events(_.map(this.events(), function (oEvent) {
		return this.parseEvent(oEvent);
	}, this));
};

module.exports = CCalendarModel;
