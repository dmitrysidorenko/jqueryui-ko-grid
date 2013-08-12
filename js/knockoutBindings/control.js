(function(undefined) {

    define(['jquery', 'knockout', 'BaseControl', 'text'], function($, ko, BaseControl){


		ks = {
			controls:{}
		};

		ko.bindingHandlers.control = {
			init:function(el, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				return { controlsDescendantBindings: true };
			},
			update:function(el, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var options = ko.utils.unwrapObservable(valueAccessor());

				if(options === undefined || options === null){
					return;
				}

				var deferred = $.Deferred();
				deferred.done(function(isControl, Control){
					var control = null;
					if(isControl){	
						control = Control;
					} else {
						// var style = $('head>#controls-style');
						// if(!style[0]){
						// 	style = $('<style/>').attr('type', 'text/css').attr('id', 'controls-style').appendTo('head');;
						// }
						// style.html(style.html() + '\n\n' + css);
						var	controlOptions = options.options,
							controlDataContext = options.dataContext;
						control = new Control(controlOptions, controlDataContext);
					}

					var vm = {
						control:control
					};
					// viewmodel
					var widgetBindingContext = bindingContext.createChildContext(vm);
					
					$(el).html('<!--ko with:control--><!--ko template:{ html:_template, data:$data }--><!--/ko--><!--/ko-->');
					//apply viewmodel
					ko.applyBindingsToDescendants(widgetBindingContext, el);
				});

				if(options instanceof BaseControl){
					deferred.resolve(true, options);
				} else {
					var path = options.id;
					var controlId = options.id.replace(/(\/*)[a-z]+\//ig, '');
					require(['control!' + path], function(js, html, css){
							deferred.resolve(false, js, html, css);
						});				
				}

				return { controlsDescendantBindings: true };
			}
		};
	});
})();