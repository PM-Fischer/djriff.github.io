const default_background_color = "#343a40";
const default_font_color = "#f8f9fa";
const default_axis_color = "#828282";

const light_color = "#eeeeee";
const medium_color = "#999999";
const dark_color = "#343a40";

//Commented out for now until I can decide on colors.
const ilevel_color_table = {
/*
"300": "#1abc9c", 
"305": "#000000", 
"310": "#3498db", 
"315": "#9b59b6", 
"320": "#34495e", 
"325": "#f1c40f",
"330": "#e67e22",
"335": "#e74c3c",
"340": "#ecf0f1",
"345": "#95a5a6",
"350": "#16a085",
"355": "#27ae60",
"360": "#2980b9",
"365": "#8e44ad",
"370": "#2c3e50",
"375": "#f39c12",
"380": "#d35400",
"385": "#c0392b",
"390": "#bdc3c7",
"395": "#7f8c8d",
"400": "#2ecc71",
*/
};


var WCP_Chart = function WCP_Chart(id, options) {
    this.chartId = id;
	this.options = options;
	this.default
   
    this.chartOptions = {
        chart: {
            renderTo: this.chartId,
            type: 'bar',
            backgroundColor: default_background_color
            },
        title: {
            style: {
                color: default_font_color,
                fontWeight: 'bold'
                },
            text: "Trinket Chart - Dark Ascension"
            },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    align: 'right',
                    enabled: false,
                    pointFormat: "Value: {point.y:,.0f} mm"
                },
                enableMouseTracking: true,
                pointWidth: 15,
                spacing: 20,
                events: {
                	legendItemClick: function () {
          				return false;
          			}
                },
                allowPointSelect: false
            }
        },
        xAxis: {
            labels: {
            	useHTML: true,
                style: {
                    color: default_font_color,
                    fontWeight: 'bold',
                    fontSize: 14,
                    events: {
	                	legendItemClick: function () {
	          				return false;
          				}
                	},
                }
            }
        },
        yAxis: {
        	crosshair: {
        		color: 'white',
        		width: 3,
        		snap: false,
        		zIndex: 10
        	},
            labels: {
                style: {
                    color: default_font_color
                }
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: default_font_color,
                    fontSize: 14
                }
            },
            gridLineColor: '#616c77',
            title: {
                text: 'Damage Per Second',
                color: default_font_color
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            borderColor: medium_color,
            borderWidth: 1,
            floating: false,
            itemMarginBottom: 3,
            itemMaginTop: 0,
            reversed: true,
            shadow: false,
            verticalAlign: 'middle',
            x: 0,
            y: 0,
            title: {
                text: "Item Level",
                style:
                    {
                    color:light_color,
                    fontWeight:'bold',
                },
            },
        itemStyle: {
            color: default_font_color,
            fontWeight: 'bold',
            },
        }
    };
};
 
