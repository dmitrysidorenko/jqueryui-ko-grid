/*global define, require*/
(function() {
    "use strict";
    define([], function() {
        require.config({
            waitSeconds: false,
            // urlArgs: "cache=" + new Date().getTime(),
            // paths config for requirejs
            paths: {
                // # paths #
                "sammy":"/lib/sammy",
                "jquery":"/lib/jquery/jquery-1.9.1",
                "knockout":"/lib/knockout/knockout",
                "knockout-binding-control":"/js/knockoutBindings/control",
                "knockout-binding-addClass":"/js/knockoutBindings/addClass",
                "knockout-binding-animate":"/js/knockoutBindings/animate",
                "ko-text":"/lib/knockout/stringTemplateEngine",

                "sprite":"/lib/sprite/sprite",

                // # engine #
                "text":"/lib/require/require.text",
                "control":"/lib/require/require-app/require.control",
                // # folder #
                "controls":"/js/controls",

                // # app #
                "BaseControl": "/js/base/BaseControl"
            },

            shim: {
                // ## jquery ##
                "jquery": {exports:"jQuery"},

                // # knockout #
                "knockout": {deps: ["jquery"], exports: "ko"},

                "sammy": {exports: "sammy"},

                "sprite": {exports: "window.Sprite"}
            }
        });
    });
}());