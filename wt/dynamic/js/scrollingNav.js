let scrolling = true;
let interval;

export function setupScrollBehaviour(targetElm) {
	/*
	let pageFooter = document.getElementsByTagName("footer")[0];
	let banner = document.getElementById("intro");
	*/
	/*
	console.log("scroll " + document.documentElement.scrollTop);
	console.log("articles " + articlesElement.offsetHeight);
	console.log("footer " + pageFooter.offsetTop);
	*/
	if(interval) {
		clearInterval(interval);
	}

	let content = targetElm;
	let pageNavElement = document.getElementById("pageNav")

	document.addEventListener("scroll", () => {
		scrolling = true;
	});

	interval = setInterval(() => {
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

export function refreshScroll() {
	scrolling = true;
}