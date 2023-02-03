'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	AddressUtils = require('%PathToCoreWebclientModule%/js/utils/Address.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js')
;

/**
 * @constructor
 */
function CCalendarSharePopup()
{
	CAbstractPopup.call(this);
	
	this.guestsDom = ko.observable();
	this.ownersDom = ko.observable();

	this.guestsLock = ko.observable(false);
	this.guests = ko.observable('').extend({'reversible': true});
	this.guests.subscribe(function () {
		if (!this.guestsLock())
		{
			$(this.guestsDom()).val(this.guests());
			$(this.guestsDom()).inputosaurus('refresh');
		}
	}, this);
	this.ownersLock = ko.observable(false);
	this.owners = ko.observable('').extend({'reversible': true});
	this.owners.subscribe(function () {
		if (!this.ownersLock())
		{
			$(this.ownersDom()).val(this.owners());
			$(this.ownersDom()).inputosaurus('refresh');
		}
	}, this);

	this.fCallback = null;

	this.calendarId = ko.observable(null);
	this.selectedColor = ko.observable('');
	this.calendarUrl = ko.observable('');
	this.exportUrl = ko.observable('');
	this.icsLink = ko.observable('');
	this.isPublic = ko.observable(false);
	this.shares = ko.observableArray([]);
	this.owner = ko.observable('');
	
	ko.computed(function () {
		if (this.owner() && this.guestsDom()) {
			this.initInputosaurus(this.guestsDom, this.guests, this.guestsLock);
		}
	}, this);

	ko.computed(function () {
		if (this.owner() && this.guestsDom()) {
			this.initInputosaurus(this.ownersDom, this.owners, this.ownersLock);
		}
	}, this);

	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.whomAnimate = ko.observable('');

	this.newShare = ko.observable('');
	this.newShareFocus = ko.observable(false);
	this.newShareAccess = ko.observable(Enums.CalendarAccess.Read);
	this.sharedToAll = ko.observable(false);
	this.sharedToAllAccess = ko.observable(Enums.CalendarAccess.Read);
	this.canAdd = ko.observable(false);
	this.aAccess = [
		{'value': Enums.CalendarAccess.Read, 'display': TextUtils.i18n('%MODULENAME%/LABEL_READ_ACCESS')},
		{'value': Enums.CalendarAccess.Write, 'display': TextUtils.i18n('%MODULENAME%/LABEL_WRITE_ACCESS')}
	];
}

_.extendOwn(CCalendarSharePopup.prototype, CAbstractPopup.prototype);

CCalendarSharePopup.prototype.PopupTemplate = '%ModuleName%_CalendarSharePopup';

/**
 * @param {Function} fCallback
 * @param {Object} oCalendar
 */
CCalendarSharePopup.prototype.onOpen = function (fCallback, oCalendar)
{
	if (_.isFunction(fCallback))
	{
		this.fCallback = fCallback;
	}
	if (!_.isUndefined(oCalendar))
	{
		this.selectedColor(oCalendar.color());
		this.calendarId(oCalendar.id);
		this.calendarUrl(oCalendar.davUrl() + oCalendar.url());
		this.exportUrl(oCalendar.exportUrl());
		this.icsLink(oCalendar.davUrl() + oCalendar.url() + '?export');
		this.isPublic(oCalendar.isPublic());
		this.owner(oCalendar.owner());

		this.populateShares(oCalendar.shares());
		this.sharedToAll(oCalendar.isSharedToAll());
		this.sharedToAllAccess(oCalendar.sharedToAllAccess);
	}
};

CCalendarSharePopup.prototype.onSaveClick = function ()
{
	var
		aOwners = AddressUtils.getArrayRecipients(this.owners(), false),
		aGuests = AddressUtils.getArrayRecipients(this.guests(), false)
	;

	if (this.isValidShares(aOwners, aGuests))
	{
		if (this.fCallback)
		{
			this.fCallback(this.calendarId(), this.isPublic(), this.getShares(aOwners, aGuests), this.sharedToAll(), this.sharedToAllAccess());
		}
		this.closePopup();
	}
};

CCalendarSharePopup.prototype.onClose = function ()
{
	this.cleanAll();
};

