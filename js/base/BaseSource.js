(function(undefined){
	define(['knockout'], function(ko){
		function BaseSource(data, options){
			this.source = ko.isObservable(data) ? data : ko.observableArray(data);

			makeItSmarter(this.source);

			this.data = this.source.data;

			this.sort = this.source.sort;//'desc'|'asc'|null
			this.filter = this.source.filter;//string
			this.filterBy = this.source.filter.by;//string
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

							if ( aBy < bBy )
								return this.sort() === 'asc' ? -1 : 1;
							if ( aBy > bBy )
								return this.sort() === 'asc' ? 1 : -1;
							return 0;
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

		return BaseSource;
	});
})();