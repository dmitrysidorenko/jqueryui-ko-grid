(function() {

	window.requestAnimFrame = (function(callback) { // shim
	  return window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    function(callback) {
	      window.setTimeout(callback, 1000 / 60);
	    };
	})();

	


	var def = $.Deferred();
    define(['jquery', 'knockout', 'sprite'], function($, ko, Sprite){
		ko.bindingHandlers.animate = {
			init:function(el, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var options = ko.utils.unwrapObservable(valueAccessor());
				var context = $(el)[0].getContext('2d');
				
			},
			update:function(el, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var options = ko.utils.unwrapObservable(valueAccessor());
				var context = $(el)[0].getContext('2d');

				var model = options.model;
				var res = model.graphicResource();


				var context = $(el)[0].getContext('2d');
				var sprite = new Sprite(res, {
					  frameW: model.frameWidth(),
					  frameH: model.frameHeight(),
					  useTimer:false,
					  startCol:0,
					  startRow:0,
					  endCol:14,
					  endRow:0,
					  interval:1000/(options.fps() || 10),
					  postInitCallback: function() { // Runs when the sprite is ready.
					    // Start animating.
					    def.resolve();
					  }
					});
				def.done(function(){
					//setInterval(draw.bind(sprite, context, sprite), 1000/80);
					run();
				   	animate();
				});

				function run(){
			    	sprite.startLoop();

				}

				function animate() { // Animation loop that draws the canvas
				  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the canvas
				  sprite.draw(context, 0, 0); // Draw the sprite
				  requestAnimFrame(animate); // Run the animation loop
				}
			}
		};
	});

})();