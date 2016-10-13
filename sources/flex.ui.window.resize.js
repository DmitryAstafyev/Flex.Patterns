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
///         Module control resizing of some node on screen. Works only with position: absolute.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            /* Description
                * data-flex-ui-window-resize-container="id"
                *
                * Next field isn't necessary and can be skipped. You should define it for situation, when container get his position form parent.
                * For example container has top:50% from parent. In this case you should define such parent by next mark
                * data-flex-ui-window-resize-position-parent="id"
                * */
            var //Variables
                privates        = null,
                render          = null,
                patterns        = null,
                coreEvents      = null,
                settings        = null;
            settings = {
                CONTAINER           : 'data-flex-ui-window-resize-container',
                INITED              : 'data-flex-window-resize-inited',
                HOOK                : 'data-flex-window-resize-hook',
                HOOKS               : ['top', 'left', 'right', 'bottom', 'corner'],
                HOOKS_STYLE         : {
                    top     : { node: 'div', style: { position: 'absolute', zIndex: 1, height: '6px', width: '100%', top: '0px', left: '0px', cursor: 'n-resize' } },
                    bottom  : { node: 'div', style: { position: 'absolute', zIndex: 1, height: '6px', width: '100%', bottom: '0px', left: '0px', cursor: 'n-resize' } },
                    left    : { node: 'div', style: { position: 'absolute', zIndex: 1, height: '100%', width: '6px', top: '0px', left: '0px', cursor: 'e-resize' } },
                    right   : { node: 'div', style: { position: 'absolute', zIndex: 1, height: '100%', width: '6px', top: '0px', right: '0px', cursor: 'e-resize'} },
                    corner  : { node: 'div', style: { position: 'absolute', zIndex: 1, height: '10px',    width: '10px',   bottom: '0px',  right: '0px', cursor: 'nw-resize' } }
                },
                POSITION_PARENT     : 'data-flex-ui-window-resize-position-parent',
                GLOBAL_GROUP        : 'flex-window-resize',
                GLOBAL_EVENT_FLAG   : 'flex-window-resize-global-event',
                GLOBAL_CURRENT      : 'flex-window-resize-global-current',
                GLOBAL_EVENT_ID     : 'flex-window-resize-global-event-id',
                STATE_STORAGE       : 'flex-window-resize-instance-state',
            };
            function init(id) {
                var id          = id || null,
                    containers  = _nodes('*[' + settings.CONTAINER + (id !== null ? '="' + id + '"' : '') + ']:not([' + settings.INITED + '])').target;
                if (containers !== null) {
                    Array.prototype.forEach.call(
                        containers,
                        function (container) {
                            var id = container.getAttribute(settings.CONTAINER);
                            if (id !== null && id !== '') {
                                Array.prototype.forEach.call(
                                    settings.HOOKS,
                                    function (hook) {
                                        var hooks = render.hooks.get(id, container, hook);
                                        render.attach(container, hooks, hook, id);
                                        coreEvents.attach(container, id);
                                    }
                                );
                            }
                            container.setAttribute(settings.INITED, true);
                        }
                    );
                }
            };
            render          = {
                position    : {
                    getParent   : function (id) {
                        var parent = _node('*[' + settings.POSITION_PARENT + '="' + id + '"' + ']');
                        return parent !== null ? parent.target : null;
                    }
                },
                hooks       : {
                    make    : function (container, hook) {
                        var node = document.createElement(settings.HOOKS_STYLE[hook].node);
                        for (var property in settings.HOOKS_STYLE[hook].style) {
                            node.style[property] = settings.HOOKS_STYLE[hook].style[property];
                        }
                        container.appendChild(node);
                        return node;
                    },
                    get     : function (id, container, hook) {
                        var hooks = _nodes('*[' + settings.CONTAINER + '="' + id + '"' + '][' + settings.HOOK + '="' + hook + '"' + ']:not([' + settings.INITED + '])').target;
                        if (hooks.length === 0) {
                            hooks = [];
                            hooks.push(render.hooks.make(container, hook));
                        }
                        return hooks;
                    }
                },
                attach  : function (container, hooks, direction, id) {
                    var position_parent = render.position.getParent(id);
                    Array.prototype.forEach.call(
                        hooks,
                        function (hook) {
                            _node(hook).events().add(
                                'mousedown',
                                function (event) {
                                    render.start(event, container, hook, direction, position_parent, id);
                                },
                                id
                            );
                        }
                    );
                },
                start: function (event, container, hook, direction, position_parent, id) {
                    function getPosition(node) {
                        if (node.currentStyle) {
                            if (node.currentStyle.position) {
                                return node.currentStyle.position;
                            }
                        }
                        if (window.getComputedStyle) {
                            return window.getComputedStyle(node).position;
                        }
                        return null;
                    }
                    var size        = null,
                        pos         = null,
                        scrl        = null,
                        isFixed     = null;
                    if (flex.overhead.objecty.get(container, settings.STATE_STORAGE, false, false) === false) {
                        size        = _node(container).html().size().get();
                        pos         = _node(position_parent !== null ? position_parent : container).html().position().byPage();
                        scrl        = _node(container.parentNode).html().scroll().position();
                        isFixed     = getPosition(container) !== 'fixed' ? false : true;
                        flex.overhead.globaly.set(
                            settings.GLOBAL_GROUP,
                            settings.GLOBAL_CURRENT,
                            {
                                clientX         : event.flex.clientX,
                                clientY         : event.flex.clientY,
                                offsetX         : event.flex.offsetX,
                                offsetY         : event.flex.offsetY,
                                pageX           : event.flex.pageX,
                                pageY           : event.flex.pageY,
                                hook            : hook,
                                direction       : direction,
                                container       : container,
                                position_parent : position_parent,
                                id              : id,
                                oldX            : event.flex.pageX,
                                oldY            : event.flex.pageY,
                                posX            : pos.left + (isFixed === false ? scrl.left() : 0),
                                posY            : pos.top + (isFixed === false ? scrl.top() : 0),
                                width           : size.width,
                                height          : size.height
                            }
                        );
                        return event.flex.stop();
                    } else {
                        return true;
                    }
                },
                move    : function(event){
                    var instance            = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT),
                        container           = null,
                        position_container  = null;
                    if (instance !== null) {
                        container           = instance.container;
                        position_container  = instance.position_parent !== null ? instance.position_parent : container;
                        switch (instance.direction) {
                            case 'top':
                                instance.posY                   = (instance.posY - (instance.oldY - event.flex.pageY));
                                instance.height                 = (instance.height + (instance.oldY - event.flex.pageY));
                                container.style.height          = instance.height + 'px';
                                position_container.style.top    = instance.posY + 'px';
                                break;
                            case 'left':
                                instance.posX                   = (instance.posX - (instance.oldX - event.flex.pageX));
                                instance.width                  = (instance.width + (instance.oldX - event.flex.pageX));
                                container.style.width           = instance.width + 'px';
                                position_container.style.left   = instance.posX + 'px';
                                break;
                            case 'bottom':
                                instance.height                 = (instance.height - (instance.oldY - event.flex.pageY));
                                container.style.height          = instance.height + 'px';
                                break;
                            case 'right':
                                instance.width                  = (instance.width - (instance.oldX - event.flex.pageX));
                                container.style.width           = instance.width + 'px';
                                break;
                            case 'corner':
                                instance.height                 = (instance.height - (instance.oldY - event.flex.pageY));
                                container.style.height          = instance.height + 'px';
                                instance.width                  = (instance.width - (instance.oldX - event.flex.pageX));
                                container.style.width           = instance.width + 'px';
                                break;
                        }
                        instance.oldX = event.flex.pageX;
                        instance.oldY = event.flex.pageY;
                        //Run external events in background
                        setTimeout(
                            function () {
                                flex.events.core.fire(
                                    flex.registry.events.ui.window.resize.GROUP,
                                    flex.registry.events.ui.window.resize.REFRESH,
                                    { container: instance.container, id: instance.id }
                                );
                            },
                            10
                        );
                        return event.flex.stop();
                    } else {
                        return true;
                    }
                },
                stop    : function(event) {
                    var instance = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT);
                    if (instance !== null) {
                        flex.events.core.fire(
                            flex.registry.events.ui.window.resize.GROUP,
                            flex.registry.events.ui.window.resize.FINISH,
                            { container: instance.container, id: instance.id }
                        );
                    }
                    flex.overhead.globaly.del(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT);
                },
                global: {
                    attach: function () {
                        var isAttached  = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG);
                        if (isAttached !== true) {
                            flex.overhead.globaly.set(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG, true);
                            _node(window).events().add(
                                'mousemove',
                                function (event) {
                                    render.move(event);
                                },
                                settings.GLOBAL_EVENT_ID
                            );
                            _node(window).events().add(
                                'mouseup',
                                function (event) {
                                    render.stop(event);
                                },
                                settings.GLOBAL_EVENT_ID
                            );
                        }
                    }
                }
            };
            coreEvents      = {
                attach: function (container, id) {
                    flex.events.core.listen(
                        flex.registry.events.ui.window.maximize.GROUP,
                        flex.registry.events.ui.window.maximize.MAXIMIZED,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, container, flex.registry.events.ui.window.maximize.MAXIMIZED);
                        },
                        settings.STATE_STORAGE + id,
                        false
                    );
                    flex.events.core.listen(
                        flex.registry.events.ui.window.maximize.GROUP,
                        flex.registry.events.ui.window.maximize.RESTORED,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, container, flex.registry.events.ui.window.maximize.RESTORED);
                        },
                        settings.STATE_STORAGE + id,
                        false
                    );
                },
                onRefreshByParent: function (parent, container, state) {
                    if (parent === container) {
                        switch (state) {
                            case flex.registry.events.ui.window.maximize.MAXIMIZED:
                                flex.overhead.objecty.set(container, settings.STATE_STORAGE, true, true);
                                break;
                            case flex.registry.events.ui.window.maximize.RESTORED:
                                flex.overhead.objecty.set(container, settings.STATE_STORAGE, false, true);
                                break;
                        }
                    }
                    return false;
                }
            };
            patterns        = {
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
            privates = {
                init : init
            };
            (function () {
                flex.registry.events.ui                 === void 0 && (flex.registry.events.ui = {});
                flex.registry.events.ui.window          === void 0 && (flex.registry.events.ui.window = {});
                flex.registry.events.ui.window.resize   === void 0 && (flex.registry.events.ui.window.resize = {
                    GROUP   : 'flex.ui.window.resize',
                    REFRESH : 'refresh',
                    FINISH  : 'finish',
                });
            }());
            render.global.attach();
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
            name            : 'ui.window.resize',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html']
        });
    }
}());