export function setupArticles(page) {
	let offset = (Number(page) - 1) * 20;
	let articlesElement = document.getElementById("articlesContainer");
	let pageNavElement = document.getElementById("pageNav")
	let pageFooter = document.getElementsByTagName("footer")[0];

	/*
	console.log("scroll " + document.documentElement.scrollTop);
	console.log("articles " + articlesElement.offsetHeight);
	console.log("footer " + pageFooter.offsetTop);
	*/

	let scrolling = false;

	document.addEventListener("scroll", () => {
		scrolling = true;
	});

	setInterval(() => {
		if (scrolling) {
			scrolling = false;

			let docElement = document.documentElement;

			if (docElement.scrollTop > articlesElement.offsetHeight - (pageFooter.offsetHeight)) {
				pageNavElement.classList.add("no-fixed");
			} else {
				pageNavElement.classList.remove("no-fixed");
			}
		}
	}, 250);


	const url = `https://wt.kpi.fei.tuke.sk/api/article`;
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
				article => fetchOneByOne(article)
			);

			return Promise.all(cntRequests);
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

	function fetchOneByOne(article) {
		fetch(`${url}/${article.id}`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else { //if we get server error
					return Promise.reject(new Error(`Failed to access the content of the articles with urls ${response.url}.`));
				}
			})
			.then(article => {
				for (let i = 0; i < articlesList.length; i++) {
					if (articlesList[i].id == article.id) {
						articlesList[i].content = article.content;
					}
				}
				return Promise.resolve();
			})
			.then(() => {
				parseArticles();
			})
	}

	function parseArticles() {
		let parsedHTML = "";

		articlesList.forEach(article => {
			article.parsedImg = (article.imageLink == "" || article.imageLink == null) ? "" : "<img class='comment-img' src='" + article.imageLink + "'>";
			article.created = (new Date(article.dateCreated)).toLocaleString();

			parsedHTML += Mustache.render(document.getElementById("template-article").innerHTML, article);
		})
		articlesElement.innerHTML = parsedHTML;

		scrolling = true;
	}

	function setupPageNav() {
		let obj = {};

		if (articlesList.length > 20) {
			obj.next = Number(page) + 1;
			articlesList.pop(); // remove last article, was used only to find out if there is next page
		}
		if (page > 1) {
			obj.previous = Number(page) - 1;
		}

		pageNavElement.innerHTML = Mustache.render(document.getElementById("template-page-nav").innerHTML, obj);

		localStorage.latestPage = page;
	}
}