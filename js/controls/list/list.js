define(['knockout', 'BaseControl'], function(ko, BaseControl){
	function ListControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);

		this.addClass = options.addClass || '';
		this.itemTemplate = options.itemTemplate || "<a href='#' data-bind='text:value'></a>";

		if(ko.isObservable(options.selectedIndex)){
			this.selectedIndex = options.selectedIndex;
		} else {
			this.selectedIndex = ko.observable(options.selectedIndex || 0);
		}
	}

	ListControl.prototype.selectItem = function(data, index) {
		this.selectedIndex(index);
	};

	BaseControl.extend(ListControl);

	return ListControl;
});