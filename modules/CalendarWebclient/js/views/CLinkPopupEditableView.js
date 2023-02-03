'use strict';

const ko = require('knockout');

function CLinkPopupEditableView()
{
	this.visibleLinkPopup = ko.observable(false);
	this.linkPopupDom = ko.observable(null);
	this.linkHrefDom = ko.observable(null);
	this.linkHref = ko.observable('');
	this.visibleLinkHref = ko.observable(false);
	this.allowEditLinks = ko.observable(false);
	this.currLink = false;

	this.onBodyClick = function (event) {
		const parent = $(event.target).parents('div.inline_popup');
		if (parent.length === 0) {
			this.closeAllPopups();
		}
	}.bind(this);
}

CLinkPopupEditableView.prototype.PopupTemplate = '%ModuleName%_LinkPopupEditableView';

CLinkPopupEditableView.prototype.onOpen = function () {
	$(document.body).on('click', this.onBodyClick);
};

CLinkPopupEditableView.prototype.onClose = function () {
	$(document.body).off('click', this.onBodyClick);
};

CLinkPopupEditableView.prototype.initInputField = function (inputField, allowEditLinks)
{
	inputField.on('click', 'a', function (event) {
		if (event.ctrlKey) {
			window.open(event.target.href, '_blank');
		} else {
			const currLink = event.currentTarget;
			if (this.visibleLinkPopup() && currLink === this.currLink) {
				this.currLink = null;
				this.hideLinkPopup();
			} else {
				this.allowEditLinks(allowEditLinks);
				this.showLinkPopup(currLink, inputField);
			}
		}
		event.preventDefault();
		event.stopPropagation();
	}.bind(this));
};

/**
 * @param {Object} currLink
 * @param {Object} inputField
 */
CLinkPopupEditableView.prototype.showLinkPopup = function (currLink, inputField)
{
	const
		$currLink = $(currLink),
		inputFieldParent = inputField.parents('div.row'),
		inputFieldPos = inputFieldParent.position(),
		linkPos = $currLink.position(),
		linkHeight = $currLink.height(),
		linkLeft = Math.round(linkPos.left + inputFieldPos.left),
		linkTop = Math.round(linkPos.top + linkHeight + inputFieldPos.top),
		css = {
			'left': linkLeft,
			'top': linkTop
		}
	;

	this.currLink = currLink;
	this.linkHref($currLink.attr('href') || $currLink.text());
	$(this.linkPopupDom()).css(css);
	$(this.linkHrefDom()).css(css);
	this.visibleLinkPopup(true);
};

CLinkPopupEditableView.prototype.hideLinkPopup = function ()
{
	this.visibleLinkPopup(false);
};

CLinkPopupEditableView.prototype.showChangeLink = function ()
{
	this.visibleLinkHref(true);
	this.hideLinkPopup();
};

CLinkPopupEditableView.prototype.changeLink = function ()
{
	this.changeLinkHref(this.linkHref());
	this.hideChangeLink();
};

CLinkPopupEditableView.prototype.hideChangeLink = function ()
{
	this.visibleLinkHref(false);
};

/**
 * @param {string} text
 * @return {string}
 */
CLinkPopupEditableView.prototype.normaliseURL = function (text)
{
	return text.search(/^https?:\/\/|^mailto:|^tel:/g) !== -1 ? text : 'http://' + text;
};

/**
 * @param {string} newHref
 */
CLinkPopupEditableView.prototype.changeLinkHref = function (newHref)
{
	const
		normHref = this.normaliseURL(newHref),
		currLink = $(this.currLink)
	;

	if (currLink) {
		if (currLink.attr('href') === currLink.text()) {
			currLink.text(normHref);
		}
		currLink.attr('href', normHref);
		this.currLink = null;
	}
};

CLinkPopupEditableView.prototype.removeCurrentLink = function ()
{
	if (this.currLink && document.createRange && window.getSelection) {
		const
			range = document.createRange(),
			selection = window.getSelection()
		;

		range.selectNodeContents(this.currLink);
		selection.removeAllRanges();
		selection.addRange(range);

		window.document.execCommand('unlink');
		this.currLink = null;
		this.hideLinkPopup();
	}
};

CLinkPopupEditableView.prototype.closeAllPopups = function ()
{
	this.currLink = null;
	this.hideLinkPopup();
	this.hideChangeLink();
};

module.exports = CLinkPopupEditableView;
