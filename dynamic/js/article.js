export function setupArticle(targetElm, articleId, page, editMode) {
	const url = `https://wt.kpi.fei.tuke.sk/api`;

	fetchOne(articleId);

	function fetchOne(articleId) {
		fetch(`${url}/article/${articleId}`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else { //if we get server error
					return Promise.reject(new Error(`Failed to access the content of the article with url ${response.url}.`));
				}
			})
			.then((article) => {
				if(editMode) {
					parseArticleForEdit(article);
				}else {
					parseArticle(article);
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

	function parseArticle(article) {
		article.parsedImg = (article.imageLink == "" || article.imageLink == null) ? "" : "<img class='comment-img' src='" + article.imageLink + "'>";
		article.created = (new Date(article.dateCreated)).toLocaleString();

		article.back = `#articles/${page}/`;
		article.edit = `#artEdit/${article.id}/${page}`;
		article.delete = `#artDelete/${article.id}/${page}`;

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-info").innerHTML, article);

		setupPageNav();
	}

	function parseArticleForEdit(article) {
		article.articleFormMode = "Úprava príspevku";
		article.urlBase = url;
		
		article.formSubmitCall = `editArticle(event, ${article.id}, ${page}, '${url}')`;

		article.parsedImg = (article.imageLink == "" || article.imageLink == null) ? "" : "<img class='comment-img' src='" + article.imageLink + "'>";
		article.created = (new Date(article.dateCreated)).toLocaleString();

		article.back = `#article/${article.id}/${page}/`;
		article.delete = `#artDelete/${article.id}/${page}/`;

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-edit").innerHTML, article);

		setupPageNav();
	}

	function setupPageNav() {

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

}