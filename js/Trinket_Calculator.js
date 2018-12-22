const default_background_color = "#343a40";
const default_font_color = "#f8f9fa";
const default_axis_color = "#828282";

const light_color = "#eeeeee";
const medium_color = "#999999";
const dark_color = "#343a40";

/*
<div class="dropdown">
  <button onclick="myFunction()" class="dropbtn">Dropdown</button>
  <div id="myDropdown" class="dropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
</div>

*/

//Create Div which holds all buttons
var mainDiv = document.createElement("div");
mainDiv.setAttribute("id", "main-div");
mainDiv.setAttribute("class", "main");
document.body.appendChild(mainDiv);

number = 0

function generateTrinketMenu(number){
	//Create Div which holds trinkets dropdown
	
	var trinketDiv = document.createElement("div");
	trinketDiv.setAttribute("id", "trinket-div" + number);
	trinketDiv.setAttribute("class", "dropdown");

	//Create Trinket Button
	var trinketBtn = document.createElement("button");
	trinketBtn.setAttribute("id", "trinketbtn" + number);
	trinketBtn.setAttribute("class","dropbtn");
	trinketBtn.setAttribute("onclick", "displayTrinkets(this)");

	var trinketText = document.createTextNode("Select Trinket");
	trinketBtn.appendChild(trinketText);
	trinketDiv.appendChild(trinketBtn);


	var trinketDropDown = document.createElement("div");
	trinketDropDown.setAttribute("id", "trinketDropDown"+number);
	trinketDropDown.setAttribute("class", "dropdown-content");
	trinketDiv.appendChild(trinketDropDown);

	mainDiv.appendChild(trinketDiv);
	generateverticalSpacer();

	number++;
	return number;
}

function generateIlvlMenu(number){
	number -= 1;
	var currTrinketDiv = document.getElementById('trinket-div'+number)

	//Crate ilvl button
	var ilvlBtn = document.createElement("button");
	ilvlBtn.setAttribute("id", "ilvlbtn" + number);
	ilvlBtn.setAttribute("class","dropbtn");
	ilvlBtn.setAttribute("onclick", "addIlvlDropdown(this)");

	var ilvlText = document.createTextNode("Select Item Level");
	ilvlBtn.appendChild(ilvlText);

	generatehorizontalSpacer(currTrinketDiv);
	currTrinketDiv.appendChild(ilvlBtn);

	var ilvlDropDown = document.createElement("div");
	ilvlDropDown.setAttribute("id", "ilvlDropDown"+number);
	ilvlDropDown.setAttribute("class", "dropdown-content");
	currTrinketDiv.appendChild(ilvlDropDown);

	
}

function generatehorizontalSpacer(div)
{
	var horizontalSpacer = document.createElement("span");
	horizontalSpacer.setAttribute("class", "divider");
	div.appendChild(horizontalSpacer);
}

function generateverticalSpacer()
{
	var verticalSpacer = document.createElement("span");
	verticalSpacer.setAttribute("class", "span");
	mainDiv.appendChild(verticalSpacer);
}

number = generateTrinketMenu(number);

generateIlvlMenu(number);
number = generateTrinketMenu(number);
generateIlvlMenu(number);
number = generateTrinketMenu(number);
generateIlvlMenu(number);

function addTrinketMenu(){
	number = generateTrinketMenu(number);
	generateIlvlMenu(number);
}


var addTrinketDiv = document.createElement("div");
addTrinketDiv.setAttribute("id", "add-trinket-div");
//addTrinketDiv.setAttribute("class", "add-trinket");
document.body.appendChild(addTrinketDiv)

var addTrinket = document.createElement("button");
addTrinket.setAttribute("id", "add-trinket");
addTrinket.setAttribute("class", "add-trinket");
addTrinket.setAttribute("onclick", "addTrinketMenu()");
var addTrinketText = document.createTextNode("+");
addTrinket.appendChild(addTrinketText);
addTrinketDiv.appendChild(addTrinket);