CCalendarSharePopup.prototype.cleanAll = function ()
{
	this.newShare('');
	this.newShareAccess(Enums.CalendarAccess.Read);
	this.shareToAllAccess = ko.observable(Enums.CalendarAccess.Read);
	//this.shareAutocompleteItem(null);
	this.canAdd(false);
};

/**
 * @param {string} sEmail
 */
CCalendarSharePopup.prototype.itsMe = function (sEmail)
{
	return (sEmail === App.getUserPublicId());
};

CCalendarSharePopup.prototype.initInputosaurus = function (koDom, koAddr, koLockAddr)
{
	if (koDom() && $(koDom()).length > 0)
	{
		const
			suggestParameters = {
				storage: 'team',
				addContactGroups: false,
				addUserGroups: false,
				exceptEmail: this.owner()
			},
			autoCompleteSource = ModulesManager.run(
				'ContactsWebclient', 'getSuggestionsAutocompleteCallback', [suggestParameters]
			)
		;
		$(koDom()).inputosaurus({
			width: 'auto',
			parseOnBlur: true,
			autoCompleteSource: _.isFunction(autoCompleteSource) ? autoCompleteSource : function () {},
			change : _.bind(function (ev) {
				koLockAddr(true);
				this.setRecipient(koAddr, ev.target.value);
				koLockAddr(false);
			}, this),
			copy: _.bind(function (sVal) {
				this.inputosaurusBuffer = sVal;
			}, this),
			paste: _.bind(function () {
				var sInputosaurusBuffer = this.inputosaurusBuffer || '';
				this.inputosaurusBuffer = '';
				return sInputosaurusBuffer;
			}, this),
			mobileDevice: App.isMobile()
		});
	}
};

CCalendarSharePopup.prototype.setRecipient = function (koRecipient, sRecipient)
{
	if (koRecipient() === sRecipient)
	{
		koRecipient.valueHasMutated();
	}
	else
	{
		koRecipient(sRecipient);
	}
};

CCalendarSharePopup.prototype.isValidShares = function (aOwners, aGuests)
{
	var aConflictEmails = [];
	_.each(aOwners, function (oOwnerAddress) {
		_.each(aGuests, function (oGuestAddress) {
			if (oOwnerAddress.email === oGuestAddress.email) {
				aConflictEmails.push(oOwnerAddress.fullEmail);
			}
		});
	});
	if (aConflictEmails.length > 0)
	{
		var
			sConflictEmails = TextUtils.encodeHtml(aConflictEmails.join(', ')),
			iConflictCount = aConflictEmails.length
		;
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_SHARE_CONFLICT_EMAILS', {'CONFLICT_EMAILS': sConflictEmails}, null, iConflictCount));
		return false;
	}
	return true;
};

CCalendarSharePopup.prototype.getShares = function (aOwners, aGuests)
{
	return $.merge(_.map(aGuests, function(oGuest){
			return {
				name: oGuest.name,
				email: oGuest.email,
				access: Enums.CalendarAccess.Read
			};
		}),
		_.map(aOwners, function(oOwner){
			return {
				name: oOwner.name,
				email: oOwner.email,
				access: Enums.CalendarAccess.Write
			};
		}));
};

CCalendarSharePopup.prototype.populateShares = function (aShares)
{
	var
		sGuests = '',
		sOwners = ''
	;

	_.each(aShares, function (oShare) {
		if (oShare.access === Enums.CalendarAccess.Read)
		{
			sGuests = oShare.name !== '' && oShare.name !== oShare.email ? 
						sGuests + '"' + oShare.name + '" <' + oShare.email + '>,' : 
						sGuests + oShare.email + ', ';
		}
		else if (oShare.access === Enums.CalendarAccess.Write)
		{
			sOwners = oShare.name !== '' && oShare.name !== oShare.email ? 
						sOwners + '"' + oShare.name + '" <' + oShare.email + '>,' : 
						sOwners + oShare.email + ', ';
		}
	}, this);

	this.setRecipient (this.guests, sGuests);
	this.setRecipient (this.owners, sOwners);
};

module.exports = new CCalendarSharePopup();
