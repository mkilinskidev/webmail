'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	
	iDefaultRatio = 0.8,
	aOpenedWins = []
;

/**
 * @return string
 */
function GetSizeParameters()
{
	var
		iScreenWidth = window.screen.width,
		iWidth = Math.ceil(iScreenWidth * iDefaultRatio),
		iLeft = Math.ceil((iScreenWidth - iWidth) / 2),

		iScreenHeight = window.screen.height,
		iHeight = Math.ceil(iScreenHeight * iDefaultRatio),
		iTop = Math.ceil((iScreenHeight - iHeight) / 2)
	;

	return ',width=' + iWidth + ',height=' + iHeight + ',top=' + iTop + ',left=' + iLeft;
}

module.exports = {
	/**
	 * @param {string} sUrl
	 * @param {string=} sWinName
	 * 
	 * @return Object
	 */
	openTab: function (sUrl, sWinName)
	{
		$.cookie('aft-cache-ctrl', '1');
		var oWin = window.open(sUrl, '_blank');
		
		if (oWin)
		{
			oWin.focus();
			oWin.name = sWinName ? sWinName : (App.currentAccountId ? App.currentAccountId() : 0);
			aOpenedWins.push(oWin);
		}
		
		return oWin;
	},
	
	/**
	 * @param {string} sUrl
	 * @param {string} sPopupName
	 * @param {boolean=} bMenubar = false
	 * 
	 * @return Object
	 */
	open: function (sUrl, sPopupName, bMenubar, sSize = '')
	{
		var
			sMenubar = (bMenubar) ? ',menubar=yes' : ',menubar=no',
			sParams = 'location=no,toolbar=no,status=no,scrollbars=yes,resizable=yes' + sMenubar,
			oWin = null
		;

		sPopupName = sPopupName.replace(/\W/g, ''); // forbidden characters in the name of the window for ie
		
		sParams += sSize === '' ? GetSizeParameters() : sSize;

		oWin = window.open(sUrl, sPopupName, sParams);
		
		if (oWin)
		{
			oWin.focus();
			oWin.name = App.currentAccountId ? App.currentAccountId() : 0;
			aOpenedWins.push(oWin);
		}
		
		return oWin;
	},
	
	/**
	 * Attempts to get the "origin" value for an opened window.
	 * Returns false if this is not possible.
	 * This means that the user has opened some other site in it.
	 * @param {object} oWin
	 * @returns {bool}
	 */
	isSameOrigin: function (oWin)
	{
		var sWinOrigin = '';

		try
		{
			sWinOrigin = oWin.location.origin;
		}
		catch (oError)
		{
			// There is "accessing a cross-origin frame" error if something else was opened in the oWin tab
			console.log('The following error was catched:');
			console.error(oError);
		}
		return window.location.origin === sWinOrigin;
	},

	/**
	 * @returns {Array}
	 */
	getOpenedWindows: function ()
	{
		aOpenedWins = _.filter(aOpenedWins, function (oWin) {
			return this.isSameOrigin(oWin) && !oWin.closed;
		}.bind(this));
		return aOpenedWins;
	},
	
	closeAll: function ()
	{
		_.each(aOpenedWins, function (oWin) {
			// Check of windows origin doesn't work in unload event handler, so it is moved to onbeforeunload event handler
			if (!oWin.closed)
			{
				oWin.close();
			}
		});

		aOpenedWins = [];
	}
};
