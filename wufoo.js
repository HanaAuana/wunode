var request = require("request");
var util = require("util");

function Wufoo(subdomain, apiKey){
	this.subdomain = subdomain;
	this.apiKey = apiKey;
}

//Returns a JSON containing an array of Forms in JSON format
Wufoo.prototype.getForms = function(callback){
	var resource = "forms";
	var format = ".json";
	var reqMethod = "GET";
	console.log("GET "+"https://"+this.subdomain+".wufoo.com/api/v3/"+resource+format);
	var options = {
		uri: "https://"+this.subdomain+".wufoo.com/api/v3/"+resource+format,
		method: reqMethod,
		json: true,
		auth: {
			user: this.apiKey,
			pass: "footastic"
		}
	};

	request(options, function(error, response, body){
		if (!error && response.statusCode === 200){
			callback(body);
		}
		else{
			console.log("CODE "+response.statusCode);
			console.log("ERROR "+error);
		}
	});
};

//Take a JSON Wufoo form and ouput a pretty version
Wufoo.prototype.parseForm = function(form){
	console.log("Name: "+ form.Name);
	console.log("Hash: "+ form.Hash);
	console.log("Fields: "+ form.LinkFields);
};

//Take an array of forms, and output pretty version
Wufoo.prototype.parseForms = function(forms){
	for (var i = 0; i < forms.length; i++) {
		this.parseForm(forms[i]);
		console.log();
	}
};


var wufoo = new Wufoo("fishbowl",  "AOI6-LFKL-VM1Q-IEX9");
wufoo.getForms(function(forms){
	console.log();
	wufoo.parseForms(forms.Forms);
});


