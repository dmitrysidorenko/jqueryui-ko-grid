/*
 * Load and create a module and cache its instance
 */
/*global require, define*/
define([], function () {
    "use strict";
    // default path if not specified in require config
    var DEFAULT_PATH_TO_CONTROLLERS = "controllers";
    // key in require config
    var PATH_TO_CONTROLLERS_CONFIG_KEY = "pathToControllers";
    // loaded services
    var controllers = {};

    return  {
        load: function (name, req, onLoad, config) {
            var controller;
            var pathToControllers;

            controller = controllers[name];

            // if service already exists
            if(controller) {
                onLoad(controller);
                return;
            }

            pathToControllers = config[PATH_TO_CONTROLLERS_CONFIG_KEY] || DEFAULT_PATH_TO_CONTROLLERS;
            require([pathToControllers + "/" + name], function(Controller) {
//                controller = new Controller();
//                onLoad(controller);
                onLoad(Controller);
            }, function(error) {
                if (onLoad.error) {
                    onLoad.error(error);
                }
            });
        }
    };
});
