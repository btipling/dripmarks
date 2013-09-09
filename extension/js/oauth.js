/**
 * @fileOverview Handle the oauth from Dropbox.
 */

function handleOauth() {
	var token, i, parts, subparts, hash, b;
	hash = window.location.hash.substr(1);
	if (!hash || !hash.length) {
		closeTab();
	}
	parts = window.location.hash.substr(1).split('&');
	if (!parts.length) {
		closeTab();
	}
	for (i = 0; i < parts.length; i++) {
		subparts = parts[i].split('=');
		if (subparts[0] === 'access_token') {
			token = subparts[1];
			break;
		}
	}
	b = chrome.extension.getBackgroundPage()
	if (token) {
		b.auth(token);
		b.run();
	}
	closeTab();
}

function closeTab() {
	chrome.tabs.getCurrent(function(tab) {
		chrome.tabs.remove(tab.id);
	});
}

handleOauth();