function displayTrinkets(trinketID)
{
	jQuery.getJSON("https://rawgit.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/"+ "trinkets_DA_C" + ".json" , function(data) {
		let sortedItems = [];
		let dpsSortedData = data["sorted_data_keys"];
		dpsSortedData = dpsSortedData.sort();
		let trinketDrop = trinketID.parentElement.childNodes[1];
		let trinketDropDown = trinketID.parentElement.childNodes[0];
		for (d of dpsSortedData)
		{
			let newTrinket = document.createElement("p");
			newTrinket.setAttribute("id", d);
			newTrinket.setAttribute("class", "dropdown-content");
			newTrinket.setAttribute("onclick", "updateTrinketText(this.id)");
			let newTrinketText = document.createTextNode(d);
			newTrinket.appendChild(newTrinketText);
			trinketDrop.appendChild(newTrinket);
		}
		
		//let trinketDrop = document.getElementById(trinketID);
		trinketDrop.classList.toggle("show");
		

		}.bind(this)).fail(function(){
		console.log("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
		alert("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
	});
}



function updateTrinketText(click)
{
	let trinketDropDownElement = document.getElementById(click).parentElement;
	let trinketDropDownParent = trinketDropDownElement.parentElement;
	let newtrinketBtn = trinketDropDownParent.childNodes[0].childNodes[0];
	newtrinketBtn.nodeValue = click;
	let ilvlText = trinketDropDownParent.childNodes[3].childNodes[0];
	ilvlText.nodeValue = "Select Item Level";
	//addIlvlDropdown(trinketDropDownParent);

	//Remove all the trinkets.
	while (trinketDropDownElement.firstChild) 
	{
    	trinketDropDownElement.removeChild(trinketDropDownElement.firstChild);
	}

}


function addIlvlDropdown(parentDiv)
{
	jQuery.getJSON("https://rawgit.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/"+ "trinkets_DA_C" + ".json" , function(data) {
		let sortedItems = [];
		let regExp = new RegExp("[0-9]+", "g"); //Accounts for all 2 digit numbers
		let tempNumber = regExp.exec(parentDiv.id); // Pulls the number out of the parent div so we don't accidently create the wrong ilvl dropdown
		trinketDiv = document.getElementById('trinketbtn' + tempNumber);
		trinketName = trinketDiv.firstChild.nodeValue;
		ilvlDrop = parentDiv.parentElement.childNodes[4];
		var keys = [];
		for(var k in data["data"][trinketName]) keys.push(k); //Pull all item levels of the trinket.
		for( k of keys)
		{
			let newIlvl = document.createElement("p");
			newIlvl.setAttribute("id", k)
			newIlvl.setAttribute("class","dropdown-content");
			newIlvl.setAttribute("onclick", "updateIlvlText(this.id)");
			let newIlvlText = document.createTextNode(k);
			newIlvl.appendChild(newIlvlText);
			ilvlDrop.appendChild(newIlvl);
		}
		
		//let trinketDrop = document.getElementById(trinketID);
		ilvlDrop.classList.toggle("show");
		

		}.bind(this)).fail(function(){
		console.log("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
		alert("The JSON chart failed to load, please let DJ know via discord Djriff#0001");
	});
}

function updateIlvlText(click)
{
	let ilvlDropDownElement = document.getElementById(click).parentElement;
	let ilvlDropDownParent = ilvlDropDownElement.parentElement;
	let newilvlBtn = ilvlDropDownParent.childNodes[3].childNodes[0];
	newilvlBtn.nodeValue = click;
	addIlvlDropdown(ilvlDropDownParent);

	//Remove all the ilvls.
	while (ilvlDropDownElement.firstChild) 
	{
    	ilvlDropDownElement.removeChild(ilvlDropDownElement.firstChild);
	}
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

var chartOptions = {
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
            text: "Trinket Comparison - Dark Ascension"
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