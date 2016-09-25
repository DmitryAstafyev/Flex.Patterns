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
///         Basic events controller.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            var select      = null,
                find        = null,
                privates    = null,
                sizes       = null,
                scroll      = null,
                builder     = null,
                styles      = null,
                position    = null,
                units       = null,
                helpers     = null,
                callers     = null,
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
            select      = {
                bySelector  : function (){
                    var protofunction       = function () { };
                    protofunction.prototype = (function () {
                        var cache       = null,
                            privates    = null;
                        cache = {
                            data    : {},
                            get     : function (selector) {
                                var data = cache.data;
                                return (data[selector] !== void 0 ? data[selector] : null);
                            },
                            add     : function (selector, nodes) {
                                var data = cache.data;
                                data[selector] = nodes;
                                return nodes;
                            },
                            remove  : function (selector) {
                                var data = cache.data;
                                data[selector] = null;
                                delete data[selector];
                            },
                            reset   : function () {
                                cache.data = {};
                            }
                        };
                        function first(selector, document_link) {
                            if (typeof selector === 'string') {
                                return (document_link || document).querySelector(selector);
                            }
                            return null;
                        };
                        function all(selector, document_link) {
                            if (typeof selector === 'string') {
                                return (document_link || document).querySelectorAll(selector);
                            }
                            return null;
                        };
                        function cachedFirst(selector, document_link) {
                            var nodes = null;
                            if (typeof selector === 'string') {
                                nodes = cache.get(selector);
                                if (nodes === null) {
                                    nodes = cache.add((document_link || document).querySelector(selector));
                                }
                                return nodes;
                            }
                            return null;
                        };
                        function cachedAll(selector, document_link) {
                            var nodes = null;
                            if (typeof selector === 'string') {
                                nodes = cache.get(selector);
                                if (nodes === null) {
                                    nodes = cache.add((document_link || document).querySelectorAll(selector));
                                }
                                return nodes;
                            }
                            return null;
                        };
                        privates = {
                            first       : first,
                            all         : all,
                            cachedFirst : cachedFirst,
                            cachedAll   : cachedAll,
                            cacheReset  : cache.reset,
                            cacheRemove : cache.remove
                        };
                        return {
                            first       : privates.first,
                            all         : privates.all,
                            cachedFirst : privates.cachedFirst,
                            cachedAll   : privates.cachedAll,
                            cacheReset  : privates.cacheReset,
                            cacheRemove : privates.cacheRemove
                        };
                    }());
                    return new protofunction();
                },
                fromParent  : function () {
                    var protofunction = function () {
                        this.selector = select.bySelector();
                    };
                    protofunction.prototype = {
                        selector    : null,
                        select      : function (parent, selector, only_first) {
                            var id      = flex.unique(),
                                nodes   = null,
                                id_attr = "data-" + id;
                            if (typeof parent.nodeName === "string") {
                                parent.setAttribute(id_attr, id);
                                nodes = this.selector[(only_first === false ? 'all' : 'first')](parent.nodeName + '[' + id_attr + '="' + id + '"] ' + selector);
                                parent.removeAttribute(id_attr);
                            }
                            return nodes;
                        },
                        first       : function (parent, selector) {
                            return this.select(parent, selector, true);
                        },
                        all         : function (parent, selector) {
                            return this.select(parent, selector, false);
                        }
                    };
                    return Object.freeze(new protofunction());
                },
            };
            find        = function () { 
                var protofunction = function () { };
                protofunction.prototype = {
                    childByAttr : function (parent, nodeName, attribute) {
                        var result_node = null,
                            nodeName    = nodeName.toLowerCase(),
                            self        = this;
                        if (parent.childNodes !== void 0) {
                            if (typeof parent.childNodes.length === "number") {
                                Array.prototype.forEach.call(
                                    parent.childNodes,
                                    function (childNode) {
                                        if (typeof childNode.nodeName === "string") {
                                            if (childNode.nodeName.toLowerCase() === nodeName || nodeName === "*") {
                                                if (typeof childNode.getAttribute === "function") {
                                                    if (attribute.value !== null) {
                                                        if (childNode.getAttribute(attribute.name) === attribute.value) {
                                                            return childNode;
                                                        }
                                                    } else {
                                                        if (childNode.hasAttribute(attribute.name) === true) {
                                                            return childNode;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        result_node = self.childByAttr(childNode, nodeName, attribute);
                                        if (result_node !== null) {
                                            return result_node;
                                        }
                                    }
                                );
                            }
                        }
                        return null;
                    },
                    childByType : function (parent, nodeName) {
                        var result_node = null,
                            nodeName    = nodeName.toLowerCase(),
                            self        = this;
                        if (parent.childNodes !== void 0) {
                            if (typeof parent.childNodes.length === "number") {
                                Array.prototype.forEach.call(
                                    parent.childNodes,
                                    function (childNode) {
                                        if (typeof childNode.nodeName === "string") {
                                            if (childNode.nodeName.toLowerCase() === nodeName) {
                                                return childNode;
                                            }
                                        }
                                    }
                                );
                                Array.prototype.forEach.call(
                                    parent.childNodes,
                                    function (childNode) {
                                        result_node = self.childByType(childNode, nodeName);
                                        if (result_node !== null) {
                                            return result_node;
                                        }
                                    }
                                );
                            }
                        }
                        return null;
                    },
                    parentByAttr: function (child, attribute) {
                        if (child !== void 0 && attribute !== void 0) {
                            if (child.parentNode !== void 0) {
                                if (child.parentNode !== null) {
                                    if (typeof child.parentNode.getAttribute === 'function') {
                                        if (attribute.value !== null) {
                                            if (child.parentNode.getAttribute(attribute.name) === attribute.value) {
                                                return child.parentNode;
                                            } else {
                                                return this.parentByAttr(child.parentNode, attribute);
                                            }
                                        } else {
                                            if (child.parentNode.getAttribute(attribute.name) !== null) {
                                                return child.parentNode;
                                            } else {
                                                return this.parentByAttr(child.parentNode, attribute);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return null;
                    }
                };
                return new protofunction();
            };
            sizes       = function () {
                var protofunction       = function () { };
                protofunction.prototype = {
                    nodeByClientRectSize    : function (node){
                        var height                  = 0,
                            width                   = 0,
                            bounding_client_rect    = null;
                        if (node.getBoundingClientRect !== void 0) {
                            bounding_client_rect    = node.getBoundingClientRect();
                            height                  = bounding_client_rect.bottom - bounding_client_rect.top;
                            width                   = bounding_client_rect.right - bounding_client_rect.left;
                        }
                        return { height: height, width: width }
                    },
                    nodeByOffset            : function (node) {
                        var height  = 0,
                            width   = 0;
                        if (node.offsetHeight !== void 0) {
                            height  = node.offsetHeight;
                            width   = node.offsetWidth;
                        }
                        return { height: height, width: width }
                    },
                    nodeWithMargin          : function (node) {
                        var height      = 0,
                            width       = 0,
                            selector    = null,
                            size        = this.node(node),
                            top, bottom, right, left,
                            b_top, b_bottom, b_right, b_left;
                        if (typeof node === 'string') {
                            selector    = select.bySelector();
                            node        = selector.first(node);
                            selector    = null;
                        }
                        if (node !== null) {
                            top         = parseInt(document.defaultView.getComputedStyle(node).marginTop,           10);
                            bottom      = parseInt(document.defaultView.getComputedStyle(node).marginBottom,        10);
                            right       = parseInt(document.defaultView.getComputedStyle(node).marginRight,         10);
                            left        = parseInt(document.defaultView.getComputedStyle(node).marginLeft,          10);
                            b_top       = parseInt(document.defaultView.getComputedStyle(node).borderTopWidth,      10);
                            b_bottom    = parseInt(document.defaultView.getComputedStyle(node).borderBottomWidth,   10);
                            b_right     = parseInt(document.defaultView.getComputedStyle(node).borderRightWidth,    10);
                            b_left      = parseInt(document.defaultView.getComputedStyle(node).borderLeftWidth,     10);
                            if (top         === null || top         === NaN) { top          = 0; }
                            if (bottom      === null || bottom      === NaN) { bottom       = 0; } 
                            if (right       === null || right       === NaN) { right        = 0; }
                            if (left        === null || left        === NaN) { left         = 0; }
                            if (b_top       === null || b_top       === NaN) { b_top        = 0; }
                            if (b_bottom    === null || b_bottom    === NaN) { b_bottom     = 0; }
                            if (b_right     === null || b_right     === NaN) { b_right      = 0; }
                            if (b_left      === null || b_left      === NaN) { b_left       = 0; }
                        }
                        return {
                            height  : size.height + top + bottom + b_top + b_bottom,
                            width   : size.width + right + left + b_right + b_left
                        }
                    },
                    node                    : function (node) {
                        var height      = 0,
                            width       = 0,
                            selector    = null,
                            size        = { height : 0, width : 0 };
                        if (typeof node === 'string') {
                            selector    = select.bySelector();
                            node        = selector.first(node);
                            selector    = null;
                        }
                        if (node !== null) {
                            size = this.nodeByClientRectSize(node);
                            if (size.height === 0 && size.width === 0) {
                                size = this.nodeByOffset(node);
                            }
                        }
                        return size;
                    },
                    window                  : function () {
                        if (self.innerHeight) {
                            return {
                                height  : self.innerHeight,
                                width   : self.innerWidth
                            };
                        } else if (document.documentElement && document.documentElement.clientHeight) {
                            return {
                                height  : document.documentElement.clientHeight,
                                width   : document.documentElement.clientWidth
                            };
                        }
                        else if (document.body) {
                            return {
                                height  : document.body.clientHeight,
                                width   : document.body.clientWidth
                            };
                        }
                        return null;
                    },
                    image                   : function (image) {
                        function generateSize(image) {
                            var imageObj    = new Image(),
                                size        = null;
                            imageObj.src = image.src;
                            size = {
                                width   : imageObj.width,
                                height  : imageObj.height
                            };
                            imageObj = null;
                            return size;
                        };
                        if (image !== void 0) {
                            if (typeof image.naturalWidth === 'number') {
                                return {
                                    width   : image.naturalWidth,
                                    height  : image.naturalHeight
                                }
                            } else {
                                return generateSize(image);
                            }
                        }
                        return null;
                    },
                };
                return new protofunction();
            };
            scroll      = function () {
                var protofunction       = function () { };
                protofunction.prototype = {
                    window          : function () {
                        var body = document.body,
                            html = document.documentElement;
                        return {
                            top     : function () {
                                return Math.max(
                                    body.scrollTop      || 0,
                                    html.scrollTop      || 0,
                                    body.pageYOffset    || 0,
                                    html.pageYOffset    || 0,
                                    window.pageYOffset  || 0
                                );
                            },
                            left    : function () {
                                return Math.max(
                                    body.scrollLeft     || 0,
                                    html.scrollLeft     || 0,
                                    body.pageXOffset    || 0,
                                    html.pageXOffset    || 0,
                                    window.pageXOffset  || 0
                                );
                            },
                            height  : function () {
                                return Math.max(
                                    body.scrollHeight || 0,
                                    body.offsetHeight || 0,
                                    html.clientHeight || 0,
                                    html.scrollHeight || 0,
                                    html.offsetHeight || 0
                                );
                            },
                            width   : function () {
                                return Math.max(
                                    body.scrollWidth || 0,
                                    body.offsetWidth || 0,
                                    html.clientWidth || 0,
                                    html.scrollWidth || 0,
                                    html.offsetWidth || 0
                                );
                            },
                        };
                    },
                    get             : function (object) {
                        if (object !== document.body && object !== document.documentElement) {
                            return {
                                top     : function () {
                                    return Math.max(
                                        object.scrollTop    || 0,
                                        object.pageYOffset  || 0
                                    );
                                },
                                left    : function () {
                                    return Math.max(
                                        object.scrollLeft   || 0,
                                        object.pageXOffset  || 0
                                    );
                                },
                                height  : function () {
                                    return Math.max(
                                        object.scrollHeight || 0,
                                        object.clientHeight || 0,
                                        object.offsetHeight || 0
                                    );
                                },
                                width   : function () {
                                    return Math.max(
                                        object.scrollWidth || 0,
                                        object.clientWidth || 0,
                                        object.offsetWidth || 0
                                    );
                                }
                            };
                        } else {
                            return this.window();
                        }

                    },
                    scrollBarSize   : function () {
                        function getSize() {
                            var node    = document.createElement("DIV"),
                                css     = styles(),
                                result  = null;
                            css.apply(
                                node,
                                {
                                    position    : 'absolute',
                                    top         : '-1000px',
                                    left        : '-1000px',
                                    width       : '300px',
                                    height      : '300px',
                                    overflow    : 'scroll',
                                    opacity     : '0.01',
                                }
                            );
                            document.body.appendChild(node);
                            result = {
                                width   : node.offsetWidth  - node.clientWidth,
                                height  : node.offsetHeight - node.clientHeight
                            };
                            result.probablyMobile   = (result.width     === 0 ? true : false);
                            result.width            = (result.width     === 0 ? settings.classes.scroll.MINIMAL_WIDTH   : result.width  );
                            result.height           = (result.height    === 0 ? settings.classes.scroll.MINIMAL_HEIGHT  : result.height );
                            document.body.removeChild(node);
                            return result;
                            /*
                            Здесь проблемное место. Дело в том, что на таблетках полоса проктутки накладывается на содержимое страницы.
                            Это приводит к тому, что метод определения ширины полосы путем вычетания из общего размера области размера 
                            содержимого не дает результатов, так как полоса прокрутки над содержимым и не "уменьшает" его. Но а найти
                            на момент написания этого комментрия сколь нибудь достойных решений по определению размера полосы прокрутки
                            на таблетках - не удалось. Поэтому и берется фиксированный размер в 15 пк. 
                            23.01.2014
                            */
                        };
                        var storaged = flex.overhead.globaly.get(settings.storage.GROUP, settings.storage.SCROLL, {});
                        if (!storaged.value) {
                            storaged.value = getSize();
                        }
                        return storaged.value;
                    }
                };
                return new protofunction();
            };
            builder     = function () {
                var protofunction = function () { };
                protofunction.prototype = {
                    build: function (attributes) {
                        function settingup(attributes, nodes) {
                            var parent = nodes[attributes.settingup.parent] || null;
                            if (typeof attributes.settingup === "object" && nodes !== null && parent !== null) {
                                Array.prototype.forEach.call(
                                    attributes.settingup.childs,
                                    function (child) {
                                        if (nodes[child]) {
                                            if (typeof attributes[child].settingup === "object") {
                                                parent.appendChild(nodes[child][attributes[child].settingup.parent]);
                                            } else {
                                                parent.appendChild(nodes[child]);
                                            }
                                        }
                                    }
                                );
                            }
                        };
                        function make(attribute) {
                            var node = document.createElement(attribute.node);
                            if (attribute.html !== null) {
                                node.innerHTML = attribute.html;
                            }
                            Array.prototype.forEach.call(
                                attribute.attrs,
                                function (attr) {
                                    if (flex.oop.objects.validate(attr, [   { name: "name",     type: "string" },
                                                                            { name: "value",    type: "string" }]) === true) {
                                        node.setAttribute(attr.name, attr.value);
                                    }
                                }
                            );
                            return node;
                        };
                        function validate(property) {
                            return flex.oop.objects.validate(property, [{ name: "node",     type: "string"              },
                                                                        { name: "attrs",    type: "array",  value: []   },
                                                                        { name: "html",     type: "string", value: null }]);
                        };
                        var nodes = {};
                        try {
                            if (validate(attributes) === true) {
                                return make(attributes);
                            } else {
                                for (var property in attributes) {
                                    if (validate(attributes[property]) === true) {
                                        nodes[property] = make(attributes[property]);
                                    } else {
                                        if (typeof attributes[property] === "object" && property !== "settingup") {
                                            nodes[property] = this.build(attributes[property]);
                                            if (nodes[property] === null) {
                                                return null;
                                            }
                                        }
                                    }
                                }
                                settingup(attributes, nodes);
                            }
                        } catch (e) {
                            return null;
                        }
                        return nodes;
                    }
                };
                return new protofunction();
            };
            styles      = function () {
                var protofunction       = function () { };
                protofunction.prototype = {
                    apply           : function (node, styles) {
                        if (node && typeof styles === 'object') {
                            if (node.style) {
                                for (var property in styles) {
                                    node.style[property] = styles[property];
                                }
                                return true;
                            }
                        }
                        return false;
                    },
                    redraw          : function (node){
                        if (node){
                            if (node.style !== void 0) {
                                node.style.display = 'none';
                                node.style.display = '';
                                return true;
                            }
                        }
                        return false;
                    },
                    getRuleFromSheet: function (sheet, selector) {
                        /// <summary>
                        /// Get rule from CSS for defined selector
                        /// </summary>
                        /// <param name="sheet"     type="sheet"    >CSS sheet</param>
                        /// <param name="selector"  type="string"   >CSS selector</param>
                        /// <returns type="array">Rules for selector</returns>
                        var sheets  = document.styleSheets,
                            styles  = null,
                            rules   = [];
                        try {
                            selector = selector.replace(/['"]/gi, '|');
                            Array.prototype.forEach.call(
                                (sheet.cssRules || sheet.rules),
                                function (rule, index) {
                                    if (rule.selectorText) {
                                        if (rule.selectorText.replace(/['"]/gi, '|') === selector) {
                                            rules.push({
                                                rule    : rule,
                                                style   : rule.style || null,
                                                index   : index,
                                                cssText : (rule.cssText || '')
                                            });
                                        }
                                    } else if (typeof rule.cssText === 'string') {
                                        if (rule.cssText.indexOf(selector.toLowerCase()) === 0) {
                                            rules.push({
                                                rule    : rule,
                                                style   : rule.style || null,
                                                index   : index,
                                                cssText : (rule.cssText || '')
                                            });
                                        }
                                    }
                                }
                            );
                        } catch (e) {
                        } finally {
                            return rules.length > 0 ? rules : null;
                        }
                    },
                    getRule         : function (selector) {
                        /// <summary>
                        /// Get rule from CSS for defined selector
                        /// </summary>
                        /// <param name="selector"  type="string"   >CSS selector</param>
                        /// <returns type="array">Rules for selector</returns>
                        var sheets  = document.styleSheets,
                            styles  = null,
                            rules   = [],
                            self    = this;
                        try {
                            selector = selector.replace(/['"]/gi, '|');
                            Array.prototype.forEach.call(
                                document.styleSheets,
                                function (sheet) {
                                    var result = self.getRuleFromSheet(sheet, selector);
                                    if (result !== null) {
                                        rules = rules.concat(result);
                                    }
                                }
                            );
                        } catch (e) {
                        } finally {
                            return rules.length > 0 ? rules : null;
                        }
                    },
                    setRule         : function (selector, cssText) {
                        var sheet = flex.overhead.globaly.get(settings.storage.GROUP, settings.storage.CUSTOM_STYLES);
                        if (typeof cssText === 'string') {
                            if (sheet === null) {
                                sheet       = document.createElement("style");
                                sheet.type  = "text/css";
                                document.head.appendChild(sheet);
                                sheet       = sheet.styleSheet || sheet.sheet;
                                flex.overhead.globaly.set(settings.storage.GROUP, settings.storage.CUSTOM_STYLES, sheet);
                            }
                            if (sheet.insertRule) {
                                sheet.insertRule(selector + ' {' + cssText + '}', sheet.cssRules.length);
                                return {
                                    rule    : sheet.cssRules[sheet.cssRules.length - 1],
                                    index   : sheet.cssRules.length - 1,
                                    sheet   : sheet
                                };
                            } else if (sheet.addRule) {
                                sheet.addRule(selector + ' {' + cssText + '}', -1);
                                return {
                                    rule    : sheet.cssRules[sheet.cssRules.length - 1],
                                    index   : sheet.cssRules.length - 1,
                                    sheet   : sheet
                                };
                            }
                        }
                        return null;
                    },
                    updateRule      : function (sheet, rule, cssText) {
                        var selector = rule.selectorText;
                        this.deleteRule(sheet, rule);
                        return this.setRule(selector, cssText);
                    },
                    deleteRule      : function (sheet, target, deep) {
                        function getIndex(self, target, sheet, deep) {
                            var result = null;
                            if (target !== void 0) {
                                if (typeof target === 'string') {
                                    //selector
                                    if (deep === false && sheet !== null) {
                                        result = self.getRuleFromSheet(sheet, target);
                                    } else {
                                        result = self.getRule(target);
                                    }
                                    if (result !== null) {
                                        if (result.length === 1) {
                                            return result[0].index;
                                        }
                                    }
                                } else if (typeof target === 'number') {
                                    //index
                                    return target;
                                } else if (typeof target === 'object') {
                                    //rule object
                                    if (sheet !== null) {
                                        return self.getRuleIndex(sheet, target);
                                    }
                                }
                            }
                            return -1;
                        };
                        var sheet   = sheet || flex.overhead.globaly.get(settings.storage.GROUP, settings.storage.CUSTOM_STYLES),
                            deep    = typeof deep === 'boolean' ? deep : true,
                            index   = getIndex(this, target, sheet, deep);
                        if (index !== -1 && sheet !== null) {
                            if (sheet.deleteRule) {
                                sheet.deleteRule(index);
                                return true;
                            } else if (sheet.removeRule) {
                                sheet.removeRule(index);
                                return true;
                            }
                        }
                        return null
                    },
                    getRuleIndex    : function (sheet, rule){
                        var index = -1;
                        try{
                            Array.prototype.forEach.call(
                                sheet.cssRules,
                                function(_rule, rule_index){
                                    if (_rule === rule){
                                        index = rule_index;
                                        throw 'found';
                                    }
                                }
                            );
                        }catch(e){
                            if (e === 'found'){
                                return index;
                            }
                        }
                        return -1;
                    },
                    addClass        : function (node, name) {
                        if (node.className !== void 0) {
                            if (node.className.search(name) === -1) {
                                node.className += name;
                            }
                        }
                    },
                    removeClass     : function (node, name) {
                        if (node.className !== void 0) {
                            if (node.className.search(name) !== -1) {
                                node.className = node.className.replace(name, '');
                            }
                        }
                    },
                };
                return new protofunction();
            };
            position    = function () {
                var protofunction = function () { };
                protofunction.prototype = (function () {
                    var tools       = null,
                        byPage      = null,
                        byWindow    = null,
                        privates    = null;
                    position = {
                        old     : function (node) {
                            var top     = 0,
                                left    = 0;
                            while (node) {
                                if (node.offsetTop !== void 0 && node.offsetLeft !== void 0) {
                                    top     += parseFloat(node.offsetTop    );
                                    left    += parseFloat(node.offsetLeft   );
                                }
                                node = node.offsetParent;
                            }
                            return {
                                top : top,
                                left: left
                            };
                        },
                        modern  : function (node) {
                            var box                 = null,
                                objBody             = null,
                                objDocumentElement  = null,
                                scrollTop           = null,
                                scrollLeft          = null,
                                clientTop           = null,
                                clientLeft          = null;
                            box                 = node.getBoundingClientRect();
                            objBody             = document.body;
                            objDocumentElement  = document.documentElement;
                            scrollTop           = window.pageYOffset || objDocumentElement.scrollTop || objBody.scrollTop;
                            scrollLeft          = window.pageXOffset || objDocumentElement.scrollLeft || objBody.scrollLeft;
                            clientTop           = objDocumentElement.clientTop || objBody.clientTop || 0;
                            clientLeft          = objDocumentElement.clientLeft || objBody.clientLeft || 0;
                            return {
                                top : box.top + scrollTop - clientTop,
                                left: box.left + scrollLeft - clientLeft
                            };
                        }
                    };
                    byPage      = function (node) {
                        var top             = null,
                            left            = null,
                            box             = null,
                            offset          = null,
                            scrollTop       = null,
                            scrollLeft      = null;
                        try {
                            box     = node.getBoundingClientRect();
                            top     = box.top;
                            left    = box.left;
                        } catch (e) {
                            offset          = position.old(node);
                            scrollTop       = window.pageYOffset || objDocumentElement.scrollTop || objBody.scrollTop;
                            scrollLeft      = window.pageXOffset || objDocumentElement.scrollLeft || objBody.scrollLeft;
                            top             = offset.top - scrollTop;
                            left            = offset.left - scrollLeft;
                        } finally {
                            return {
                                top : top,
                                left: left
                            };
                        }
                    };
                    byWindow    = function (node) {
                        var result = null;
                        try {
                            result = position.modern(node);
                        } catch (e) {
                            result = position.old(node);
                        } finally {
                            return result;
                        }
                    };
                    privates    = {
                        byPage      : byPage,
                        byWindow    : byWindow
                    };
                    return {
                        byPage  : privates.byPage,
                        byWindow: privates.byWindow,
                    }
                }());
                return new protofunction();
            };
            units       = function () { 
                var protofunction       = function () { };
                protofunction.prototype = {
                    em  : function (context) {
                        context = context || document.documentElement;
                        context = context.parentNode ? context : document.documentElement;
                        return parseFloat(getComputedStyle(context).fontSize);
                    },
                    rem : function () {
                        this.em(document.documentElement);
                    },
                };
                return new protofunction();
            };
            helpers     = {
                validateNode: function (node) {
                    var selector = null;
                    if (node) {
                        if (typeof node === 'string') {
                            selector    = select.bySelector();
                            node        = selector.first(node);
                        }
                        if (node !== null) {
                            if (node.parentNode !== void 0) {
                                return node;
                            }
                        }
                    }
                    return null;
                },
                appendChilds: function (parent, childs) {
                    for (var index = childs.length - 1; index >= 0; index -= 1) {
                        parent.appendChild(childs[0]);
                    }
                }
            };
            callers     = {
                init: function () {
                    function SizeClass      () { if (_size      === null) { _size       = sizes             (); } };
                    function PositionClass  () { if (_position  === null) { _position   = position          (); } };
                    function StylesClass    () { if (_styles    === null) { _styles     = styles            (); } };
                    function ScrollClass    () { if (_scroll    === null) { _scroll     = scroll            (); } };
                    function FindClass      () { if (_find      === null) { _find       = find              (); } };
                    function SelectorClass  () { if (_selector  === null) { _selector   = select.fromParent (); } };
                    var _size       = null,
                        _position   = null,
                        _styles     = null,
                        _scroll     = null,
                        _find       = null,
                        _selector   = null;
                    //_node
                    flex.callers.define.node('html.size.get',                   function () {
                        SizeClass();
                        return _size.node(this.target);
                    });
                    flex.callers.define.node('html.size.getWithMargin',         function () {
                        SizeClass();
                        return _size.nodeWithMargin(this.target);
                    });
                    flex.callers.define.node('html.size.getByClientRectSize',   function () {
                        SizeClass();
                        return _size.nodeByClientRectSize(this.target);
                    });
                    flex.callers.define.node('html.size.getByOffset',           function () {
                        SizeClass();
                        return _size.nodeByOffset(this.target);
                    });
                    flex.callers.define.node('html.position.byPage',            function () {
                        PositionClass();
                        return _position.byPage(this.target);
                    });
                    flex.callers.define.node('html.position.byWindow',          function () {
                        PositionClass();
                        return _position.byWindow(this.target);
                    });
                    flex.callers.define.node('html.styles.apply',               function (styles) {
                        StylesClass();
                        return _styles.apply(this.target, styles);
                    });
                    flex.callers.define.node('html.styles.redraw',              function () {
                        StylesClass();
                        return _styles.redraw(this.target);
                    });
                    flex.callers.define.node('html.styles.addClass',            function (class_name) {
                        StylesClass();
                        return _styles.addClass(this.target, class_name);
                    });
                    flex.callers.define.node('html.styles.removeClass',         function (class_name) {
                        StylesClass();
                        return _styles.removeClass(this.target, class_name);
                    });
                    flex.callers.define.node('html.scroll.position',            function () {
                        ScrollClass();
                        return _scroll.get(this.target);
                    });
                    flex.callers.define.node('html.find.childByAttr',           function (node_name, attribute) {
                        FindClass();
                        return _find.childByAttr(this.target, node_name, attribute);
                    });
                    flex.callers.define.node('html.find.childByType',           function (node_name) {
                        FindClass();
                        return _find.childByType(this.target, node_name);
                    });
                    flex.callers.define.node('html.find.parentByAttr',          function (attribute) {
                        FindClass();
                        return _find.parentByAttr(this.target, attribute);
                    });
                    flex.callers.define.node('html.find.node',                  function (selector) {
                        SelectorClass();
                        return _selector.first(this.target, selector);
                    });
                    flex.callers.define.node('html.find.nodes',                 function (selector) {
                        SelectorClass();
                        return _selector.all(this.target, selector);
                    });
                    //_nodes
                    flex.callers.define.nodes('html.size.get',                   function () {
                        var result = [];
                        SizeClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_size.node(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.size.getWithMargin',         function () {
                        var result = [];
                        SizeClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_size.nodeWithMargin(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.size.getByClientRectSize',   function () {
                        var result = [];
                        SizeClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_size.nodeByClientRectSize(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.size.getByOffset',           function () {
                        var result = [];
                        SizeClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_size.nodeByOffset(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.position.byPage',            function () {
                        var result = [];
                        PositionClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_position.byPage(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.position.byWindow',          function () {
                        var result = [];
                        PositionClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_position.byWindow(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.styles.apply',               function (styles) {
                        var result = [];
                        StylesClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_styles.apply(target, styles));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.styles.redraw',              function () {
                        var result = [];
                        StylesClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_styles.redraw(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.styles.addClass',            function (class_name) {
                        var result = [];
                        StylesClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_styles.addClass(target, class_name));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.styles.removeClass',         function (class_name) {
                        var result = [];
                        StylesClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_styles.removeClass(target, class_name));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.scroll.position',            function () {
                        var result = [];
                        ScrollClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_scroll.get(target));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.find.childByAttr',           function (node_name, attribute) {
                        var result = [];
                        FindClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_find.childByAttr(target, node_name, attribute));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.find.childByType',           function (node_name) {
                        var result = [];
                        FindClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_find.childByType(target, node_name));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.find.parentByAttr',          function (attribute) {
                        var result = [];
                        FindClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(_find.parentByAttr(target, attribute));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.find.node',                  function (selector) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(selector.first(target, selector));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('html.find.nodes',                 function (selector) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(selector.all(target, selector));
                        });
                        return result;
                    });
                }
            };
            //Initialization of callers
            callers.init();
            //Public part
            privates    = {
                select  : {
                    bySelector  : select.bySelector,
                    fromParent  : select.fromParent
                },
                find    : find,
                size    : sizes,
                scroll  : scroll,
                builder : builder,
                styles  : styles,
                position: position,
                units   : units,
                helpers : helpers
            };
            return {
                select      : {
                    bySelector: privates.select.bySelector,
                    fromParent: privates.select.fromParent
                },
                find        : privates.find,
                size        : privates.size,
                scroll      : privates.scroll,
                builder     : privates.builder,
                styles      : styles,
                position    : privates.position,
                units       : units,
                helpers     : privates.helpers
            };
        };
        flex.modules.attach({
            name            : 'html',
            protofunction   : protofunction,
        });
    }
}());