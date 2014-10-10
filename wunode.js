var request = require("request");
var util = require("util");
var fs = require('fs');

function Wufoo(subdomain, apiKey){
	this.subdomain = subdomain;
	this.apiKey = apiKey;
}

Wufoo.prototype.buildResource = function(path, format){
	return "https://"+this.subdomain+".wufoo.com/api/v3/"+path+format;
};

Wufoo.prototype.buildOptions = function(verb, resource){
	var options = {
		method: verb,
		uri: resource,
		json: true,
		auth: {
			user: this.apiKey,
			pass: "footastic"
		}
	};

	return options;
};

Wufoo.prototype.request = function(options, callback){
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

//Pass a JSON containing an array of Forms in JSON format to the callback argument
Wufoo.prototype.getForms = function(callback){
	var path = "forms";
	var format = ".json";
	var reqMethod = "GET";

	var resource = this.buildResource(path, format);
	
	var options = this.buildOptions(reqMethod, resource);

	console.log(reqMethod+": "+resource);
	//Make call to helper Wufoo.request method
	this.request(options, callback);
};

//Pass a JSON containing an array of Fields in JSON format from the formID to the callback argument
//Passing true for "pretty" will break parsing, so should be avoided
Wufoo.prototype.getFields = function(formID, pretty, system, callback){
	var path = "forms/"+formID+"/fields";
	var format = ".json";
	var extras = "";
	if( (pretty || system) ){
		extras += "?";
		if( pretty ){
			extras += "pretty=true";
		}
		if( system ){
			extras += "system=true";
		}
	}
	format += extras;
	var reqMethod = "GET";
	var resource = this.buildResource(path, format);
	
	var options = this.buildOptions(reqMethod, resource);

	console.log(reqMethod+": "+resource);
	//Make call to helper Wufoo.request method
	this.request(options, callback);
};

//Pass a JSON containing an array of Entries in JSON format from the formID to the callback argument
//Passing true for "pretty" will break parsing, so should be avoided
Wufoo.prototype.getEntriesForm = function(formID, pretty, callback){
	var path = "forms/"+formID+"/entries";
	var format = ".json";
	var extras = "";
	if( pretty ){
		extras = "pretty=true";
	}
	format += extras;
	var reqMethod = "GET";
	var resource = this.buildResource(path, format);
	
	var options = this.buildOptions(reqMethod, resource);

	console.log(reqMethod+": "+resource);
	//Make call to helper Wufoo.request method
	this.request(options, callback);
};

Wufoo.prototype.getFormURL = function(formID, defaultValues){
	var url =  "https://"+this.subdomain+".wufoo.com/forms/"+formID;
	if(defaultValues){
		url += "/def/"+defaultValues;
	}
	return url;
};

//Given a form ID and an entryID, return a URL that will recreate the entry in a new form
Wufoo.prototype.refillEntry = function(formID, entryID, callback){
	var that = this;
	this.getEntriesForm(formID, false, function(entries){
		var entry;

		for (var i = 0; i < entries.Entries.length; i++) {
			if(entries.Entries[i].EntryId == entryID){
				entry = entries.Entries[i];
			}
		}

		var defaultValues = "";
		for (var property in entry) {
			if(property.indexOf("Field") > -1){
				defaultValues += property+"="+encodeURIComponent(entry[property])+"&";
			}
		}
		//Remove the last &
		defaultValues = defaultValues.slice(0, -1);

		callback(that.getFormURL(formID, defaultValues));
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

//Take a JSON Wufoo entry and ouput a pretty version
Wufoo.prototype.parseEntry = function(entry){
	console.log("Entry Id: "+ entry.EntryId);
	for (var property in entry) {

		if(property.indexOf("Field") > -1){
			console.log(property+": "+ entry[property]);
		}
	}
};

//Take an array of entries, and output pretty version
Wufoo.prototype.parseEntries = function(entries){
	for (var i = 0; i < entries.length; i++) {
		this.parseEntry(entries[i]);
		console.log();
	}
};




// var wufoo = new Wufoo("fishbowl",  "AOI6-LFKL-VM1Q-IEX9");
// console.log("Getting forms");
// wufoo.getForms(function(forms){
//  //console.log("Parsing Forms");
//  //wufoo.parseForms(forms.Forms);
//  var form = forms.Forms[0];

//  var formID = form.Hash;
//  console.log("Getting fields from form "+formID);
//  wufoo.getFields(formID, false, true, function(fields){
//      //console.log(fields);
//      //wufoo.parseFields(fields.Fields);
//  });

//  console.log("Getting entries from form "+formID);
//  wufoo.getEntriesForm(formID, false, function(entries){
//      //console.log(entries);
//      //wufoo.parseEntries(entries.Entries);
//  });
//  console.log("Building URL");
//  wufoo.refillEntry(formID, 1, function(url){
//      fs.writeFile("./test.txt", url, function(err) {
//          if(err) {
//              console.log(err);
//          } else {
//              console.log("The file was saved!");
//          }
//      });
//  });
// });


