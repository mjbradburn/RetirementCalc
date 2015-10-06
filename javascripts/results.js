$(document).ready(function () {

	$("#social_security").autoNumeric('init',{aSign: "$", mDec: "0"});
	$("#monthly_savings").autoNumeric('init',{aSign: "$", mDec: "2"});
	$("#retirement_income").autoNumeric('init',{aSign: "$", mDec: "0"});
	$("#income_total").autoNumeric('init',{aSign: "$", mDec: "0"});
	$("#current_savings").autoNumeric('init',{aSign: "$", mDec: "0"});
	$("#savings_total").autoNumeric('init',{aSign: "$", mDec: "0"});
	$("#ss_total").autoNumeric('init',{aSign: "$", mDec: "0"});
	$("#savings_gap").autoNumeric('init',{aSign: "$", mDec: "0"});

	var name = window.sessionStorage.getItem('name');
	var currentAge = window.sessionStorage.getItem('currentAge');
	var retirementAge = window.sessionStorage.getItem('retirementAge');
	var expectancy = window.sessionStorage.getItem('expectancy');
	var retirementIncome = window.sessionStorage.getItem('retirementIncome');
	var currentSavings = window.sessionStorage.getItem('currentSavings');
	var socialSecurity = window.sessionStorage.getItem('socialSecurity');
	var totalShortfall = window.sessionStorage.getItem('totalShortfall');
	// var additionalSavings = window.sessionStorage.getItem('additionalSavings');
	var monthlySavings = window.sessionStorage.getItem('monthlySavings');
	
	var user_name = document.getElementById("fullname");
	var age = document.getElementById("current_age");
	var retirement_age = document.getElementById("retirement_age");
	var years_to_save = document.getElementById("years_to_save");
	var life_expectancy = document.getElementById("life_expectancy");
	var ret_years = document.getElementById("ret_years");
	var retirement_income = document.getElementById("retirement_income");
	var income_total = document.getElementById("income_total");
	var income_header = document.getElementById("income_header");
	var current_savings = document.getElementById("current_savings");
	var total_savings_header = document.getElementById("total_savings_header");
	var savings_total = document.getElementById("savings_total");
	var social_security = document.getElementById("social_security");
	var total_ss_header = document.getElementById("total_ss_header");
	var ss_total = document.getElementById("ss_total");
	var savings_gap = document.getElementById("savings_gap");
	var monthly_savings = document.getElementById("monthly_savings");

	user_name.innerHTML = name;
	age.innerHTML = currentAge;
	retirement_age.innerHTML = retirementAge;
	years_to_save.innerHTML = retirementAge - currentAge;
	life_expectancy.innerHTML = expectancy;
	ret_years.innerHTML = expectancy - retirementAge;
	retirement_income.innerHTML = retirementIncome;
	income_header.innerHTML = "Total for " + ret_years.innerHTML + " years";
	$("#income_total").autoNumeric('set',$("#retirement_income").autoNumeric('get') * ret_years.innerHTML);

	current_savings.innerHTML = currentSavings;
	total_savings_header.innerHTML = "Estimated value in " + years_to_save.innerHTML + " years";
	$("#savings_total").autoNumeric('set', Math.round(
		$("#current_savings").autoNumeric('get') * Math.pow((1 + (0.03/12)),(12*years_to_save.innerHTML))));
	
	$("#social_security").autoNumeric('set', socialSecurity);
	total_ss_header.innerHTML = "Total for " + (expectancy - 65) + " years"
	$("#ss_total").autoNumeric('set', socialSecurity * (expectancy - 65));
	$("#savings_gap").autoNumeric('set', totalShortfall);
	var contribution = Math.round(monthlySavings*100)/100
	$("#monthly_savings").autoNumeric('set', contribution);
	


});
