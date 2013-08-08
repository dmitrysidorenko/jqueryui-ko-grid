(function(){

	ks.utils.extend(ListControl, ks.BaseControl);
	function ListControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);

		this.addClass = options.addClass || '';
		this.itemTemplate = options.itemTemplate || "<a href='#' data-bind='text:value'></a>";
		this._template = "<ul class='ks-list' data-bind='foreach:dataContext, addClass:addClass'>" +
				"<li class='list-item' data-bind='css:{active:$index() === $parent.selectedIndex()}, click:$parent.selectItem.bind($parent, $data, $index())'>" +
					 this.itemTemplate +
				"</li>" +
			"</ul>";

		if(ko.isObservable(options.selectedIndex)){
			this.selectedIndex = options.selectedIndex;
		} else {
			this.selectedIndex = ko.observable(options.selectedIndex || 0);
		}
	}
	ListControl.prototype.selectItem = function(data, index) {
		this.selectedIndex(index);
	};


	ks.controls.list = {
		creator:function(options, dataContext){
			var result = new ListControl(options, dataContext);
			return result;
		},
		construct:ListControl
	};

})();