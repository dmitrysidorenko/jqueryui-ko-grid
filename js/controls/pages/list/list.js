define(['knockout', 'BaseControl', 'control!list'], function(ko, BaseControl, List){
	function ListPageControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);
		this.message = ko.observable('I am ListPage control');
		console.log(this, List);
	}

	BaseControl.extend(ListPageControl);
	return ListPageControl;
});