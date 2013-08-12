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
			addClass:'dropdown-menu1',
			selectedIndex:this.selectedIndex
		};

		makeItSmarter(this.items);
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
			this.items.push({id:idIndex++, value:'item ' + (this.items().length + 1)});
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
	}


	// draft for filterable and sortable observableArray
	function makeItSmarter(array){
	    array.filter = ko.observable();
	    array.sort = ko.observable();
	    array.sort.by = ko.observable();
	    array.data = ko.observableArray();
	    //trigger
	    array.trigger = ko.computed(function () {
	        var data = null;
	        //filter
	        if (this.filter()) {
	            var data = this().filter(function (v) {
	                if (typeof v === 'object' && !(v instanceof Array)) {
	                    for (var key in v) {
	                        if (v.hasOwnProperty(key)) {
	                            var checkResult = check(v[key], this.filter());
	                            if (checkResult) {
	                                return true;
	                            }
	                        }
	                    }
	                } else {
	                    if(typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'){
	                        return check(v, this.filter());
	                    }
	                    //check is it value type
	                }
	                return false;
	            }.bind(this));
	        } else {
	            data = this().slice(0);
	        }
	        //sort
	        if (this.sort()) {
	            if (this.sort() === 'asc' || this.sort() === 'desc') {
	                data = data.sort(function (a, b) {
	                    var aBy = getBy(a, this.sort.by());
	                    var bBy = getBy(b, this.sort.by());
	                    return this.sort() === 'asc' ? aBy > bBy : aBy < bBy;
	                }.bind(this));
	            }
	        }
	        this.data(data);
	    }, array);
	}

	function getBy(it, by) {
	    if(by == null){
	        return it;
	    }
	    if (ko.isObservable(it[by])) {
	        return it[by]();
	    } else {
	        return it[by];
	    }
	}

	function check(v, filter) {
	    var val = null;
	    if (ko.isObservable(v) && !ko.isComputed(v)) {
	        val = v();
	    } else {
	        val = v;
	    }
	    if (val != null && (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean')) {
	        var result = new RegExp(filter, 'gi').test(val);
	        return result;
	    }
	    return false;
	}



	BaseControl.extend(ListPageControl);
	return ListPageControl;
});