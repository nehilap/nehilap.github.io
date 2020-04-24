import {
	setupArticleComments, 
	setupAddComment
} from './articleComments.js';

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

		article.tags = article.tags.filter(tag => tag != "aniNeh");

		article.back = `#articles/${page}/`;
		article.edit = `#artEdit/${article.id}/${page}`;
		article.delete = `#artDelete/${article.id}/${page}`;

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-info").innerHTML, article);

		setupArticleComments("articleComments", article.id, page, commentPage, serverUrl);
		setupAddComment("articleComments", article.id, page, serverUrl);
		setupPageNav(targetElm);
	}

	function parseArticleForEdit(article) {
		article.articleFormMode = "Úprava príspevku";
		article.urlBase = serverUrl;

		article.formSubmitCall = `submitForm(event, '#article/${article.id}/${page}', '${serverUrl}/article/${article.id}', 'PUT')`;
		
		article.tags = article.tags.filter(tag => tag != "aniNeh");

		article.back = `#article/${article.id}/${page}/`;
		article.delete = `#artDelete/${article.id}/${page}/`;

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-edit").innerHTML, article);

		setupPageNav(targetElm);
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