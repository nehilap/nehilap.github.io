const form = document.getElementById("calculateForm");

const outCCost = document.getElementById("outCCost");
const outCValue = document.getElementById("outCValue");
const outCrCost = document.getElementById("outCrCost");

// ...and take over its submit event.
form.addEventListener("submit", function (event) {
	event.preventDefault();

	let data = {
		nItems: document.getElementById("nItems").value,
		cCost: document.getElementById("cCost").value,
		cPrice: document.getElementById("cPrice").value,
		iCost: document.getElementById("iCost").value,
		iCraft: document.getElementById("iCraft").value
	}

	outCCost.innerText = (data.cPrice / 95 * data.cCost).toFixed(3);
	outCValue.innerText = (data.nItems * data.iCost).toFixed(3);
	outCrCost.innerText = (data.nItems * data.iCraft).toFixed(3);
});