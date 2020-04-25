function showFileUpload() {
	document.getElementById('fileUpload').classList.remove("hidden");
	document.getElementById('btShowFileUpload').classList.add("hidden");
}

function cancelFileUpload() {
	document.getElementById('fileUpload').classList.add("hidden");
	document.getElementById('btShowFileUpload').classList.remove("hidden");
}

function uploadImg(url) {
	const uploadUrl = url + "/fileUpload";

	const files = document.getElementById("flElm").files;

	if (files.length > 0) {
		const imgLinkElement = document.getElementById("imageLink");

		const alertBar = document.getElementById("alertBar");
		const alertSpan = document.getElementById("alertSpan");


		let obj = new FormData();
		obj.append("file", files[0]);

		const options = {
			method: 'POST',
			body: obj
		};

		fetch(uploadUrl, options)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
				}
			})
			.then(responseJSON => {
				imgLinkElement.value = responseJSON.fullFileUrl;
				cancelFileUpload();
				setSuccessAlert();

				alertSpan.innerText = `Image uploaded successfully`;
				return Promise.resolve();
			})
			.catch(error => {
				setErrorAlert();

				alertSpan.innerText = `Image uploading failed. ${error}.`;

				console.log(`Image uploading failed. ${error}.`);
			});
	}
}

function submitForm(event, backLink, completeUrl, method) {
	event.preventDefault();

	const articleData = {
		title: document.getElementById("title").value.trim(),
		content: document.getElementById("content").value.trim(),
		author: document.getElementById("author").value.trim(),

		imageLink: document.getElementById("imageLink").value.trim(),
		tags: document.getElementById("tags").value.trim()
	};

	if (!(articleData.title && articleData.content)) {
		window.alert("Please, enter article title and content");
		return;
	}

	if (!articleData.author) {
		articleData.author = "Anonymous";
	}

	if (!articleData.imageLink) {
		delete articleData.imageLink;
	}

	if (!articleData.tags) {
		delete articleData.tags;
	} else {
		articleData.tags = articleData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
		articleData.tags.push("aniNeh");
		if (articleData.tags.length == 0) {
			delete articleData.tags;
		}
	}

	const options = {
		method: method.toUpperCase(),
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(articleData)
	};

	fetch(completeUrl, options)
		.then(response => {
			if (response.ok) {
				return Promise.resolve();
			} else {
				return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
			}
		})
		.catch(error => {
			setErrorAlert();

			alertSpan.innerText(`Failed to save the updated article on server. ${error}`);

		})
		.finally(() => window.location = backLink);

	
}

function showCommentForm() {
	document.getElementById('articleCommentForm').classList.remove("hidden-height");
}

function hideCommentForm() {
	document.getElementById('articleCommentForm').classList.add("hidden-height");
}


function hideAlert() {
	document.getElementById("alertBar").classList.add("invis", "hidden");
}

function hideSlowlyAlert() {
	const alertBar = document.getElementById("alertBar");
	alertBar.classList.add("invis");
	setTimeout(() => alertBar.classList.add("hidden"), 500);
}

function showAlert() {
	document.getElementById("alertBar").classList.remove("invis", "hidden");
}

function setSuccessAlert() {
	const alertBar = document.getElementById("alertBar");

	showAlert();
	alertBar.classList.remove("error");
	alertBar.classList.add("success");
}

function setErrorAlert() {
	const alertBar = document.getElementById("alertBar");

	showAlert();
	alertBar.classList.add("error");
	alertBar.classList.remove("success");
}