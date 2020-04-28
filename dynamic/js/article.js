import {
	setupArticleComments, 
	setupAddComment
} from './articleComments.js';
import {
	setupScrollBehaviour
}from './scrollingNav.js';

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
					parseArticleForEdit(article, commentPage);
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

		const tagsToFilter = JSON.parse(localStorage.filteredTags);
		article.tags = article.tags.filter(tag => !tagsToFilter.includes(tag));

		article.back = `#articles/${page}/`;
		article.edit = `#artEdit/${article.id}/${page}/`;
		article.delete = `#artDelete/${article.id}/${page}/`;

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-info").innerHTML, article);

		setupArticleComments("articleComments", article.id, page, commentPage, serverUrl);
		setupAddComment("articleComments", article.id, page, serverUrl);
		setupScrollBehaviour(targetElm);
	}

	function parseArticleForEdit(article) {
		article.articleFormMode = "Úprava príspevku";
		article.urlBase = serverUrl;

		article.back = `#article/${article.id}/${page}/${sessionStorage.latestCommentPage}/`;
		article.delete = `#artDelete/${article.id}/${page}/`;

		const tagsToFilter = JSON.parse(localStorage.filteredTags);
		article.tags = article.tags.filter(tag => !tagsToFilter.includes(tag));

		targetElm.innerHTML = Mustache.render(document.getElementById("template-article-edit").innerHTML, article);

		setupArticleFormSubmit(`${article.back}`, `${serverUrl}/article/${article.id}`, 'PUT');
		setupScrollBehaviour(targetElm);
	}
}

export function setupAddArticle(targetElm, page, serverUrl) {
	let obj = {
		back: `#articles/${page}`,
		articleFormMode: `Pridanie nového príspevku`,
	}

	targetElm.innerHTML = Mustache.render(document.getElementById("template-article-edit").innerHTML, obj);

	setupArticleFormSubmit(`#articles/${page}/`, `${serverUrl}/article`, 'POST');
	setupScrollBehaviour(targetElm);
}

function setupArticleFormSubmit(backLink, completeUrl, method) {
	const commentForm = document.getElementById("articleForm");

	if(googleUser) {
		document.getElementById("author").value = googleUser.getBasicProfile().getName();
	}

	commentForm.addEventListener("submit", submitForm);

	function submitForm(event) {
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
			articleData.tags.concat(JSON.parse(localStorage.filteredTags));
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
	
				alertSpan.innerText = `Failed to save the updated article on server. ${error}`;
	
			})
			.finally(() => window.location = backLink);	
	}
}