'use strict';

var
	_ = require('underscore'),

	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: '%ModuleName%',
	HashModuleName: 'signup',

	CustomLogoUrl: '',
	InfoText: '',
	BottomInfoHtmlText: '',
	DomainList: [],

	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['%ModuleName%'];

		if (!_.isEmpty(oAppDataSection))
		{
			var aDomainList = Types.pArray(oAppDataSection.DomainList, this.DomainList);

			this.ServerModuleName = Types.pString(oAppDataSection.ServerModuleName, this.ServerModuleName);
			this.HashModuleName = Types.pString(oAppDataSection.HashModuleName, this.HashModuleName);
			this.CustomLogoUrl = Types.pString(oAppDataSection.CustomLogoUrl, this.CustomLogoUrl);
			this.InfoText = Types.pString(oAppDataSection.InfoText, this.InfoText);
			this.BottomInfoHtmlText = Types.pString(oAppDataSection.BottomInfoHtmlText, this.BottomInfoHtmlText);
			this.DomainList = Types.isNonEmptyArray(aDomainList) ? aDomainList : ['no domain set'];
		}
	}
};
