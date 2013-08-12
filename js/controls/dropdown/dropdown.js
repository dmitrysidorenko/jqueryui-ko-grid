define(['knockout', 'BaseControl', 'control!list'], function(ko, BaseControl, ListControl){
	BaseControl.extend(DropDownControl);
	function DropDownControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);

		this.addClass = options.addClass || '';

		this.isOpen = typeof options.isOpen === 'boolean' ?
				ko.observable(options.isOpen) :
				ko.isObservable(options.isOpen) ?
				options.isOpen : 
				ko.observable(options.isOpen);

		this.clickBtn = function(){
			this.isOpen(!this.isOpen());
		};

		if(ko.isObservable(options.selectedItem)){
			this.selectedItem = options.selectedItem;
		} else {
			this.selectedItem = ko.observable(options.selectedItem);
		}

		this.listControl = new ListControl({
			addClass:'dropdown-menu',
			selectedItem:this.selectedItem
		}, dataContext);

		this.listControl.selectItem = function(data, index){
			this.listControl.constructor.prototype.selectItem.apply(this.listControl, arguments);
			this.close();
		}.bind(this);
	}

	DropDownControl.prototype.close = function() {
		this.isOpen(false);
	};

	return DropDownControl;
});