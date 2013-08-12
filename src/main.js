(function() {
    "use strict";

    require([
        "configs/require-config"
    ], function() {
        require([
                'knockout',
                'control'
            ], function(ko){
            require([
                'sammy',
                'knockout-binding-control',
                'knockout-binding-addClass',
                'knockout-binding-animate',
                'ko-text'
                ], function(sammy){
                function AppViewModel(){
                    //pages
                    this.controls = [
                        {name:'List', id:'pages/list', href:'#/controls/list'},
                        {name:'Dropdown', id:'pages/dropdown', href:'#/controls/dropdown'},
                        {name:'Animation Editor', id:'pages/animationEditor', href:'#/animationEditor'}
                    ];

                    //current page
                    this.activeControlId = ko.observable();                    
                    this.currentControl = ko.observable();
                    this.mainControl = ko.computed(function(){
                        var control = this.currentControl();
                        if(control){
                            this.activeControlId(control.id);
                            return {
                                id:control.id,
                                dataContext:null,
                                options:control.options
                            };
                        }
                        return null;
                    }, this);
                }
                var appViewModel = new AppViewModel();

                //router
                var app = sammy(function () {
                    //add pages to routes
                    var map = appViewModel.controls.map(function(v){
                        return ['get', v.href, function (e) {
                            appViewModel.currentControl(v);
                        }];
                    });
                    //root route
                    map.push(['get', '/index.html', function (e) {
                            appViewModel.currentControl(null);
                        }]);
                    //tadam!
                    this.mapRoutes(map);
                });
                //run router
                app.run();
                //turn on bindings
                ko.applyBindings(appViewModel);
            });

        });
    });
}());