export function setupArticle(targetElm, articleId, page, editMode, serverUrl, commentPage) {

	fetchOne(articleId);

	function fetchOne(articleId) {
		fetch(`${serverUrl}/article/${articleId}`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else { //if we get server error
					return Promise.reject(new Error(`Failed to access the content of the article with url ${response.url}.`));
				}
			})
			.then((article) => {
				if (editMode) {
					parseArticleForEdit(article);
				} else {
					parseArticle(article, commentPage);
				}
				return Promise.resolve();
			}).catch(error => {
				const errMsgObj = {
					errMessage: error
				};
				targetElm.innerHTML =
					Mustache.render(
						document.getElementById("template-articles-error").innerHTML,
						errMsgObj
					);
			});
	}

	function parseArticle(article, commentPage) {
		article.parsedImg = (article.imageLink == "" || article.imageLink == null) ? "" : "<img class='comment-img' src='" + article.imageLink + "'>";
		article.created = (new Date(article.dateCreated)).toLocaleString();

		article.updated = (new Date(article.lastUpdated)).toLocaleString();

		article.back = `#articles/${page}/`;
		article.edit = `#artEdit/${article.id}/${page}`;
		article.delete = `#artDelete/${article.id}/${page}`;

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-info").innerHTML, article);

		fetchComments(article.id, commentPage);
		setupAddComment(article.id);
		setupPageNav(targetElm);
	}

	function parseArticleForEdit(article) {
		article.articleFormMode = "Úprava príspevku";
		article.urlBase = serverUrl;

		article.formSubmitCall = `submitForm(event, '#article/${article.id}/${page}', '${serverUrl}/article/${article.id}', 'PUT')`;

		article.back = `#article/${article.id}/${page}/`;
		article.delete = `#artDelete/${article.id}/${page}/`;

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-edit").innerHTML, article);

		setupPageNav(targetElm);
	}

	function fetchComments(articleId, commentPage) {
		let commentOffset = (Number(commentPage) - 1) * 10;
		fetch(`${serverUrl}/article/${articleId}/comment/?max=10&offset=${commentOffset}`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else { //if we get server error
					return Promise.reject(new Error(`Failed to access comments of the article with url ${response.url}.`));
				}
			})
			.then((responseJSON) => {
				return responseJSON.comments;
			})
			.then((comments) => {
				let parsedHTML = "";
				comments.forEach(comment => {
					comment.created = (new Date(comment.dateCreated)).toLocaleString();
					comment.updated = (new Date(comment.lastUpdated)).toLocaleString();

					parsedHTML += Mustache.render(document.getElementById("template-article-comment").innerHTML, comment);
				});
				document.getElementById("articleComments").innerHTML = parsedHTML;
				return Promise.resolve();
			})
			.catch(error => {
				const errMsgObj = {
					errMessage: error
				};
				targetElm.innerHTML =
					Mustache.render(
						document.getElementById("template-articles-error").innerHTML,
						errMsgObj
					);
			});
	}

	function setupAddComment(articleId) {
		const commentForm = document.getElementById("addCommentForm");

		commentForm.addEventListener("submit", submitComment);

		function submitComment(event) {
			event.preventDefault();

			const authorVal = commentForm.elements.namedItem("author").value.trim();
			const textVal = commentForm.elements.namedItem("text").value.trim();

			if (authorVal == "" || textVal == "") {
				return;
			}

			const request = {
				author: authorVal,
				text: textVal,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(request)
			};
		
			let completeUrl = `${serverUrl}/article/${articleId}/comment`;

			fetch(completeUrl, options)
				.then(response => {
					if (response.status == 201) {
						return response.json();
					} else {
						return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
					}
				})
				.then(comment => {
					comment.created = (new Date(comment.dateCreated)).toLocaleString();
					comment.updated = (new Date(comment.lastUpdated)).toLocaleString();
					
					document.getElementById("articleComments").innerHTML += Mustache.render(document.getElementById("template-article-comment").innerHTML, comment);
					return Promise.resolve();
				})
				.catch(error => {
					console.error("Failed to add comment, " + error);
				}).finally(() => 
					document.getElementById('articleCommentForm').classList.add("hidden")
				);
				
		}
	}
}

export function setupAddArticle(targetElm, page, serverUrl) {
	let obj = {
		back: `#articles/${page}`,
		articleFormMode: `Pridanie nového príspevku`,
		formSubmitCall: `submitForm(event, '#articles/${page}/', '${serverUrl}/article', 'POST')`
	}

	targetElm.innerHTML = Mustache.render(document.getElementById("template-article-edit").innerHTML, obj);

	setupPageNav(targetElm);
}

function setupPageNav(targetElm) {

	let content = targetElm;
	let pageNavElement = document.getElementById("pageNav")

	let scrolling = true;

	document.addEventListener("scroll", () => {
		scrolling = true;
	});

	setInterval(() => {
		if (scrolling) {
			scrolling = false;

			let docEl = document.documentElement;
			let bodyEl = document.body;

			if ((docEl && docEl.scrollTop > content.offsetHeight + content.offsetTop - window.innerHeight) ||
				(bodyEl && bodyEl.scrollTop > content.offsetHeight + content.offsetTop - window.innerHeight)) {
				pageNavElement.classList.add("no-fixed");
			} else {
				pageNavElement.classList.remove("no-fixed");
			}
		}
	}, 250);
}