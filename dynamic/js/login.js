let auth2 = {};
let googleUser = null;

function signOut() {
	if (auth2.signOut) auth2.signOut();
	if (auth2.disconnect) auth2.disconnect();

	googleUser = null;
	document.getElementById('signInButton').innerText = "Google prihlásenie";
}

function userChanged() {
	if(auth2.isSignedIn.get()) {
		googleUser = auth2.currentUser.get();
		document.getElementById('signInButton').innerText = "Prihlásený: " + googleUser.getBasicProfile().getName();
	}
}


function updateSignIn() {
	if (auth2.isSignedIn.get()) {
		document.getElementById("customLogOutButton").classList.remove("hidden");

		if(googleUser) {
			document.getElementById('signInButton').innerText = "Prihlásený: " + googleUser.getBasicProfile().getName();
		}
	} else {
		document.getElementById("customLogOutButton").classList.add("hidden");
	}
}

function onSuccess(googleUser) {
	document.getElementById("customLogOutButton").classList.remove("hidden");
	document.getElementById('signInButton').innerText = "Prihlásený: " + googleUser.getBasicProfile().getName();
}

function onFailure(error) {
	console.error(error);
}

function initLogin() {
	gapi.load('auth2', function () {
		auth2 = gapi.auth2.init();

		auth2 = gapi.auth2.getAuthInstance();
		auth2.currentUser.listen(userChanged);
		auth2.isSignedIn.listen(updateSignIn);
		auth2.then(updateSignIn);

		auth2.attachClickHandler("customGoogleBtn", {}, onSuccess, onFailure);

		if (auth2.isSignedIn.get() == true) {
			auth2.signIn();
		}
	});
};

function refreshValues() {
	if (auth2) {
		googleUser = auth2.currentUser.get();
	}
}