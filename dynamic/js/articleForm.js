function showFileUpload(){
	document.getElementById('fileUpload').classList.remove("hidden");
	document.getElementById('btShowFileUpload').classList.add("hidden");
}

function cancelFileUpload(){
	document.getElementById('fileUpload').classList.add("hidden");
	document.getElementById('btShowFileUpload').classList.remove("hidden");
}