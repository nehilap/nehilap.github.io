import {
	setupScrollBehaviour,
	refreshScroll
}from './scrollingNav.js';

export function setupArticles(targetElm, page, serverUrl) {
	let offset = (Number(page) - 1) * 20;
	let articlesElement = document.getElementById("articlesContainer");
	let pageNavElement = document.getElementById("pageNav")
	
	setupScrollBehaviour(articlesElement);

	const url = serverUrl + "/articles";
	let fetchUrl = url + `/?max=20&offset=${offset}`;

	const tagsToFilter = JSON.parse(localStorage.filteredTags);
	tagsToFilter.forEach((tag) => {
		fetchUrl += `&tag=${tag}`
	}); 

	let articlesList = [];

	fetch(fetchUrl)
		.then(response => {
			if (response.ok) {
				return response.json();
			} else { //if we get server error
				return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
			}
		})
		.then(responseJSON => {
			articlesList = responseJSON.articles;
			
			setupPageNav(responseJSON.meta.offset, responseJSON.meta.totalCount);

			parseArticles();
			return Promise.resolve();
		})
		/*.then(() => {
			let cntRequests = articlesList.map(
				article => fetchOneByOne(article)
			);

			return Promise.all(cntRequests);
		})*/
		.catch(error => { ////here we process all the failed promises
			const errMsgObj = {
				errMessage: error
			};
			articlesElement.innerHTML =
				Mustache.render(
					document.getElementById("template-articles-error").innerHTML,
					errMsgObj
				);
		});



	function parseArticles() {
		let parsedHTML = "";

		articlesList.forEach(article => {
			article.articleLink = `#article/${article.id}/${page}/1`;
			article.created = (new Date(article.dateCreated)).toLocaleString();
				
			const tagsToFilter = JSON.parse(localStorage.filteredTags);
			article.tags = article.tags.filter(tag => !tagsToFilter.includes(tag));

			parsedHTML += Mustache.render(document.getElementById("template-article").innerHTML, article);
		})
		articlesElement.innerHTML = parsedHTML;

		refreshScroll();
		//scrolling = true;
	}

	function setupPageNav(offset, totalCount) {
		let obj = {};

		if (Number(offset) + 20 < totalCount) {
			obj.next = Number(page) + 1;
		}
		if (page > 1) {
			obj.previous = Number(page) - 1;
		}
		
		if(obj.next || obj.previous) {
			pageNavElement.innerHTML = Mustache.render(document.getElementById("template-page-nav").innerHTML, obj);
		}

		localStorage.latestPage = page;
	}
}