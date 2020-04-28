export function setupComments() {
	let databaseUrl = "https://parseapi.back4app.com/classes/opinions";
	let databaseHeaders = {
		"X-Parse-Application-Id": "ygvQv5SiQusJl5Ba5QIB6IFstE716eRGK3lfBOgy",
		"X-Parse-REST-API-Key": "S7scxlRO6lBd4UECAIx2u9bvCyxGmjuADQvFOLSY"
	}

	let formRequests = [];
	let commentsContainer = document.getElementById("commentsContainer");
	let delCommentsButton = document.getElementById("delOldComments");

	fetchComments();

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

	function fetchComments() {
		const options = {
			headers: {
				"X-Parse-Application-Id": "Tvs5yreyzTAKVdSumV0RbETbaTbjxf2pSAPgjgD2",
				"X-Parse-REST-API-Key": "T9ghaIz8pmyjcD6RBd0vZA5BJXxNBKHuHgYYjI2z"
			}
		}

		fetch(databaseUrl, options)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
				}
			})
			.then(responseJSON => {
				formRequests = responseJSON.results;

				commentsContainer.innerHTML = parseRequests(formRequests);
				return Promise.resolve();
			})
			.catch(error => { ////here we process all the failed promises
				commentsContainer.innerHTML = error;
			});
	}
}