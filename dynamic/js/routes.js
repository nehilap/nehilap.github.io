import {
    setupComments
} from './comments.js';
import {
    setupForm
} from './contactForm.js';
import {
    setupArticles
} from './articles.js';

//an array, defining the routes
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
        hash: "contactForm",
        target: "router-view",
        getTemplate: displayForm
    },
    {
        hash: "land",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-land").innerHTML
    },
    {
        hash: "comments",
        target: "router-view",
        getTemplate: displayComments

    }
];

function fetchAndDisplayArticles(targetElm, page) {
    if(page == undefined || page == null || page == "") {
       if(localStorage.latestPage) {
           page = localStorage.latestPage;
       } else {
           page = 1;
       }
    }

    document.getElementById(targetElm).innerHTML = document.getElementById("template-articles").innerHTML;
    setupArticles(page);
}

function displayComments(targetElm) {
    document.getElementById(targetElm).innerHTML = document.getElementById("template-web-comments").innerHTML;
    setupComments();
}

function displayForm(targetElm) {
    document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML;
    setupForm();
}