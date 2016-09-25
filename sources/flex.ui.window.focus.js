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
///         Module control movement of some node on screen. Works only with position: absolute.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            /* Description
            * data-flex-ui-window-focus
            * data-flex-ui-window-move-hook
            * */
            var //Variables
                privates        = null,
                global          = null,
                processing      = null,
                settings        = null,
                patterns        = null;
            settings = {
                CONTAINER           : 'data-flex-ui-window-focus',
                INITED              : 'data-flex-window-focus-inited',
                GLOBAL_GROUP        : 'flex-window-focus-global-group',
                GLOBAL_EVENT_FLAG   : 'flex-window-focus-global-event',
                GLOBAL_CURRENT      : 'flex-window-focus-global-current',
                GLOBAL_EVENT_ID     : 'flex-window-focus-global-event-id',
                FOCUSED_ZINDEX      : 1000
            };
            function init(id) {
                var id          = id || null,
                    containers  = _nodes('*[' + settings.CONTAINER + (id !== null ? '="' + id + '"' : '') + ']:not([' + settings.INITED + '])').target;
                if (containers !== null) {
                    Array.prototype.forEach.call(
                        containers,
                        function (container) {
                            var id = container.getAttribute(settings.CONTAINER);
                            if (id === '' || id === null) {
                                container.setAttribute(settings.CONTAINER, flex.unique());
                            }
                            container.setAttribute(settings.INITED, true);
                        }
                    );
                }
            };
            global      = {
                attach: function () {
                    var isAttached  = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG);
                    if (isAttached !== true) {
                        flex.overhead.globaly.set(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG, true);
                        _node(window).events().add(
                            'click',
                            function (event) {
                                processing.onClick(event);
                                return true;
                            },
                            settings.GLOBAL_EVENT_ID
                        );
                    }
                },
            };
            processing  = {
                getContainer    : function(node){
                    var id          = null,
                        container   = null;
                    if (typeof node.getAttribute === 'function') {
                        id = node.getAttribute(settings.CONTAINER);
                        if (id !== '' && id !== null) {
                            return {
                                container   : node,
                                id          : id
                            };
                        }
                    }
                    container = _node(node).html().find().parentByAttr({ name: settings.CONTAINER, value: null });
                    if (container !== null) {
                        return {
                            container   : container,
                            id          : container.getAttribute(settings.CONTAINER)
                        };
                    }
                    return null;
                },
                history         : {
                    is      : function (id) {
                        return (flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT) !== id ? false : true);
                    },
                    set     : function (id) {
                        flex.overhead.globaly.set(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT, id);
                    },
                    get     : function () {
                        return flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT);
                    },
                    del     : function () {
                        flex.overhead.globaly.del(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT);
                    }
                },
                onClick         : function (event) {
                    var container   = processing.getContainer(event.flex.target),
                        previous    = processing.history.get();
                    if (previous !== null) {
                        processing.focus.unset(previous);
                    }
                    if (container !== null) {
                        if (processing.history.is(container.id) === false) {
                            processing.focus.set(container.id);
                        }
                    }
                },
                focus           : {
                    zIndex  : function(id, value){
                        var container   = _node('*[' + settings.CONTAINER + '="' + id + '"' + ']').target;
                        if (container !== null) {
                            container.style.zIndex = value;
                        }
                    },
                    set     : function(id){
                        processing.focus.zIndex(id, settings.FOCUSED_ZINDEX);
                        processing.history.set(id);
                    },
                    unset   : function(id){
                        processing.focus.zIndex(id, '');
                        processing.history.del(id);
                    },
                },
            };
            patterns    = {
                attach: function () {
                    if (flex.oop.namespace.get('flex.registry.events.ui.patterns.GROUP') !== null) {
                        flex.events.core.listen(flex.registry.events.ui.patterns.GROUP, flex.registry.events.ui.patterns.MOUNTED, function (nodes) {
                            var context = nodes.length !== void 0 ? (nodes.length > 0 ? nodes : null) : null;
                            if (context !== null) {
                                context.forEach(function (context) {
                                    if (_node('*[' + settings.CONTAINER + ']:not([' + settings.INITED + '])', false, context).target !== null) {
                                        init();
                                    }
                                });
                            }
                        });
                    }
                }
            };
            privates    = {
                init : init
            };
            global.attach();
            patterns.attach();
            //Init modules
            if (flex.libraries !== void 0) {
                if (flex.libraries.events !== void 0 && flex.libraries.html !== void 0) {
                    flex.libraries.events.create();
                    flex.libraries.html.create();
                }
            }
            return {
                init : privates.init
            };
        };
        flex.modules.attach({
            name            : 'ui.window.focus',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html']
        });
    }
}());