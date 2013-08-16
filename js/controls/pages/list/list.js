define(['knockout', 'BaseControl', 'control!list'], function(ko, BaseControl, List){
	function ListPageControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);

		this.items = ko.observableArray([
			{id:1, value:'item 1'},
			{id:2, value:'item 2'},
			{id:3, value:'item 3'}
		]);
		this.selectedIndex = ko.observable(1);
		this.options = {
			addClass:'',
			selectedIndex:this.selectedIndex
		};

		this.items.sort.by('value');

		this.filteredItems = ko.observableArray();
		this.filter = ko.observable();
		this.filterHandler = ko.computed(function(){
			var items = this.items();
			var filter = this.filter();
			if(!filter){
				this.filteredItems(items);
			} else {
				this.filteredItems(items.filter(function(item){
					return new RegExp(filter, 'gi').test(item.value);
				}));
			}
		}, this);


		//api demonstration
		var idIndex = 4;
		this.addItem = function(){
			this.items.push({id:idIndex++, value: 'item ' + (this.items().length + 1)});
		}.bind(this);

		this.removeItem = function(){
			this.items.splice(this.items().length - 1, 1);
		}.bind(this);

		this.descend = function(){
			this.items.sort('desc');
		}.bind(this);

		this.ascend = function(){
			this.items.sort('asc');
		}.bind(this);

		this.noSort = function(){
			this.items.sort(null);
		}.bind(this);
	}

	BaseControl.extend(ListPageControl);
	return ListPageControl;
});