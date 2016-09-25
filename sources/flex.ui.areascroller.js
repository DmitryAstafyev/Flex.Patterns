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
///         Module control scrolling of areas 
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
                animationEvents = flex.libraries.css.events.    create(),
                animation       = flex.libraries.css.animation. create(),
                //Variables
                initializer     = null,
                render          = null,
                movement        = null,
                privates        = null,
                settings        = null;
            settings = {
                /*
                Template of areascroller container
                <div data-flex-ui-areascroller="Container">
                </div>

                Template of areascroller area
                <div data-flex-ui-areascroller="Item">
                </div>
                */
                layouts     : {
                    BOX: {
                        container   : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'Container' }, { name: 'data-flex-ui-areascroller-group', value: 'id' }] },
                        content     : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'Content' }] },
                        settingup: {
                            parent: 'container',
                            childs: ['content']
                        }
                    },
                    AREA        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'Item'         }, { name: 'data-flex-ui-areascroller-area',    value: 'id' }] },
                    borders     : {
                        TOP: {
                            container   : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-top-container' }] },
                            line        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-top' }] },
                            settingup   : {
                                parent  : 'container',
                                childs  : ['line']
                            }
                        },
                        BOTTOM: {
                            container   : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-bottom-container' }] },
                            line        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-bottom' }] },
                            settingup   : {
                                parent  : 'container',
                                childs  : ['line']
                            }
                        },
                        LEFT: {
                            container   : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-left-container' }] },
                            line        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-left' }] },
                            settingup   : {
                                parent  : 'container',
                                childs  : ['line']
                            }
                        },
                        RIGHT: {
                            container   : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-right-container' }] },
                            line        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-areascroller', value: 'border-right' }] },
                            settingup   : {
                                parent  : 'container',
                                childs  : ['line']
                            }
                        },
                    }
                },
                storage     : {
                    GLOBAL      : 'flex.ui.areascroller.group',
                    PARAMETERS  : 'flex.ui.areascroller.parameters'
                },
                attrs       : {
                    GROUP_ID    : 'data-flex-ui-areascroller-group',
                    ITEM_ID     : 'data-flex-ui-areascroller-area',
                    ITEM_ORDER  : 'data-flex-ui-areascroller-order'
                },
                animations: {
                    top: {
                        keyframes: '0% {top:-2rem;} 25% {top:-1rem;} 50%{top:-1rem;} 100%{top:-2rem;}',
                        animation: '1000ms ease-in-out 0ms normal forwards'
                    },
                    bottom: {
                        keyframes: '0% {bottom:-2rem;} 25% {bottom:-1rem;} 50%{bottom:-1rem;} 100%{bottom:-2rem;}',
                        animation: '1000ms ease-in-out 0ms normal forwards'
                    },
                    left: {
                        keyframes: '0% {left:-2rem;} 25% {left:-1rem;} 50%{left:-1rem;} 100%{left:-2rem;}',
                        animation: '1000ms ease-in-out 0ms normal forwards'
                    },
                    right: {
                        keyframes: '0% {right:-2rem;} 25% {right:-1rem;} 50%{right:-1rem;} 100%{right:-2rem;}',
                        animation: '1000ms ease-in-out 0ms normal forwards'
                    },
                },
                classes: {
                    ANIMATION_MOVEMENT: 'data-flex-ui-areascroller-animation'
                },
                parameters  : {
                    SWITCH_TRIGGER  : 0.3,//from 0 to 1
                    SENSITIVITY     :5 //in px
                }
            };
            initializer = {
                validate        : {
                    parameters  : function (parameters) {
                        var result = flex.oop.objects.validate(parameters, [    { name: 'parent',       type: ['node', 'string'],   value: null, handle: html.helpers.validateNode  },
                                                                                { name: 'content',      type: ['node', 'string'],   value: null, handle: html.helpers.validateNode  },
                                                                                { name: 'events',       type: 'object',             value: {} },
                                                                                { name: 'trigger',      type: 'number',             value: settings.parameters.SWITCH_TRIGGER },
                                                                                { name: 'sensitivity',  type: 'number',             value: settings.parameters.SENSITIVITY },
                                                                                { name: 'id',           type: 'string',             value: flex.unique() }]);
                        if (result !== false) {
                            if (parameters.trigger < 0 || parameters.trigger > 1) {
                                parameters.trigger = settings.parameters.SWITCH_TRIGGER;
                            }
                            if (parameters.sensitivity < 0 || parameters.sensitivity > 50) {
                                parameters.sensitivity = settings.parameters.SENSITIVITY;
                            }
                        }
                        return result;
                    },
                    events      : function (events) {
                        return flex.oop.objects.validate(events, [{ name: 'resize', type: 'function', value: null }]);
                    }
                },
                init            : function (parameters) {
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
                        parameters.id = getItemID(parameters);
                        settings.layouts.BOX.container.attrs[1].value   = parameters.id;
                        container                                       = builder.build(settings.layouts.BOX);
                        if (container !== null) {
                            parameters.parent       = container.container;
                            parameters.container    = container.content;
                            if (parameters.parent !== null) {
                                //Replace content
                                render.migration(parameters);
                                //Mount
                                parameters.content.parentNode.insertBefore(parameters.parent, parameters.content);
                                parameters.content.parentNode.removeChild(parameters.content);
                                //Save parameters 
                                storage[parameters.id] = parameters;
                            }
                            parameters.borders      = {
                                top     : builder.build(settings.layouts.borders.TOP),
                                bottom  : builder.build(settings.layouts.borders.BOTTOM),
                                left    : builder.build(settings.layouts.borders.LEFT),
                                right   : builder.build(settings.layouts.borders.RIGHT),
                            };
                            for (var key in parameters.borders) {
                                parameters.container.parentNode.appendChild(parameters.borders[key].container);
                                parameters.borders[key] = parameters.borders[key].line;
                            }
                            movement.init();
                        }
                    }
                },
                getParameters   : function (id) {
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
                migration   : function (parameters) {
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
                        areas   = {},
                        index   = 0;
                    //Get/set ordering 
                    render.ordering.get(parameters);
                    //Replace nodes
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
                                    wrapper : wrapper,
                                    index   : index++
                                };
                            }
                        }
                    );
                    removed.forEach(function (node) {
                        node.parentNode.removeChild(node);
                    });
                    parameters.areas = areas;
                    //Define ordering
                    render.ordering.set(parameters);
                    //Update ordering
                    render.ordering.update(parameters);
                },
                ordering    : {
                    defaults: function (parameters) {
                        var order = [],
                            index = 0;
                        Array.prototype.forEach.call(
                            parameters.content.childNodes,
                            function (childNode) {
                                if (childNode.nodeName.toLowerCase() !== '#text') {
                                    order.push([index++, 0]);
                                }
                            }
                        );
                        return order;
                    },
                    get     : function (parameters) {
                        function parseValue(value) {
                            if (value.indexOf(',') === -1) {
                                try {
                                    if (type === 2) {
                                        return false;
                                    }
                                    type    = 1;
                                    value   = parseInt(value, 10);
                                    if (value < 0) { return false; }
                                    value   = [value, 0];
                                } catch (e) {
                                    return false;
                                }
                            } else {
                                if (type === 1) {
                                    return false;
                                }
                                type    = 2;
                                value   = value.split(',');
                                if (value.length === 2) {
                                    try {
                                        value[0] = parseInt(value[0], 10);
                                        value[1] = parseInt(value[1], 10);
                                        if (value[0] < 0 || value[1] < 0) { return false; }
                                    } catch (e) {
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            }
                            return value;
                        };
                        var order   = [],
                            type    = -1;
                        try{
                            Array.prototype.forEach.call(
                                parameters.content.childNodes,
                                function (childNode) {
                                    var order_defined   = null,
                                        value           = null;
                                    if (childNode.nodeName.toLowerCase() !== '#text') {
                                        order_defined = childNode.getAttribute(settings.attrs.ITEM_ORDER);
                                        if (order_defined === null && order_defined === '') {
                                            throw 'finish';
                                        } else {
                                            value = parseValue(order_defined);
                                            if (value !== false) {
                                                order.push(value);
                                            } else {
                                                throw 'finish';
                                            }
                                        }
                                    }
                                }
                            );
                        } catch (e) {
                            parameters.ordering = render.ordering.defaults(parameters);
                            return false;
                        }
                        parameters.ordering = order;
                        return true;
                    },
                    set     : function (parameters) {
                        var ordering = {
                                rows    : 0,
                                columns : 0,
                                current : {
                                    row     : 0,
                                    column  : 0,
                                }
                            };
                        for (var id in parameters.areas) {
                            //Set column
                            parameters.areas[id].column = parameters.ordering[parameters.areas[id].index][0];
                            ordering.columns            = ordering.columns < parameters.areas[id].column ? parameters.areas[id].column : ordering.columns;
                            //Set row
                            parameters.areas[id].row    = parameters.ordering[parameters.areas[id].index][1];
                            ordering.rows               = ordering.rows < parameters.areas[id].row ? parameters.areas[id].row : ordering.rows;
                        }
                        ordering.rows       += 1;
                        ordering.columns    += 1;
                        parameters.ordering = ordering;
                    },
                    update  : function (parameters) {
                        var size = {
                                width   : 100 / parameters.ordering.columns,
                                height  : 100 / parameters.ordering.rows,
                            };
                        parameters.container.style.width    = 100 * parameters.ordering.columns + '%';
                        parameters.container.style.height   = 100 * parameters.ordering.rows    + '%';
                        for (var id in parameters.areas) {
                            //Set column
                            parameters.areas[id].wrapper.style.left     = (size.width * parameters.areas[id].column) + '%';
                            parameters.areas[id].wrapper.style.width    = (size.width) + '%';
                            //Set row
                            parameters.areas[id].wrapper.style.top      = (size.height * parameters.areas[id].row) + '%';
                            parameters.areas[id].wrapper.style.height   = (size.height) + '%';
                        }
                    }
                }
            };
            movement = {
                init    : (function () {
                    var inited = false;
                    return function () {
                        var DOMEvents = events.DOMEvents();
                        if (inited === false) {
                            DOMEvents.add(window, 'mousedown', function (event) { movement.events.onMouseDown(event); });
                            inited = true;
                        }
                    }
                }()),
                events  : {
                    preventAnimationError:  {
                        is      : function (parameters) {
                            var styles = null;
                            if (!parameters.possibleAnimationError) {
                                parameters.possibleAnimationError = true;
                                movement.events.preventAnimationError.set(parameters);
                                return false;
                            } else {
                                styles = html.styles();
                                styles.removeClass(parameters.container, settings.classes.ANIMATION_MOVEMENT);
                                movement.events.preventAnimationError.reset(parameters);
                                return true;
                            }
                        },
                        reset   : function (parameters) {
                            delete parameters.possibleAnimationError;
                        },
                        set     : function (parameters) {
                            parameters.possibleAnimationError = true;
                        }
                    },
                    onMouseDown : function (event) {
                        var find        = html.find(),
                            size        = html.size(),
                            target      = null,
                            id          = null,
                            DOMEvents   = null,
                            parameters  = null;
                        if (event.flex.target) {
                            target = find.parentByAttr(event.flex.target, { name: settings.attrs.GROUP_ID, value: null });
                            if (target !== null) {
                                id = target.getAttribute(settings.attrs.GROUP_ID);
                                if (id !== '' && id !== null) {
                                    parameters = initializer.getParameters(id);
                                    if (parameters !== null) {
                                        if (!parameters.movement) {
                                            size                = size.node(parameters.container);
                                            size                = {
                                                _width  : size.width,
                                                _height : size.height,
                                                width   : size.width / parameters.ordering.columns,
                                                height  : size.height / parameters.ordering.rows,
                                            };
                                            parameters.movement = {
                                                _x          : event.flex.clientX,
                                                _y          : event.flex.clientY,
                                                x           : event.flex.clientX,
                                                y           : event.flex.clientY,
                                                left        : -parameters.ordering.current.column   * size.width,
                                                top         : -parameters.ordering.current.row      * size.height,
                                                _left       : -parameters.ordering.current.column   * size.width,
                                                _top        : -parameters.ordering.current.row      * size.height,
                                                size        : size,
                                                direction   : false
                                            };
                                            DOMEvents = events.DOMEvents();
                                            DOMEvents.add(window, 'mousemove',  function (event) { movement.events.onMouseMove(event, parameters); }, id);
                                            DOMEvents.add(window, 'mouseup',    function (event) { movement.events.onMouseUp(event, parameters); }, id);
                                            movement.events.preventAnimationError.reset(parameters);
                                        } else {
                                            if (movement.events.preventAnimationError.is(parameters) !== false) {
                                                parameters.movement = null;
                                                delete parameters.movement;
                                                movement.events.onMouseDown(event);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    onMouseMove : function (event, parameters) {
                        var offsets = {
                                x: Math.abs(parameters.movement.x - event.flex.clientX),
                                y: Math.abs(parameters.movement.y - event.flex.clientY),
                            };
                        if (parameters.movement.direction === false && (offsets.x > parameters.sensitivity || offsets.y > parameters.sensitivity)) {
                            if (offsets.x > offsets.y) {
                                if (parameters.ordering.columns > 1) {
                                    parameters.movement.direction = 'horizontal';
                                } else {
                                    if (parameters.ordering.rows > 1) {
                                        parameters.movement.direction = 'vertical';
                                    } else {
                                        return null;
                                    }
                                }
                            } else if (offsets.x < offsets.y) {
                                if (parameters.ordering.rows > 1) {
                                    parameters.movement.direction = 'vertical';
                                } else {
                                    if (parameters.ordering.columns > 1) {
                                        parameters.movement.direction = 'horizontal';
                                    } else {
                                        return null;
                                    }
                                }
                            } else {
                                return null;
                            }
                        }
                        if (parameters.movement.direction === 'horizontal') {
                            if (Math.abs(parameters.movement._x - event.flex.clientX) < parameters.movement.size.width) {
                                if (parameters.movement.left - (parameters.movement.x - event.flex.clientX) <= 0) {
                                    if (Math.abs(parameters.movement.left - (parameters.movement.x - event.flex.clientX)) < (parameters.movement.size._width - parameters.movement.size.width)) {
                                        parameters.movement.left    = parameters.movement.left - (parameters.movement.x - event.flex.clientX);
                                    } else {
                                        parameters.movement.left    = -(parameters.movement.size._width - parameters.movement.size.width);
                                        parameters.movement._x      = event.flex.clientX;
                                        movement.borders.show('right', parameters);
                                    }
                                } else {
                                    parameters.movement.left    = 0;
                                    parameters.movement._x      = event.flex.clientX;
                                    movement.borders.show('left', parameters);
                                }
                            } else {
                                parameters.movement.left        = parameters.movement._left + (parameters.movement._x > event.flex.clientX ? -1 : 1) * parameters.movement.size.width;
                            }
                            parameters.container.style.left     = parameters.movement.left + 'px';
                            parameters.movement.x               = event.flex.clientX;
                        } else if (parameters.movement.direction === 'vertical') {
                            if (Math.abs(parameters.movement._y - event.flex.clientY) < parameters.movement.size.height) {
                                if (parameters.movement.top - (parameters.movement.y - event.flex.clientY) <= 0) {
                                    if (Math.abs(parameters.movement.top - (parameters.movement.y - event.flex.clientY)) < (parameters.movement.size._height - parameters.movement.size.height)) {
                                        parameters.movement.top = parameters.movement.top - (parameters.movement.y - event.flex.clientY);
                                    } else {
                                        parameters.movement.top = -(parameters.movement.size._height - parameters.movement.size.height);
                                        parameters.movement._y  = event.flex.clientY;
                                        movement.borders.show('bottom', parameters);
                                    }
                                } else {
                                    parameters.movement.top     = 0;
                                    parameters.movement._y      = event.flex.clientY;
                                    movement.borders.show('top', parameters);
                                }
                            } else {
                                parameters.movement.top         = parameters.movement._top + (parameters.movement._y > event.flex.clientY ? -1 : 1) * parameters.movement.size.height;
                            }
                            parameters.container.style.top      = parameters.movement.top + 'px';
                            parameters.movement.y               = event.flex.clientY;
                        }
                    },
                    onMouseUp   : function (event, parameters) {
                        function applyAnimation(parameters) {
                            var styles = html.styles();
                            styles.addClass(parameters.container, settings.classes.ANIMATION_MOVEMENT);
                            animationEvents.transition.attach.end(
                                parameters.container,
                                function () {
                                    styles.removeClass(parameters.container, settings.classes.ANIMATION_MOVEMENT);
                                    parameters.movement = null;
                                    delete parameters.movement;
                                },
                                true
                            );
                        };
                        var DOMEvents = events.DOMEvents();
                        DOMEvents.remove(window, 'mousemove',   null, parameters.id);
                        DOMEvents.remove(window, 'mouseup',     null, parameters.id);
                        if (parameters.movement.direction === 'horizontal') {
                            if (Math.abs(parameters.movement._left - parameters.movement.left) > parameters.trigger * parameters.movement.size.width) {
                                if (parameters.movement._left > parameters.movement.left) {
                                    parameters.ordering.current.column  += 1;
                                } else {
                                    parameters.ordering.current.column  -= 1;
                                }
                            }
                            if (parameters.movement._left !== parameters.movement.left && Math.abs(parameters.movement._left - parameters.movement.left) !== parameters.movement.size.width) {
                                applyAnimation(parameters);
                            } else {
                                parameters.movement = null;
                                delete parameters.movement;
                            }
                            parameters.container.style.left = -(parameters.ordering.current.column) * 100 + '%';
                        } else if (parameters.movement.direction === 'vertical') {
                            if (Math.abs(parameters.movement._top - parameters.movement.top) > parameters.trigger * parameters.movement.size.height) {
                                if (parameters.movement._top > parameters.movement.top) {
                                    parameters.ordering.current.row     += 1;
                                } else {
                                    parameters.ordering.current.row     -= 1;
                                }
                            }
                            if (parameters.movement._top !== parameters.movement.top && Math.abs(parameters.movement._top - parameters.movement.top) !== parameters.movement.size.height) {
                                applyAnimation(parameters);
                            } else {
                                parameters.movement = null;
                                delete parameters.movement;
                            }
                            parameters.container.style.top = -(parameters.ordering.current.row) * 100 + '%';
                        }
                    }
                },
                borders: {
                    show: function (type, parameters) {
                        if (parameters.borders[type]) {
                            if (!parameters.borders[type].playing) {
                                parameters.borders[type].playing = true;
                                animation.apply({
                                    element     : parameters.borders[type],
                                    keyframes   : settings.animations[type].keyframes,
                                    animation   : settings.animations[type].animation,
                                    onFinish    : function () {
                                        delete parameters.borders[type].playing;
                                    },
                                });
                            }
                        }
                    }
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
            name            : 'ui.areascroller',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html', 'flex.css.events', 'flex.css.animation'],
            resources       : [
                { url: 'KERNEL::/css/flex.ui.areascroller.css' }
            ],
        });
    }
}());