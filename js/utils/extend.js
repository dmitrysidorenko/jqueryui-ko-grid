/***
 * Inherits class 'a' from class 'b'
 */
define([], function(){
	return function(a, b){
		function _(){
			this.constructor = a;
		}
		_.prototype = b.prototype;
		a.prototype = new _();
		a.__super__ = b;
	}
});