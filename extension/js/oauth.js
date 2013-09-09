var token, i, parts, subparts;
parts = window.location.hash.substr(1).split('&');
for (i = 0; i < parts.length; i++) {
	subparts = parts[i].split('=');
	if (subparts[0] === 'access_token') {
		token = subparts[1];
		break;
	}
}
var b = chrome.extension.getBackgroundPage()
b.auth(token);
b.run();
