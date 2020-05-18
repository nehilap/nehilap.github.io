// delete(localStorage.formComments);

let formRequests = [];
let commentsContainer = document.getElementById("commentsContainer");
let delCommentsButton = document.getElementById("delOldComments");
let alertBar = document.getElementById("alertBar");
let alertSpan = document.getElementById("alertSpan");
let formElement = document.forms.namedItem("contactForm");

const nameInput = formElement.elements.namedItem("name");
const emailInput = formElement.elements.namedItem("email");
const contextInput = formElement.elements.namedItem("context");
const imgLinkInput = formElement.elements.namedItem("imgLink");

if (localStorage.formComments) {
	formRequests = JSON.parse(localStorage.formComments);
}

commentsContainer.innerHTML = parseRequests(formRequests);

showHideDelCommentsButton();

// ONLY FOR TESTING PURPOSE

//console.log(localStorage);
//console.log(formRequests);

/*
formRequests.pop();
localStorage.formComments = JSON.stringify(formRequests);
*/

document.getElementById("closeAlert").addEventListener("click", hideSlowlyAlert);

formElement.addEventListener("submit", submitFormData);

formElement.addEventListener("reset", () => alertSpan.innerText = "");

delCommentsButton.addEventListener("click", removeAndRefreshComments);

// requires feedback to decide whether to keep then on input or on submit only
nameInput.addEventListener("input", showNameError);

emailInput.addEventListener("input", showEmailError);

contextInput.addEventListener("input", showContextError);

imgLinkInput.addEventListener("input", showImgLinkError);


function submitFormData(event) {
	event.preventDefault();

	const nameVal = nameInput.value.trim();
	const emailVal = emailInput.value.trim();
	const imageUrlVal = imgLinkInput.value.trim();
	const keyWordVal = formElement.elements.namedItem("keyWord").value.trim();
	const ratingVal = formElement.elements.namedItem("hodnotenie").value;
	const sendMailVal = formElement.elements.namedItem("sendMail").checked;
	const contextVal = contextInput.value.trim();

	if (nameVal == "" || !(emailInput.validity.valid) || contextVal.length <= 10) {
		showError(nameInput, emailInput, contextInput, imgLinkInput);
		return;
	}

	const request = {
		name: nameVal,
		email: emailVal,
		imageUrl: imageUrlVal,
		keyWord: keyWordVal,
		rating: ratingVal,
		sendMail: sendMailVal,
		context: contextVal,
		created: new Date()
	};

	formRequests.push(request);

	localStorage.formComments = JSON.stringify(formRequests);

	// ONLY FOR TESTING PURPOSE

	//console.log(localStorage);
	//console.log(formRequests);

	commentsContainer.innerHTML = parseRequests(formRequests);

	formElement.reset();

	showHideDelCommentsButton();

	showSubmitSuccess();

	setTimeout(hideSlowlyAlert, 4000);
}

function parseComment(comment) {
	let commentTmp = {
		name: comment.name,
		email: comment.email,
		parsedImg: comment.imageUrl == "" ? "" : "<img class='comment-img' src='" + comment.imageUrl + "'>",
		keyWord: comment.keyWord,
		ratingMessage: comment.rating == "" ? "" : ", hodnotenie: " + comment.rating + "/5",
		context: comment.context,
		created: (new Date(comment.created)).toLocaleString()
	};

	const template = document.getElementById("commentTemplate").innerHTML;
	return Mustache.render(template, commentTmp);
}

function parseRequests(requests) {
	if (requests == null) {
		return "";
	}

	let parsedHtml = "";

	for (let comment of requests) {
		parsedHtml += parseComment(comment);
	}

	return parsedHtml;
}

function removeAndRefreshComments() {
	//formRequests.forEach(comment => console.log(new Date() - new Date(comment.created)));
	//console.log(24 * 3600 * 1000);

	formRequests = formRequests.filter(comment => (new Date() - new Date(comment.created)) < (24 * 3600 * 1000));

	localStorage.formComments = JSON.stringify(formRequests);

	commentsContainer.innerHTML = parseRequests(formRequests);

	showHideDelCommentsButton();
}

function showHideDelCommentsButton() {
	// no comments == no button
	if (formRequests.length < 1) {
		delCommentsButton.classList.add("hidden");
	} else {
		delCommentsButton.classList.remove("hidden");
	}
}

function showError(nameInput, emailInput, contextInput, imgLinkInput) {
	if (!(nameInput.validity.valid)) {
		showNameError();
	} else if (!(emailInput.validity.valid)) {
		showEmailError();
	} else if (!(contextInput.validity.valid) || contextInput.value.length <= 10) {
		showContextError();
	} else if (!(imgLinkInput.validity.valid)) {
		showImgLinkError();
	}
}

function showNameError() {
	let errorMessage = "";

	if (nameInput.validity.valueMissing) {
		errorMessage = "Chýba meno";
		setErrorAlert();
	} else if (nameInput.validity.valid) {
		hideAlert();
	}


	alertSpan.innerText = errorMessage;
}

function showEmailError() {
	let errorMessage = "";

	if (emailInput.validity.valueMissing) {
		errorMessage = "Chýba email";
		setErrorAlert();
	} else if (!emailInput.validity.valid) {
		errorMessage = "Nesprávny formát emailu";
		setErrorAlert();
	} else if (emailInput.validity.valid) {
		hideAlert();
	}

	alertSpan.innerText = errorMessage;
}

function showContextError() {
	let errorMessage = "";

	if (contextInput.validity.valueMissing) {
		errorMessage = "Chýba text komentára";
		setErrorAlert();
	} else if (contextInput.validity.tooShort || contextInput.value.length <= 10) {
		errorMessage = "Komentár musí mať viac než " + contextInput.minLength + " znakov, zadali ste " + contextInput.value.length;
		setErrorAlert();
	} else if (contextInput.validity.valid) {
		hideAlert();
	}


	alertSpan.innerText = errorMessage;
}

function showImgLinkError() {
	let errorMessage = "";

	if (imgLinkInput.validity.typeMismatch) {
		errorMessage = "Nesprávny formát url odkazu";
		setErrorAlert();
	} else if (imgLinkInput.validity.valid) {
		hideAlert();
	}


	alertSpan.innerText = errorMessage;
}

function showSubmitSuccess() {
	setSuccessAlert();
	alertSpan.innerText = "Uspešné odoslanie komentára";
}

function hideAlert() {
	alertBar.classList.add("invis", "hidden");
}

function hideSlowlyAlert() {
	alertBar.classList.add("invis");
	setTimeout(() => alertBar.classList.add("hidden"), 500);
}

function showAlert() {
	alertBar.classList.remove("invis", "hidden");
}

function setSuccessAlert() {
	showAlert();
	alertBar.classList.remove("error");
	alertBar.classList.add("success");
}

function setErrorAlert() {
	showAlert();
	alertBar.classList.add("error");
	alertBar.classList.remove("success");
}