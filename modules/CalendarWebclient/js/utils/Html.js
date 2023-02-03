'use strict';

module.exports = {
	plainToHtml (text) {
		let html = text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;');

		//URLs starting with http://, https://, or ftp://
		const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		html = html.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		html = html.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

		//Change email addresses to mailto:: links.
		const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
		html = html.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

		return html.replace(/\r/g, '').replace(/\n/g, '<br />');
	},

	htmlToPlain (html) {
		return html
			.replace(/([^>]{1})<div>/gi, '$1\n')
			.replace(/<style[^>]*>[^<]*<\/style>/gi, '\n')
			.replace(/<br *\/{0,1}>/gi, '\n')
			.replace(/<\/p>/gi, '\n')
			.replace(/<\/div>/gi, '\n')
			.replace(/<a [^>]*href="([^"]*?)"[^>]*>(.*?)<\/a>/gi, '$2')
			.replace(/<[^>]*>/g, '')
			.replace(/&nbsp;/g, ' ')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
			.replace(/&quot;/g, '"')
		;
	}
};
