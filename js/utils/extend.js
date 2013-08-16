define([], function(){
	return function extend(a, b){
		function _(){
			this.constructor = a;
		}
		_.prototype = b.prototype;
		a.prototype = new _();
		a.__super__ = b;
	}
});