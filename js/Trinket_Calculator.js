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

var number = 0

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

	var verticalSpacer = document.createElement("span");
	verticalSpacer.setAttribute("class", "span");
	mainDiv.appendChild(verticalSpacer);
	number += 1
}

generateTrinketMenu(1)
generateTrinketMenu(2)
generateTrinketMenu(3)

function addTrinketMenu(){
	generateTrinketMenu(number);
}

var addTrinket = document.createElement("button");
addTrinket.setAttribute("id", "add-trinket");
addTrinket.setAttribute("class", "add-trinket");
addTrinket.setAttribute("onclick", "addTrinketMenu()");
var addTrinketText = document.createTextNode("+");
addTrinket.appendChild(addTrinketText);
mainDiv.appendChild(addTrinket);

function displayTrinkets(trinketID)
{
	jQuery.getJSON("https://rawgit.com/WarcraftPriests/bfa-shadow-priest/master/json_Charts/"+ "trinkets_DA_C" + ".json" , function(data) {
		let sortedItems = [];
		let dpsSortedData = data["sorted_data_keys"];
		dpsSortedData = dpsSortedData.sort();
		console.log(trinketID.parentElement.childNodes);
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
			//trinketDropDown = document.getElementById("trinketDropDown" + number)
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
	console.log(trinketDropDownElement.childNodes);
	console.log(trinketDropDownParent);

	newtrinketBtn.nodeValue = click;

	//Remove all the trinkets.
	while (trinketDropDownElement.firstChild) 
	{
    	trinketDropDownElement.removeChild(trinketDropDownElement.firstChild);
	}

}

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


/* 
When the user clicks on the button, 
toggle between hiding and showing the dropdown content 
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it


*/