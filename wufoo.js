var request = require("request");
var util = require("util");

function Wufoo(subdomain, apiKey){
	this.subdomain = subdomain;
	this.apiKey = apiKey;
}

//Pass a JSON containing an array of Forms in JSON format to the callback argument
Wufoo.prototype.getForms = function(callback){
	var resource = "forms";
	var format = ".json";
	var reqMethod = "GET";
	
	var options = {
		uri: "https://"+this.subdomain+".wufoo.com/api/v3/"+resource+format,
		method: reqMethod,
		json: true,
		auth: {
			user: this.apiKey,
			pass: "footastic"
		}
	};

	console.log("GET "+"https://"+this.subdomain+".wufoo.com/api/v3/"+resource+format);

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

//Pass a JSON containing an array of Fields in JSON format from the formID to the callback argument
//Passing true for "pretty" will break parsing, so should be avoided
Wufoo.prototype.getFields = function(formID, pretty, system, callback){
	var resource = "forms/"+formID+"/fields";
	var format = ".json";
	if( (pretty || system) ){
		format += "?";
		if( pretty ){
			format += "pretty=true";
		}
		if( system ){
			format += "system=true";
		}
	}
	var reqMethod = "GET";
	
	var options = {
		uri: "https://"+this.subdomain+".wufoo.com/api/v3/"+resource+format,
		method: reqMethod,
		json: true,
		auth: {
			user: this.apiKey,
			pass: "footastic"
		}
	};

	console.log("GET "+"https://"+this.subdomain+".wufoo.com/api/v3/"+resource+format);

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

//Take a JSON Wufoo field and ouput a pretty version
Wufoo.prototype.parseField = function(field){
	console.log("Title: "+ field.Title);
	console.log("ID: "+ field.ID);
	console.log("Type: "+ field.Type);
};

//Take an array of fields, and output pretty version
Wufoo.prototype.parseFields = function(fields){
	for (var i = 0; i < fields.length; i++) {
		this.parseField(fields[i]);
		console.log();
	}
};


var wufoo = new Wufoo("fishbowl",  "AOI6-LFKL-VM1Q-IEX9");
console.log("Getting forms");
wufoo.getForms(function(forms){
	//console.log("Parsing Forms");
	//wufoo.parseForms(forms.Forms);
	var form = forms.Forms[0];

	var formID = form.Hash;
	console.log("Getting fields from form "+formID);
	wufoo.getFields(formID, false, true, function(fields){
		//console.log(fields);
		wufoo.parseFields(fields.Fields);
	});
});


