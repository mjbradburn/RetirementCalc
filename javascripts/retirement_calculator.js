$(document).ready(function () {

    $("#currentincome").autoNumeric('init',{aSign: "$", mDec: "0"});
    $("#retirementincome").autoNumeric('init',{aSign: "$", mDec: "0"});
    $("#currentsavings").autoNumeric('init',{aSign: "$", mDec: "0"});
    $("#totalsavings").autoNumeric('init',{aSign: "$", mDec: "0"});
    $("#monthlysavings").autoNumeric('init',{aSign: "$", mDec: "2"});

    var intInput = document.getElementById("intslider");
    var intOutput = document.getElementById('expectedinterest');
    intOutput.innerHTML = $('#intslider').val() + "%";

    var lifeInput = document.getElementById("lifeslider");
    var lifeOutput = document.getElementById('ageSelected');
    lifeOutput.innerHTML = $('#lifeslider').val();

    var submitBtn = document.getElementById('submit');
    var advancedBtn = document.getElementById('options');
    var printBtn = document.getElementById('print');

    var name = document.getElementById("name");
    var currentAge = document.getElementById('age');
    var retirementAge = document.getElementById('retirementage');
    var currentIncome = $("#currentincome").autoNumeric('get');
    var retirementIncome = $("#retirementincome").autoNumeric('get');
    var currentSavings = $("#currentsavings").autoNumeric('get');
    var socialSecurityCheck = $('#socialsecurity').val();
    var expectedInterest = document.getElementById('expectedinterest');
    var pension = document.getElementById('pension');
    var annuity = document.getElementById('annuity');
    var otherIncome = document.getElementById('otherincome');

    var totalSavings = document.getElementById('totalsavings');
    var monthlySavings = document.getElementById('monthlysavings');

    var lifeFactorMap = {
        [
            [55, 82]
        ]: 18.79,
        [
            [60, 82]
        ]: 16.31,
        [
            [65, 82]
        ]: 13.45,
        [
            [70, 82]
        ]: 10.15,
        [
            [55, 86]
        ]: 20.53,
        [
            [60, 86]
        ]: 18.32,
        [
            [65, 86]
        ]: 15.77,
        [
            [70, 86]
        ]: 12.83,
        [
            [55, 89]
        ]: 21.71,
        [
            [60, 89]
        ]: 19.68,
        [
            [65, 89]
        ]: 17.35,
        [
            [70, 89]
        ]: 14.65,
        [
            [55, 92]
        ]: 22.79,
        [
            [60, 92]
        ]: 20.93,
        [
            [65, 92]
        ]: 18.79,
        [
            [70, 92]
        ]: 16.31,
        [
            [55, 94]
        ]: 23.46,
        [
            [60, 94]
        ]: 21.71,
        [
            [65, 94]
        ]: 19.68,
        [
            [70, 94]
        ]: 17.35,
        [
            [55, 97]
        ]: 24.4,
        [
            [60, 97]
        ]: 22.79,
        [
            [65, 97]
        ]: 20.93,
        [
            [70, 97]
        ]: 18.79
    };

    var savingsFactorMap = {
        10: 1.3,
        15: 1.6,
        20: 1.8,
        25: 2.1,
        30: 2.4,
        35: 2.8,
        40: 3.3
    };
    var contributionMap = {
        10: 0.085,
        15: 0.052,
        20: 0.036,
        25: 0.027,
        30: 0.020,
        35: 0.016,
        40: 0.013
    };



    $(function () {
        $("#fineTune").accordion({
            collapsible: true
        });
    });
    //populate year options
    for(i=1970; i<2015; i++){
        if (i != 1980){
            $("#birthyear").append("<option>" + i + "</option>");
        } else {
            $("#birthyear").append("<option selected>" + i + "</option>");
        }
    }        

    //function to calculate age
    $("#birthyear").change(function(){
        $("#age").val( (new Date).getFullYear() - $("#birthyear").val());
    });

    //function to display interest slider value
    intInput.addEventListener("input", function () {
        intOutput.innerHTML = intInput.value + "%";
    });

    //function to display life expectancy slider value
    lifeInput.addEventListener("input", function () {
        if (lifeInput.value == 82) {
            lifeOutput.innerHTML = lifeInput.value;
        } else if (lifeInput.value > 82 && lifeInput.value < 89) {
            lifeOutput.innerHTML = 86;
        } else if (lifeInput.value > 86 && lifeInput.value < 92) {
            lifeOutput.innerHTML = 89;
        } else if (lifeInput.value > 89 && lifeInput.value < 94) {
            lifeOutput.innerHTML = 92;
        } else if (lifeInput.value > 92 && lifeInput.value < 97) {
            lifeOutput.innerHTML = 94;
        } else {
            lifeOutput.innerHTML = 97;
        }
    });

    //on submit action
    /*submitBtn.onclick = calculate;*/
    $('#submit').click(function(){
        calculate();
        $('#resultpane').slideDown("slow");
        return false;
    })

    //on advanced action
    advancedBtn.onclick = showAdvancedOptions;

    //on print action
    printBtn.onclick = showPrintPage;

    //function to show advanced options
    function showAdvancedOptions() {
        $('#advanced').toggle();
        $('html, body').animate({
    scrollTop: $("#advanced").offset().top
}, 1000);
    };

    //display print page
    function showPrintPage() {
        window.location='retirement_calculator_results.html';
    };

    //estimate social security payments
    function estimateSocSec(income) {
        if (income >= 25000 && income < 40000) {
            return 12000;
        } else if (income >= 40000) {
            return 14500;
        } else {
            return 8000;
        }
    };

    //round years to retirement to multiple of 5
    function yearsToRetirementRounded(age, retage) {
        var years = retage - age;
        if (years < 10) {
            return 0;
        } else if (years >= 10 && years < 15) {
            return 10;
        } else if (years >= 15 && years < 20) {
            return 15;
        } else if (years >= 20 && years < 25) {
            return 20;
        } else if (years >= 25 && years < 30) {
            return 25;
        } else if (years >= 30 && years < 35) {
            return 30;
        } else if (years >= 35 && years < 40) {
            return 35;
        } else if (years >= 40) {
            return 40;
        }
    };

    //show results
        function calculate() {
        var yearsLeft = yearsToRetirementRounded(currentAge.value, retirementAge.value);
        var socialSecurity = estimateSocSec(currentIncome);
        var annualShortfall = retirementIncome - socialSecurity - pension.value - otherIncome.value;
        var totalShortfall = annualShortfall * lifeFactorMap[[retirementAge.value, lifeOutput.innerHTML]];
        var finalSavings = currentSavings * savingsFactorMap[yearsLeft];
        var additionalSavings = totalShortfall - finalSavings;
        var newSavings = additionalSavings * contributionMap[yearsLeft];

        $("#totalsavings").autoNumeric('set',finalSavings + additionalSavings);
        $("#monthlysavings").autoNumeric('set', newSavings/12);

        window.sessionStorage.getItem('name');
        window.sessionStorage.setItem('name', name.value);

        window.sessionStorage.getItem('currentAge');
        window.sessionStorage.setItem('currentAge', currentAge.value);

        window.sessionStorage.getItem('retirementAge');
        window.sessionStorage.setItem('retirementAge', retirementAge.value);

        window.sessionStorage.getItem('expectancy');
        window.sessionStorage.setItem('expectancy', lifeInput.value);

        window.sessionStorage.getItem('retirementIncome');
        window.sessionStorage.setItem('retirementIncome', retirementIncome);

        window.sessionStorage.getItem('currentSavings');
        window.sessionStorage.setItem('currentSavings', currentSavings);

        window.sessionStorage.getItem('socialSecurity');
        window.sessionStorage.setItem('socialSecurity', socialSecurity);

        window.sessionStorage.getItem('totalShortfall');
        window.sessionStorage.setItem('totalShortfall', totalShortfall);

        // window.sessionStorage.getItem('additionalSavings');
        // window.sessionStorage.setItem('additionalSavings', additionalSavings.value);

        window.sessionStorage.getItem('monthlySavings');
        window.sessionStorage.setItem('monthlySavings', newSavings/12);

        window.scrollTo(0, 0);
        return false;
    };


});