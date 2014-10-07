var http = require("http");
var util = require("util");

function Wufoo(subdomain, apiKey){
	this.subdomain = subdomain;
	this.apiKey = apiKey;
}

Wufoo.prototype.getForms = function(){
	var resource = "forms";
	var format = ".json";
	var reqMethod = "GET";
	var reqAuth = ""+this.apiKey + ":footastic";

	var options = {
		hostname: ""+this.subdomain+".wufoo.com",
		path:     "/api/v3"+resource+format,
		method: reqMethod,
		auth: reqAuth
	};

	var callback = function(response){
		return response;
	};

	var req = http.request(options, callback);

	req.on('error', function(e){
		console.log('Error '+ e.message);
		console.log(e);
	});
};

var wufoo = new Wufoo("fishbowl",  "AOI6-LFKL-VM1Q-IEX9");
var forms = wufoo.getForms();

console.log(forms);