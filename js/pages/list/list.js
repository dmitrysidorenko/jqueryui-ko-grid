define(['knockout'], function(ko){
	return function SomeConstructor(){
		console.log(arguments);
		this._template = ko.observable();
	}
});