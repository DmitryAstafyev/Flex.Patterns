/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright © 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
* This file (core / module) is released under the Apache License (Version 2.0). See [LICENSE] file for details.    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/// <reference path='intellisense/flex.callers.node.intellisense.js' />
/// <reference path='intellisense/flex.callers.nodes.intellisense.js' />
/// <reference path='intellisense/flex.callers.object.intellisense.js' />
/// <reference path="intellisense/flex.intellisense.js" />
/// <module>
///     <summary>
///         Controller of CSS animation.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            var //Get modules
                html        = flex.libraries.html.create(),
                cssEvents   = flex.libraries.css.events.create(),
                //Variables
                keyframes   = null,
                animations  = null,
                privates    = null,
                settings    = null;
            settings    = {
                storage : {
                    GROUP           : 'flex.html',
                    SCROLL          : 'scroll',
                    CUSTOM_STYLES   : 'custom.styles'
                },
                classes : {
                    scroll: {
                        MINIMAL_WIDTH   : 15,
                        MINIMAL_HEIGHT  : 15
                    }
                }
            };
            keyframes = {
                keyframe: (function () {
                    if      (window.CSSRule.WEBKIT_KEYFRAMES_RULE   ) { return '@-webkit-keyframes';  }
                    else if (window.CSSRule.MOZ_KEYFRAMES_RULE      ) { return '@-moz-keyframes';     }
                    else if (window.CSSRule.O_KEYFRAMES_RULE        ) { return '@-o-keyframes';       } 
                    else if (window.CSSRule.KEYFRAMES_RULE          ) { return '@keyframes';          }
                }()),
                //Create new keyframe rule
                create  : function (name, value) {
                    ///     <summary>Create new keyframe rule.</summary>
                    ///     <param name="name"  type="string">Name of rule</param>
                    ///     <param name="value" type="string">Value of keyframe</param>
                    ///     <returns type="boolean" mayBeNull="true">Null - if error. True - if is OK.</returns>
                    var name        = (typeof name  === "string" ? name     : null),
                        value       = (typeof value === "string" ? value    : null),
                        styles      = html.styles();
                    if (name !== null && value !== null) {
                        //Remove { from beginning
                        value = value.replace(/^\{/gi, '');
                        //Remove } from end
                        value = value.replace(/(\}[\s\n\r]*\})$/gi, '}');
                        return styles.setRule(keyframes.keyframe + ' ' + name, value);
                    }
                    return null;
                },
                remove: function (name) {
                    var name    = (typeof name === "string" ? name : null),
                        styles  = html.styles();
                    if (name !== null) {
                        return styles.deleteRule(null, keyframes.keyframe + ' ' + name, false);
                    }
                    return null;
                },
            };
            animations = {
                animation: (function () {
                    if      (window.CSSRule.WEBKIT_KEYFRAMES_RULE   ) { return '-webkit-animation';  }
                    else if (window.CSSRule.MOZ_KEYFRAMES_RULE      ) { return '-moz-animation';     }
                    else if (window.CSSRule.O_KEYFRAMES_RULE        ) { return '-o-animation';       } 
                    else if (window.CSSRule.KEYFRAMES_RULE          ) { return 'animation';          }
                }()),
                //Apply some animation to any DOM object and clear animation data after animation will finish
                apply: function (parameters) {
                    ///     <summary>Apply CSS animation to any DOM object. Clear animation data after animation will finish</summary>
                    ///     <param name="parameters" type="Object">
                    ///         {element            : DOMObject || string (selector),                                       &#13;&#10;
                    ///          keyframes          : string    (rules like : {from{...}to{...}})                           &#13;&#10;                  
                    ///          animation          : string    (animation string like (without name of animation): 1000ms ease-in 0ms normal),         &#13;&#10;               
                    ///          onFinish           : function  (will be called on finish animation. [this] will be element &#13;&#10;              
                    ///          id                 : string    id of animation                                             &#13;&#10;                  
                    ///         }
                    ///     </param>
                    ///     <returns type="boolean" mayBeNull="true">True - if OK. False - if some problem is</returns>
                    var styles = html.styles();
                    if (flex.oop.objects.validate(parameters, [ { name: 'element',      type: ['node', 'string'], value: null, handle: html.helpers.validateNode },
                                                                { name: 'keyframes',    type: 'string'                              },
                                                                { name: 'animation',    type: 'string'                              },
                                                                { name: 'onFinish',     type: 'function',   value: null             },
                                                                { name: 'id',           type: 'string',     value: flex.unique('css_animation')    }]) !== false) {
                        if (parameters.element !== null) {
                            cssEvents.animations.attach.end(parameters.element, function (event) {
                                animations.clear(parameters.element, parameters.id, (event ? parameters.onFinish : null));
                            }, true, true);
                            keyframes.create(parameters.id, parameters.keyframes);
                            styles.setRule('.' + parameters.id, animations.animation + ':' + parameters.id + ' ' + parameters.animation + ';');
                            styles.addClass(parameters.element, parameters.id);
                            return parameters.id;
                        }
                    }
                    return null;
                },
                clear: function (element, id, onFinish) {
                    var styles = html.styles();
                    flex.system.handle(onFinish, null, 'flex.css.animation.animations.clear', element);
                    styles.removeClass(element, id);
                    styles.deleteRule(null, '.' + id, false);
                    keyframes.remove(id);
                },
            };
            privates = {
                apply: animations.apply,
                clear: animations.clear
            };
            return {
                apply: privates.apply,
                clear: privates.clear
            };
        };
        flex.modules.attach({
            name            : 'css.animation',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html', 'flex.css.events'],
        });
    }
}());