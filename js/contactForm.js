// delete(localStorage.formComments);

let formRequests = [];
let commentsContainer = document.getElementById("commentsContainer");
let delCommentsButton = document.getElementById("delOldComments");

if (localStorage.formComments) {
	formRequests = JSON.parse(localStorage.formComments);
}

commentsContainer.innerHTML = parseRequests(formRequests);

// no comments == no button
if(formRequests.length < 1) { 
	delCommentsButton.classList.add("hidden");
}

// ONLY FOR TESTING PURPOSE

//console.log(localStorage);
console.log(formRequests);

/*
formRequests.pop();
localStorage.formComments = JSON.stringify(formRequests);
*/

let formElement = document.forms.namedItem("contactForm");

formElement.addEventListener("submit", submitFormData);

delCommentsButton.addEventListener("click", removeAndRefreshComments);

function submitFormData(event) {
	event.preventDefault();

	const nameVal = formElement.elements.namedItem("name").value;
	const emailVal = formElement.elements.namedItem("email").value;
	const imageUrlVal = formElement.elements.namedItem("imgLink").value;
	const keyWordVal = formElement.elements.namedItem("keyWord").value;
	const ratingVal = formElement.elements.namedItem("hodnotenie").value;
	const sendMailVal = formElement.elements.namedItem("sendMail").checked;
	const contextVal = formElement.elements.namedItem("context").value;

	if (nameVal == "" || emailVal == "" || contextVal == "") {
		console.error("Incorrect form values!!");
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
}

function parseComment(comment) {
	let commentTmp = {
		name: comment.name,
		email: comment.email,
		parsedImg: comment.imageUrl == "" ? "" : "<img class='comment-img' src='" + comment.imageUrl +"'>",
		keyWord: comment.keyWord,
		ratingMessage: comment.rating == "" ? "" : ", hodnotenie: " + comment.rating + "/5",
		context: comment.context,
		created: (new Date(comment.created)).toLocaleString()
	};

    const template = document.getElementById("commentTemplate").innerHTML;
    return Mustache.render(template, commentTmp);
}

function parseRequests(requests) {
	if(requests == null) {
		return "";
	}

	let parsedHtml = "";

	for(let comment of requests) {
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
}