WCP_Chart.prototype.init = function() {
    // Setup your dummy charts, tabs, initiate the inial chart
	this.chart = Highcharts.chart(this.chartId, this.chartOptions); // Empty chart.
	if (this.options.hasOwnProperty('buttons')){
		this.buildButtons();
	}
	var first = Object.keys(this.options.charts)[0];
	if (this.options.charts[first].type == 'trinket'){
        this.updateTrinketChart(first); // Setup the initial chart
    } else if (this.options.charts[first].type == 'azerite-trait') {
        this.updateTraitChart(first); // Setup the initial chart
    }
    else {
        console.log(this.options.carts[0].type,'is an invalid type');
        return;
    }
};

 
WCP_Chart.prototype.updateTrinketChart = function(chartName) {
	jQuery.getJSON("https://rawgit.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/"+ this.options.charts[chartName].src + ".json" , function(data) {
		var sortedItems = [];
		var dpsSortedData = data["sorted_data_keys"];
		var wowheadTooltips = [];
		for (dpsName of dpsSortedData)
		{
			chartLink = "";
			truncatedName = dpsName.trim()
			dpsName = dpsName.replace(/ /g,'_');
			itemID = data["item_ids"][dpsName];
			chartLink = "";
			chartLink += "<div style=\"display:inline-block; margin-bottom:-3px\">";
			chartLink += "<a style=\"color: white; font-size: 16px; padding: 3px; cursor: default\" href=#";
			chartLink += " onclick=\"return false\"";
			chartLink += " rel=\"https://www.wowhead.com/item=";
			chartLink += itemID;
			chartLink += "/"
			chartLink += dpsName.trim().replace(/ /g,'_');
			chartLink += "\" target=\"blank\"";
			chartLink += " class=\"chart_link\"";
			chartLink += ">";
			chartLink += dpsName.trim();
			chartLink += "</a>";
			chartLink += "</div>";

			//Push link into array
			wowheadTooltips.push(chartLink);
		}
		while (this.chart.series.length > 0){
			this.chart.series[0].remove(false);
		}
		this.chart.update({
			xAxis: {
				categories: wowheadTooltips,
				useHTML: true,
			},
			legend: {
            title: {
                text: "Item Level"
            	}
        	},
			title: {
				style: {
					color: default_font_color,
					fontWeight: 'bold'
					},
				text: this.options.charts[chartName].title
				},
			tooltip: {
        	shared: true,
            useHTML: true,
            headerFormat: "<b>(point.x)</b>",	//'<span style="font-size: 14px"><b>{point.key}</b></span><br/>',
            style: {
            	color: default_font_color,
        	},
            pointFormat: '<span style=color: "{point.color}"><b>{series.name}</b></span>: <b>{point.y}</b><br/>',
            padding: 5,
            formatter: function() {
                var s = '<div style="margin: -4px -6px -11px -7px; padding: 3px 3px 6px 3px; background-color:';
                s += dark_color;
                s += '"><div style=\"margin-left: 9px; margin-right: 9px; margin-bottom: 6px; font-weight: 700;\">' + this.x + '</div>'
                var baseAmount = data["data"]["Base"]["300"];
                var cumulativeAmount = 0 + baseAmount;
                for (var i = this.points.length -1; i >= 0; i--) {
                    cumulativeAmount += this.points[i].y;
                    if(this.points[i].y != 0) {
                        s += '<div><span style=\"margin-left: 9px; border-left: 9px solid ' +
                            this.points[i].series.color + ';' +
                            ' padding-left: 4px;' +
                            '\">' +
                            this.points[i].series.name +
                            '</span>:&nbsp;&nbsp;' +
                            Intl.NumberFormat().format(cumulativeAmount - baseAmount);
                            s+=' dps';
                            s+= ' - ';
                            let percentage = (cumulativeAmount/baseAmount*100-100).toFixed(2);
                            s+= percentage;
                            if (percentage > 0)
                            {
                            	s+= '% (Increase)';
                            }
                            else
                            {
                            	s+= '% (decrease)';
                            }
                            
                            


                    }
                }
                s+= '</div>';
                return s;
               },
                
            },

		})

		let itemLevels = data["simulated_steps"];
		for (currIlevel of itemLevels)
			{
				let maxItemLevel = data["simulated_steps"][0];
				let itemLevelDpsValues = [];
				for(sortedData of dpsSortedData)
					{
						var keys = [];
						for(var k in data["data"][sortedData]) keys.push(k); //Pull all item levels of the trinket.
						let minItemLevel = keys[0];
					   
						sortedData = sortedData.trim();
					   
						let dps = data["data"][sortedData][currIlevel];
						let baselineDPS = data["data"]["Base"]["300"];
					   
						//Check to make sure DPS isn't 0
						if(dps > 0)
							{
						   
							if(currIlevel == minItemLevel)
								{
									//If lowest ilvl is looked at, subtract base DPS
									itemLevelDpsValues.push(dps - baselineDPS);
								}
							else
							{
								itemLevelDpsValues.push(dps - data["data"][sortedData][currIlevel - 5]);
							}
						}
						else
							{
							if (currIlevel in data["data"][sortedData])
								{
								itemLevelDpsValues.push(dps);
								}
							else
								{
								itemLevelDpsValues.push(0);
								}
							}
					   
					}
				//this.chart.yAxis[0].update({categories: dpsSortedData});
			   
				this.chart.addSeries({
					color: ilevel_color_table[currIlevel],
					data: itemLevelDpsValues,
					name: currIlevel,
					showInLegend: true
				}, false);
			}
		document.getElementById(this.chartId).style.height = 200 + dpsSortedData.length * 30 + "px";
		this.chart.setSize(document.getElementById(this.chartId).style.width, document.getElementById(this.chartId).style.height);
		//this.chart.renderTo(this.chartId);
		
		this.chart.redraw();
		try {
			$WowheadPower.refreshLinks();
				} 
		catch (error) {
  				console.log(error);}
		

	}.bind(this)).fail(function(){
		console.log("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
		alert("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
	});
};

WCP_Chart.prototype.updateTraitChart = function(chartName) {
	jQuery.getJSON("https://rawgit.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/"+ this.options.charts[chartName].src + ".json" , function(data) {
		let sortedItems = [];
		let dpsSortedData = data["sorted_data_keys"];
		var wowheadTooltipsTraits = [];
		for (dpsName of dpsSortedData)
		{
			chartLink = "";
			truncatedName = dpsName.trim()
			spellID = data["spell_ids"][dpsName];
			chartLink = "";
			chartLink += "<div style=\"display:inline-block; margin-bottom:-3px\">";
			chartLink += "<a style=\"color: white; font-size: 16px; padding: 3px; cursor: default\" href=#";
			chartLink += " onclick=\"return false\"";
			chartLink += " rel=\"https://www.wowhead.com/spell=";
			chartLink += spellID;
			chartLink += "/"
			chartLink += dpsName.trim().replace(/ /g,'-');
			chartLink += "\" target=\"blank\"";
			chartLink += " class=\"chart_link\"";
			chartLink += ">";
			chartLink += dpsName.trim();
			chartLink += "</a>";
			chartLink += "</div>";
			//Push link into array
			wowheadTooltipsTraits.push(chartLink);
		}
		while (this.chart.series.length > 0){
			this.chart.series[0].remove(false);
		}
		this.chart.update({
			xAxis: {
				categories: wowheadTooltipsTraits,
				useHTML: true,
				labels: {
					x: -30,
				},
			},
			title: {
				style: {
					color: default_font_color,
					fontWeight: 'bold'
					},
				text: this.options.charts[chartName].title
				},
			legend: {
            title: {
                text: "Stack Count"
            	}
        	},
			tooltip: {
        	shared: true,
            useHTML: true,
            headerFormat: "<b>(point.x)</b>",	//'<span style="font-size: 14px"><b>{point.key}</b></span><br/>',
            style: {
            	color: default_font_color,
        	},
            pointFormat: '<span style=color: "{point.color}"><b>{series.name}</b></span>: <b>{point.y}</b><br/>',
            padding: 5,
            //shared: true
           
            
            formatter: function() {
                var s = '<div style="margin: -4px -6px -11px -7px; padding: 3px 3px 6px 3px; background-color:';
                s += dark_color;
                s += '"><div style=\"margin-left: 9px; margin-right: 9px; margin-bottom: 6px; font-weight: 700;\">' + this.x + '</div>'
                var baseAmount = data["data"]["Base"]["1_stack"];
                var cumulativeAmount = 0 + baseAmount;
                for (var i = this.points.length -1; i >= 0; i--) {
                    cumulativeAmount += this.points[i].y;
                    if(this.points[i].y != 0) {
                        s += '<div><span style=\"margin-left: 9px; border-left: 9px solid ' +
                            this.points[i].series.color + ';' +
                            ' padding-left: 4px;' +
                            '\">' +
                            this.points[i].series.name +
                            '</span>:&nbsp;&nbsp;' +
                            Intl.NumberFormat().format(cumulativeAmount - baseAmount);
                            s+=' dps';
                            s+= ' - ';
                            let percentage = (cumulativeAmount/baseAmount*100-100).toFixed(2);
                            s+= percentage;
                            if (percentage > 0)
                            {
                            	s+= '% (Increase)';
                            }
                            else
                            {
                            	s+= '% (decrease)';
                            }
                            
                            


                    }
                }
                s+= '</div>';
                return s;
               },
                
            },
		});
		for (let stackCount of [3,2,1])
		{
			let maxItemLevel = data["simulated_steps"][0].split("_")[1];
			let stackName = stackCount + "_" + maxItemLevel;
			let itemLevelDpsValues = [];
			for(sortedData of dpsSortedData)
				{

					sortedData = sortedData.trim();
					
					let dps = data["data"][sortedData][stackName];
					let baselineDPS = data["data"]["Base"]["1_"+maxItemLevel];
					
					//Check to make sure DPS isn't 0
					if(dps > 0) 
						{
						
						if(stackCount == 1) 
							{
								//If lowest ilvl is looked at, subtract base DPS
								itemLevelDpsValues.push(dps - baselineDPS);
							}
						else 
						{
							itemLevelDpsValues.push(dps - data["data"][sortedData][stackCount - 1 + "_" + maxItemLevel]);
						}
					}
					else 
						{
						if (stackName in data["data"][sortedData]) 
							{
						itemLevelDpsValues.push(dps);
							} 
						else 
							{
						itemLevelDpsValues.push(0);
							}
						}
					
				}
			let newStackName = stackName.split("_")[0];
			//standard_chart.yAxis[0].update({categories: dpsSortedData});
			this.chart.addSeries({
				color: ilevel_color_table[stackName],
				data: itemLevelDpsValues,
				name: newStackName,
				showInLegend: true
			}, false);
		}
		document.getElementById(this.chartId).style.height = 200 + dpsSortedData.length * 30 + "px";
		this.chart.setSize(document.getElementById(this.chartId).style.width, document.getElementById(this.chartId).style.height);
		//this.chart.renderTo(this.chartId);
		this.chart.redraw();
		try {
			$WowheadPower.refreshLinks();
				} 
		catch (error) {
  				console.log(error);}
			
	}.bind(this)).fail(function(){
		console.log("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
		alert("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
	});
};

WCP_Chart.prototype.buildButtons = function() {
    var container = document.createElement('div');
    container.id = 'button-container';
    for(i = 0; i < this.options.buttons.length; i++) {
        var d = document.createElement('div');
        d.id = Object.keys(this.options.buttons)[i];
        for (x = 0; x < this.options.buttons[d.id].length; x++) {
            var b = document.createElement('button');
            b.id = Object.values(this.options.buttons[d.id])[x];
            d.appendChild(b);
        }
        container.appendChild(d);
    }
    var parent = document.getElementById(this.chartId);
    parent.parentNode.insertBefore(container, parent);
};

WCP_Chart.prototype.changeChart = function(event) {
	
}

WCP_Chart.prototype.tabClicked = function(event) {
    var chartName = event.target;
    console.log(chartName);
    if (this.options.charts[chartName].type == 'trinket'){
            this.updateTrinketChart(chartName); // Setup the initial chart
        } else if (this.options.charts[chartName].type == 'azerite-trait') {
            this.updateTraitChart(chartName); // Setup the initial chart
    }
};
    
//var buttons = document.querySelector(this.chartId + '_tabs > button');
//buttons.addEventListener('click', tabClicked);

/*
Button Layout:
[Dark Ascension][Legacy of the Void] --"talent-div"
[Trinket][Azerite Trait] --"Trinket-Trait-div"
[Composite][Single Target][Dungeon] --"Fight-Style-Div"
*/

//Create Div for other charts
var externalLinks = document.createElement("div");
externalLinks.setAttribute("id", "external-links");
externalLinks.setAttribute("class", "tabcontent");

var trinketCalc = document.createElement("BUTTON");
trinketCalc.setAttribute("id", "trinket-calculator-btn");
trinketCalc.setAttribute("class", "button");
trinketCalc.setAttribute("onClick", "location.href='trinket_calc.html'");
var trinketCalcText = document.createTextNode("Trinket Calculator");
trinketCalc.appendChild(trinketCalcText)
externalLinks.appendChild(trinketCalc);
document.body.appendChild(externalLinks);

var hr = document.createElement("hr");
document.body.appendChild(hr);


//Create all the HTML for the elements for the charts.
//Main Div
var talentDiv = document.createElement("div");
talentDiv.setAttribute("id", "talent-div");
talentDiv.setAttribute("class","tabcontent");

//Talent Buttons
//DA
var DABtn = document.createElement("BUTTON");
DABtn.setAttribute("id", "DABtn");
DABtn.setAttribute("class", "button");
DABtn.setAttribute("onClick", "talentClick('DA')");


//DABtn.setAttribute("onClick", "wcp_charts.tabClicked(this.id)");
var DAText = document.createTextNode("Dark Ascension");
DABtn.appendChild(DAText);
document.body.appendChild(talentDiv);
talentDiv.appendChild(DABtn)
//LotV
var LotVBtn = document.createElement("BUTTON");
LotVBtn.setAttribute("id", "LotvBtn");
LotVBtn.setAttribute("class", "button");
LotVBtn.setAttribute("onClick", "talentClick('LotV')");
//LotVBtn.setAttribute("onClick", "wcp_charts.tabClicked(this.id)");
var LotVText = document.createTextNode("Legacy of the Void");
LotVBtn.appendChild(LotVText);
document.body.appendChild(talentDiv);
talentDiv.appendChild(LotVBtn)




//Trinket/Trait div's
var TrinketTraitDiv = document.createElement("div");
TrinketTraitDiv.setAttribute("id", "Trinket-Trait-div");
TrinketTraitDiv.setAttribute("class", "tabcontent");
document.body.appendChild(TrinketTraitDiv);

//Trinket / Trait Buttons
//Trinket
var TrinketBtn = document.createElement("BUTTON");
TrinketBtn.setAttribute("id", "TrinketsBtn");
TrinketBtn.setAttribute("class", "button");
TrinketBtn.setAttribute("onClick", "itemClick('Trinkets')");
var TrinketText = document.createTextNode("Trinket");
TrinketBtn.appendChild(TrinketText);
TrinketTraitDiv.appendChild(TrinketBtn)
//Trait
var TraitBtn = document.createElement("BUTTON");
TraitBtn.setAttribute("id", "TraitsBtn");
TraitBtn.setAttribute("class", "button");
TraitBtn.setAttribute("onClick", "itemClick('Traits')");
var TraitText = document.createTextNode("Azerite Trait");
TraitBtn.appendChild(TraitText);
TrinketTraitDiv.appendChild(TraitBtn)


//Fight Style div's
var fightStyleDiv = document.createElement("div");
fightStyleDiv.setAttribute("id", "Fight-Style-div");
fightStyleDiv.setAttribute("class", "tabcontent");
fightStyleDiv.style.justifyContent = "center";
document.body.appendChild(fightStyleDiv);

//Fight Style Buttons
//Composite
var compositeBtn = document.createElement("BUTTON");
compositeBtn.setAttribute("id", "CBtn");
compositeBtn.setAttribute("class", "button");
compositeBtn.setAttribute("onClick", "fightClick('C')");
var compositeText = document.createTextNode("Composite");
compositeBtn.appendChild(compositeText);
fightStyleDiv.appendChild(compositeBtn)
//Single Target
var singleTargetBtn = document.createElement("BUTTON");
singleTargetBtn.setAttribute("id", "STBtn");
singleTargetBtn.setAttribute("class", "button");
singleTargetBtn.setAttribute("onClick", "fightClick('ST')");
var singleTargetText = document.createTextNode("Single Target");
singleTargetBtn.appendChild(singleTargetText);
fightStyleDiv.appendChild(singleTargetBtn)
//Dungeon
var dungeonBtn = document.createElement("BUTTON");
dungeonBtn.setAttribute("id", "DBtn");
dungeonBtn.setAttribute("class", "button");
dungeonBtn.setAttribute("onClick", "fightClick('D')");
var dungeonText = document.createTextNode("Dungeon");
dungeonBtn.appendChild(dungeonText);
fightStyleDiv.appendChild(dungeonBtn)





//Set vars for btns
var btnGroup = document.getElementsByClassName("button");
var talentsBtn = 'DA';
var itemBtn = 'Trinkets';
var fightBtn = 'C';


function talentClick(clicked)
{
	talentsBtn = clicked;
	clickedID = clicked + 'Btn';
	var talents = document.getElementById('talent-div').children;
	for(i = 0; i< talents.length; i++)
	{
		console.log(talents[i].id);
		if (talents[i].id.toLowerCase() == clickedID.toLowerCase())
		{
			talents[i].style.borderColor = 'blue';
			console.log("match")
		}
		else
		{
			talents[i].style.borderColor = 'white';
		}
	}
}

function itemClick(clicked)
{
	itemBtn = clicked;
	clickedID = clicked + 'Btn';
	console.log(clickedID);
	var trinketTraits = document.getElementById('Trinket-Trait-div').children;
	for(i = 0; i< trinketTraits.length; i++)
	{
		console.log(trinketTraits[i].id);
		if (trinketTraits[i].id.toLowerCase() == clickedID.toLowerCase())
		{
			trinketTraits[i].style.borderColor = 'blue';
		}
		else
		{
			trinketTraits[i].style.borderColor = 'white';
		}
	}
}

function fightClick(clicked)
{
	fightBtn = clicked;
	clickedID = clicked + 'Btn';
	var fight = document.getElementById('Fight-Style-div').children;
	for(i = 0; i< fight.length; i++)
	{
		console.log(fight[i].id);
		if (fight[i].id.toLowerCase() == clickedID.toLowerCase())
		{
			fight[i].style.borderColor = 'blue';
		}
		else
		{
			fight[i].style.borderColor = 'white';
		}
	}
}

for (var i = 0; i < btnGroup.length; i++)
{

	btnGroup[i].addEventListener("click",function(){
		if (itemBtn == 'Trinkets')
		{
			wcp_charts.updateTrinketChart(talentsBtn+itemBtn+fightBtn);
		}
		else
		{
			wcp_charts.updateTraitChart(talentsBtn+itemBtn+fightBtn);
		}
	})
}

var divs = document.getElementsByClassName("tabcontent")

//Style Divs
function styleDivs(){
	for (var i = 0; i < divs.length; i++)
	{
		let divClass = document.getElementById(divs[i].id)
		divClass.style.textAlign = "center";
		divClass.style.paddingBottom = "5px";
		divClass.style.paddingRight = "5px";
	}

}

//Style Buttons
function styleButtons(){
	for(var i = 0; i< btnGroup.length; i++)
	{
		let btn = document.getElementById(btnGroup[i].id)
		
		btn.style.backgroundColor = default_background_color;
		btn.style.color = "white";
		btn.style.border = "1px solid white"
		btn.style.padding = "15px 32px";
		btn.style.textAlign = "center";
		btn.style.fontSize = "16px";
		btn.style.display = "inline-block";
		btn.style.justifyContent = "center";
		if (btn.id == 'DABtn' || btn.id == 'TrinketsBtn' || btn.id == 'CBtn')
		{
			btn.style.borderColor = "blue";
		}
		else
		{
			btn.style.borderColor = "white";
		}
		btn.style.cursor = 'pointer';


	}
}
styleDivs();
styleButtons();

//Tab Function
function createTabs(tabID){
	let tempTab = document.createElement("div");
	tempTab.setAttribute("id", tabID);
	tempTab.setAttribute("class","tabcontent");
	tempTab.style.display = "block"; //Hide all tabs by default.
	return tempTab;
}

//Charts div
var chartDiv = document.createElement("div");
chartDiv.setAttribute("id", "Chart-Display-div");
chartDiv.setAttribute("class", "tabcontent");
document.body.appendChild(chartDiv);

//Trinket Tabs
var DATrinketTab_C = createTabs("DA-Trinket-Tab-Composite");
var DATrinketTab_ST = createTabs("DA-Trinket-Tab-SingleTarget");
var DATrinketTab_D = createTabs("DA-Trinket-Tab-Dungeon");
var LotVTrinketTab_C = createTabs("LotV-Trinket-Tab-Composite");
var LotVTrinketTab_ST = createTabs("LotV-Trinket-Tab-SingleTarget");
var LotVTrinketTab_D = createTabs("LotV-Trinket-Tab-Dungeon");

//Trait Tabs
var DATraitTab_C = createTabs("DA-Trait-Tab-Composite");
var DATraitTab_ST = createTabs("DA-Trait-Tab-SingleTarget");
var DATraitTab_D = createTabs("DA-Trait-Tab-Dungeon");
var LotVTraitTab_C = createTabs("LotV-Trait-Tab-Composite");
var LotVTraitTab_ST = createTabs("LotV-Trait-Tab-SingleTarget");
var LotVTraitTab_D = createTabs("LotV-Trait-Tab-Dungeon");

var DATrinketsCTest = createTabs("DATrinketsC");






//Show DA Trinekts Composite by Default
DATrinketTab_C.style.display = "none";


//Button Clicking
function openChart() {
    var x = document.getElementById 
}





