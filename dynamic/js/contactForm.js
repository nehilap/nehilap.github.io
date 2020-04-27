export function setupContactForm() {
	let formRequests = [];

	if (localStorage.formComments) {
		formRequests = JSON.parse(localStorage.formComments);
	}
	// delete(localStorage.formComments);

	let alertBar = document.getElementById("alertBar");
	let alertSpan = document.getElementById("alertSpan");
	let formElement = document.forms.namedItem("contactForm");
	let closeAlert = document.getElementById("closeAlert");

	const nameInput = formElement.elements.namedItem("name");
	const emailInput = formElement.elements.namedItem("email");
	const imgLinkInput = formElement.elements.namedItem("imgLink");
	const contextInput = formElement.elements.namedItem("context");
	// ONLY FOR TESTING PURPOSE

	//console.log(localStorage);
	//console.log(formRequests);

	/*
	formRequests.pop();
	localStorage.formComments = JSON.stringify(formRequests);
	*/

	closeAlert.addEventListener("click", hideSlowlyAlert);

	formElement.addEventListener("submit", submitFormData);

	formElement.addEventListener("reset", () => alertSpan.innerText = "");

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

		formElement.reset();

		showSubmitSuccess();

		window.location.hash = "#comments";
		// setTimeout(hideSlowlyAlert, 4000);
	}

	function showError(nameInput, emailInput, contextInput, imgLinkInput) {
		if (!(nameInput.validity.valid) || !nameInput.value.trim()) {
			showNameError();
		} else if (!(emailInput.validity.valid) || !emailInput.value.trim()) {
			showEmailError();
		} else if (!(contextInput.validity.valid) || contextInput.value.length <= 10 || !contextInput.value.trim()) {
			showContextError();
		} else if (!(imgLinkInput.validity.valid)) {
			showImgLinkError();
		}
	}

	function showNameError(event) {
		let nameInput = event.target;
		let errorMessage = "";

		if (nameInput.validity.valueMissing) {
			errorMessage = "Chýba meno";
			setErrorAlert();
		} else if (nameInput.validity.valid) {
			hideAlert();
		}

		alertSpan.innerText = errorMessage;
	}

	function showEmailError(event) {
		let emailInput = event.target;
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

	function showContextError(event) {
		let contextInput = event.target;
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

	function showImgLinkError(event) {
		let imgLinkInput = event.target;
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
}