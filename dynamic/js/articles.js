export function setupArticles(page) {
	let offset = (Number(page) - 1) * 20;
	let articlesElement = document.getElementById("articlesContainer");
	let pageNavElement = document.getElementById("pageNav")
	const url = `http://wt.kpi.fei.tuke.sk/api/article`;
	const fetchUrl = url + `/?max=21&offset=${offset}`;
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
			setupPageNav();
			return Promise.resolve();
		})
		.then(() => {
			let cntRequests = articlesList.map(
				article => fetch(`${url}/${article.id}`)
			);
			return Promise.all(cntRequests);
		})
		.then(responses => {
			let failed = "";
			for (let response of responses) {
				if (!response.ok) failed += response.url + " ";
			}
			if (failed === "") {
				return responses;
			} else {
				return Promise.reject(new Error(`Failed to access the content of the articles with urls ${failed}.`));
			}
		})
		.then(responses => {
			return Promise.all(responses.map(resp => resp.json()))
		})
		.then(articles => {
			for (let i = 0; i < articles.length; i++) {
				articlesList[i].content = articles[i].content;
			}
			return Promise.resolve();
		})
		.then(() => {
			parseArticles();
		})
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
			article.parsedImg = (article.imageLink == "" || article.imageLink == null) ? "" : "<img class='comment-img' src='" + article.imageLink + "'>";
			article.created = (new Date(article.dateCreated)).toLocaleString();
			parsedHTML += Mustache.render(document.getElementById("template-article").innerHTML, article);
		})
		articlesElement.innerHTML = parsedHTML;
	}

	function setupPageNav() {
		let obj = {};

		if(articlesList.length > 20) {
			obj.next = Number(page) + 1;
		}
		if(page > 1) {
			obj.previous = Number(page) - 1;
		}

		pageNavElement.innerHTML = Mustache.render(document.getElementById("template-page-nav").innerHTML, obj);

		localStorage.latestPage = page;
	}
}