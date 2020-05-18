let nav = document.getElementsByTagName("nav")[0];
let menuBar = document.getElementsByClassName("menu-bar")[0];

document.addEventListener("click", hideMenu);

menuBar.addEventListener("click", toggleMenu);

function hideMenu(event) {
	//console.log(event.target);
	//console.log(menuBar);
	if (!(event.target == menuBar || event.target.parentNode == menuBar)) {
		//console.log("removed");
		nav.classList.remove("show-menu");
	}
}

function toggleMenu() {
	//console.log("toggled");
	nav.classList.toggle("show-menu");
}