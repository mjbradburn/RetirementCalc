$(document).ready(function () {

	var stored = window.sessionStorage.getItem('age');
	var age = document.getElementById("age");

	age.innerHTML = stored;


});