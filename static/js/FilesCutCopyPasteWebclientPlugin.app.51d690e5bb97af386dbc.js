(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[32],{

/***/ "767o":
/*!**************************************************************************!*\
  !*** ./modules/FilesCutCopyPasteWebclientPlugin/js/views/ButtonsView.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "xG9w"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),

	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR")
;

/**
 * @constructor
 */
function СButtonsView()
{
	this.oFilesView = null;
	this.copiedItems = ko.observableArray([]);
	this.cuttedItems = ko.observableArray([]);
	this.sharedParentFolderWhereItemsCutFrom = ko.observable(null);

	this.savedItemsCount = ko.computed(function () {
		return this.cuttedItems().length + this.copiedItems().length;
	}, this);

	this.pasteTooltip = ko.computed(function () {
		var aItems = _.union(this.cuttedItems(), this.copiedItems());
		if (aItems.length > 0) {
			return TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/ACTION_PASTE') + ': <br/>' + _.map(aItems, function (oFile) {
				return oFile.fileName();
			}).join(',<br/>');
		} else {
			return TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/ACTION_PASTE');
		}
	}, this);
}

СButtonsView.prototype.ViewTemplate = 'FilesCutCopyPasteWebclientPlugin_ButtonsView';

СButtonsView.prototype.useFilesViewData = function (filesView)
{
	this.oFilesView = filesView;

	this.cutCommand = Utils.createCommand(this, this.executeCut, filesView.isCutAllowed);

	this.copyCommand = Utils.createCommand(this, this.executeCopy, filesView.isCopyAllowed);

	this.isPasteAllowed = ko.computed(function () {
		var
			allowPaste = false,
			sharedParentFolder = filesView.sharedParentFolder()
		;
		if (this.copiedItems().length > 0) {
			allowPaste = !filesView.isSharedStorage() && !sharedParentFolder
						 || sharedParentFolder && sharedParentFolder.bSharedWithMeAccessWrite;
		}
		if (this.cuttedItems().length > 0) {
			allowPaste = filesView.storageType() === Enums.FileStorageType.Personal
						 && (!sharedParentFolder || sharedParentFolder && sharedParentFolder.bSharedWithMeAccessWrite)
						 || filesView.isCorporateStorage()
						 || filesView.isSharedStorage() && sharedParentFolder && sharedParentFolder.bSharedWithMeAccessWrite;
		}
		return allowPaste;
	}, this);
	this.pasteCommand = Utils.createCommand(this, this.executePaste, this.isPasteAllowed);
};

СButtonsView.prototype.executeCut = function ()
{
	this.copiedItems([]);
	this.cuttedItems(this.oFilesView.selector.listCheckedAndSelected());
	this.sharedParentFolderWhereItemsCutFrom(this.oFilesView.sharedParentFolder());
	Popups.showPopup(AlertPopup, [TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/INFO_ITEMS_CUTTED')]);
};

СButtonsView.prototype.executeCopy = function ()
{
	this.copiedItems(this.oFilesView.selector.listCheckedAndSelected());
	this.cuttedItems([]);
	Popups.showPopup(AlertPopup, [TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/INFO_ITEMS_COPIED')]);
};

СButtonsView.prototype.executePaste = function ()
{
	if (this.cuttedItems().length > 0) {
		this.oFilesView.moveItems('Move', this.oFilesView.getCurrentFolder(), this.cuttedItems());
		this.cuttedItems([]);
	}
	if (this.copiedItems().length > 0) {
		this.oFilesView.moveItems('Copy', this.oFilesView.getCurrentFolder(), this.copiedItems());
		this.copiedItems([]);
	}
};

module.exports = new СButtonsView();


/***/ }),

/***/ "QYQq":
/*!****************************************************************!*\
  !*** ./modules/FilesCutCopyPasteWebclientPlugin/js/manager.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5");

	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('FilesWebclient', 'registerToolbarButtons', [__webpack_require__(/*! modules/FilesCutCopyPasteWebclientPlugin/js/views/ButtonsView.js */ "767o")]);
			}
		};
	}
	
	return null;
};


/***/ })

}]);