/*global require, define*/
define([], function () {
    "use strict";
    // default path if not specified in require config
    var DEFAULT_PATH_TO_CONTROLS = "controls";
    // load css flag by default
    var DEFAULT_LOAD_CSS = true;

    // key in require config
    var PATH_TO_CONTROLS_CONFIG_KEY = "pathToControls";
    // load css for controls
    var LOAD_CSS_CONFIG_KEY = "loadControlCSS";

    // html file extension
    var HTML_FILE_EXTENSION = "html";
    // css file extension
    var CSS_FILE_EXTENSION = "css";

    // regex to find control name (e.g. in "com/example" name is example, not "com/example")
    var MATCH_NAME_REGEX = /(?:\/{0,1})(?:[a-z0-9]*$)/i;
    // string to match binding include strings
    var MATCH_BINDING_INCLUDE_STRING = "@useBinding";
    // string to match binding include strings
    var MATCH_BINDING_PRESET_INCLUDE_STRING = "@usePreset";

    // prefix to load bindings
    var BINDING_PREFIX = "knockout-binding-handlers";
    var BINDING_PRESET_PREFIX = "knockout-binding-presets";

    var IS_GLOBAL_PATH_REGEX = /^\//;

    // loaded services
    var controls = [];

    // css style tag
    var styleTag = document.createElement("style");

    // is in debug mode
    var DEBUG = true;

    return {
        /**
         * Load control
         * @param {String} name
         * @param {Function} req
         * @param {Function} onLoad
         * @param {Object} config
         */
        load: function (name, req, onLoad, config) {
            var _this = this;
            var requirements = this.getRequireArray(name, config);
            var bindingRequirement;
            var bindingPresetRequirement;

            DEBUG = !!config.DEBUG;

            require(requirements, function(Control, html, css) {
                Control.template = html;

                bindingRequirement = _this.getBindingIdsFromHTML(html);
                bindingPresetRequirement = _this.getBindingPresetIdsFromHTML(html);
                bindingRequirement = bindingRequirement.concat(bindingPresetRequirement);

                if(css) {
                    Control._css = css;
                    _this.addCSS(css,
                        window.location.href + req.toUrl(requirements[2].replace("text!", "")));
                }

                if(bindingRequirement) {
                    require(bindingRequirement, function() {
                        onLoad(Control);
                    });
                } else {
                    onLoad(Control);
                }

            }, function(error) {
                if (onLoad.error) {
                    onLoad.error(error);
                }
            });
        },

        /**
         * Get module ids from html
         * @param {String} html
         * @returns {Array.<String>}
         */
        getBindingIdsFromHTML: function(html) {
            var _this = this;
            var regex = new RegExp(MATCH_BINDING_INCLUDE_STRING + "\\s*[\\w|/]{1,}", "ig");
            var found = html.match(regex);
            var requirementsArray = [];

            if(found) {
                found.forEach(function(value) {
                    requirementsArray.push(BINDING_PREFIX + "/" + _this.getNameFromBindingString(value));
                });
            }
            return requirementsArray;
        },

        /**
         * Get module ids from html
         * @param {String} html
         * @returns {Array.<String>}
         */
        getBindingPresetIdsFromHTML: function(html) {
            var _this = this;
            var regex = new RegExp(MATCH_BINDING_PRESET_INCLUDE_STRING + "\\s*\\w{1,}", "ig");
            var found = html.match(regex);
            var requirementsArray = [];

            if(found) {
                found.forEach(function(value) {
                    requirementsArray.push(BINDING_PRESET_PREFIX + "/" + _this.getNameFromBindingPresetString(value));
                });
            }
            return requirementsArray;
        },

        /**
         * Get binding name from special tag string
         * @param {String} bindingString
         * @returns {String}
         */
        getNameFromBindingString: function(bindingString) {
            var removeBindingTagNameRegex = new RegExp(MATCH_BINDING_INCLUDE_STRING, "ig");
            var removeSpacesRegex = new RegExp("\\s*", "ig");
            var name = bindingString.replace(removeBindingTagNameRegex, "");
            name = name.replace(removeSpacesRegex, "");
            return name;
        },

        /**
         * Get binding name from special tag string
         * @param {String} bindingString
         * @returns {String}
         */
        getNameFromBindingPresetString: function(bindingString) {
            var removeBindingTagNameRegex = new RegExp(MATCH_BINDING_PRESET_INCLUDE_STRING, "ig");
            var removeSpacesRegex = new RegExp("\\s*", "ig");
            var name = bindingString.replace(removeBindingTagNameRegex, "");
            name = name.replace(removeSpacesRegex, "");
            return name;
        },

        /**
         * Get control name from path
         * E.g. com/common/example => example
         * @param {String} fullPath
         * @returns {String}
         */
        getControlName: function(fullPath) {
            if(typeof fullPath !== "string") {
                throw new Error("Path of control should be of a string type!");
            }

            var name = fullPath.match(MATCH_NAME_REGEX);
            if(!name) {
                throw new Error("Can't find name in path!");
            }

            name = name[0];
            name = name.replace(IS_GLOBAL_PATH_REGEX, "");
            return name;
        },

        /**
         * Add css to the page. If require.config.DEBUG is true load as link tab else as style tag with loaded content
         * @param {String} css Css content
         * @param {String} link Link to css file
         */
        addCSS: function(css, link) {
            var h = document.getElementsByTagName('head')[0];
            var style;
            if(DEBUG) {
                style = document.createElement("link");
                style.type = "text/css";
                style.rel = "stylesheet";
                style.href = link;
            } else {
                style = styleTag || document.createElement("style");
                style.setAttribute("type", "text/css");

                if (style.styleSheet) { // for IE
                    style.styleSheet.cssText = (style.styleSheet.cssText || "") + css;
                } else { // others
                    var textnode = document.createTextNode(css);
                    style.appendChild(textnode);
                }
            }
            h.appendChild(style);
        },

        /**
         * Get array of requirements
         * @param {String} path
         * @param {Object} config
         * @returns {Array.<String>}
         */
        getRequireArray: function(path, config) {
            // set of requirements [js, html, css]
            var requirements = [];
            // current path to controls
            var pathToControls;
            // name of control
            var name = this.getControlName(path);

            // do load css for control
            var loadCSS = typeof config[LOAD_CSS_CONFIG_KEY] === "string" ?
                config[LOAD_CSS_CONFIG_KEY] : DEFAULT_LOAD_CSS;

            // get path to controls
            pathToControls = config[PATH_TO_CONTROLS_CONFIG_KEY] || DEFAULT_PATH_TO_CONTROLS;

            // add js
            requirements.push(pathToControls + "/" + path + "/" + name);
            // add html
            requirements.push("text!" + pathToControls + "/" + path + "/" + name + "." + HTML_FILE_EXTENSION);

            // css can't be not loaded for some reason (all css in one file)
            if(loadCSS) {
                // add css
                requirements.push("text!" + pathToControls + "/" + path + "/" + name + "." + CSS_FILE_EXTENSION);
            }

            return requirements;
        }
    };
});
