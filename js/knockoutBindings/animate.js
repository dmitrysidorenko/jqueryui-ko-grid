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


	function rowFromIndex(index, colCount){
		return index / colCount | 0;
	}
	function colFromIndex(index, colCount){
		return index - rowFromIndex(index, colCount) * colCount;
	}

	
	function loadSprite(src, options, model){
		var def = $.Deferred();
		var sprite = new Sprite(src, {
			  frameW: model.frameWidth(),
			  frameH: model.frameHeight(),
			  useTimer:false,
			  startCol:colFromIndex(model.frameStart(), model.colsCount()),
			  startRow:rowFromIndex(model.frameStart(), model.colsCount()),
			  endCol:colFromIndex(model.frameCount() - 1, model.colsCount()),
			  endRow:rowFromIndex(model.frameCount() - 1, model.colsCount()),
			  interval:1000/(options.fps() || 10),
			  postInitCallback: function() { // Runs when the sprite is ready.
			    // Start animating.
			    def.resolve();
			  }
			});

		return {sprite:sprite, promise:def.promise()};
	}


    define(['jquery', 'knockout', 'sprite'], function($, ko, Sprite){
		ko.bindingHandlers.animate = {
			init:function(el, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var options = ko.utils.unwrapObservable(valueAccessor());
				var context = $(el)[0].getContext('2d');

				var model = options.model;
				var res = model.graphicResource();

				var load = loadSprite(res, options, model);
				var def = load.promise;
				var sprite = load.sprite;

				var animationData = {
					sprite:sprite,
					isRun:true,
					context:context,
					startAnimation:function(){
						this.isRun = true;
						this.animate();
						this.sprite.startLoop();
					},
					stopAnimation:function(){
						this.isRun = false;
						this.sprite.stopLoop();
					},
					animate:function(){ // Animation loop that draws the canvas
						var context = this.context;
						if(this.isRun){
						  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the canvas
						  this.sprite.draw(context, 0, 0); // Draw the sprite
						  requestAnimFrame(this.animate.bind(this)); // Run the animation loop
						}
				}
				};

				def.done(function(){
					animationData.startAnimation();
				});

				$(el).data('_animationData', animationData);
			},
			update:function(el, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var options = ko.utils.unwrapObservable(valueAccessor());
				var context = $(el)[0].getContext('2d');

				var model = options.model;
				var res = model.graphicResource();

				var animationData = $(el).data('_animationData');
				var sprite = animationData.sprite;
				sprite.frameW = model.frameWidth();
				sprite.frameH = model.frameHeight();
				sprite.useTimer = false;
				sprite.startCol = colFromIndex(model.frameStart(), model.colsCount());
				sprite.startRow = rowFromIndex(model.frameStart(), model.colsCount());
				sprite.endCol = colFromIndex(model.frameCount(), model.colsCount());
				sprite.endRow = rowFromIndex(model.frameCount(), model.colsCount());
				sprite.interval = 1000/(options.fps() || 10);
				if(sprite.sourceFile !== res){
					animationData.stopAnimation();
					var load = loadSprite(res, options, model);
					var def = load.promise;
					var sprite = load.sprite;
					animationData.sprite = sprite;
					def.done(function(){
						animationData.startAnimation();
					});
				}

				function getRowByIndex(i, colsCount){
					return i / colsCount | 0;
				}

				function getColByIndex(i, colsCount){
					return i - getRowByIndex(i, colsCount) * colsCount;
				}

			} 

		};
	});

})();