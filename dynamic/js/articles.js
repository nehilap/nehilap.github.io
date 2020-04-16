export function setupArticles() {
	let articlesElement = document.getElementById("articlesContainer");
	const url = "http://wt.kpi.fei.tuke.sk/api/article";
	let articlesList = []

    fetch(url)
    .then(response =>{
        if(response.ok){
            return response.json();
        }else{ //if we get server error
            return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
        }
    })
    .then(responseJSON => {
		articlesList = responseJSON.articles;
		return Promise.resolve();
	})
	.then(() => {
		let cntRequests = articlesList.map(
			article => fetch(`${url}/${article.id}`)
		);
		return Promise.all(cntRequests);
	})
	.then(responses =>{
		let failed="";
		for(let response of responses) {
			if(!response.ok) failed+=response.url+" ";
		}
		if(failed===""){
			return responses;
		}else{
			return Promise.reject(new Error(`Failed to access the content of the articles with urls ${failed}.`));
		}
	})
	.then(responses => {
		return Promise.all(responses.map(resp => resp.json()))
	})
	.then(articles => {
		for(let i = 0; i < articles.length; i++) {
			articlesList[i].content = articles[i].content;
		}
		return Promise.resolve();
	})
	.then(() => {
		parseArticles();
	})
    .catch (error => { ////here we process all the failed promises
        const errMsgObj = {errMessage:error};
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
			console.log(article);
			parsedHTML += Mustache.render(document.getElementById("template-article").innerHTML, article);
		})
		articlesElement.innerHTML = parsedHTML;
	}
}