jQuery(function($){



$function ()

    var chartDiv = document.createElement("div");
    chartDiv.setAttribute("id", "chart-div");
    chartDiv.setAttribute("class","tab");
    
    DABtn.setAttribute("id", "defaultOpen");
    var DAText = document.createTextNode("Dark Ascension");
    DABtn.appendChild(DAText);
    document.body.appendChild(chartDiv);
    chartDiv.appendChild(DABtn)

    document.getElementById("defaultOpen").click();

})