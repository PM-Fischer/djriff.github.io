var request = new XMLHttpRequest();
/*
request.open('GET', 'https://cors-anywhere.herokuapp.com/http://104.248.0.248/classes', true);


request.onload = function () {
	console.log("Loaded JSON file");
	var data = JSON.parse(this.response);
	for (x in data["_embedded"])
	{
		console.log(x);
	}


}

request.send();
*/


var tableDiv = document.getElementById("classes-div");
var table = document.createElement("class-table");
var tableBody = document.createElement("TBODY");

table.border = '1';
table.appendChild(tableBody);

var heading = new Array();
heading[0] = "Computer Science";
heading[1] = "Class Session";
heading[2] = "Session List";

var test = new Array();
test[0] = new Array("Cars", "88.625", "85.50")
test[1] = new Array("Veggies", "88.625", "85.50")
test[2] = new Array("Colors", "88.625", "85.50")

// Table Columns
var tr = document.createElement('TR');
tableBody.appendChild(tr);

for (i = 0; i < heading.length; i++)
{
	var th = document.createElement('TH');
	th.width = '75';
	th.appendChild(document.createTextNode(heading[i]));
	tr.appendChild(th);
}

//Table Rows
for (i = 0; i < test.length; i++)
{
	var tr = document.createElement('TR');
	for (j = 0; j < test[i].length; j++)
	{
		var td = document.createElement('TD');
		td.appendChild(document.createTextNode(test[i][j]));
		tr.appendChild(td);
	}
	tableBody.appendChild(tr);
}

tableDiv.appendChild(table)
