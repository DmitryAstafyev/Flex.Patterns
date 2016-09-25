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
///         Module control scroll box behavior 
///     </summary>
/// </module>
(function () {
    'use strict';
    if (flex !== void 0) {
        var protofunction       = function () { };
        protofunction.prototype = function () {
            var //Get modules
                html            = flex.libraries.html.create(),
                events          = flex.libraries.events.create(),
                //Variables
                initializer     = null,
                tracks          = null,
                runners         = null,
                buttons         = null,
                scroll          = null,
                sbEvents        = null,
                privates        = null,
                settings        = null;
            settings = {
                /*Template of scroll area
                <div data-flex-ui-scrollbox="Container">
                    <div data-flex-ui-scrollbox="Content">
                    </div>
                    <div data-flex-ui-scrollbox="Tracks.Horizontal">
                        <div data-flex-ui-scrollbox="Tracks.Horizontal.Button.Left">
                        </div>
                        <div data-flex-ui-scrollbox="Tracks.Horizontal.Button.Right">
                        </div>
                        <div data-flex-ui-scrollbox="Tracks.Horizontal.Button.Runner">
                        </div>
                    </div>
                    <div data-flex-ui-scrollbox="Tracks.Vertical">
                        <div data-flex-ui-scrollbox="Tracks.Vertical.Button.Top">
                        </div>
                        <div data-flex-ui-scrollbox="Tracks.Vertical.Button.Bottom">
                        </div>
                        <div data-flex-ui-scrollbox="Tracks.Vertical.Button.Runner">
                        </div>
                    </div>
                </div>
                * */
                layouts     : {
                    BOX     : {
                        container   : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Container'},{name: 'data-flex-ui-scrollbox-id', value: 'id'}] },
                        content     : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Content'  }] },
                        horizontal  : {
                            container   : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Horizontal'                }, {name: 'data-flex-ui-scrollbox-type', value: 'Track'}] },
                            left        : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Horizontal.Button.Left'    }, {name: 'data-flex-ui-scrollbox-type', value: 'Button'}] },
                            right       : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Horizontal.Button.Right'   }, {name: 'data-flex-ui-scrollbox-type', value: 'Button'}] },
                            runner      : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Horizontal.Button.Runner'  }, {name: 'data-flex-ui-scrollbox-type', value: 'Button'}] },
                            settingup   : {
                                parent: 'container',
                                childs: ['left', 'right', 'runner']
                            }
                        },
                        vertical    : {
                            container   : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Vertical'                  }, {name: 'data-flex-ui-scrollbox-type', value: 'Track'}] },
                            top         : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Vertical.Button.Top'       }, {name: 'data-flex-ui-scrollbox-type', value: 'Button'}] },
                            bottom      : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Vertical.Button.Bottom'    }, {name: 'data-flex-ui-scrollbox-type', value: 'Button'}] },
                            runner      : { node: 'DIV', attrs: [{name: 'data-flex-ui-scrollbox', value: 'Tracks.Vertical.Button.Runner'    }, {name: 'data-flex-ui-scrollbox-type', value: 'Button'}] },
                            settingup   : {
                                parent: 'container',
                                childs: ['top', 'bottom', 'runner']
                            }
                        },
                        settingup   : {
                            parent: 'container',
                            childs: ['content', 'horizontal', 'vertical']
                        }
                    },
                },
                storage     : {
                    GROUP               : 'flex.ui.scrollbox',
                    RUNNER_MOVE         : 'runner.move',
                    RUNNER_WINDOW_MOVE  : 'runner.window.move.flag',
                    BUTTONS_SIZES       : 'buttons.sizes',
                    SCROLL_TIMER        : 'scroll.timer'
                },
                timeouts    : {
                    BUTTONS: 50
                },
                parameters  : {
                    BUTTONS_FADE_DISTANCE   : 1.1, //from size of button
                    TRACK_FADE_DURATION     : 3000, //ms,
                    GLOBAL_EVENT_ID         : 'flex-ui-scroll-box-id'
                }
            };
            initializer = {
                validate : {
                    parameters  : function (parameters) {
                        return flex.oop.objects.validate(parameters, [  { name: 'parent',               type: ['node', 'string'],   value: null, handle: html.helpers.validateNode      },
                                                                        { name: 'events',               type: 'object',             value: {}               },
                                                                        { name: 'id',                   type: 'string',             value: flex.unique()    },
                                                                        { name: 'visibility',           type: 'object',             value: { vertical: 'auto',  horizontal: 'auto'      } },
                                                                        { name: 'steps',                type: 'object',             value: { tracks: 150, buttons: 50 } },
                                                                        { name: 'hide_tracks',          type: 'boolean',            value: true }]);
                    },
                    visibility  : function (visibility) {
                        return flex.oop.objects.validate(visibility, [  { name: 'vertical',     type: 'string', values: ['auto', 'visible', 'hidden'] },
                                                                        { name: 'horizontal',   type: 'string', values: ['auto', 'visible', 'hidden'] }]);
                    },
                    steps       : function (visibility) {
                        return flex.oop.objects.validate(visibility, [  { name: 'tracks',   type: 'number', value: 150  },
                                                                        { name: 'buttons',  type: 'number', value: 50   }]);
                    }
                },
                init    : function (parameters) {
                    var scrollbox   = null,
                        builder     = html.builder(),
                        nodes       = null;
                    if (initializer.validate.parameters(parameters) !== null) {
                        initializer.validate.visibility (parameters.visibility  );
                        initializer.validate.steps      (parameters.steps       );
                        settings.layouts.BOX.container.attrs[1].value   = parameters.id;
                        scrollbox                                       = builder.build(settings.layouts.BOX);
                        if (scrollbox !== null) {
                            nodes = {
                                content     : scrollbox.content,
                                container   : scrollbox.container,
                                buttons     : {
                                    top     : scrollbox.vertical.top,
                                    bottom  : scrollbox.vertical.bottom,
                                    left    : scrollbox.horizontal.left,
                                    right   : scrollbox.horizontal.right
                                },
                                tracks      : {
                                    vertical    : scrollbox.vertical.container,
                                    horizontal  : scrollbox.horizontal.container,
                                },
                                runner      : {
                                    vertical    : scrollbox.vertical.runner,
                                    horizontal  : scrollbox.horizontal.runner,
                                }
                            };
                            if (parameters.parent !== null) {
                                //Mount
                                parameters.parent.appendChild(scrollbox.container);
                                //Init tracks
                                tracks.init(parameters, nodes);
                                //Init buttons
                                buttons.init(parameters, nodes);
                                //Init runners
                                runners.init(parameters, nodes);
                                //Attach scrollbox events
                                sbEvents.attach(parameters, nodes);
                            } else {
                                return false;
                            }
                        }
                        return {
                            id      : parameters.id,
                            nodes   : nodes
                        };
                    }
                }
            };
            tracks      = {
                init        : function (parameters, nodes) {
                    //Update sizes 
                    tracks.resize(parameters, nodes);
                    //Update visibility
                    tracks.visibility.both(parameters, nodes);
                    //Hide / show
                    tracks.fade.init(parameters);
                    tracks.fade.both(parameters, nodes);
                    //Attach events
                    tracks.events.mousedown(parameters, nodes);
                    tracks.events.mouseup(parameters, nodes);
                },
                resize      : function (parameters, nodes) {
                    var scroll      = html.scroll(),
                        scroll_size = scroll.scrollBarSize();
                    nodes.content.style.paddingRight    = scroll_size.width     + 'px';
                    nodes.content.style.paddingBottom   = scroll_size.height    + 'px';
                },
                visibility  : {
                    update      : function (parameters, nodes, type) {
                        var size_scroll = (type === "vertical" ? nodes.content.scrollHeight : nodes.content.scrollWidth),
                            size_client = (type === "vertical" ? nodes.content.clientHeight : nodes.content.clientWidth);
                        switch (parameters.visibility[type]) {
                            case 'auto':
                                if (size_scroll > size_client) {
                                    nodes.tracks[type].style.display = '';
                                } else {
                                    nodes.tracks[type].style.display = 'none';
                                }
                                break;
                            case 'visible':
                                nodes.tracks[type].style.display = '';
                                break;
                            case 'hidden':
                                nodes.tracks[type].style.display = 'none';
                                break;
                        }
                        return true;
                    },
                    vertical    : function (parameters, nodes) {
                        return tracks.visibility.update(parameters, nodes, "vertical");
                    },
                    horizontal  : function (parameters, nodes) {
                        return tracks.visibility.update(parameters, nodes, "horizontal");
                    },
                    both        : function (parameters, nodes) {
                        var result_operation = true;
                        result_operation = (tracks.visibility.vertical  (parameters, nodes) === true ? result_operation : false);
                        result_operation = (tracks.visibility.horizontal(parameters, nodes) === true ? result_operation : false);
                        return result_operation;
                    }
                },
                fade: {
                    init        : function (parameters) {
                        parameters.hide_tracks_timer_id = {
                            vertical    : -1,
                            horizontal  : -1
                        };
                    },
                    show        : function (parameters, nodes, type) {
                        if (parameters.hide_tracks !== false) {
                            if (parameters.hide_tracks_timer_id[type] !== -1) {
                                clearTimeout(parameters.hide_tracks_timer_id[type]);
                            }
                            nodes.tracks[type].style.opacity = 1;
                            parameters.hide_tracks_timer_id[type] = setTimeout(
                                function () {
                                    tracks.fade.hide(parameters, nodes, type);
                                },
                                settings.parameters.TRACK_FADE_DURATION
                            );
                        }
                    },
                    hide        : function (parameters, nodes, type) {
                        if (parameters.hide_tracks !== false) {
                            nodes.tracks[type].style.opacity = 0.01;
                            parameters.hide_tracks_timer_id[type] = -1;
                        }
                    },
                    vertical    : function (parameters, nodes) {
                        return tracks.fade.show(parameters, nodes, "vertical");
                    },
                    horizontal  : function (parameters, nodes) {
                        return tracks.fade.show(parameters, nodes, "horizontal");
                    },
                    both        : function (parameters, nodes) {
                        var result_operation = true;
                        result_operation = (tracks.fade.vertical    (parameters, nodes) === true ? result_operation : false);
                        result_operation = (tracks.fade.horizontal  (parameters, nodes) === true ? result_operation : false);
                        return result_operation;
                    }
                },
                events: {
                    mousedown: function (parameters, nodes) {
                        var DOMEvents = events.DOMEvents();
                        DOMEvents.add(nodes.tracks.vertical,    'mousedown', function (event) { tracks.actions.onMouseDown(event, parameters, nodes, 'vertical'     ); });
                        DOMEvents.add(nodes.tracks.horizontal,  'mousedown', function (event) { tracks.actions.onMouseDown(event, parameters, nodes, 'horizontal'   ); });
                    },
                    mouseup: function (parameters, nodes) {
                        var DOMEvents = events.DOMEvents();
                        DOMEvents.add(nodes.tracks.vertical,    'mouseup', function () { tracks.actions.onMouseUp(parameters, nodes); });
                        DOMEvents.add(nodes.tracks.horizontal,  'mouseup', function () { tracks.actions.onMouseUp(parameters, nodes); });
                    },
                },
                actions: {
                    onMouseDown : function (event, parameters, nodes, direction) {
                        function getDirection(event, nodes, _direction) {
                            var direction = null;
                            if (_direction === 'vertical') {
                                if (event.flex.offsetY < nodes.runner.vertical.offsetTop) {
                                    direction = 'up';
                                } else {
                                    direction = 'down';
                                }
                            } else {
                                if (event.flex.offsetX < nodes.runner.vertical.offsetLeft) {
                                    direction = 'left';
                                } else {
                                    direction = 'right';
                                }
                            }
                            return direction;
                        };
                        scroll.offset(nodes, parameters.steps.tracks, getDirection(event, nodes, direction), true);
                        return event.flex.stop();
                    },
                    onMouseUp   : function (parameters, nodes) {
                        scroll.timer.reset(nodes);
                    },
                }
            };
            runners = {
                init        : function (parameters, nodes) {
                    //Update sizes 
                    runners.size.both(parameters, nodes);
                    //Attach events
                    runners.events.scroll   (parameters, nodes);
                    runners.events.move     (parameters, nodes);
                    runners.events.window_move();
                },
                events      : {
                    scroll      : function (parameters, nodes) {
                        flex.events.DOM.add(
                            nodes.content,
                            'scroll',
                            function (event) {
                                runners.actions.onScroll(event, parameters, nodes);
                            }
                        );
                    },
                    move        : function (parameters, nodes) {
                        var DOMEvents = events.DOMEvents();
                        DOMEvents.add(
                            nodes.runner.horizontal,
                            'mousedown',
                            function (event) {
                                runners.actions.onMouseDown(event, parameters, nodes, 'horizontal');
                            },
                            parameters.id
                        );
                        DOMEvents.add(
                            nodes.runner.vertical,
                            'mousedown',
                            function (event) {
                                runners.actions.onMouseDown(event, parameters, nodes, 'vertical');
                            },
                            parameters.id
                        );
                    },
                    window_move : function () {
                        var isAttached  = flex.overhead.globaly.get(settings.storage.GROUP, settings.storage.RUNNER_WINDOW_MOVE),
                            DOMEvents   = events.DOMEvents();
                        if (isAttached !== true) {
                            flex.overhead.globaly.set(settings.storage.GROUP, settings.storage.RUNNER_WINDOW_MOVE, true);
                            DOMEvents.add(
                                window,
                                'mousemove',
                                function (event) {
                                    runners.actions.onMouseMove(DOMEvents.unify(event));
                                },
                                settings.parameters.GLOBAL_EVENT_ID
                            );
                            DOMEvents.add(
                                window,
                                'mouseup',
                                function (event) {
                                    runners.actions.onMouseUp(DOMEvents.unify(event));
                                },
                                settings.parameters.GLOBAL_EVENT_ID
                            );
                        }
                    }
                },
                actions     : {
                    onScroll    : function (event, parameters, nodes) {
                        runners.position.both(parameters, nodes);
                        tracks.fade.both(parameters, nodes);
                    },
                    onMouseDown : function (event, parameters, nodes, type) {
                        var possition       = html.position(),
                            scroll          = html.scroll(),
                            sizer           = html.size(),
                            pos             = possition.byPage(nodes.runner[type]),
                            scrl            = scroll.get(nodes.runner[type].parentNode),
                            size_container  = sizer.node(nodes.container),
                            size_runner     = sizer.node(nodes.runner[type]);
                        flex.overhead.globaly.set(
                            settings.storage.GROUP,
                            settings.storage.RUNNER_MOVE,
                            {
                                oldX        : event.flex.pageX,
                                oldY        : event.flex.pageY,
                                posX        : pos.left + scrl.left(),
                                posY        : pos.top + scrl.top(),
                                container   : {
                                    width   : size_container.width,
                                    height  : size_container.height,
                                },
                                runner      : {
                                    width   : size_runner.width,
                                    height  : size_runner.height,
                                },
                                rates       : runners.size.rates(nodes),
                                parameters  : parameters,
                                nodes       : nodes,
                                type        : type
                            }
                        );
                        return event.flex.stop();
                    },
                    onMouseMove : function (event) {
                        var instance    = flex.overhead.globaly.get(settings.storage.GROUP, settings.storage.RUNNER_MOVE),
                            runner      = null,
                            content     = null,
                            type        = null,
                            value       = null;
                        if (instance !== null) {
                            type                    = instance.type;
                            content                 = instance.nodes.content;
                            runner                  = instance.nodes.runner[type];
                            if (type === 'vertical') {
                                instance.posY       = (instance.posY - (instance.oldY - event.flex.pageY));
                                value               = (runner.offsetTop - (instance.oldY - event.flex.pageY));
                                runner.style.top    = (value < 0 ? 0 : (value > instance.container.height - instance.runner.height ? instance.container.height - instance.runner.height : value)) + 'px';
                                content.scrollTop   -= Math.round((instance.oldY - event.flex.pageY) * (1 / instance.rates.vertical));
                                instance.oldY       = event.flex.pageY;
                                tracks.fade.vertical(instance.parameters, instance.nodes);
                            } else {
                                instance.posX       = (instance.posX - (instance.oldX - event.flex.pageX));
                                value               = (runner.offsetLeft - (instance.oldX - event.flex.pageX));
                                runner.style.left   = (value < 0 ? 0 : (value > instance.container.width - instance.runner.width ? instance.container.width - instance.runner.width : value)) + 'px';
                                content.scrollLeft  -= Math.round((instance.oldX - event.flex.pageX) * (1 / instance.rates.horizontal));
                                instance.oldX       = event.flex.pageX;
                                tracks.fade.horizontal(instance.parameters, instance.nodes);
                            }
                            buttons.visibility[type](instance.nodes.buttons, runner, { runner: instance.runner, container: instance.container });
                        }
                        return event.flex.stop();
                    },
                    onMouseUp   : function (event) {
                        flex.overhead.globaly.del(settings.storage.GROUP, settings.storage.RUNNER_MOVE);
                    }
                },
                position    : {
                    update      : function (parameters, nodes, type) {
                        var runner      = nodes.runner[type],
                            size_scroll = (type === "vertical" ? nodes.content.scrollHeight : nodes.content.scrollWidth),
                            size_client = (type === "vertical" ? nodes.content.clientHeight : nodes.content.clientWidth),
                            position    = (type === "vertical" ? nodes.content.scrollTop    : nodes.content.scrollLeft),
                            property    = (type === "vertical" ? "top" : "left");
                        runner.style[property] = (position * (size_client / size_scroll)) + "px";
                        runners.size.both(parameters, nodes);
                        return true;
                    },
                    vertical    : function (parameters, nodes) {
                        return runners.position.update(parameters, nodes, "vertical");
                    },
                    horizontal  : function (parameters, nodes) {
                        return runners.position.update(parameters, nodes, "horizontal");
                    },
                    both        : function (parameters, nodes) {
                        var result_operation = true;
                        result_operation = (runners.position.vertical(parameters,   nodes) === true ? result_operation : false);
                        result_operation = (runners.position.horizontal(parameters, nodes) === true ? result_operation : false);
                        return result_operation;
                    }
                },
                size        : {
                    update      : function (parameters, nodes, type) {
                        var runner      = nodes.runner[type],
                            size_scroll = (type === "vertical" ? nodes.content.scrollHeight : nodes.content.scrollWidth),
                            size_client = (type === "vertical" ? nodes.content.clientHeight : nodes.content.clientWidth),
                            property    = (type === "vertical" ? "height" : "width"),
                            value       = (size_client * (size_client / size_scroll));
                        runner.style[property] = value + "px";
                        if (type === 'vertical') {
                            buttons.visibility.vertical(nodes.buttons, runner, { runner: { height: value }, container: { height: size_client } })
                        } else {
                            buttons.visibility.horizontal(nodes.buttons, runner, { runner: { width: value }, container: { width: size_client } })
                        }
                        return true;
                    },
                    vertical    : function (parameters, nodes) {
                        return runners.size.update(parameters, nodes, "vertical");
                    },
                    horizontal  : function (parameters, nodes) {
                        return runners.size.update(parameters, nodes, "horizontal");
                    },
                    both        : function (parameters, nodes) {
                        var result_operation = true;
                        result_operation = (runners.size.vertical   (parameters, nodes) === true ? result_operation : false);
                        result_operation = (runners.size.horizontal (parameters, nodes) === true ? result_operation : false);
                        return result_operation;
                    },
                    rates       : function (nodes) {
                        return {
                            vertical    : nodes.content.clientHeight / nodes.content.scrollHeight,
                            horizontal  : nodes.content.clientWidth / nodes.content.scrollWidth
                        };
                    }
                }
            };
            buttons     = {
                init        : function (parameters, nodes) {
                    buttons.sizes.init      (nodes);
                    buttons.events.mousedown(parameters, nodes);
                    buttons.events.mouseup  (parameters, nodes);
                },
                visibility  : {
                    vertical    : function(_buttons, runner, sizes){
                        var height_top      = buttons.sizes.get(_buttons.top),
                            height_bottom   = buttons.sizes.get(_buttons.bottom);
                        if (height_top !== null && height_bottom !== null) {
                            if (runner.offsetTop < (height_top.height * settings.parameters.BUTTONS_FADE_DISTANCE)) {
                                _buttons.top.style.opacity = 0;
                            } else {
                                _buttons.top.style.opacity = 1;
                            }
                            if (runner.offsetTop + sizes.runner.height > sizes.container.height - (height_bottom.height * settings.parameters.BUTTONS_FADE_DISTANCE)) {
                                _buttons.bottom.style.opacity = 0;
                            } else {
                                _buttons.bottom.style.opacity = 1;
                            }
                        }
                    },
                    horizontal  : function (_buttons, runner, sizes) {
                        var height_left     = buttons.sizes.get(_buttons.left),
                            height_right    = buttons.sizes.get(_buttons.right);
                        if (height_left !== null && height_right !== null) {
                            if (runner.offsetLeft < (height_left.width * settings.parameters.BUTTONS_FADE_DISTANCE)) {
                                _buttons.left.style.opacity = 0;
                            } else {
                                _buttons.left.style.opacity = 1;
                            }
                            if (runner.offsetLeft + sizes.runner.width > sizes.container.width - (height_right.width * settings.parameters.BUTTONS_FADE_DISTANCE)) {
                                _buttons.right.style.opacity = 0;
                            } else {
                                _buttons.right.style.opacity = 1;
                            }
                        }
                    },
                },
                sizes: {
                    init    : function (nodes) {
                        var sizer = html.size(),
                            sizes = {
                                top     : sizer.node(nodes.buttons.top      ),
                                bottom  : sizer.node(nodes.buttons.bottom   ),
                                left    : sizer.node(nodes.buttons.left     ),
                                right   : sizer.node(nodes.buttons.right    ),
                            };
                        flex.overhead.objecty.set(nodes.buttons.top,    settings.storage.BUTTONS_SIZES, sizes.top,      true);
                        flex.overhead.objecty.set(nodes.buttons.bottom, settings.storage.BUTTONS_SIZES, sizes.bottom,   true);
                        flex.overhead.objecty.set(nodes.buttons.left,   settings.storage.BUTTONS_SIZES, sizes.left,     true);
                        flex.overhead.objecty.set(nodes.buttons.right,  settings.storage.BUTTONS_SIZES, sizes.right,    true);
                    },
                    get     : function (button) {
                        var value = flex.overhead.objecty.get(button, settings.storage.BUTTONS_SIZES),
                            sizer = null;
                        if (value.height === 0 || value.width === 0) {
                            sizer = html.size();
                            value = sizer.node(button);
                            flex.overhead.objecty.set(button, settings.storage.BUTTONS_SIZES, value, true);
                        }
                        return value;
                    }
                },
                events: {
                    mousedown   : function (parameters, nodes) {
                        var DOMEvents = events.DOMEvents();
                        DOMEvents.add(nodes.buttons.top,      'mousedown', function (event) { buttons.actions.onMouseDown(event, parameters, nodes, 'up'      ); });
                        DOMEvents.add(nodes.buttons.bottom,   'mousedown', function (event) { buttons.actions.onMouseDown(event, parameters, nodes, 'down'    ); });
                        DOMEvents.add(nodes.buttons.left,     'mousedown', function (event) { buttons.actions.onMouseDown(event, parameters, nodes, 'left'    ); });
                        DOMEvents.add(nodes.buttons.right,    'mousedown', function (event) { buttons.actions.onMouseDown(event, parameters, nodes, 'right'   ); });
                    },
                    mouseup     : function (parameters, nodes) {
                        var DOMEvents = events.DOMEvents();
                        DOMEvents.add(nodes.buttons.top,      'mouseup', function () { buttons.actions.onMouseUp(parameters, nodes); });
                        DOMEvents.add(nodes.buttons.bottom,   'mouseup', function () { buttons.actions.onMouseUp(parameters, nodes); });
                        DOMEvents.add(nodes.buttons.left,     'mouseup', function () { buttons.actions.onMouseUp(parameters, nodes); });
                        DOMEvents.add(nodes.buttons.right,    'mouseup', function () { buttons.actions.onMouseUp(parameters, nodes); });
                    },
                },
                actions: {
                    onMouseDown : function (event, parameters, nodes, direction) {
                        scroll.offset(nodes, parameters.steps.buttons, direction, true);
                        return event.flex.stop();
                    },
                    onMouseUp   : function (parameters, nodes) {
                        scroll.timer.reset(nodes);
                    },
                }
            };
            scroll  = {
                timer   : {
                    set     : function (nodes, offset, direction) {
                        var timer_id = flex.overhead.objecty.get(nodes.content, settings.storage.SCROLL_TIMER, false);
                        if (typeof timer_id === 'number') {
                            clearTimeout(timer_id);
                        }
                        timer_id = setTimeout(
                            function () {
                                scroll.offset(nodes, offset, direction, true);
                            },
                            settings.timeouts.BUTTONS
                        );
                        flex.overhead.objecty.set(nodes.content, settings.storage.SCROLL_TIMER, timer_id, true);
                    },
                    reset   : function (nodes) {
                        var timer_id = flex.overhead.objecty.get(nodes.content, settings.storage.SCROLL_TIMER, false);
                        if (typeof timer_id === 'number') {
                            clearTimeout(timer_id);
                            flex.overhead.objecty.del(nodes.content, settings.storage.SCROLL_TIMER);
                        }
                    }
                },
                offset  : function (nodes, offset, direction, loop) {
                    var is_border = false;
                    switch (direction) {
                        case 'up':
                            nodes.content.scrollTop -= offset;
                            is_border = (nodes.content.scrollTop > 0 ? false : true);
                            break;
                        case 'down':
                            nodes.content.scrollTop += offset;
                            is_border = (nodes.content.scrollTop < nodes.content.scrollHeight - nodes.content.clientHeight ? false : true);
                            break;
                        case 'left':
                            nodes.content.scrollLeft -= offset;
                            is_border = (nodes.content.scrollLeft > 0 ? false : true);
                            break;
                        case 'right':
                            nodes.content.scrollLeft += offset;
                            is_border = (nodes.content.scrollLeft < nodes.content.scrollWidth - nodes.content.clientWidth ? false : true);
                            break;
                    }
                    if (loop !== false && is_border === false) {
                        scroll.timer.set(nodes, offset, direction);
                    } else {
                        scroll.timer.reset(nodes);
                    }
                    return is_border;
                }
            };
            sbEvents    = {
                attach              : function (parameters, nodes) {
                    flex.events.core.listen(
                        flex.registry.events.ui.scrollbox.GROUP,
                        flex.registry.events.ui.scrollbox.REFRESH,
                        function (id) {
                            return sbEvents.onRefresh(id, parameters, nodes);
                        },
                        parameters.id,
                        false
                    );
                    flex.events.core.listen(
                        flex.registry.events.ui.window.resize.GROUP,
                        flex.registry.events.ui.window.resize.REFRESH,
                        function (params) {
                            return sbEvents.onRefreshByParent(params.container, parameters, nodes);
                        },
                        parameters.id,
                        false
                    );
                    flex.events.core.listen(
                        flex.registry.events.ui.window.maximize.GROUP,
                        flex.registry.events.ui.window.maximize.CHANGE,
                        function (params) {
                            return sbEvents.onRefreshByParent(params.container, parameters, nodes);
                        },
                        parameters.id,
                        false
                    );
                },
                onRefresh           : function (id, parameters, nodes) {
                    var styles = html.styles();
                    if (id === parameters.id) {
                        setTimeout(
                            function () {
                                //Update visibility
                                tracks.visibility.both(parameters, nodes);
                                //Update runners sizes 
                                runners.size.both(parameters, nodes);
                                //Update runners position 
                                runners.position.both(parameters, nodes);
                            },
                            10
                        );
                        return true;
                    } else {
                        return false;
                    }
                },
                onRefreshByParent   : function (parent, parameters, nodes) {
                    var fromParent  = html.select.fromParent(),
                        node        = fromParent.first(parent, '*[' + settings.layouts.BOX.container.attrs[1].name + '="' + parameters.id + '"]');
                    if (node !== null) {
                        //Update visibility
                        tracks.visibility.both(parameters, nodes);
                        //Update runners sizes 
                        runners.size.both(parameters, nodes);
                        //Update runners position 
                        runners.position.both(parameters, nodes);
                        return true;
                    }
                    return false;
                }
            };
            (function () {
                flex.registry.events.ui             === void 0 && (flex.registry.events.ui = {});
                flex.registry.events.ui.scrollbox   === void 0 && (flex.registry.events.ui.scrollbox = {
                    GROUP   : 'flex.ui.scrollbox',
                    REFRESH : 'refresh',
                });
            }());
            privates = {
                init    : initializer.init,
            };
            return {
                init    : privates.init,
            };
        };
        flex.modules.attach({
            name            : 'ui.scrollbox',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html'],
            resources: [
                { url: 'KERNEL::/css/flex.ui.scrollbox.css' }
            ],
        });
    }
}());