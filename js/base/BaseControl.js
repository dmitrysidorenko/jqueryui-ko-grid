define(['knockout'], function(ko){
	function BaseControl(dataContext){
		this.dataContext = ko.isObservable(dataContext) ? dataContext : ko.observable(dataContext);
		console.dir(this);

		this._template = this.constructor.template;
	}

	BaseControl.extend = function(a){
		function _(){
			this.constructor = a;
		}
		_.prototype = this.prototype;
		a.prototype = new _();
		a.__super__ = this;
	};

	return BaseControl;
});