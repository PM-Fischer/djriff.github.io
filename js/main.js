var request = new XMLHttpRequest();

request.open('GET', 'http://104.248.0.248/classes', true);

request.onload = function () {
	console.log("Loaded JSON file");
	var data = JSON.parse(this.response);
	console.log(request.status);
	console.log(data);


}

request.send();