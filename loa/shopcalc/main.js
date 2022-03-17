const form = document.getElementById("calculateForm");
const historyElem = document.getElementById("historyElem");

const outCCost = document.getElementById("outCCost");
const outCValue = document.getElementById("outCValue");
const outCrCost = document.getElementById("outCrCost");

tryInitParams();

let history = JSON.parse(localStorage.getItem("history"));
setHistory(history);

// ...and take over its submit event.
form.addEventListener("submit", function (event) {
	event.preventDefault();

	let data = {
		nItems: document.getElementById("nItems").value,
		cCost: document.getElementById("cCost").value,
		cPrice: document.getElementById("cPrice").value,
		nBundle: document.getElementById("nBundle").value,
		iCost: document.getElementById("iCost").value,
		iCraft: document.getElementById("iCraft").value
	}

	calculateOut(data);

	if (history == null) {
		history = [data];
	} else {
		history.unshift(data);
	}

	localStorage.setItem("history", JSON.stringify(history));
	setHistory(history);
	addUrlParameters(data);
});

function setHistory(history) {
	if (history == null) {
		return;
	}
	while (historyElem.firstChild) {
		historyElem.removeChild(historyElem.lastChild);
	}

	for (let index = 0; index < history.length; index++) {
		const element = history[index];

		var tag = document.createElement("a");
		tag.href = "#";
		tag.addEventListener("click", function (event) {
			reuseData(history[index]);
			addUrlParameters(history[index]);
		})
		var text = document.createTextNode(history[index].nItems + ", " + history[index].cCost + ", " + history[index].cPrice + ", " + history[index].iCost + ", " + history[index].iCraft);
		tag.appendChild(text);
		historyElem.appendChild(tag);
	}
}

function reuseData(data) {
	document.getElementById("nItems").value = data.nItems;
	document.getElementById("cCost").value = data.cCost;
	document.getElementById("cPrice").value = data.cPrice;
	document.getElementById("nBundle").value = data.nBundle;
	document.getElementById("iCost").value = data.iCost;
	document.getElementById("iCraft").value = data.iCraft;

	calculateOut(data)
}

function calculateOut(data) {
	outCCost.innerText = (data.cPrice / 95 * data.cCost).toFixed(3);
	outCValue.innerText = (data.nItems * data.iCost / data.nBundle).toFixed(3);
	outCrCost.innerText = (data.nItems * data.iCraft).toFixed(3);
}

function tryInitParams() {
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);

	if (params.get("nItems") != null) {
		data = Object.fromEntries(params.entries());
		reuseData(data);
	}
}

function addUrlParameters(data) {
	window.location.search = new URLSearchParams(data).toString()
}