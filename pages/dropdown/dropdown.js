define(['knockout', 'BaseControl'], function(ko, BaseControl){
	function DropdownPageControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);
		this.message = ko.observable('I am DropdownPage control');
	}

	BaseControl.extend(DropdownPageControl);

	return DropdownPageControl;
});