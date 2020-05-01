export function setupComments() {

	let formRequests = [];
	let commentsContainer = document.getElementById("commentsContainer");
	let delCommentsButton = document.getElementById("delOldComments");

	fetchComments();

	if (delCommentsButton) {
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
			created: (new Date(comment.createdAt)).toLocaleString(),
			updated: (new Date(comment.updatedAt)).toLocaleString()
		};

		const template = document.getElementById("template-opinion").innerHTML;
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
		let formRequestsToDel = formRequests.filter(comment => (new Date() - new Date(comment.createdAt)) > (24 * 3600 * 1000));
		console.log(formRequestsToDel);
		formRequestsToDel.forEach(comment => {
			deleteComment(comment.objectId);
		});

		fetchComments();

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
				...back4AppHeaders
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
				
				showHideDelCommentsButton();
				return Promise.resolve();
			})
			.catch(error => { ////here we process all the failed promises
				commentsContainer.innerHTML = error;
			});
	}

	function deleteComment(commentId) {
		const options = {
			headers: {
				...back4AppHeaders
			},
			method: 'DELETE'
		}
		let deleteUrl = databaseUrl + '/' +commentId;
		console.log(deleteUrl);
		fetch(deleteUrl, options)
			.then(response => {
				if (response.ok) {
					return Promise.resolve();
				} else {
					return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
				}
			})
			.catch(error => { ////here we process all the failed promises
				commentsContainer.innerHTML = error;
			});
	}
}