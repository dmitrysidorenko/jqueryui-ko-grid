(function(){

	ks.utils.extend(DropDownControl, ks.BaseControl);
	function DropDownControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);
		this._template = "<div class='ks-dropdown btn-group' data-bind='css:{open:isOpen}'>"+
				"<a class='btn btn-small dropdown-toggle' data-bind='click:click'><span data-bind='text:selectedItem() ? selectedItem().value : null'></span><span class='caret'></span></a>"+
				"<div class='ks-dropdown-content' data-bind='control:listControl'></div></div>";
		this.isOpen = options.isOpen || ko.observable(false);
		var listOptions = {
			selectedIndex:options.selectedIndex,
			addClass:'dropdown-menu'
		};
		this.listControl = ks.controls.list.creator(listOptions, dataContext);

		this.selectedItem = ko.computed(function(){
			return dataContext()[this.listControl.selectedIndex()];
		}, this);

		this.listControl.selectItem = function(data, index){
			this.listControl.constructor.prototype.selectItem.call(this.listControl, data, index);
			this.close();
		}.bind(this);

		this.click = function(){
			if(this.isOpen()){
				this.close();
			} else {
				this.open();
			}
		}.bind(this);
	}

	DropDownControl.prototype.open = function(){
		this.isOpen(true);
	}
	DropDownControl.prototype.close = function(){
		this.isOpen(false);
	}

	ks.controls.dropdown = {
		creator:function(options, dataContext){
			var result = new DropDownControl(options, dataContext);
			return result;
		}
	};

})();