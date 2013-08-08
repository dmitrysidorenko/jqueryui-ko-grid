/**
 * @license RequireJS text 2.0.5 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, define*/

define(['module'], function () {
    'use strict';
    var DEFAULT_PATH_TO_SERVICES = "services";
    // loader services
    var services = {};

    return  {
        finishLoad: function () {},
        load: function (name, req, onLoad, config) {
            var service;
            var pathToServices;


            service = services[name];

            // if service already exists
            if(service) {
                onLoad(service);
                return;
            }

            pathToServices = config.pathToServices || DEFAULT_PATH_TO_SERVICES;
            require([pathToServices + "/" + name], function(Service) {
                service = new Service();
                onLoad(service);
            }, function(error) {
                if (onLoad.error) {
                    onLoad.error(error);
                }
            });
        }
    };
});
