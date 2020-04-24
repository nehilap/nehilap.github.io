import {
    setupComments
} from './comments.js';
import {
    setupForm
} from './contactForm.js';
import {
    setupArticles
} from './articles.js';
import {
    setupArticle,
    setupAddArticle
} from './article.js';
import {
	setupArticleComments
} from './articleComments.js';

const SERVER_URL = `https://wt.kpi.fei.tuke.sk/api`;

export default [

    {
        hash: "welcome",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML
    },
    {
        hash: "articles",
        target: "router-view",
        getTemplate: fetchAndDisplayArticles
    },
    {
        hash: "contact",
        target: "router-view",
        getTemplate: displayForm
    },
    {
        hash: "comments",
        target: "router-view",
        getTemplate: displayComments
    },
    {
        hash: "land",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-land").innerHTML
    },
    {
        hash: "article",
        target: "router-view",
        getTemplate: displayArticle
    },
    {
        hash: "artEdit",
        target: "router-view",
        getTemplate: editArticle
    },
    {
        hash: "artDelete",
        getTemplate: deletArticle
    },
    {
        hash: "artInsert",
        target: "router-view",
        getTemplate: addArticle
    },
    {
        hash: "artComment",
        target: "articleComments",
        getTemplate: displayArticleComments
    }
];

function fetchAndDisplayArticles(targetElm, page) {
    if (page == undefined || page == null || page == "") {
        if (localStorage.latestPage) {
            page = localStorage.latestPage;
        } else {
            page = 1;
        }
        window.location.hash = `#articles/${page}`;
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(document.getElementById("template-articles").innerHTML, {page: page});
    setupArticles(page, SERVER_URL, "");
}

function displayComments(targetElm) {
    document.getElementById(targetElm).innerHTML = document.getElementById("template-web-comments").innerHTML;
    setupComments();
}

function displayForm(targetElm) {
    document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML;
    setupForm();
}

function displayArticle(targetElm, articleId, page, commentPage) {
    setupArticle(document.getElementById(targetElm), articleId, page, false, SERVER_URL, commentPage);
}

function editArticle(targetElm, articleId, page) {
    setupArticle(document.getElementById(targetElm), articleId, page, true, SERVER_URL);
}

function deletArticle(targetElm, articleId, page) {
    let options = {
        method: "DELETE"
    }

    const delUrl = `${SERVER_URL}/article/${articleId}/`

    fetch(delUrl, options)
        .then(response => {
            if (response.status == 204) {
                window.location = `#articles/${page}/`;
                return Promise.resolve();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .catch(error => {
            console.log(`Failed to delete article. ${error}.`);
        });
}

function addArticle(targetElm, page) {
    setupAddArticle(document.getElementById(targetElm), page, SERVER_URL);
}

    
function displayArticleComments(targetElm, articleId, page, commentPage) {
    setupArticleComments(targetElm, articleId, page, commentPage, SERVER_URL);
}