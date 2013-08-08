define(['knockout', 'BaseControl', 'control!list'], function(ko, BaseControl, List){
	function ListPageControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);

		this.items = [
			{id:1, value:'item 1'},
			{id:2, value:'item 2'},
			{id:3, value:'item 3'}
		];
		this.options = {};
	}

	BaseControl.extend(ListPageControl);
	return ListPageControl;
});