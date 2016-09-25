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
///         Module control items box behavior 
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
                render          = null,
                tabs            = null,
                coreEvents      = null,
                privates        = null,
                settings        = null;
            settings = {
                /*
                Template of itemsbox area
                <div data-flex-ui-itemsbox="Container">
                    <div data-flex-ui-itemsbox="Content">
                    </div>
                    <div data-flex-ui-itemsbox="Tabs">
                    </div>
                </div>
                
                Template of itemsbox item
                <div data-flex-ui-itemsbox="Item">
                </div>

                Template of itemsbox button
                <div data-flex-ui-itemsbox="Button">
                </div>
                */
                layouts: {
                    BOX     : {
                        container   : { node: 'DIV', attrs: [{ name: 'data-flex-ui-itemsbox', value: 'Container' }, { name: 'data-flex-ui-itemsbox-id', value: 'id' }] },
                        content     : { node: 'DIV', attrs: [{ name: 'data-flex-ui-itemsbox', value: 'Content'  }] },
                        tabs        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-itemsbox', value: 'Tabs'     }] },
                        settingup   : {
                            parent: 'container',
                            childs: ['content', 'tabs']
                        }
                    },
                    ITEM    : { node: 'DIV', attrs: [{ name: 'data-flex-ui-itemsbox', value: 'Item' }] },
                    BUTTON  : { node: 'A', attrs: [{ name: 'data-flex-ui-itemsbox', value: 'Button' }] },
                },
                storage : {
                    ITEM_SIZE   : 'flex.ui.itemsbox.itemsize',
                    tabs        : {
                        CURRENT         : 'flex.ui.itemsbox.currenttab',
                        ITEMS_COUNT     : 'flex.ui.itemsbox.counttabs.items',
                        COUNT_PREVIOUS  : 'flex.ui.itemsbox.counttabs.old',
                        SIZES_CACHE     : 'flex.ui.itemsbox.tabs.sizecache',
                    },
                },
                classes : {
                    SELECTED_TAB : 'active'
                },
                attrs   : {
                    HIDDEN_BUTTON_TAB : 'data-flex-ui-itemsbox-button-state'
                }
            };
            initializer = {
                validate: {
                    parameters: function (parameters) {
                        /**/
                        return _object(parameters).validate([   { name: 'parent',   type: ['node', 'string'],   value: null, handle: html.helpers.validateNode },
                                                                { name: 'content',  type: ['node', 'string'],   value: null, handle: html.helpers.validateNode },
                                                                { name: 'events',   type: 'object',             value: {}               },
                                                                { name: 'id',       type: 'string',             value: flex.unique()    }]);
                    },
                    events      : function (events) {
                        return flex.oop.objects.validate(events, [{ name: 'resize', type: 'function', value: null }]);
                    }
                },
                init    : function (parameters) {
                    var itemsbox    = null,
                        builder     = html.builder();
                    if (initializer.validate.parameters(parameters) !== null) {
                        if (parameters.parent !== null || parameters.content !== null) {
                            initializer.validate.events(parameters.events);
                            settings.layouts.BOX.container.attrs[1].value = parameters.id;
                            itemsbox = builder.build(settings.layouts.BOX);
                            if (itemsbox !== null) {
                                if (parameters.content !== null) {
                                    render.migration(parameters, itemsbox);
                                    //Mount
                                    parameters.content.parentNode.insertBefore(itemsbox.container, parameters.content);
                                    parameters.content.parentNode.removeChild(parameters.content);
                                    //Prepare items
                                    tabs.breaks.add(parameters, itemsbox);
                                    tabs.optimization.build(parameters, itemsbox);
                                    //Reordering
                                    tabs.update.layout(parameters, itemsbox);
                                    //Attach events
                                    coreEvents.attach(parameters, itemsbox);
                                }
                            }
                        }
                    }
                }
            };
            render      = {
                migration   : function (parameters, nodes) {
                    var builder = html.builder(),
                        wrapper = builder.build(settings.layouts.ITEM);
                    Array.prototype.forEach.call(
                        parameters.content.childNodes,
                        function (childNode) {
                            var item = null;
                            if (childNode.nodeName.toLowerCase() !== '#text'){
                                item = wrapper.cloneNode(true);
                                item.appendChild(childNode);
                                nodes.content.appendChild(item);
                            }
                        }
                    );
                },
                size        : {
                    get : function (item) {
                        var storage = flex.overhead.objecty.get(item, settings.storage.ITEM_SIZE, false),
                            Size    = null;
                        if (storage === null) {
                            Size    = html.size();
                            storage = Size.node(item);
                            flex.overhead.objecty.set(item, settings.storage.ITEM_SIZE, storage, true);
                        }
                        return storage;
                    }
                }
            };
            tabs        = {
                getCurrentTab   : function (nodes, check) {
                    var storage = flex.overhead.objecty.get(nodes.container, settings.storage.tabs.CURRENT, false),
                        check   = typeof check === 'boolean' ? check : false,
                        count   = null;
                    if (storage === null) {
                        storage = 0;
                        flex.overhead.objecty.set(nodes.container, settings.storage.tabs.CURRENT, storage, true);
                    }
                    if (check !== false) {
                        count = tabs.getTabsCount(nodes);
                        if (storage > count - 1) {
                            storage = count - 1;
                            flex.overhead.objecty.set(nodes.container, settings.storage.tabs.CURRENT, storage, true);
                        }
                    }
                    return storage;
                },
                setCurrentTab   : function (nodes, tab) {
                    return flex.overhead.objecty.set(nodes.container, settings.storage.tabs.CURRENT, tab, true);
                },
                getTabsCount    : function (nodes) {
                    var items = flex.overhead.objecty.get(nodes.container, settings.storage.tabs.ITEMS_COUNT, false);
                    if (items !== null) {
                        return Math.ceil((nodes.content.childNodes.length / 2) / items);
                    }
                    return 1;
                },
                buttons         : {
                    update      : function (parameters, nodes) {
                        function build(parameters, nodes, tabs_count) {
                            var builder     = html.builder(),
                                template    = builder.build(settings.layouts.BUTTON),
                                button      = null,
                                buttons     = [],
                                DOMEvents   = events.DOMEvents();
                            nodes.tabs.innerHTML = '';
                            for (var index = 0; index < tabs_count; index += 1) {
                                button              = template.cloneNode(true);
                                button.innerHTML    = index + 1;
                                nodes.tabs.appendChild  (button);
                                buttons.push            (button);
                            }
                            buttons.forEach(function (button, index) {
                                DOMEvents.add(
                                    button,
                                    'click',
                                    function () {
                                        tabs.setCurrentTab  (nodes, index);
                                        tabs.update.layout  (parameters, nodes);
                                        setActive           (parameters, nodes);
                                        tabs.buttons.regroup(parameters, nodes, buttons);
                                    }
                                );
                            });
                            setActive           (parameters, nodes);
                        };
                        function setActive(parameters, nodes) {
                            var tabs_count  = tabs.getTabsCount(nodes),
                                selected    = tabs.getCurrentTab(nodes) > tabs_count - 1 ? tabs_count - 1 : tabs.getCurrentTab(nodes),
                                select      = html.select.bySelector(),
                                button      = select.first('*[' + settings.layouts.BOX.container.attrs[1].name + '="' + parameters.id + '"] *[' + settings.layouts.BUTTON.attrs[0].name + '="' + settings.layouts.BUTTON.attrs[0].value + '"]:nth-child(' + (selected + 1) + ')');
                            if (button !== null) {
                                Array.prototype.forEach.call(
                                    nodes.tabs.childNodes,
                                    function (node) {
                                        node.className = '';
                                    }
                                );
                                button.className = settings.classes.SELECTED_TAB;
                            }
                        };
                        var tabs_count      = tabs.getTabsCount(nodes),
                            _tabs_count     = flex.overhead.objecty.get(nodes.tabs, settings.storage.tabs.COUNT_PREVIOUS, false),
                            in_tab_count    = flex.overhead.objecty.get(nodes.container, settings.storage.tabs.ITEMS_COUNT, false);
                        if (in_tab_count > 0) {
                            if (tabs_count > 1) {
                                tabs.buttons.show(parameters, nodes);
                                if (_tabs_count !== tabs_count) {
                                    build(parameters, nodes, tabs_count);
                                    flex.overhead.objecty.set(nodes.tabs, settings.storage.tabs.COUNT_PREVIOUS, tabs_count, true);
                                }
                            } else {
                                tabs.buttons.hide(parameters, nodes);
                                tabs.setCurrentTab(nodes, 0);
                                flex.overhead.objecty.set(nodes.tabs, settings.storage.tabs.COUNT_PREVIOUS, 1, true);
                            }
                            tabs.buttons.softRegroup(parameters, nodes);
                        } else {
                            tabs.buttons.hide(parameters, nodes);
                            tabs.setCurrentTab(nodes, 0);
                            flex.overhead.objecty.set(nodes.tabs, settings.storage.tabs.COUNT_PREVIOUS, 1, true);
                        }
                    },
                    show        : function (parameters, nodes) {
                        nodes.tabs.style.height     = '2rem';
                        nodes.tabs.style.bottom     = '0rem';
                        nodes.content.style.bottom  = '2rem';
                    },
                    hide        : function (parameters, nodes) {
                        nodes.tabs.style.height     = '0rem';
                        nodes.tabs.style.bottom     = '0rem';
                        nodes.content.style.bottom  = '0rem';
                    },
                    regroup     : function (parameters, nodes) {
                        function getTabButtonSize(button, index, cache) {
                            if (!cache[index]) {
                                cache[index] = Size.nodeWithMargin(button).width;
                            }
                            return cache[index];
                        };
                        function makeReordering(nodes, cache, exclusions) {
                            try {
                                Array.prototype.forEach.call(
                                    nodes.tabs.childNodes,
                                    function (button, index) {
                                        if (size < scroll) {
                                            if (exclusions.indexOf(index) === -1) {
                                                button.setAttribute(settings.attrs.HIDDEN_BUTTON_TAB, 'true');
                                                scroll -= getTabButtonSize(button, index, cache);
                                            }
                                        } else {
                                            throw 'ready';
                                        }
                                    }
                                );
                            } catch (e) { }
                        };
                        var Size        = html.size(),
                            size        = Size.node(nodes.tabs).width,
                            scroll      = 0,
                            count       = nodes.tabs.childNodes.length,
                            cache       = flex.overhead.objecty.get(nodes.tabs, settings.storage.tabs.SIZES_CACHE, false, {}),
                            selected    = tabs.getCurrentTab(nodes, false);
                        Array.prototype.forEach.call(
                            nodes.tabs.childNodes,
                            function (button, index) {
                                if (button.hasAttribute(settings.attrs.HIDDEN_BUTTON_TAB) !== false) {
                                    button.removeAttribute(settings.attrs.HIDDEN_BUTTON_TAB);
                                }
                                scroll += getTabButtonSize(button, index, cache);
                            }
                        );
                        if (size < scroll) {
                            makeReordering(nodes, cache, [0, count - 1, selected, selected - 1, selected + 1]);
                            if (size < scroll) {
                                makeReordering(nodes, cache, [selected, selected - 1, selected + 1]);
                            }
                        }
                    },
                    softRegroup : function (parameters, nodes) {
                        var Size        = html.size(),
                            size        = Size.node(nodes.tabs).width,
                            scroll      = 0,
                            cache       = flex.overhead.objecty.get(nodes.tabs, settings.storage.tabs.SIZES_CACHE, false, {}),
                            selected    = tabs.getCurrentTab(nodes, false),
                            has_hidden  = false;
                        Array.prototype.forEach.call(
                            nodes.tabs.childNodes,
                            function (button, index) {
                                if (button.hasAttribute(settings.attrs.HIDDEN_BUTTON_TAB) === false) {
                                    if (!cache[index]) {
                                        cache[index] = Size.nodeWithMargin(button).width;
                                    }
                                    scroll += cache[index];
                                } else {
                                    has_hidden = true;
                                }
                            }
                        );
                        if (size < scroll) {
                            tabs.buttons.regroup(parameters, nodes, nodes.tabs.childNodes);
                        } else {
                            if (has_hidden !== false) {
                                tabs.buttons.regroup(parameters, nodes, nodes.tabs.childNodes);
                            }
                        }
                    }
                },
                breaks          : {
                    add     : function (parameters, nodes) {
                        var wrapper = document.createElement('DIV');
                        for (var index = nodes.content.childNodes.length - 1; index >= 0; index -= 1) {
                            wrapper.appendChild(nodes.content.childNodes[0]);
                        }
                        for (var index = wrapper.childNodes.length - 1; index >= 0; index -= 1) {
                            nodes.content.appendChild(wrapper.childNodes[0]);
                            nodes.content.appendChild(document.createElement('BR'));
                        }
                    }
                },
                update          : {
                    order   : function (parameters, nodes) {
                        var Size            = html.size(),
                            common          = {
                                height  : 0,
                                width   : 0,
                                row     : 0,
                                size    : Size.node(nodes.content)
                            },
                            tab             = {
                                selected    : tabs.getCurrentTab(nodes, true),
                                current     : 0,
                                itemsInTab  : 0,
                                count       : 1
                            },
                            cache           = {
                                items       : {},
                                brs         : {}
                            };
                        if (parameters.items) {
                            tabs.reset.visibility(parameters);
                            cache.items[tab.current]    = [];
                            cache.brs[tab.current]      = [];
                            parameters.items.forEach(function (element, index) {
                                var size = render.size.get(element.item);
                                common.width    += size.width;
                                common.row      = (common.row < size.height ? size.height : common.row);
                                tab.itemsInTab  += (tab.current === 0 ? 1 : 0);
                                if (common.width > common.size.width) {
                                    common.width    = size.width;
                                    common.height   += common.row;
                                    common.row      = size.height;
                                    cache.brs[tab.current].push(parameters.items[index - 1].br);
                                    if (tab.current === tab.selected) {
                                        if (parameters.items[index - 1]) {
                                            parameters.items[index - 1].br.style.display = '';
                                        }
                                    }
                                }
                                cache.items[tab.current].push(element.item);
                                if (common.height + common.row > common.size.height) {
                                    cache.items[tab.current].pop();
                                    tab.itemsInTab              += (tab.current === 0 ? -1 : 0);
                                    tab.count                   += 1;
                                    tab.current                 += 1;
                                    common.height               = 0;
                                    cache.items[tab.current]    = [];
                                    cache.brs[tab.current]      = [];
                                    cache.items[tab.current].push(element.item);
                                }
                                if (tab.current !== tab.selected) {
                                    element.item.style.display  = 'none';
                                }
                            });
                            if (tab.selected >= tab.count) {
                                tab.selected = tab.count - 1;
                                cache.items[tab.selected].forEach(function (item) {
                                    item.style.display = '';
                                });
                                cache.brs[tab.selected].forEach(function (br) {
                                    br.style.display = '';
                                });
                            }
                            flex.overhead.objecty.set(nodes.container, settings.storage.tabs.ITEMS_COUNT, tab.itemsInTab, true);
                            tabs.buttons.update(parameters, nodes);
                        }
                    },
                    margin  : function (parameters, nodes) {
                        var Styles          = html.styles(),
                            Size            = html.size(),
                            sizes           = {
                                container   : Size.node(nodes.content),
                                item        : (parameters.items.length > 0 ? render.size.get(parameters.items[0].item) : null)
                            },
                            margin          = 0,
                            columns         = 0;
                        if (sizes.item !== null){
                            columns = Math.floor(sizes.container.width / sizes.item.width);
                            margin  = Math.floor((sizes.container.width - sizes.item.width * columns) / (columns + 1));
                            if (!parameters.css_margin) {
                                parameters.css_margin = Styles.setRule('*[' + settings.layouts.BOX.container.attrs[1].name + '="' + parameters.id + '"] *[' + settings.layouts.ITEM.attrs[0].name + '="' + settings.layouts.ITEM.attrs[0].value + '"]', 'margin-left: ' + margin + 'px;');
                            } else {
                                parameters.css_margin = Styles.updateRule(parameters.css_margin.sheet, parameters.css_margin.rule, 'margin-left: ' + margin + 'px;');
                            }
                        }
                    },
                    layout  : function (parameters, nodes) {
                        tabs.reset.margin   (parameters);
                        tabs.update.order   (parameters, nodes);
                        tabs.update.margin  (parameters, nodes);
                    }
                },
                reset           : {
                    margin      : function (parameters) {
                        var Styles = html.styles();
                        if (!parameters.css_margin) {
                            parameters.css_margin = Styles.setRule('*[' + settings.layouts.BOX.container.attrs[1].name + '="' + parameters.id + '"] *[' + settings.layouts.ITEM.attrs[0].name + '="' + settings.layouts.ITEM.attrs[0].value + '"]', 'margin-left: 0px;');
                        } else {
                            parameters.css_margin = Styles.updateRule(parameters.css_margin.sheet, parameters.css_margin.rule, 'margin-left: 0px;');
                        }
                    },
                    visibility  : function (parameters) {
                        parameters.items.forEach(function (element) {
                            element.item.   style.display = '';
                            element.br.     style.display = 'none';
                        });
                    }
                },
                optimization    : {
                    build       : function (parameters, nodes) {
                        var item = {};
                        if (!parameters.items) {
                            parameters.items = [];
                            Array.prototype.forEach.call(
                                nodes.content.childNodes,
                                function (node) {
                                    if (node.nodeName.toLowerCase() === 'br') {
                                        item.br     = node;
                                    } else {
                                        item.item   = node;
                                    }
                                    if (item.br && item.item) {
                                        parameters.items.push(item);
                                        item = {};
                                    }
                                }
                            );
                        }
                    }
                }
            };
            coreEvents = {
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
            (function () {
                flex.registry.events.ui             === void 0 && (flex.registry.events.ui = {});
                flex.registry.events.ui.itemsbox    === void 0 && (flex.registry.events.ui.itemsbox = {
                    GROUP   : 'flex.ui.itemsbox',
                    REFRESH : 'refresh',
                });
            }());
            privates    = {
                init    : initializer.init,
            };
            return {
                init    : privates.init,
            };
        };
        flex.modules.attach({
            name            : 'ui.itemsbox',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html'],
            resources       : [
                { url: 'KERNEL::/css/flex.ui.itemsbox.css' }
            ],
        });
    }
}());