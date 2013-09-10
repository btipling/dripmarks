var token, client;

function auth() {
	var b;
	b = chrome.extension.getBackgroundPage()
	b.auth();
}

token = localStorage.dropboxAccessToken;
if (!token) {
	auth();
}

client = new Dropbox.Client({token: token});
if (!client.isAuthenticated()) {
	auth();
}
document.getElementById('content').innerHTML = 'authed!';
