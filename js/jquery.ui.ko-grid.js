(function( $ ) {
 
	$.widget( "ui.kogrid", {
		options: {
			autoOpen: true
		},
		
		_create: function() {

		},
		
		_init: function() {
		
		},
		
		destroy: function() {
			// call the original destroy method since we overwrote it
			$.Widget.prototype.destroy.call( this );
		}
	});

})( jQuery );