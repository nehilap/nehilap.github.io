export function setupComments() {
	let formRequests = [];
	let commentsContainer = document.getElementById("commentsContainer");
	let delCommentsButton = document.getElementById("delOldComments");

	if (localStorage.formComments) {
		formRequests = JSON.parse(localStorage.formComments);
	}

	commentsContainer.innerHTML = parseRequests(formRequests);

	if (delCommentsButton) {
		showHideDelCommentsButton();

		delCommentsButton.addEventListener("click", removeAndRefreshComments);
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
}