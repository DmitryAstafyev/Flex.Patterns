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
///         Module control switching of areas 
///     </summary>
/// </module>
(function () {
    'use strict';
    if (flex !== void 0) {
        var protofunction       = function () { };
        protofunction.prototype = function () {
            var //Get modules
                html            = flex.libraries.html.          create(),
                events          = flex.libraries.events.        create(),
                animation       = flex.libraries.css.animation. create(),
                //Variables
                initializer     = null,
                render          = null,
                switcher        = null,
                coreEvents      = null,
                privates        = null,
                settings        = null;
            settings = {
                /*
                Template of areaswitcher container
                <div data-flex-ui-areaswitcher="Container">
                </div>

                Template of areaswitcher area
                <div data-flex-ui-areaswitcher="Item">
                </div>
                */
                layouts     : {
                    BOX         : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areaswitcher', value: 'Container'    }, { name: 'data-flex-ui-areaswitcher-group',   value: 'id' }] },
                    AREA        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areaswitcher', value: 'Item'         }, { name: 'data-flex-ui-areaswitcher-area',    value: 'id' }] },
                },
                storage     : {
                    GLOBAL      : 'flex.ui.areaswitcher.group',
                    CURRENT_AREA: 'flex.ui.areaswitcher.currentarea',
                    PARAMETERS  : 'flex.ui.areaswitcher.parameters'
                },
                animations  : {
                    horizontal: {
                        show: {
                            keyframes: 'from {left:[width];} to {left:0;}',
                            animation: '350ms ease-in-out 0ms normal forwards'
                        },
                        hide: {
                            keyframes: 'from {left:0;} to {left:-[width];}',
                            animation: '350ms ease-in-out 0ms normal forwards'
                        },
                    },
                    vertical: {
                        show: {
                            keyframes: 'from {top:[height];} to {top:0;}',
                            animation: '350ms ease-in-out 0ms normal forwards'
                        },
                        hide: {
                            keyframes: 'from {top:0;} to {top:-[height];}',
                            animation: '350ms ease-in-out 0ms normal forwards'
                        },
                    }
                },
                attrs       : {
                    GROUP_ID: 'data-flex-ui-areaswitcher-group',
                    ITEM_ID : 'data-flex-ui-areaswitcher-area'
                }
            };
            initializer = {
                validate: {
                    parameters  : function (parameters) {
                        return flex.oop.objects.validate(parameters, [  { name: 'parent',       type: ['node', 'string'],   value: null, handle: html.helpers.validateNode  },
                                                                        { name: 'content',      type: ['node', 'string'],   value: null, handle: html.helpers.validateNode  },
                                                                        { name: 'auto',         type: 'object',             value: {} },
                                                                        { name: 'events',       type: 'object',             value: {} },
                                                                        { name: 'animation',    type: 'object',             value: {} },
                                                                        { name: 'id',           type: 'string',             value: flex.unique()    }]);
                    },
                    events      : function (events) {
                        return flex.oop.objects.validate(events, [{ name: 'resize', type: 'function', value: null }]);
                    },
                    auto        : function (auto) {
                        return flex.oop.objects.validate(auto, [{ name: 'duration', type: 'number',     value: -1     }]);
                    },
                    animation   : function (animation) {
                        flex.oop.objects.validate(animation, [  { name: 'show',     type: 'object', value: {} },
                                                                { name: 'hide',     type: 'object', value: {} },
                                                                { name: 'preset',   type: 'string', value: 'horizontal', values: ['horizontal'] }]);
                        animation.show = animation.show === null ? {} : animation.show;
                        animation.hide = animation.hide === null ? {} : animation.hide;
                        flex.oop.objects.validate(animation.show, [ { name: 'keyframes',    type: 'string', value: null },
                                                                    { name: 'animation',    type: 'string', value: null }]);
                        flex.oop.objects.validate(animation.hide, [ { name: 'keyframes',    type: 'string', value: null },
                                                                    { name: 'animation',    type: 'string', value: null }]);
                    }
                },
                init    : function (parameters) {
                    function getItemID(parameters) {
                        if (parameters.content !== null) {
                            if (parameters.content.hasAttribute) {
                                if (parameters.content.hasAttribute(settings.attrs.GROUP_ID) !== false) {
                                    return parameters.content.getAttribute(settings.attrs.GROUP_ID)
                                }
                            }
                        }
                        return parameters.id;
                    };
                    var container = null,
                        builder     = html.builder(),
                        storage     = flex.overhead.globaly.get(settings.storage.GLOBAL, settings.storage.PARAMETERS, {});
                    if (initializer.validate.parameters(parameters) !== null) {
                        initializer.validate.events     (parameters.events      );
                        initializer.validate.auto       (parameters.auto        );
                        initializer.validate.animation  (parameters.animation   );
                        parameters.id = getItemID(parameters);
                        settings.layouts.BOX.attrs[1].value     = parameters.id;
                        container                               = builder.build(settings.layouts.BOX);
                        if (container !== null) {
                            parameters.container = container;
                            if (parameters.content !== null) {
                                //Replace content
                                render.migration(parameters);
                                //Mount
                                parameters.content.parentNode.insertBefore(parameters.container, parameters.content);
                                parameters.content.parentNode.removeChild(parameters.content);
                                //Save parameters 
                                storage[parameters.id] = parameters;
                                //Init areas
                                switcher.init(parameters.id);
                            }
                        }
                    }
                },
                getParameters: function (id) {
                    var parameters = flex.overhead.globaly.get(settings.storage.GLOBAL, settings.storage.PARAMETERS);
                    if (parameters !== null) {
                        if (parameters[id]) {
                            return parameters[id];
                        }
                    }
                    return null;
                }
            };
            render = {
                migration: function (parameters) {
                    function getItemID(node) {
                        if (node.hasAttribute) {
                            if (node.hasAttribute(settings.attrs.ITEM_ID) !== false) {
                                return node.getAttribute(settings.attrs.ITEM_ID)
                            } else {
                                return flex.unique();
                            }
                        } else {
                            return null;
                        }
                    };
                    var builder = html.builder(),
                        removed = [],
                        areas   = {};
                    Array.prototype.forEach.call(
                        parameters.content.childNodes,
                        function (childNode) {
                            var wrapper = null,
                                id      = getItemID(childNode);
                            if (childNode.nodeName.toLowerCase() !== '#text' && id !== null) {
                                settings.layouts.AREA.attrs[1].value = id;
                                wrapper = builder.build(settings.layouts.AREA)
                                html.helpers.           appendChilds(wrapper, childNode.childNodes);
                                parameters.container.   appendChild(wrapper);
                                removed.push(childNode);
                                areas[id] = {
                                    id      : id,
                                    wrapper : wrapper
                                };
                            }
                        }
                    );
                    removed.forEach(function (node) {
                        node.parentNode.removeChild(node);
                    });
                    parameters.areas = areas;
                },
            };
            switcher = {
                switchTo: function (parameters, id) {
                    var current = flex.overhead.objecty.get(parameters.container, settings.storage.CURRENT_AREA, false);
                    if (parameters.areas[id]) {
                        if (current !== id) {
                            if (current !== null) {
                                switcher.hide.soft(parameters, current);
                            }
                            switcher.show(parameters, id);
                            flex.overhead.objecty.set(parameters.container, settings.storage.CURRENT_AREA, id, true);
                        }
                    }
                },
                show: function (parameters, id) {
                    var Sizes       = html.size(),
                        size        = Sizes.node(parameters.container),
                        keyframes   = parameters.animation.show;
                    if (parameters.areas[id]) {
                        parameters.areas[id].wrapper.style.display  = '';
                        if (keyframes !== null) {
                            parameters.areas[id].wrapper.style.width    = size.width    + 'px';
                            parameters.areas[id].wrapper.style.height   = size.height   + 'px';
                            keyframes = keyframes.keyframes;
                            keyframes = keyframes.replace(/\[width\]/gi,    size.width  + 'px');
                            keyframes = keyframes.replace(/\[height\]/gi,   size.height + 'px');
                            animation.apply({
                                element     : parameters.areas[id].wrapper,
                                keyframes   : keyframes,
                                animation   : parameters.animation.show.animation,
                                onFinish    : function () {
                                    parameters.areas[id].wrapper.style.width    = '';
                                    parameters.areas[id].wrapper.style.height   = '';
                                },
                            });
                        }
                    }
                },
                hide    : {
                    hard: function (parameters, id) {
                        if (parameters.areas[id]) {
                            parameters.areas[id].wrapper.style.display = 'none';
                        }
                    },
                    soft: function (parameters, id) {
                        var Sizes       = html.size(),
                            size        = Sizes.node(parameters.container),
                            keyframes   = parameters.animation.hide;
                        if (parameters.areas[id]) {
                            if (keyframes !== null) {
                                parameters.areas[id].wrapper.style.width    = size.width    + 'px';
                                parameters.areas[id].wrapper.style.height   = size.height   + 'px';
                                keyframes = keyframes.keyframes;
                                keyframes = keyframes.replace(/\[width\]/gi,    size.width  + 'px');
                                keyframes = keyframes.replace(/\[height\]/gi,   size.height + 'px');
                                animation.apply({
                                    element     : parameters.areas[id].wrapper,
                                    keyframes   : keyframes,
                                    animation   : parameters.animation.hide.animation,
                                    onFinish    : function () {
                                        parameters.areas[id].wrapper.style.width    = '';
                                        parameters.areas[id].wrapper.style.height   = '';
                                        parameters.areas[id].wrapper.style.display  = 'none';
                                    },
                                });
                            } else {
                                parameters.areas[id].wrapper.style.display = 'none';
                            }
                        }
                    },
                },
                auto    : {
                    start   : function (parameters) {
                        parameters.auto.timerID = setTimeout(function () {
                            switcher.auto.next(parameters);
                        }, parameters.auto.duration);
                    },
                    next    : function (parameters) {
                        var current = flex.overhead.objecty.get(parameters.container, settings.storage.CURRENT_AREA, false),
                            index   = null;
                        if (current !== null) {
                            index = Object.keys(parameters.areas).indexOf(current);
                            index = (index === Object.keys(parameters.areas).length - 1 ? 0 : index + 1);
                            switcher.switchTo(parameters, Object.keys(parameters.areas)[index]);
                            parameters.auto.timerID = setTimeout(function () {
                                switcher.auto.next(parameters);
                            }, parameters.auto.duration);
                        }
                    },
                    stop    : function (parameters) {
                        if (parameters.auto.timerID) {
                            clearTimeout(parameters.auto.timerID);
                            parameters.auto.timerID = null;
                            delete parameters.auto.timerID;
                        }
                    }
                },
                init    : function (id) {
                    function keyframesSettings(parameters) {
                        function check(parameters, type) {
                            if (parameters.animation[type].keyframes === null || parameters.animation[type].animation === null) {
                                if (settings.animations[parameters.animation.preset][type] !== null) {
                                    parameters.animation[type].keyframes = settings.animations[parameters.animation.preset][type].keyframes;
                                    parameters.animation[type].animation = settings.animations[parameters.animation.preset][type].animation;
                                } else {
                                    parameters.animation[type] = null;
                                }
                            }
                        };
                        check(parameters, 'show');
                        check(parameters, 'hide');
                    };
                    var parameters = initializer.getParameters(id);
                    if (parameters !== null) {
                        keyframesSettings(parameters);
                        if (Object.keys(parameters.areas).length > 0) {
                            for (var id in parameters.areas) {
                                switcher.hide.hard(parameters, id);
                            }
                            switcher.switchTo(parameters, Object.keys(parameters.areas)[0]);
                            if (parameters.auto.duration !== -1) {
                                switcher.auto.start(parameters);
                            }
                        }
                    }
                }
            };
            coreEvents  = {
                attach              : function (parameters, nodes) {
                    flex.events.core.listen(
                        flex.registry.events.ui.window.resize.GROUP,
                        flex.registry.events.ui.window.resize.REFRESH,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, parameters, nodes);
                        },
                        parameters.id,
                        false
                    );
                    flex.events.core.listen(
                        flex.registry.events.ui.window.maximize.GROUP,
                        flex.registry.events.ui.window.maximize.CHANGE,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, parameters, nodes);
                        },
                        parameters.id,
                        false
                    );
                    flex.events.core.listen(
                        flex.registry.events.ui.itemsbox.GROUP,
                        flex.registry.events.ui.itemsbox.REFRESH,
                        function () {
                            return tabs.update.layout(parameters, nodes);
                        },
                        parameters.id,
                        false
                    );
                },
                onRefreshByParent   : function (parent, parameters, nodes) {
                    var fromParent  = html.select.fromParent(),
                        node        = fromParent.first(parent, '*[' + settings.layouts.BOX.container.attrs[1].name + '="' + parameters.id + '"]');
                    if (node !== null) {
                        tabs.update.layout(parameters, nodes);
                        return true;
                    }
                    return false;
                }
            };
            privates    = {
                init    : initializer.init,
            };
            return {
                init    : privates.init,
            };
        };
        flex.modules.attach({
            name            : 'ui.areaswitcher',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html', 'flex.css.animation'],
            resources       : [
                { url: 'KERNEL::/css/flex.ui.areaswitcher.css' }
            ],
        });
    }
}());