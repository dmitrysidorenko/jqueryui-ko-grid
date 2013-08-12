define(['knockout', 'BaseControl'], function(ko, BaseControl){
	function DropdownPageControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);
		this.items = ko.observableArray([
			{id:1, value:'item 1'},
			{id:2, value:'item 2'},
			{id:3, value:'item 3'}
		]);
		this.selectedItem = ko.observable(this.items()[1]);
		this.options = {
			selectedItem:this.selectedItem
		};

		this.selectedItem.subscribe(function(newVal){
			console.log('selectedItem:', newVal);
		});
	}

	BaseControl.extend(DropdownPageControl);

	return DropdownPageControl;
});