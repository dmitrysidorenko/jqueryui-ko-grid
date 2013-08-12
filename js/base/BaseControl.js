define(['knockout', 'extend'], function(ko, extend){
	/***
	 * BaseController class
	 * @param {*} dataContext
	 */
	function BaseControl(dataContext){
		this.dataContext = ko.isObservable(dataContext) ? dataContext : ko.observable(dataContext);
		// control loader must care about adding the control's html to  the field '_template'
		this._template = this.constructor.template;
	}

	BaseControl.extend = function(a){
		return extend(a, this);
	};

	return BaseControl;
});