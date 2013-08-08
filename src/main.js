(function() {
    "use strict";

    require([
        "configs/require-config"
    ], function() {
        require([
                'knockout',
            ], function(ko){
            require([
                'sammy',
                'knockout-binding-control',
                'ko-text'
                ], function(sammy){
                function AppViewModel(){
                    this.controls = [
                        {name:'List', id:'pages/list', href:'#/controls/list'},
                        {name:'Dropdown', id:'pages/dropdown', href:'#/controls/dropdown'}
                    ];

                    this.activeControlId = ko.observable();                    

                    this.mainControlName = ko.observable();
                    this.mainControl = ko.computed(function(){
                        var id = this.mainControlName();
                        if(id){
                            var index = null;
                            this.controls.some(function(v, i){
                                var result = v.id === id;
                                if(result){
                                    index = i;
                                }
                                return result;
                            }.bind(this));
                            var control = index !== null ? this.controls[index] : null;
                            if(control){
                                this.activeControlId(control.id);
                                return {
                                    id:control.id,
                                    dataContext:null,
                                    options:{a:1}
                                };
                            }
                            return null;
                        }
                    }, this);
                }
                var appViewModel = new AppViewModel();

                var app = sammy(function () {

                    var map = appViewModel.controls.map(function(v){
                        return ['get', v.href, function (e) {
                            appViewModel.mainControlName(v.id);
                        }];
                    });
                    map.push(['get', '/index.html', function (e) {
                            appViewModel.mainControlName('start');
                        }]);
                    this.mapRoutes(map);
                });

                app.run();
                ko.applyBindings(appViewModel);
            });

        });
    });
}());