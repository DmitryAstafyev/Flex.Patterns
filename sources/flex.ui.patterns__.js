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
            var config          = null,
                settings        = null,
                //Classes
                Source          = null,
                Pattern         = null,
                instance        = null,
                result          = null,
                Caller          = null,
                addition        = null,
                //Methods
                layout          = null,
                privates        = null,
                controllers     = null,
                storage         = null,
                logs            = null,
                measuring       = null,
                helpers         = null,
                conditions      = null,
                callers         = null,
                defaultshooks   = null,
                defaultsmap     = null,
                ExArray         = flex.libraries.types.array.create().ExArray;
            //Config
            config          = {
                values      : {
                    USE_STORAGE_CSS     : true,
                    USE_STORAGE_JS      : true,
                    USE_STORAGE_HTML    : true,
                    USE_LOCALSTORAGE    : true,
                    PATTERN_NODE        : 'pattern',
                    PATTERN_SRC         : 'data-pattern',
                    HOOK_PREFIX         : 'h_',
                    HOOKS_SET           : 'data-hooks',
                    HOOKS_SRC           : 'data-hooks-src',
                    ACCESSORS           : true,
                    CACHE_PATTERNS      : false,
                    onLayoutBuildFinish : null
                },
                validator   : {
                    USE_STORAGE_CSS     : function (value) { return typeof value === 'boolean';},
                    USE_STORAGE_JS      : function (value) { return typeof value === 'boolean';},
                    USE_STORAGE_HTML    : function (value) { return typeof value === 'boolean';},
                    USE_LOCALSTORAGE    : function (value) { return typeof value === 'boolean'; },
                    PATTERN_SRC         : function (value) { return typeof value === 'string'; },
                    PATTERN_NODE        : function (value) { return typeof value === 'string'   ? (value.length > 0 ? (value.replace(/\w/gi, '').length === 0 ? true : false) : false) : false; },
                    PATTERN_SRC         : function (value) { return typeof value === 'string'; },
                    HOOK_PREFIX         : function (value) { return typeof value === 'string'; },
                    HOOKS_SET           : function (value) { return typeof value === 'string'; },
                    HOOKS_SRC           : function (value) { return typeof value === 'string'; },
                    ACCESSORS           : function (value) { return typeof value === 'boolean'; },
                    CACHE_PATTERNS      : function (value) { return typeof value === 'boolean'; },
                    onLayoutBuildFinish : function (value) { return typeof value === 'function'; },
                },
                setup       : function (_config) {
                    if (_config !== null && typeof _config === 'object') {
                        _object(_config).forEach(function (key, value) {
                            if (config.values[key] !== void 0 && config.validator[key] !== void 0) {
                                config.values[key] = config.validator[key](value) ? value : config.values[key];
                            }
                        });
                    }
                },
                get         : function () {
                    return config.values;
                },
                debug       : function (){
                    config.values.USE_STORAGE_CSS   = false;
                    config.values.USE_STORAGE_JS    = false;
                    config.values.USE_STORAGE_HTML  = false;
                    config.values.USE_LOCALSTORAGE  = false;
                    config.values.CACHE_PATTERNS    = false;
                    flex.config.set({
                        logs: { SHOW: ['CRITICAL', 'LOGICAL', 'WARNING', 'NOTIFICATION', 'LOGS', 'KERNEL_LOGS'] }
                    });
                }
            };
            //Settings
            settings        = {
                measuring       : {
                    MEASURE : true,
                },
                classes         : {
                    SOURCE  : function(){},
                    PATTERN : function(){},
                    CALLER  : function(){},
                    URL     : function(){},
                },
                regs            : {
                    BODY                    : /<\s*body[^>]*>(\n|\r|\s|.)*?<\s*\/body\s*>/gi,
                    BODY_TAG                : /<\s*body[^>]*>|<\s*\/\s*body\s*>/gi,
                    BODY_CLEAR              : /^[\n\r\s]*|[\n\r\s]*$/gi,
                    FIRST_TAG               : /^\s*<\s*\w{1,}/gi,
                    TAG_BORDERS             : /<|>/gi,
                    CSS                     : /<link\s+.*?\/>|<link\s+.*?\>/gi,
                    CSS_HREF                : /href\s*\=\s*"(.*?)"|href\s*\=\s*'(.*?)'/gi,
                    CSS_REL                 : /rel\s*=\s*"stylesheet"|rel\s*=\s*'stylesheet'/gi,
                    CSS_TYPE                : /type\s*=\s*"text\/css"|type\s*=\s*'text\/css'/gi,
                    JS                      : /<script\s+.*?>/gi,
                    JS_SRC                  : /src\s*\=\s*"(.*?)"|src\s*\=\s*'(.*?)'/gi,
                    JS_TYPE                 : /type\s*=\s*"text\/javascript"|type\s*=\s*'text\/javascript'/gi,
                    STRING                  : /"(.*?)"|'(.*?)'/gi,
                    STRING_BORDERS          : /"|'/gi,
                    DOM                     : /\{\{\$[\w\.\,]*?\}\}/gi,
                    DOM_OPEN_STR            : '{{$',
                    DOM_CLOSE_STR           : '}}',
                    HOOK                    : /\{\{[\w\d_\.]*?\}\}/gi,
                    MODEL                   : /\{\{\:\:[\w\d_\.]*?\}\}/gi,
                    MODEL_BORDERS           : /\{\{\:\:|\}\}/gi,
                    HOOK_OPEN               : '\\{\\{',
                    HOOK_CLOSE              : '\\}\\}',
                    HOOK_BORDERS            : /\{\{|\}\}/gi,
                    CONDITIONS              : /<!--[\w_]*=.{1,}?-->/gi,
                    CONDITION_CONTENT       : '<!--[open]-->.*?<!--[close]-->',
                    CONDITION_CONTENT_ANY   : '<!--[open]=.{1,}?-->.*?<!--[close]-->',
                    STRING_CON              : /".*?"/gi,
                    STRING_CON_STRICT       : '".*?"',
                    STRING_BORDER_CON       : /"/gi,
                    CON_CLOSE_STR           : '<!--[name]-->',
                    OPEN_TAG                : /<[\s]*[\w]{1,}/gi,
                    COMMENT_BORDERS         : /<!--|-->/gi,
                    FIRST_WORD              : /^\w+/gi,
                    //New regs
                    TAGS                    : /<\s*\w[^>\/]*.*?>/gi,
                    ATTRS                   : /([\w-]{1,}\s*=\s*".{1,}?")|([\w-]{1,}\s*=\s*'.{1,}?')/gi,
                    DOM_BORDERS             : /\{\{\$|\}\}/gi,
                    MODEL_OPEN_STR          : '{{::',
                    MODEL_CLOSE_STR         : '}}',
                    HOOK_OPEN_STR           : '{{',
                    HOOK_CLOSE_STR          : '}}',
                    ALL                     : /\{\{.*?\}\}/gi,
                    INSIDE_TAG              : />(.*?)</gi,
                    EVENT_ATTR              : /[\w]{1,}(\s{1,})?=(\s{1,})?["']\{\{\@[\w\d_\.]*?\}\}["']/gi,
                    EVENT_BORDERS           : /\{\{\@|\}\}/gi,
                    LINES                   : /\n|\r|\n\r/gi
                },
                storage         : {
                    VIRTUAL_STORAGE_GROUP   : 'FLEX_UI_PATTERNS_GROUP',
                    VIRTUAL_STORAGE_ID      : 'FLEX_UI_PATTERNS_STORAGE',
                    CSS_ATTACHED_JOURNAL    : 'FLEX_UI_PATTERNS_CSS_JOURNAL',
                    JS_ATTACHED_JOURNAL     : 'JS_ATTACHED_JOURNAL',
                    PRELOAD_TRACKER         : 'FLEX_UI_PATTERNS_PRELOAD_TRACKER',
                    CONTROLLERS_LINKS       : 'FLEX_PATTERNS_CONTROLLERS_LINKS',
                    CONTROLLERS_STORAGE     : 'FLEX_PATTERNS_CONTROLLERS_STORAGE',
                    CONDITIONS_STORAGE      : 'FLEX_PATTERNS_CONDITIONS_STORAGE',
                    HOOKS_STORAGE           : 'FLEX_PATTERNS_HOOKS_STORAGE',
                    MAPS_STORAGE            : 'FLEX_PATTERNS_MAPS_STORAGE',
                    PATTERN_SOURCES         : 'FLEX_PATTERNS_PATTERN_SOURCES',
                    GLOBAL_EVENTS           : 'FLEX_PATTERNS_GLOBAL_EVENTS',
                    PATTERN_CACHE           : 'FLEX_PATTERNS_CACHE_STORAGE'
                },
                compatibility   : {
                    PARENT_TO_CHILD : {
                        table   : 'tbody',
                        tbody   : 'tr',
                        thead   : 'tr',
                        tfoot   : 'tr',
                        tr      : 'td',
                        colgroup: 'col',
                    },
                    CHILD_TO_PARENT : {
                        tr      : 'tbody',
                        th      : 'tbody',
                        td      : 'tr',
                        col     : 'colgroup',
                        tbody   : 'table',
                        thead   : 'table',
                        tfoot   : 'table',
                    },
                    BASE            : 'div'
                },
                css             : {
                    classes     : {
                        MODEL_NODE  : 'data-flex-model-node',
                    },
                    attrs       : {
                        MODEL       : 'data-flex-model-data',
                        DOM         : 'data-flex-pattern-dom',
                        CONDITION   : 'data-flex-pattern-condition',
                        PARENT      : 'data-flex-pattern-parrent'
                    },
                    selectors   : {
                        HOOK_WRAPPERS: '.flex_patterns_hook_wrapper'
                    },
                },
                events          : {
                    ONREADY     : 'onReady',
                    ONUPDATE    : 'onUpdate',
                    ONCHANGE    : 'onChange',
                    SETINSTNCE  : 'setInstance'
                },
                other           : {
                    SUBLEVEL_BEGIN          : '_',
                    SUBLEVEL_END            : '_',
                    BIND_PREFIX             : '$$',
                    DOM_PREFIX              : '$',
                    ACCESSOR_PREFIX         : '__',
                    HOOK_COM_BEGIN          : '^^^',
                    HOOK_COM_END            : '###',
                    PARENT_MARK_HTML        : '##parent##',
                    ANCHOR                  : 'ANCHOR::',
                    EVENTS_HANDLE_ID        : 'flex_patterns_listener_handle_id',
                    CACHE_PATTERNS_PREFIX   : 'PATTERNS_CACHE:',
                    HOOK_ACCESSOR_FUNC_NAME : 'setHookValue'
                }
            };
            logs            = {
                SIGNATURE   : '[flex.ui.patterns]', 
                source      : {
                    TEMPLATE_WAS_LOADED                     : '0001:TEMPLATE_WAS_LOADED',
                    FAIL_TO_LOAD_TEMPLATE                   : '0002:FAIL_TO_LOAD_TEMPLATE',
                    FAIL_TO_PARSE_TEMPLATE                  : '0003:FAIL_TO_PARSE_TEMPLATE',
                    FAIL_TO_LOAD_JS_RESOURCE                : '0004:FAIL_TO_LOAD_JS_RESOURCE',
                    ONLY_ONE_MODEL_REF_CAN_BE_IN_ATTR       : '0005: ONLY_ONE_MODEL_REF_CAN_BE_IN_ATTR',
                    BAD_FORMAT_OF_STYLE_IN_ATTRIBUTE        : '0006: BAD_FORMAT_OF_STYLE_IN_ATTRIBUTE',
                    ONLY_ONE_MODEL_REF_CAN_BE_IN_STYLE_PROP : '0007: ONLY_ONE_MODEL_REF_CAN_BE_IN_STYLE_PROP',
                    FAIL_TO_LOAD_PATTERN_IN_COMPONENT       : '0008: FAIL_TO_LOAD_PATTERN_IN_COMPONENT',
                },
                pattern     : {
                    CANNOT_FIND_SOURCE_OF_TEMPLATE          : '1000:CANNOT_FIND_SOURCE_OF_TEMPLATE',
                    CANNOT_DETECT_HOOK_VALUE                : '1001:CANNOT_DETECT_HOOK_VALUE',
                    CANNOT_DETECT_HOOK_ANCHOR               : '1002:CANNOT_DETECT_HOOK_ANCHOR',
                    TEXT_HOOK_VALUE_CANBE_ONLY_TEXT         : '1003:TEXT_HOOK_VALUE_CANBE_ONLY_TEXT',
                    CANNOT_DETECT_HTML                      : '1004:CANNOT_DETECT_HTML',
                    CANNOT_DETECT_BEGIN_OR_END_HOOK_ANC     : '1005:CANNOT_DETECT_BEGIN_OR_END_HOOK_ANC',
                },
                caller      : {
                    CANNOT_INIT_PATTERN                     : '3000:CANNOT_INIT_PATTERN',
                },
                controller  : {
                    CONTROLLER_DEFINED_MORE_THAN_ONCE       : '4000:CONTROLLER_DEFINED_MORE_THAN_ONCE',
                },
                layout      : {
                    PATTERN_SRC_DEFINED_TWICE_OR_MORE       : '5000:PATTERN_SRC_DEFINED_TWICE_OR_MORE',
                    PATTERN_SRC_OR_NAME_IS_TOO_SHORT        : '5001:PATTERN_SRC_OR_NAME_IS_TOO_SHORT',
                    HOOK_SRC_DEFINED_TWICE_OR_MORE          : '5002:HOOK_SRC_DEFINED_TWICE_OR_MORE',
                    HOOK_SRC_OR_NAME_IS_TOO_SHORT           : '5003:HOOK_SRC_OR_NAME_IS_TOO_SHORT',
                    HOOK_CANNOT_BE_DEFINED_WITH_OTHER_TAGS  : '5004:HOOK_CANNOT_BE_DEFINED_WITH_OTHER_TAGS',
                },
                url         : {
                    URL_SHOULD_BE_DEFINED_AS_STRING         : '6000:URL_SHOULD_BE_DEFINED_AS_STRING',
                }
            };
            //Classes implementations
            //BEGIN: source class ===============================================
            Source          = {
                proto       : function (privates) {
                    var self        = this,
                        load        = null,
                        parse       = null,
                        process     = null,
                        resources   = null,
                        html        = null,
                        get         = null,
                        processing  = null,
                        component   = null,
                        callback    = null,
                        signature   = null,
                        returning   = null;
                    load        = function (success, fail) {
                        var perf_id     = null,
                            ajax        = null,
                            storaged    = null;
                        if (privates.html === null) {
                            storaged = storage.get(self.url);
                            if (storaged !== null && config.get().USE_STORAGE_HTML === true) {
                                process(storaged, success, fail);
                            } else {
                                perf_id = measuring.measure();
                                ajax    = flex.ajax.send(
                                    self.url,
                                    flex.ajax.methods.GET,
                                    null,
                                    {
                                        success : function (response, request) {
                                            measuring.measure(perf_id, 'loading sources for (' + self.url + ')');
                                            process(response.original, success, fail);
                                        },
                                        fail    : function (response, request) {
                                            measuring.measure(perf_id, 'loading sources for (' + self.url + ')');
                                            flex.logs.log(signature() + logs.source.FAIL_TO_LOAD_TEMPLATE, flex.logs.types.CRITICAL);
                                            callback(fail);
                                            throw logs.source.FAIL_TO_LOAD_TEMPLATE;
                                        },
                                    }
                                );
                                ajax.send();
                            }
                        } else {
                            flex.logs.log(signature() + logs.source.TEMPLATE_WAS_LOADED, flex.logs.types.NOTIFICATION);
                        }
                        return true;
                    };
                    parse       = {
                        URLs: function (hrefs) {
                            var baseURL = flex.system.url.restore(self.url);
                            if (baseURL !== null) {
                                hrefs = hrefs.map(function (href) {
                                    var url = flex.system.url.parse(href, baseURL);
                                    return (url !== null ? url.url : false);
                                });
                                hrefs = hrefs.filter(function (href) {
                                    return (href !== false ? true : false);
                                });
                            }
                            return hrefs;
                        },
                        html: function (html, success, fail) {
                            var regs = settings.regs,
                                body = html.match(regs.BODY);
                            if (body !== null) {
                                if (body.length === 1) {
                                    privates.html       = body[0].replace(regs.BODY_TAG, '').replace(regs.BODY_CLEAR, '');
                                    privates.original   = html;
                                    if (!component.getSRCs()) {
                                        processing.procced();
                                        success();
                                    } else {
                                        component.load(success);
                                    }
                                    return true;
                                }
                            }
                            privates.html = null;
                            fail();
                            return false;
                        },
                        css : function () {
                            var regs    = settings.regs,
                                links   = privates.original !== null ? privates.original.match(regs.CSS) : null,
                                hrefs   = [];
                            if (links !== null) {
                                Array.prototype.forEach.call(
                                    links,
                                    function (link) {
                                        function validate(link) {
                                            var rel     = link.search(regs.CSS_REL),
                                                type    = link.search(regs.CSS_TYPE);
                                            if (rel > 0 && type > 0) {
                                                return true;
                                            }
                                            return false;
                                        };
                                        var href    = link.match(regs.CSS_HREF),
                                            str     = null;
                                        if (validate(link) !== false && href !== null) {
                                            if (href.length === 1) {
                                                str = href[0].match(regs.STRING);
                                                if (str !== null) {
                                                    if (str.length === 1) {
                                                        hrefs.push(str[0].replace(regs.STRING_BORDERS, ''));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                );
                            }
                            privates.css = parse.URLs(hrefs);
                        },
                        js  : function () {
                            var regs    = settings.regs,
                                links   = privates.original !== null ? privates.original.match(regs.JS) : null,
                                hrefs   = [];
                            if (links !== null) {
                                Array.prototype.forEach.call(
                                    links,
                                    function (link) {
                                        function validate(link) {
                                            var type = link.search(regs.JS_TYPE);
                                            if (type > 0) {
                                                return true;
                                            }
                                            return false;
                                        };
                                        var src = link.match(regs.JS_SRC),
                                            str = null;
                                        if (validate(link) !== false && src !== null) {
                                            if (src.length === 1) {
                                                str = src[0].match(regs.STRING);
                                                if (str !== null) {
                                                    if (str.length === 1) {
                                                        hrefs.push(str[0].replace(regs.STRING_BORDERS, ''));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                );
                            }
                            privates.js = parse.URLs(hrefs);
                        },
                    };
                    process     = function (response, success, fail) {
                        function load(storaged) {
                            resources.css.load(function () {
                                resources.js.load(
                                    function () {
                                        if (!storaged) {
                                            storage.add(self.url, {
                                                original: privates.original,
                                                html    : privates.html,
                                                js      : privates.js,
                                                css     : privates.css,
                                                map     : privates.map,
                                                flags   : privates.flags
                                            });
                                        }
                                        component
                                        callback(success);
                                    },
                                    function () {
                                        callback(fail);
                                    }
                                );
                            });
                        };
                        if (typeof response === 'string') {
                            parse.html(
                                response,
                                function () {
                                    parse.js();
                                    parse.css();
                                    load(false);
                                },
                                function () {
                                    flex.logs.log(signature() + logs.source.FAIL_TO_PARSE_TEMPLATE, flex.logs.types.NOTIFICATION);
                                    callback(fail);
                                }
                             );
                        } else if (typeof response === 'object') {
                            privates.original   = response.original;
                            privates.html       = response.html;
                            privates.js         = response.js;
                            privates.css        = response.css;
                            privates.map        = response.map;
                            privates.flags      = response.flags;
                            load(true);
                        }
                    };
                    resources   = {
                        css : {
                            load: function (success) {
                                var journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CSS_ATTACHED_JOURNAL, {}),
                                    register_id = flex.unique();
                                if (privates.css !== null && privates.css.length > 0) {
                                    flex.overhead.register.open(register_id, privates.css, success);
                                    Array.prototype.forEach.call(
                                        privates.css,
                                        function (url) {
                                            var storaged    = null,
                                                perf_id     = null;
                                            if (!journal[url]) {
                                                journal[url]    = true;
                                                storaged        = storage.get(url);
                                                if (storaged === null || config.get().USE_STORAGE_CSS === false) {
                                                    perf_id = measuring.measure();
                                                    flex.resources.attach.css.connect(
                                                        url,
                                                        function (url) {
                                                            var cssText = flex.resources.parse.css.stringify(url);
                                                            if (cssText !== null) {
                                                                storage.add(url, cssText);
                                                            }
                                                            if (register_id !== null) {
                                                                flex.overhead.register.done(register_id, url);
                                                            }
                                                            measuring.measure(perf_id, 'loading resources for (' + self.url + '):: ' + url);
                                                        }
                                                    );
                                                } else {
                                                    flex.resources.attach.css.adoption(storaged, null, url);
                                                    flex.overhead.register.done(register_id, url);
                                                    storage.add(url, storaged);
                                                }
                                            } else {
                                                flex.overhead.register.done(register_id, url);
                                            }
                                        }
                                    );
                                } else {
                                    callback(success);
                                }
                            },
                        },
                        js  : {
                            load    : function (success, fail) {
                                var journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.JS_ATTACHED_JOURNAL, {}),
                                    register_id = flex.unique();
                                if (privates.js !== null && privates.js.length > 0) {
                                    flex.overhead.register.open(register_id, privates.js, success);
                                    Array.prototype.forEach.call(
                                        privates.js,
                                        function (url) {
                                            var storaged    = null,
                                                perf_id     = null,
                                                _success    = function _success() {
                                                    flex.overhead.register.done(register_id, url);
                                                    var request = flex.ajax.send(
                                                        url,
                                                        flex.ajax.methods.GET,
                                                        null,
                                                        {
                                                            success: function (response, request) {
                                                                storage.add(url, response.original);
                                                            },
                                                        }
                                                    );
                                                    request.send();
                                                    measuring.measure(perf_id, 'loading resources for (' + self.url + '):: ' + url);
                                                },
                                                _fail       = function _fail() {
                                                    flex.logs.log(signature() + logs.source.FAIL_TO_LOAD_JS_RESOURCE, flex.logs.types.CRITICAL);
                                                    measuring.measure(perf_id, 'loading resources for (' + self.url + '):: ' + url);
                                                    callback(fail);
                                                    throw logs.source.FAIL_TO_LOAD_JS_RESOURCE;
                                                };
                                            if (journal[url] === void 0) {
                                                controllers.references.assign(url, self.url);
                                                journal[url]    = true;
                                                storaged        = storage.get(url);
                                                if (storaged === null || config.get().USE_STORAGE_JS === false) {
                                                    perf_id = measuring.measure();
                                                    if (Source.resource.isIn(url)) {
                                                        if (Source.resource.isDone(url)) {
                                                            flex.overhead.register.done(register_id, url);
                                                        } else {
                                                            Source.resource.add(url, function () {
                                                                flex.overhead.register.done(register_id, url);
                                                            });
                                                        }
                                                    } else {
                                                        Source.resource.add(url, _success);
                                                        flex.resources.attach.js.connect(url, function () {
                                                            Source.resource.done(url);
                                                        }, _fail);
                                                    }
                                                } else {
                                                    controllers.current.set(url);
                                                    flex.resources.attach.js.adoption(storaged, function () {
                                                        flex.overhead.register.done(register_id, url);
                                                        controllers.current.reset(url);
                                                    });
                                                    storage.add(url, storaged);
                                                }
                                            } else {
                                                if (Source.resource.isDone(url)) {
                                                    flex.overhead.register.done(register_id, url);
                                                } else {
                                                    Source.resource.add(url, function () {
                                                        flex.overhead.register.done(register_id, url);
                                                    });
                                                }
                                            }
                                        }
                                    );
                                } else {
                                    callback(success);
                                }
                            },
                        }
                    };
                    callback    = function (callback) {
                        if (typeof callback === 'function') {
                            callback.call(privates.__instance, self.url, self.original_url, privates.__instance);
                        }
                    };
                    component   = {
                        getSRCs     : function () {
                            function find(nodes, hooks) {
                                Array.prototype.forEach.call(nodes, function (node) {
                                    var src         = node.getAttribute(config.get().PATTERN_SRC),
                                        nodeName    = null;
                                    if (src !== null && src !== '') {
                                        !~privates.srcs.indexOf(src) && privates.srcs.push(src);
                                        nodeName = node.nodeName.toLowerCase();
                                        if (nodeName === config.get().PATTERN_NODE) {
                                            hooks.src   = src;
                                            hooks.hooks = {};
                                            node.children !== void 0 && find(node.children, hooks.hooks);
                                        } else {
                                            hooks[nodeName] = {
                                                src     : src,
                                                hooks   : {}
                                            };
                                            node.children !== void 0 && find(node.children, hooks[nodeName].hooks);
                                        }
                                    }
                                });
                            };
                            var node = document.createElement('DIV');
                            node.innerHTML          = privates.html;
                            privates.srcs           = [];
                            privates.map.component  = {};
                            find(node.children, privates.map.component);
                            privates.srcs.length === 0 && (privates.map.component   = null);
                            privates.srcs.length === 0 && (privates.srcs            = null);
                            return privates.srcs !== null;
                        },
                        load        : function (success) {
                            Source.init(privates.srcs, success, component.onFail);
                        },
                        onFail      : function () {
                            var SourceError = function () {
                                    this.urls       = privates.srcs;
                                    this.code       = logs.source.FAIL_TO_LOAD_PATTERN_IN_COMPONENT;
                                    this.message    = signature() + logs.source.FAIL_TO_LOAD_PATTERN_IN_COMPONENT + ':: URLs = ' + JSON.stringify(privates.srcs);
                                },
                                error = new SourceError();
                            flex.logs.log(error.message, flex.logs.types.CRITICAL);
                            throw error;
                        },
                    },
                    processing  = {
                        map         : {
                            getting : function (match, clear, dest, indexes) {
                                var refs    = privates.html.match(match),
                                    map     = {};
                                if (refs instanceof Array) {
                                    refs.forEach(function (ref) {
                                        ref = ref.replace(clear, '');
                                        ref = ref.split(',');
                                        if (ref instanceof Array) {
                                            ref.forEach(function (ref) {
                                                map[ref] = indexes ? (map[ref] === void 0 ? 1 : map[ref] += 1) : true;
                                            });
                                        }
                                    });
                                }
                                privates.map[dest] = map;
                            },
                            model   : function () {
                                processing.map.getting(settings.regs.MODEL, settings.regs.MODEL_BORDERS, 'model', false);
                            },
                            dom     : function () {
                                processing.map.getting(settings.regs.DOM, settings.regs.DOM_BORDERS, 'dom', true);
                            }
                        },
                        binding     : {
                            model: function () {
                                function processing(map){
                                    var binds = {};
                                    _object(map).forEach(function (prop, value) {
                                        var _prop = settings.other.BIND_PREFIX + prop;
                                        if (typeof value === 'object') {
                                            binds[prop] = processing(value);
                                        } else if (value === true) {
                                            Object.defineProperty(binds, prop, {
                                                get         : function(){
                                                    return this[_prop].val;
                                                },
                                                set         : function (val) {
                                                    var prev = this[_prop].val;
                                                    this[_prop].val = val;
                                                    this[_prop].handle(val, prev);
                                                },
                                                configurable: true,
                                                enumerable  : true
                                            });
                                            binds[_prop] = {
                                                val     : '',
                                                handles : {},
                                                bind    : function (handle) {
                                                    var id = null;
                                                    if (typeof handle === 'function') {
                                                        id = flex.unique();
                                                        this.handles[id] = handle;
                                                    }
                                                    return id;
                                                },
                                                unbind  : function (id) {
                                                    if (this.handles[id] !== void 0) {
                                                        delete this.handles[id];
                                                        return true;
                                                    }
                                                    return false;
                                                },
                                                handle  : function (current, previous) {
                                                    _object(this.handles).forEach(function (id, handle) {
                                                        handle(current, previous);
                                                    });
                                                }
                                            };
                                            binds[_prop].bind.bind(binds[_prop]);
                                            binds[_prop].unbind.bind(binds[_prop]);
                                            binds[_prop].handle.bind(binds[_prop]);
                                        }
                                    });
                                    return binds;
                                };
                                var model               = privates.binding.model === null ? (privates.map.model !== null ? processing(privates.map.model) : null) : privates.binding.model;
                                privates.binding.model  = model;
                                return model;
                            }
                        },
                        attrs       : {
                            parse       : function (str) {
                                var parts = str.split('=');
                                return {
                                    name    : parts[0].replace(/\s/gi, ''),
                                    value   : (parts[1].replace(/^\s*|\s*$/gi, '')).replace(/(^"|"$)|(^'|'$)/gi, '')
                                };
                            },
                            parseStyle  : function (value) {
                                var props   = value.split(';'),
                                    res     = [];
                                props.forEach(function (prop) {
                                    var id      = flex.unique(),
                                        prop    = prop.replace(/::/gi, id),
                                        parts   = prop.split(':');
                                    if (prop !== '') {
                                        if (parts.length === 2) {
                                            res.push({
                                                name : parts[0].replace(/\s/, ''),
                                                value: parts[1].replace(/^\s*|\s*$/, '').replace(new RegExp(id, 'gi'), '::')
                                            });
                                        } else {
                                            flex.logs.log(signature() + logs.source.BAD_FORMAT_OF_STYLE_IN_ATTRIBUTE + '. Style value in attr: (' + value + ')', flex.logs.types.WARNING);
                                        }
                                    }
                                });
                                return res;
                            }
                        },
                        prepare     : function(){
                            privates.html = privates.html.replace(settings.regs.LINES, '');
                        },
                        fix         : function(){
                            var all = privates.html.match(settings.regs.ALL);
                            if (all instanceof Array) {
                                all.forEach(function (elem) {
                                    privates.html = privates.html.replace(elem, elem.replace(/\s|\t|\r|\n/gi, ''));
                                });
                            }
                        },
                        tags        : {
                            get     : function () {
                                var result = null;
                                if (self.tags === void 0) {
                                    result      = privates.html.match(settings.regs.TAGS);
                                    result      = result instanceof Array ? result : [];
                                    self.tags   = [];
                                    result.forEach(function (tag) {
                                        self.tags.push({
                                            org: tag,
                                            mod: tag
                                        });
                                    });
                                }
                                return self.tags;
                            },
                            accept  : function () {
                                if (self.tags instanceof Array) {
                                    self.tags.forEach(function (tag) {
                                        privates.html = privates.html.replace(tag.org, tag.mod);
                                    });
                                }
                            }
                        },
                        hooks       : {
                            inAttrs: function (){
                                var tags = processing.tags.get(),
                                    regs = settings.regs;
                                tags.forEach(function (tag, index) {
                                    var attrs = null;
                                    if (helpers.testReg(regs.HOOK, tag.mod)) {
                                        attrs = tag.mod.match(regs.ATTRS);
                                        if (attrs instanceof Array) {
                                            attrs.forEach(function (attr) {
                                                var hooks = attr.match(regs.HOOK),
                                                    _attr = attr;
                                                if (hooks instanceof Array) {
                                                    hooks.forEach(function (hook) {
                                                        var _hook = hook.replace(regs.HOOK_BORDERS, '');
                                                        _attr = _attr.replace(hook, regs.HOOK_OPEN_STR + settings.other.PARENT_MARK_HTML + _hook + regs.HOOK_CLOSE_STR);
                                                    });
                                                    tag.mod = tag.mod.replace(attr, _attr);
                                                }
                                            });
                                        }
                                    }
                                });
                            },
                            inNodes: function () {
                                var regs            = settings.regs,
                                    contents        = privates.html.match(regs.INSIDE_TAG);
                                if (contents instanceof Array) {
                                    contents.forEach(function (content) {
                                        var hooks       = privates.html.match(regs.HOOK),
                                            _content    = content;
                                        if (hooks instanceof Array) {
                                            hooks.forEach(function (hook) {
                                                var _hook       = hook.replace(regs.HOOK_BORDERS, ''),
                                                    com_open    = '<!--' + settings.other.HOOK_COM_BEGIN + settings.other.PARENT_MARK_HTML + _hook + '-->',
                                                    com_close   = '<!--' + settings.other.HOOK_COM_END + settings.other.PARENT_MARK_HTML + _hook + '-->';
                                                _content = _content.replace(hook, com_open + regs.HOOK_OPEN_STR + settings.other.PARENT_MARK_HTML + _hook + regs.HOOK_CLOSE_STR + com_close);
                                            });
                                            privates.html = privates.html.replace(content, _content);
                                        }
                                    });
                                }
                            },
                            find: function () {
                                var regs    = settings.regs,
                                    hooks   = privates.html.match(regs.HOOK);
                                if (hooks instanceof Array) {
                                    hooks.forEach(function (hook) {
                                        var _hook = hook.replace(regs.HOOK_BORDERS, '');
                                        privates.html = privates.html.replace(hook, regs.HOOK_OPEN_STR + settings.other.PARENT_MARK_HTML + _hook + regs.HOOK_CLOSE_STR);
                                    });
                                }
                            }
                        },
                        dom         : {
                            find: function () {
                                var tags = processing.tags.get(),
                                    regs = settings.regs;
                                tags.forEach(function (tag, index) {
                                    var dom     = tag.mod.match(regs.DOM),
                                        marks   = [];
                                    if (dom instanceof Array) {
                                        dom.forEach(function (_dom) {
                                            var mark = _dom.replace(regs.DOM_BORDERS, '').split(',');
                                            marks = marks.concat(mark.filter(function (val) { return val !== '' ? true : false }));
                                        });
                                        (function () {
                                            var history = [];
                                            marks = marks.filter(function (val) {
                                                if (history.indexOf(val) === -1) {
                                                    history.push(val);
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            });
                                        }());
                                        marks = marks.map(function (val) {
                                            return settings.other.PARENT_MARK_HTML + val;
                                        });
                                        if (tag.tag === void 0) {
                                            tag.tag = tag.mod.match(regs.OPEN_TAG)[0];
                                        }
                                        tag.mod = tag.mod.replace(regs.DOM, '');
                                        tag.mod = tag.mod.replace(tag.tag, tag.tag + ' ' + settings.css.attrs.DOM + '="' + marks.join(',') + '" ');
                                    }
                                });
                            }
                        },
                        model       : {
                            inAttrs: function (){
                                var tags = processing.tags.get(),
                                    regs = settings.regs;
                                tags.forEach(function (tag, index) {
                                    var scheme  = {},
                                        attrs   = null;
                                    if (helpers.testReg(regs.MODEL, tag.mod)) {
                                        attrs = tag.mod.match(regs.ATTRS);
                                        if (attrs instanceof Array) {
                                            attrs.forEach(function (attr) {
                                                var _attr   = null,
                                                    models  = null,
                                                    styles  = null;
                                                if (helpers.testReg(regs.MODEL, attr)) {
                                                    _attr   = processing.attrs.parse(attr);
                                                    if (_attr.name === 'style') {
                                                        styles = processing.attrs.parseStyle(_attr.value);
                                                        styles.forEach(function (pair) {
                                                            models = pair.value.match(regs.MODEL);
                                                            if (models instanceof Array) {
                                                                if (models.length > 1) {
                                                                    flex.logs.log(signature() + logs.source.ONLY_ONE_MODEL_REF_CAN_BE_IN_STYLE_PROP + '. HTML fragment: (' + tag.mod + '), Style prop: (' + pair.value + ')', flex.logs.types.WARNING);
                                                                }
                                                                models                          = models[0];
                                                                scheme['style.' + pair.name]    = settings.other.PARENT_MARK_HTML + models.replace(regs.MODEL_BORDERS, '');
                                                            }
                                                        });
                                                    } else {
                                                        models = _attr.value.match(regs.MODEL);
                                                        if (models instanceof Array) {
                                                            if (models.length > 1) {
                                                                flex.logs.log(signature() + logs.source.ONLY_ONE_MODEL_REF_CAN_BE_IN_ATTR + '. HTML fragment: (' + tag.mod + '), Attr: (' + _attr.name + ')', flex.logs.types.WARNING);
                                                            }
                                                            models              = models[0];
                                                            scheme[_attr.name]  = settings.other.PARENT_MARK_HTML + models.replace(regs.MODEL_BORDERS, '');
                                                        }
                                                    }
                                                    tag.mod = tag.mod.replace(attr, '');
                                                }
                                            });
                                        }
                                        if (Object.keys(scheme).length > 0) {
                                            if (tag.tag === void 0) {
                                                tag.tag = tag.mod.match(regs.OPEN_TAG)[0];
                                            }
                                            tag.mod                     = tag.mod.replace(tag.tag, tag.tag + ' ' + settings.css.attrs.MODEL + "='" + JSON.stringify(scheme) + "' ");
                                            privates.flags.has_model    = true;
                                        }
                                    }
                                });
                            },
                            inNodes: function () {
                                var regs        = settings.regs,
                                    contents    = privates.html.match(regs.INSIDE_TAG);
                                if (contents instanceof Array) {
                                    contents.forEach(function (content) {
                                        var elems       = null,
                                            _content    = content;
                                        if (helpers.testReg(regs.MODEL, content)) {
                                            elems = _content.match(regs.MODEL);
                                            elems.forEach(function (elem) {
                                                var _elem = elem.replace(regs.MODEL_BORDERS, '');
                                                _elem = regs.MODEL_OPEN_STR + settings.other.PARENT_MARK_HTML + _elem + regs.MODEL_CLOSE_STR;
                                                _content = _content.replace(elem, '<span class="' + settings.css.classes.MODEL_NODE + '" style="display:none;">' + _elem + '</span>');
                                            });
                                            privates.html = privates.html.replace(content, _content);
                                            if (elems.length > 0) {
                                                privates.flags.has_model = true;
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        conditions  : {
                            find    : function () {
                                var conditions  = privates.html.match(settings.regs.CONDITIONS),
                                    names       = [],
                                    html        = privates.html,
                                    attrs       = null,
                                    con_strict  = null;
                                if (conditions instanceof Array) {
                                    privates.map.conditions = {};
                                    conditions = conditions.map(function (condition) {
                                        var value   = condition.replace(settings.regs.COMMENT_BORDERS, ''),
                                            name    = value.split('=')[0];
                                        if (names.indexOf(name) === -1) { names.push(name); }
                                        privates.map.conditions[value] = privates.map.conditions[value] === void 0 ? 1 : privates.map.conditions[value] + 1;
                                        return {
                                            value       : value,
                                            name        : name,
                                            content     : '',
                                            corrected   : ''
                                        };
                                    });
                                    conditions.forEach(function (condition) {
                                        var content = html.match(
                                                new RegExp(settings.regs.CONDITION_CONTENT.
                                                    replace('[open]', condition.value).
                                                    replace('[close]', condition.name), 'gi')
                                            );
                                        if (content instanceof Array) {
                                            condition.content   = content;
                                            condition.corrected = content;
                                            content.forEach(function (content, index) {
                                                var tags = content.match(settings.regs.OPEN_TAG);
                                                if (tags instanceof Array) {
                                                    tags = (function (tags) {
                                                        var history = {};
                                                        return tags.filter(function (tag) {
                                                            if (history[tag] === void 0) {
                                                                history[tag] = true;
                                                                return true;
                                                            } else {
                                                                return false;
                                                            }
                                                        });
                                                    }(tags));
                                                    tags.forEach(function (tag) {
                                                        condition.corrected[index] = condition.corrected[index].replace(new RegExp(tag, 'gi'), tag + ' ' + settings.css.attrs.CONDITION + '="' + settings.other.PARENT_MARK_HTML + condition.value + '"');
                                                    });
                                                    html = html.replace(content, condition.corrected[index]);
                                                }
                                            });
                                        }
                                    });
                                    attrs = html.match(new RegExp('(' + settings.css.attrs.CONDITION + '=' + settings.regs.STRING_CON_STRICT + '\\s?){1,}', 'gi'));
                                    if (attrs instanceof Array) {
                                        con_strict = new RegExp(settings.css.attrs.CONDITION + '=' + settings.regs.STRING_CON_STRICT, 'gi');
                                        attrs.forEach(function (attr) {
                                            var valid   = attr.match(con_strict),
                                                _attr   = valid.join(' '),
                                                values  = _attr.match(settings.regs.STRING_CON),
                                                value   = '';
                                            if (values instanceof Array && values.length > 1) {
                                                values.reverse().forEach(function (val, index) {
                                                    value += val.replace(settings.regs.STRING_BORDER_CON, '') + (index < values.length - 1 ? ',' : '');
                                                });
                                                html = html.replace(_attr, settings.css.attrs.CONDITION + '="' + value + '"');
                                            }
                                        });
                                    }
                                    conditions.forEach(function (condition) {
                                        var reg = new RegExp('<\\!--' + condition.name, 'gi');
                                        html = html.replace(reg, '<!--' + settings.other.PARENT_MARK_HTML + condition.name);
                                    });
                                    if (conditions.length > 0) {
                                        privates.flags.has_conditions = true;
                                    }
                                    /*
                                    html = html.replace(settings.regs.CONDITIONS, '');
                                    names.forEach(function (name) {
                                        html = html.replace(new RegExp(settings.regs.CON_CLOSE_STR.replace('[name]', name), 'gi'), '');
                                    });
                                    */
                                    privates.html = html;
                                }
                            },
                        },
                        events      : {
                            find: function () {
                                var tags        = processing.tags.get(),
                                    regs        = settings.regs,
                                    all         = [],
                                    hash        = helpers.getHash(self.url).replace('-', '0'),
                                    ID_index    = 0;
                                tags.forEach(function (tag, index) {
                                    var attrs   = tag.mod.match(regs.EVENT_ATTR),
                                        events  = [];
                                    if (attrs instanceof Array) {
                                        attrs.forEach(function (attr) {
                                            var content = attr.replace(regs.EVENT_BORDERS, '').replace(/["']/gi, '').split('=');
                                            content.length === 2 && events.push({
                                                event   : content[0].replace(/^on/i, ''),
                                                handle  : content[1],
                                                id      : hash + ID_index++,
                                                attr    : attr
                                            });
                                        });
                                        (function () {
                                            var history = [];
                                            events = events.filter(function (val) {
                                                if (history.indexOf(val.event) === -1) {
                                                    history.push(val.event);
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            });
                                        }());
                                        events.forEach(function (event) {
                                            tag.mod = tag.mod.replace(event.attr, regs.DOM_OPEN_STR + event.id + regs.DOM_CLOSE_STR);
                                        });
                                        privates.html   = privates.html.replace(tag.org, tag.mod);
                                        tag.org         = tag.mod;
                                        all             = all.concat(events);
                                    }
                                });
                                privates.map.events = all;
                            }
                        },
                        procced     : function (){
                            processing.prepare();
                            processing.fix();
                            processing.hooks.inAttrs();
                            processing.hooks.inNodes();
                            processing.events.find();
                            processing.map.model();
                            processing.map.dom();
                            processing.conditions.find();
                            processing.model.inNodes();
                            processing.model.inAttrs();
                            processing.dom.find();
                            processing.tags.accept();
                        },
                    };
                    html        = {
                        get             : function (parent) {
                            var _html       = privates.html,
                                parent      = typeof parent === 'string' ? parent : false,
                                no_parent   = '__no_parent__';
                            if (parent !== false) {
                                if (privates.cache.html[parent] === void 0) {
                                    _html                       = _html.replace(new RegExp(settings.other.PARENT_MARK_HTML, 'gi'), parent + '.');
                                    privates.cache.html[parent] = _html;
                                } else {
                                    _html = privates.cache.html[parent];
                                }
                            } else {
                                if (privates.cache.html[no_parent] === void 0) {
                                    _html = _html.replace(new RegExp(settings.other.PARENT_MARK_HTML, 'gi'), '');
                                    privates.cache.html[no_parent] = _html;
                                } else {
                                    _html = privates.cache.html[no_parent];
                                }
                            }
                            return _html;
                        }
                    };
                    signature   = function () {
                        return logs.SIGNATURE + ':: pattern (' + self.url + ')';
                    };
                    returning   = {
                        load    : load,
                        html    : html.get,
                        map     : function () { return privates.map;},
                        flags   : function () { return privates.flags;},
                    };
                    return {
                        load    : returning.load,
                        html    : returning.html,
                        map     : returning.map,
                        binding : {
                            model : processing.binding.model
                        },
                        flags   : returning.flags
                    };
                },
                instance    : function (parameters) {
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',  type: 'string'              },
                                                                { name: 'html', type: 'string', value: null },
                                                                { name: 'css',  type: 'array',  value: null },
                                                                { name: 'js',   type: 'array',  value: null }]) !== false) {
                        return _object({
                            parent          : settings.classes.SOURCE,
                            constr          : function () {
                                this.url            = flex.system.url.restore(parameters.url);
                                this.original_url   = parameters.url;
                            },
                            privates        : {
                                original: null,
                                html    : parameters.html,
                                css     : parameters.css,
                                js      : parameters.js,
                                map     : {
                                    model       : null,
                                    dom         : null,
                                    conditions  : null,
                                    events      : null,
                                    component   : null
                                },
                                binding : {
                                    model   : null
                                },
                                cache   : {
                                    html    : {},
                                    regs    : {}
                                },
                                flags   : {
                                    has_model       : false,
                                    has_conditions  : false
                                }
                            },
                            prototype       : Source.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                },
                storage     : {
                    add: function (url, instance) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERN_SOURCES, {});
                        if (storage[url] === void 0) {
                            storage[url] = instance;
                        }
                    },
                    get: function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERN_SOURCES, {});
                        return storage[url] !== void 0 ? storage[url] : null;
                    },
                },
                resource    : {
                    add : function (url, callback) {
                        Source.resource.data === void 0 && (Source.resource.data = {});
                        if (Source.resource.data[url] === void 0) {
                            Source.resource.data[url] = { handles : [], status: false };
                        }
                        Source.resource.data[url].handles.push(callback);
                    },
                    done: function (url) {
                        Source.resource.data        === void 0 && (Source.resource.data             = {});
                        Source.resource.data[url]   !== void 0 && (Source.resource.data[url].status = true);
                        _object(Source.resource.data).forEach(function (url, source) {
                            if (source.status) {
                                source.handles.forEach(function (callback) {
                                    callback();
                                });
                                source.handles  = [];
                            }
                        });
                    },
                    isDone: function (url) {
                        Source.resource.data === void 0 && (Source.resource.data = {});
                        return Source.resource.data[url] !== void 0 ? Source.resource.data[url].status : false;
                    },
                    isIn: function (url) {
                        Source.resource.data === void 0 && (Source.resource.data = {});
                        return Source.resource.data[url] !== void 0;
                    }
                },
                init        : function (url, success, fail) {
                    var urls        = url instanceof Array ? url : [url],
                        journal     = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {}),
                        register_id = flex.unique(),
                        sources     = [],
                        is_failed   = false;
                    flex.overhead.register.open(register_id, urls, function () {
                        if (typeof success === 'function' && !is_failed) {
                            success(sources);
                        } else {
                            flex.system.handle(fail);
                        }
                    });
                    urls.forEach(function (url) {
                        var instance = Source.storage.get(url);
                        if (instance !== null) {
                            sources.push(instance);
                            flex.overhead.register.done(register_id, url);
                        } else {
                            instance = Source.instance({ url: url });
                            instance.load(
                                function (_url, _original_url, _instance) {
                                    sources.push                (_instance);
                                    Source.storage.add          (_original_url, _instance);
                                    flex.overhead.register.done (register_id, _original_url);
                                },
                                function (_url, _original_url, _instance) {
                                    is_failed = true;
                                    flex.overhead.register.done(register_id, _original_url);
                                }
                            );
                        }
                    });
                }
            };
            //END: source class ===============================================
            Pattern         = {
                proto   : function (privates) {
                    var self        = this,
                        html        = null,
                        model       = null,
                        dom         = null,
                        mapping     = null,
                        hooks       = null,
                        condition   = null,
                        controller  = null,
                        build       = null,
                        cache       = null,
                        methods     = null,
                        signature   = null,
                        returning   = null,
                        hash        = null,
                        consts      = {
                            maps: {
                                MODEL   : 'model',
                                DOM     : 'dom',
                            }
                        };
                    mapping     = {
                        get     : function(type){
                            function getMap(url, hooks) {
                                function proccess(_hooks, dest) {
                                    _object(_hooks).forEach(function (name, inst) {
                                        if (inst instanceof settings.classes.CALLER) {
                                            dest[settings.other.SUBLEVEL_BEGIN + name + settings.other.SUBLEVEL_END] = getMap(inst.url, inst.hooks);
                                        } else if (typeof inst === 'object' && inst !== null) {
                                            dest[name] = {};
                                            proccess(inst, dest[name]);
                                        }
                                    });
                                };
                                var defmap  = cache[url] === void 0 ? Source.storage.get(url).map()[type] : cache[url],
                                    map     = [];
                                cache[url] = defmap;
                                if (hooks !== null) {
                                    hooks.forEach(function (_hooks) {
                                        var _map = _object(defmap).copy();
                                        proccess(_hooks, _map);
                                        map.push(_map);
                                    });
                                } else {
                                    map.push(_object(defmap).copy());
                                }
                                return map;
                            };
                            var cache = {};
                            return getMap(self.url, privates.hooks);
                        },
                        refs    : function () {
                            function setValue(obj, path, val, caller) {
                                var parts = path.split('.');
                                parts.forEach(function (part, index) {
                                    var src = null;
                                    if (index < parts.length - 1) {
                                        obj[part] === void 0 && (obj[part] = { url: '', hooks: {}});
                                        obj = obj[part].hooks;
                                    } else {
                                        src         = Source.storage.get(val);
                                        obj[part]   = { 
                                            url         : val,
                                            hooks       : {},
                                            events      : src !== null ? src.map().events : null,
                                            controller  : controller.convert(caller.controller, val),
                                            path        : path
                                        };
                                    }
                                });
                            };
                            function process(hooks, path) {
                                if (helpers.isArray(hooks)) {
                                    hooks.forEach(function (hooks) {
                                        process(hooks, path);
                                    });
                                } else if (hooks instanceof settings.classes.CALLER) {
                                    if (cache[path] === void 0) {
                                        cache[path] = true;
                                        setValue(map, path, hooks.url, hooks);
                                    }
                                    process(hooks.hooks, path);
                                } else if (typeof hooks === 'object') {
                                    _object(hooks).forEach(function (prop, val) {
                                        process(val, (path !== '' ? (path + '.') : '') + prop);
                                    });
                                }
                            };
                            var map     = privates.caller.map,
                                cache   = {};
                            if (Object.keys(map).length === 0) {
                                map = defaultsmap.storage.get(self.url);
                                map === null && (map = {});
                            }
                            if (Object.keys(map).length === 0) {
                                process(privates.hooks, '');
                            }
                            privates.map.refs = {
                                url         : self.url,
                                hooks       : map,
                                events      : self.source.map().events,
                                controller  : privates.controller,
                                path        : ''
                            };
                        }
                    };
                    model       = {
                        nodes       : function (){
                            var nodes       = _nodes('.' + settings.css.classes.MODEL_NODE, false, privates.wrapper).target,
                                res         = {},
                                cache       = {};
                            if (nodes !== null && nodes.length > 0) {
                                Array.prototype.forEach.call(nodes, function (node) {
                                    var ref     = node.innerHTML,
                                        _ref    = cache[ref] !== void 0 ? cache[ref] : ref.replace(settings.regs.MODEL_BORDERS, ''),
                                        _node   = document.createTextNode('');
                                    cache[ref]  = _ref;
                                    res[_ref]   = res[_ref] === void 0 ? [] : res[_ref];
                                    node.parentNode.insertBefore(_node, node);
                                    node.parentNode.removeChild(node);
                                    res[_ref].push(_node);
                                });
                            }
                            return res;
                        },
                        attrs       : function (){
                            var nodes       = _nodes('*[' + settings.css.attrs.MODEL + ']', false, privates.wrapper).target,
                                res         = {},
                                cache       = {};
                            if (nodes !== null && nodes.length > 0) {
                                Array.prototype.forEach.call(nodes, function (node) {
                                    var attr    = node.getAttribute(settings.css.attrs.MODEL),
                                        scheme  = cache[attr] !== void 0 ? cache[attr] : JSON.parse(attr);
                                    cache[attr] = scheme;
                                    _object(scheme).forEach(function (attr, ref) {
                                        res[ref] = res[ref] === void 0 ? [] : res[ref];
                                        res[ref].push({
                                            node    : node,
                                            attr    : attr
                                        });
                                    });
                                    node.removeAttribute(settings.css.attrs.MODEL);
                                });
                            }
                            return res;
                        },
                        bind        : function (){
                            function isSubPattern(path) {
                                var refs    = privates.map.refs,
                                    parts   = path.split('.'),
                                    res     = true;
                                parts.forEach(function (part) {
                                    if (refs !== null && refs.hooks[part] !== void 0) {
                                        refs = refs.hooks[part];
                                    } else {
                                        res = false;
                                    }
                                });
                                return res;
                            };
                            function getMap(url, hooks, path) {
                                function proccess(_hooks, dest, path) {
                                    _object(_hooks).forEach(function (name, inst) {
                                        var ref = name;
                                        if (inst instanceof settings.classes.CALLER) {
                                            ref         = settings.other.SUBLEVEL_BEGIN + ref + settings.other.SUBLEVEL_END;
                                            dest[ref]   = getMap(inst.url, inst.hooks, path + (path === '' ? '' : '.') + ref);
                                        } else if (typeof inst === 'object' && inst !== null) {
                                            dest[ref]   = {};
                                            proccess(inst, dest[ref], path + (path === '' ? '' : '.') + ref);
                                        } else if (inst === null || inst === void 0) {
                                            if (isSubPattern((path !== '' ? path + '.' : '') + name)) {
                                                ref         = settings.other.SUBLEVEL_BEGIN + ref + settings.other.SUBLEVEL_END;
                                                dest[ref] = new ExArray();
                                            }
                                        }
                                    });
                                };
                                var defmap      = cache[url] === void 0 ? Source.storage.get(url).binding.model() : cache[url],
                                    map         = new ExArray(),
                                    bind_parent = privates.wrapper.children.length === 1 ? privates.wrapper.children[0] : null;
                                cache[url]  = defmap;
                                if (hooks !== null) {
                                    hooks.forEach(function (_hooks) {
                                        var _map = Object.create(defmap);
                                        flex.oop.objects.copy(defmap, _map);
                                        _object(_map).forEach(function (prop, val) {
                                            var _prop       = path + (path === '' ? '' : '.') + prop,
                                                attr        = null,
                                                default_val = null;
                                            if (nodes[_prop] !== void 0 && nodes[_prop].length > 0) {
                                                (function (node) {
                                                    _map[settings.other.BIND_PREFIX + prop].bind(function (current, previous) {
                                                        node.nodeValue = current;
                                                    });
                                                }(nodes[_prop][0]));
                                                nodes[_prop].splice(0, 1);
                                            }
                                            if (attrs[_prop] !== void 0 && attrs[_prop].length > 0) {
                                                attr = attrs[_prop][0].attr;
                                                (function (node) {
                                                    if (helpers.binds.isPossible(node, attr)) {
                                                        helpers.binds.assing(node, attr, function (event, getter, setter) {
                                                            var val = getter();
                                                            if (_map[prop] !== val) {
                                                                _map[prop] = val;
                                                            }
                                                        });
                                                    }
                                                    _map[settings.other.BIND_PREFIX + prop].bind(function (current, previous) {
                                                        var parts   = attr.split('.'),
                                                            dest    = node;
                                                        if (parts.length === 1) {
                                                            if (node.getAttribute(attr) !== current) {
                                                                node.setAttribute(attr, current);
                                                            }
                                                        } else if (parts.length === 1 && node[attr] !== void 0){
                                                            if (node[attr] !== current) {
                                                                node[attr] = current;
                                                            }
                                                        } else {
                                                            parts.forEach(function (part, index) {
                                                                if (index !== parts.length - 1) {
                                                                    dest = dest !== null ? (dest[part] !== void 0 ? dest[part] : null) : null;
                                                                } else if (dest !== null) {
                                                                    if (dest[part] !== void 0 && dest[part] !== current) {
                                                                        dest[part] = current;
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                    if (bind_parent !== null){
                                                        if (attr.indexOf('.') === -1 && node[attr] === void 0) {
                                                            //Bind attribute
                                                            _node(node).bindingAttrs().bind(attr, function (attr, current, previous, mutation, id) {
                                                                if (_map[prop] !== current) {
                                                                    _map[prop] = current;
                                                                }
                                                            }, bind_parent);
                                                        } else {
                                                            //Bind property
                                                            _node(node).bindingProps().bind(attr, function (attr, current, previous, mutation, id) {
                                                                if (_map[prop] !== current) {
                                                                    _map[prop] = current;
                                                                }
                                                            }, bind_parent);
                                                        }
                                                    }
                                                }(attrs[_prop][0].node));
                                                attrs[_prop].splice(0, 1);
                                            }
                                            if (_hooks[prop] !== void 0 && !(_hooks[prop] instanceof settings.classes.CALLER) && !(typeof _hooks[prop] === 'object')) {
                                                if (typeof _hooks[prop] === 'function') {
                                                    default_val = _hooks[prop]();
                                                } else if (typeof _hooks[prop] === 'string') {
                                                    default_val = _hooks[prop];
                                                } else if (typeof _hooks[prop].toString === 'function') {
                                                    default_val = _hooks[prop].toString();
                                                }
                                                _map[prop] = default_val;
                                            }
                                        });
                                        proccess(_hooks, _map, path);
                                        map.push(_map);
                                    });
                                } else {
                                    map.push(_object(defmap).copy());
                                }
                                return map;
                            };
                            var cache = {},
                                nodes = model.nodes(),
                                attrs = model.attrs();
                            privates.map.model = getMap(self.url, privates.hooks, '');
                        },
                        combine     : function () {
                            function process(dom, model, path) {
                                function obj(dom, model, path) {
                                    _object(dom).forEach(function (prop, val) {
                                        if (val instanceof addition.nodeList.NODE_LIST) {
                                            model[settings.other.DOM_PREFIX + prop] = val;
                                            privates.cache.dom[prop] === void 0 && (privates.cache.dom[prop] = []);
                                            privates.cache.dom[prop].push({
                                                nodeList    : val,
                                                path        : path
                                            });
                                        } else if (helpers.isArray(val)) {
                                            model[prop] = model[prop] !== void 0 ? model[prop] : [];
                                            process(val, model[prop], (path !== '' ? path + '.' : '') + prop.replace(borders, ''));
                                        } else if (typeof val === 'object') {
                                            model[prop] = model[prop] !== void 0 ? model[prop] : {};
                                            obj(val, model[prop], (path !== '' ? path + '.' : '') + prop.replace(borders, ''));
                                        }
                                    });
                                };
                                dom.forEach(function (_dom, index) {
                                    if (model[index] === void 0) {
                                        model.push({});
                                    }
                                    obj(dom[index], model[index], path);
                                });
                            };
                            var _dom    = dom.bind(),
                                borders = new RegExp('^' + settings.other.SUBLEVEL_BEGIN + '|' + settings.other.SUBLEVEL_END + '$', 'gi');
                            if (helpers.isArray(_dom)) {
                                privates.map.model = helpers.isArray(privates.map.model) ? privates.map.model : new ExArray();
                                process(_dom, privates.map.model, '');
                            }
                        },
                        accessors   : function (){
                            function process(accessors, model, path) {
                                function obj(accessors, model, path) {
                                    if (helpers.isArray(model) && model.length === 1) {
                                        model = model[0];
                                    }
                                    _object(accessors).forEach(function (prop, val) {
                                        if (val[settings.other.HOOK_ACCESSOR_FUNC_NAME] !== void 0) {
                                            model[settings.other.ACCESSOR_PREFIX + prop.replace(borders, '')] = val[settings.other.HOOK_ACCESSOR_FUNC_NAME].bind({ model: model, hook: prop });
                                        }
                                        if (typeof val === 'object' && val !== null) {
                                            if ((Object.keys(val).length > 0 && val[settings.other.HOOK_ACCESSOR_FUNC_NAME] === void 0) ||
                                                (Object.keys(val).length > 1 && val[settings.other.HOOK_ACCESSOR_FUNC_NAME] !== void 0)) {
                                                model[prop] = model[prop] !== void 0 ? model[prop] : {};
                                                obj(val, model[prop], (path !== '' ? path + '.' : '') + prop.replace(borders, ''));
                                            }
                                        } else if (helpers.isArray(val)) {
                                            model[prop] = model[prop] !== void 0 ? model[prop] : [];
                                            process(val, model[prop], (path !== '' ? path + '.' : '') + prop.replace(borders, ''));
                                        }
                                    });
                                };
                                accessors.forEach(function (accessors, index) {
                                    if (model[index] === void 0) {
                                        model.push({});
                                    }
                                    obj(accessors, model[index], path);
                                });
                            };
                            var accessors   = helpers.isArray(privates.map.accessors) ? privates.map.accessors : [privates.map.accessors],
                                borders     = new RegExp('^' + settings.other.SUBLEVEL_BEGIN + '|' + settings.other.SUBLEVEL_END + '$', 'gi');
                            privates.map.model = helpers.isArray(privates.map.model) ? privates.map.model : new ExArray();
                            process(accessors, privates.map.model, '', { model: null, prop: null });
                            //Reset accessors
                            privates.map.accessors = null;
                        },
                        finalize    : function () {
                            function getMap(path) {
                                var parts   = path.split('.'),
                                    obj     = privates.map.refs;
                                if (obj !== null) {
                                    parts.forEach(function (part) {
                                        if (obj.hooks !== void 0 && obj.hooks[part] !== void 0) {
                                            obj = obj.hooks[part];
                                        }
                                    });
                                }
                                return obj;
                            };
                            function getRef(path) {
                                var parts   = path.split('.'),
                                    obj     = privates.map.refs,
                                    ref     = null;
                                if (obj !== null) {
                                    parts.forEach(function (part) {
                                        if (obj.hooks !== void 0 && obj.hooks[part] !== void 0 && ref !== false) {
                                            obj = obj.hooks[part];
                                            ref = obj.url;
                                        } else {
                                            ref = false;
                                        }
                                    });
                                }
                                return ref === null ? false : ref;
                            };
                            function bind(target, path, url) {
                                function getPath(path) {
                                    var parts = path.split('.'),
                                        _path = '';
                                    parts.forEach(function (part) {
                                        _path += (_path !== '' ? '.' : '') + settings.other.SUBLEVEL_BEGIN + part + settings.other.SUBLEVEL_END;
                                    });
                                    return _path;
                                }
                                var _path       = cache[path] === void 0 ? getPath(path) : cache[path],
                                    anchor      = hooks.anchors.get(_path),
                                    collection  = null;
                                cache[path] = _path;
                                if (anchor !== null) {
                                    collection = model.collection(url, anchor, target, getMap(path), dom.indexes);
                                    target.bind('add',      collection.add      );
                                    target.bind('remove',   collection.remove   );
                                } else {
                                    flex.logs.log(signature() + logs.pattern.CANNOT_DETECT_HOOK_ANCHOR, flex.logs.types.WARNING);
                                }
                            };
                            function process(hooks, model, path) {
                                function obj(hooks, model, path) {
                                    _object(hooks).forEach(function (prop, val) {
                                        var ref = null,
                                            url = null;
                                        if (val instanceof settings.classes.CALLER) {
                                            ref = settings.other.SUBLEVEL_BEGIN + prop + settings.other.SUBLEVEL_END;
                                            model[ref] === void 0 && (model[ref] = new ExArray());
                                            bind(model[ref], (path !== '' ? path + '.' : '') + prop, val.url);
                                            process(val.hooks, model[ref], (path !== '' ? path + '.' : '') + prop);
                                        } else if (typeof val === 'object') {
                                            model[prop] === void 0 && (model[prop] = {});
                                            obj(val, model[prop], (path !== '' ? path + '.' : '') + prop);
                                        } else {
                                            if (val === null) {
                                                url = getRef((path !== '' ? path + '.' : '') + prop);
                                                if (url !== false) {
                                                    ref = settings.other.SUBLEVEL_BEGIN + prop + settings.other.SUBLEVEL_END;
                                                    model[ref] === void 0 && (model[ref] = new ExArray());
                                                    bind(model[ref], (path !== '' ? path + '.' : '') + prop, url);
                                                } else {
                                                    model[prop] === void 0 && (model[prop] = val);
                                                }
                                            } else {
                                                model[prop] === void 0 && (model[prop] = val);
                                            }
                                        }
                                    });
                                };
                                hooks.forEach(function (hooks, index) {
                                    model[index] === void 0 && model.push({});
                                    obj(hooks, model[index], path);
                                });
                            };
                            var cache = {};
                            if (helpers.isArray(privates.hooks)) {
                                privates.map.model = helpers.isArray(privates.map.model) ? privates.map.model : new ExArray();
                                process(privates.hooks, privates.map.model, '');
                            }
                            return privates.map.model;
                        },
                        collection  : function (url, anchor, parent, refs, indexesUpdate) {
                            var Collection = function (url, anchor) {
                                var self            = this,
                                    add             = null,
                                    getStartIndex   = null,
                                    mount           = null,
                                    unmount         = null,
                                    remove          = null,
                                    hooks           = null,
                                    update          = indexesUpdate,
                                    dom             = null;
                                this.url        = url;
                                this.anchor     = anchor;
                                this.parent     = parent;
                                this.refs       = refs;
                                this.start      = null;
                                getStartIndex   = function getStartIndex() {
                                    var parent = self.anchor.parentNode,
                                        target = null;
                                    if (self.start === null) {
                                        try {
                                            Array.prototype.forEach.call(parent.childNodes, function (node) {
                                                if (node === self.anchor) {
                                                    throw 'found';
                                                }
                                                if (node instanceof Element) {
                                                    target = node;
                                                }
                                            });
                                        } catch (e) { }
                                        if (target !== null) {
                                            self.start = Array.prototype.indexOf.call(parent.children, target) + 1;
                                        } else {
                                            self.start = 0;
                                        }
                                    }
                                    return self.start;
                                };
                                mount           = function mount(nodes, index, count) {
                                    var parent  = self.anchor.parentNode,
                                        mark    = null,
                                        start   = getStartIndex(),
                                        finish  = start + (self.parent.length - 2);
                                    if (self.parent.length - 1 === index + (count - 1)) {
                                        if (parent.children.length - 1 > finish) {
                                            mark = parent.children[finish + 1];
                                            for (var i = nodes.length - 1; i >= 0; i -= 1) {
                                                parent.insertBefore(nodes[0], mark);
                                            }
                                        } else {
                                            for (var i = nodes.length - 1; i >= 0; i -= 1) {
                                                parent.appendChild(nodes[0]);
                                            }
                                        }
                                    } else if (parent.children[start + index] !== void 0) {
                                        mark = parent.children[start + index];
                                        for (var i = nodes.length - 1; i >= 0; i -= 1) {
                                            parent.insertBefore(nodes[0], mark);
                                        }
                                    }
                                };
                                unmount         = function unmount(index, count) {
                                    var children    = self.anchor.parentNode !== null ? self.anchor.parentNode.children : null,
                                        target      = null,
                                        start       = getStartIndex();
                                    if (children.length !== null && children[start + index] !== void 0) {
                                        for (var i = count - 1; i >= 0; i -= 1) {
                                            target = children[start + index + i];
                                            target.parentNode.removeChild(target);
                                        }
                                    }
                                };
                                hooks           = function hooks(src, map) {
                                    var map = map === null ? null : (map.hooks !== void 0 ? map.hooks : null);
                                    if (map !== null) {
                                        src.forEach(function (_hooks, index) {
                                            _object(_hooks).forEach(function (prop, val) {
                                                if (map[prop] !== void 0) {
                                                    src[index][prop] = Caller.instance({
                                                        url     : map[prop].url,
                                                        hooks   : hooks(helpers.isArray(val) ? val : [val], map[prop])
                                                    });
                                                }
                                            });
                                        });
                                    }
                                    return src;
                                };
                                add             = function add(event) {
                                    var added   = helpers.isArray(event.item) ? event.item : [event.item],
                                        inst    = Caller.instance({
                                            url     : self.url,
                                            hooks   : hooks(added, self.refs)
                                        });
                                    inst        = inst.build();
                                    added.forEach(function (item, index) {
                                        self.parent[event.index + index] = inst.model[index].length === 1 ? inst.model[index][0] : inst.model[index];
                                    });
                                    mount(inst.nodes, event.index, event.count);
                                    dom.add(inst.model);
                                    update();
                                    return void 0;
                                };
                                remove          = function remove(event) {
                                    unmount(event.index, event.count);
                                    dom.remove(helpers.isArray(event.item) ? event.item : [event.item]);
                                    update();
                                    return void 0;
                                };
                                dom             = {
                                    add     : function (models) {
                                        models.forEach(function (model) {
                                            if (typeof model === 'object') {
                                                _object(model).forEach(function (prop, val) {
                                                    if (val instanceof addition.nodeList.NODE_LIST) {
                                                        self.parent[prop] === void 0 && (self.parent[prop] = addition.nodeList.create());
                                                        self.parent[prop].add(val);
                                                    }
                                                });
                                            }
                                        });
                                    },
                                    remove  : function (models) {
                                        models.forEach(function (model) {
                                            if (typeof model === 'object') {
                                                _object(model).forEach(function (prop, val) {
                                                    if (val instanceof addition.nodeList.NODE_LIST && self.parent[prop] !== void 0) {
                                                        self.parent[prop] === void 0 && (self.parent[prop] = addition.nodeList.create());
                                                        self.parent[prop].exclude(val);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                };
                                return {
                                    add     : add,
                                    remove  : remove
                                }
                            };
                            return new Collection(url, anchor);
                        },
                    };
                    dom         = {
                        nodes   : function () {
                            var nodes       = _nodes('*[' + settings.css.attrs.DOM + ']', false, privates.wrapper).target,
                                res         = {},
                                cache       = {};
                            if (nodes !== null && nodes.length > 0) {
                                Array.prototype.forEach.call(nodes, function (node) {
                                    var attr    = node.getAttribute(settings.css.attrs.DOM),
                                        names   = cache[attr] !== void 0 ? cache[attr] : attr.split(',');
                                    cache[attr] = names;
                                    names.forEach(function (ref) {
                                        res[ref] = res[ref] === void 0 ? [] : res[ref];
                                        res[ref].push(node);
                                    });
                                    node.removeAttribute(settings.css.attrs.DOM);
                                });
                            }
                            return res;
                        },
                        bind    : function (){
                            function getMap(map, path) {
                                var res = null;
                                if (map instanceof Array) {
                                    res = [];
                                    map.forEach(function (item) {
                                        res.push(getMap(item, path));
                                    });
                                } else if (typeof map === 'object') {
                                    res = {};
                                    _object(map).forEach(function (prop, val) {
                                        res[prop] = getMap(val, path + (path === '' ? '' : '.') + prop);
                                    });
                                } else if (typeof map === 'number') {
                                    if (nodes[path] !== void 0 && nodes[path].length >= map) {
                                        res = addition.nodeList.create(nodes[path].slice(0, map));
                                        nodes[path].splice(0, map);
                                    }
                                }
                                return res;
                            };
                            var cache   = {},
                                nodes   = dom.nodes(),
                                map     = mapping.get(consts.maps.DOM);
                            return getMap(map, '');
                        },
                        indexes : function () {
                            function process(model, indexes, parent) {
                                if (helpers.isArray(model)) {
                                    model.forEach(function (model, index) {
                                        process(model, indexes.concat([index]), parent);
                                    });
                                } else if (typeof model === 'object') {
                                    _object(model).forEach(function (prop, val) {
                                        if (val instanceof addition.nodeList.NODE_LIST) {
                                            val.setIndexes(indexes);
                                            if (parent !== null) {
                                                parent[prop] === void 0 && (parent[prop] = addition.nodeList.create());
                                                parent[prop].add(val);
                                            }
                                        } else if (helpers.isArray(val)) {
                                            process(val, indexes, val);
                                        }
                                    });
                                }
                            };
                            if (helpers.isArray(privates.map.model)) {
                                process(privates.map.model, [], null);
                            }
                        }
                    };
                    html        = {
                        cache       : {
                            load    : function (parent, conditions) {
                                var cache       = privates.cache.html,
                                    conditions  = typeof conditions === 'object' ? conditions : false,
                                    _cache      = {},
                                    _names      = {},
                                    insts       = {};
                                if (helpers.isArray(privates.hooks)) {
                                    privates.hooks.forEach(function (_hooks) {
                                        _object(_hooks).forEach(function (name, value) {
                                            var _name   = null,
                                                path    = null,
                                                ref     = null;
                                            if (value instanceof settings.classes.CALLER) {
                                                _name       = settings.other.SUBLEVEL_BEGIN + name + settings.other.SUBLEVEL_END;
                                                path        = (parent === false ? '' : parent + '.') + _name;
                                                ref         = path + value.url;
                                                _cache[ref] = _cache[ref] !== void 0 ? _cache[ref] : { url: value.url, hooks: [], path: path };
                                                if (helpers.isArray(value.hooks)) {
                                                    _cache[ref].hooks = _cache[ref].hooks.concat(value.hooks.getOriginal());
                                                } else {
                                                    _cache[ref].hooks.push(value.hooks);
                                                }
                                            }
                                        });
                                    });
                                    _object(_cache).forEach(function (ref, data) {
                                        var html = Pattern.instance({
                                                id      : flex.unique(),
                                                url     : data.url,
                                                hooks   : data.hooks
                                            });
                                        html        = html.html(data.path, conditions);
                                        cache[ref]  = {
                                            hooks       : data.hooks,
                                            html        : html.html,
                                            fragments   : html.fragments,
                                            parent      : data.path,
                                            cursor      : 0,
                                        };
                                    });
                                    return cache;
                                }
                            },
                        },
                        getHTML     : function (parent, name, inst, index){
                            var html            = false,
                                cached          = null,
                                ref             = null,
                                _ref            = (parent === false ? '' : parent + '.') + settings.other.SUBLEVEL_BEGIN + name + settings.other.SUBLEVEL_END;
                            if (inst instanceof settings.classes.CALLER) {
                                ref     = _ref + inst.url;
                                if (privates.cache.html[ref] !== void 0) {
                                    cached  = privates.cache.html[ref];
                                    html    = {
                                        html        : '<!--' + settings.other.ANCHOR + _ref + '-->' + cached.fragments.slice(cached.cursor, cached.cursor + inst.hooks.length).join(''),
                                        fragments   : null,
                                        original    : cached.original
                                    };
                                    cached.cursor   += inst.hooks.length;
                                }
                            }
                            return html;
                        },
                        build       : function (parent, conditions) {
                            var parent      = typeof parent === 'string' ? parent : false,
                                conditions  = typeof conditions === 'object' ? conditions : false,
                                res         = '',
                                original    = null,
                                regs        = settings.regs,
                                _cache      = cache.reset().regs,
                                fragments   = [],
                                cached      = hash.getCache();
                            if (cached === null) {
                                original = self.source.html(parent);
                                if (helpers.isArray(privates.hooks)) {
                                    html.cache.load(parent, conditions);
                                    privates.hooks.forEach(function (_hooks, index) {
                                        var fragment = original;
                                        _object(_hooks).forEach(function (name, value) {
                                            var _name   = (!parent ? '' : parent + '.') + name,
                                                _res    = html.getHTML(parent, name, value, index);
                                            _cache[_name]   = _cache[_name] === void 0 ? new RegExp(regs.HOOK_OPEN + _name.replace(/\./gi,'\\.') + regs.HOOK_CLOSE, 'gi') : _cache[_name];
                                            fragment        = _res !== false ? fragment.replace(_cache[_name], _res.html) : fragment;
                                            fragment        = _res !== false ? fragment : hooks.insert(_name, value, fragment);
                                        });
                                        fragment    = condition.html(fragment, condition.getByPath(!parent ? '' : parent, conditions), _hooks, parent);
                                        res         += fragment;
                                        fragments.push(fragment);
                                    });
                                }
                                privates.html = res !== '' ? res : original;
                                hash.setCache({
                                    html        : privates.html,
                                    fragments   : fragments.length === 0 ? [original] : fragments,
                                });
                                return fragments.length === 0 ? [original] : fragments;
                            } else {
                                privates.html = cached.html;
                                return cached.fragments;
                            }
                        },
                        wrap        : function () {
                            privates.wrapper            = helpers.getPattern(privates.html);
                            privates.wrapper.innerHTML  = privates.html;
                        },
                        map         : function (){
                            function procces(hooks, path, name, dest) {
                                var _name   = '',
                                    source  = null;
                                if (hooks instanceof settings.classes.CALLER) {
                                    _name = settings.other.SUBLEVEL_BEGIN + name + settings.other.SUBLEVEL_END;
                                    if (dest[_name] === void 0) {
                                        source      = Source.storage.get(hooks.url);
                                        path        = (path === '' ? '' : path + '.') + _name;
                                        dest.inc    = dest.inc === void 0 ? [] : dest.inc;
                                        dest[_name] = {
                                            url     : hooks.url,
                                            html    : source.html(path),
                                        };
                                        dest.inc.push(_name);
                                        procces(hooks.hooks, path, name, dest[_name]);
                                    }
                                } else if (helpers.isArray(hooks)) {
                                    hooks.forEach(function (hooks) {
                                        procces(hooks, path, name, dest);
                                    });
                                } else if (typeof hooks === 'object') {
                                    _object(hooks).forEach(function (name, hooks) {
                                        procces(hooks, path, name, dest);
                                    });
                                }
                            };
                            privates.map.html = {
                                url : self.url,
                                html: self.source.html(''),
                            };
                            procces(privates.hooks, '', '', privates.map.html);
                        },
                    };
                    hooks       = {
                        cache   : {},
                        getValue: function (name, value) {
                            var res = '';
                            if (value instanceof settings.classes.CALLER) {
                                res = hooks.convert(value.hooks);
                            } else if (typeof value === 'function'){
                                res = hooks.getValue(name, value());
                            } else if (typeof value === 'string') {
                                res = value;
                            } else if (typeof value === 'object') {
                                res = {};
                                _object(value).forEach(function (name, val) {
                                    res[name] = hooks.getValue(name, val);
                                });
                            } else if (typeof value.toString === 'function') {
                                res = value.toString();
                            } else {
                                flex.logs.log(signature() + logs.pattern.CANNOT_DETECT_HOOK_VALUE + '. Hook name: (' + name + ')', flex.logs.types.WARNING);
                                res = '';
                            }
                            return res;
                        },
                        convert : function (source_hooks) {
                            var result = [];
                            if (helpers.isArray(source_hooks)) {
                                source_hooks.forEach(function (_hooks) {
                                    var res = {};
                                    _object(_hooks).forEach(function (name, value) {
                                        res[name] = hooks.getValue(name, value);
                                    });
                                    result.push(res);
                                });
                            }
                            return result;
                        },
                        insert  : function (name, value, fragment) {
                            function getProps(parent, obj, props) {
                                var props = props !== void 0 ? props : {};
                                _object(obj).forEach(function (name, value) {
                                    if (!(value instanceof settings.classes.CALLER) && typeof value === 'object') {
                                        getProps(parent + '.' + name, value, props);
                                    } else {
                                        props[parent + '.' + name] = value;
                                    }
                                });
                                return props;
                            };
                            var cache           = privates.cache.regs;
                            if (typeof value === 'object') {
                                _object(getProps(name, value)).forEach(function (name, value) {
                                    fragment = hooks.insert(name, value, fragment);
                                });
                                return fragment;
                            } else {
                                cache[name] = cache[name] === void 0 ? new RegExp(settings.regs.HOOK_OPEN + name + settings.regs.HOOK_CLOSE, 'gi') : cache[name];
                                return fragment.replace(cache[name], hooks.getValue(name, value));
                            }
                        },
                        anchors : {
                            html    : function () {
                                function getRef(ref) {
                                    var parts   = ref.split('.'),
                                        _ref    = '';
                                    parts.forEach(function (part, index) {
                                        if (index === parts.length - 1) {
                                            _ref += (_ref !== '' ? '.' : '') + settings.other.SUBLEVEL_BEGIN + part + settings.other.SUBLEVEL_END;
                                        } else {
                                            _ref += (_ref !== '' ? '.' : '') + part;
                                        }
                                    });
                                    return _ref;
                                };
                                var matchs  = privates.html.match(settings.regs.HOOK),
                                    regs    = settings.regs,
                                    cache   = {},
                                    refs    = {};
                                if (matchs instanceof Array) {
                                    matchs.forEach(function (hook) {
                                        var ref = hook.replace(settings.regs.HOOK_BORDERS, ''),
                                            reg = cache[ref] !== void 0 ? cache[ref] : new RegExp(regs.HOOK_OPEN + ref.replace(/\./gi, '\\.') + regs.HOOK_CLOSE, 'gi');
                                        cache[ref]  = reg;
                                        ref         = refs[ref] === void 0 ? getRef(ref) : refs[ref];
                                        refs[ref]   = ref;
                                        privates.html = privates.html.replace(reg, '<!--' + settings.other.ANCHOR + ref + '-->');
                                    });
                                }
                            },
                            convert : function () {
                                function converHooksAccessors(accessors, name, path) {
                                    function convert(node) {
                                        var textNode = document.createTextNode('');
                                        node.parentNode.insertBefore(textNode, node);
                                        node.parentNode.removeChild(node);
                                        return textNode;
                                    };
                                    function makeAccessor(begin, end, path) {
                                        return function (content, safely) {
                                            function getNodes(begin, end) {
                                                var i       = 10000,
                                                    nodes   = [],
                                                    current = begin;
                                                do {
                                                    if (current !== begin && current !== end) {
                                                        nodes.push(current);
                                                    }
                                                    current = current.nextSibling;
                                                    i -= 1;
                                                } while (i >= 0 && current !== null && current !== end);
                                                i < 0 && flex.logs.log(signature() + logs.pattern.CANNOT_DETECT_BEGIN_OR_END_HOOK_ANC + '. Hook name: (' + path + ')', flex.logs.types.WARNING);
                                                return nodes;
                                            };
                                            function getValue(value) {
                                                var res = value;
                                                if (typeof value === 'function') {
                                                    res = getValue(value());
                                                } else if (typeof value === 'string') {
                                                    res = value;
                                                } else if (typeof value !== 'object' && typeof value.toString === 'function') {
                                                    res = value.toString();
                                                }
                                                return res === null ? '' : res;
                                            };
                                            function setModelValue(model, hook, value, pattern) {
                                                var prev = model[hook] !== void 0 ? model[hook] : model[settings.other.SUBLEVEL_BEGIN + hook + settings.other.SUBLEVEL_END];
                                                model[settings.other.SUBLEVEL_BEGIN + hook + settings.other.SUBLEVEL_END] !== void 0 && (delete model[settings.other.SUBLEVEL_BEGIN + hook + settings.other.SUBLEVEL_END]);
                                                model[hook]                                                                 !== void 0 && (delete model[hook]);
                                                model[(pattern ? settings.other.SUBLEVEL_BEGIN : '') + hook + (pattern ? settings.other.SUBLEVEL_END : '')] = value;
                                                if (privates.controller !== null && typeof privates.controller === 'object' && typeof privates.controller[settings.events.ONCHANGE] === 'function') {
                                                    privates.controller[settings.events.ONCHANGE]((pattern ? settings.other.SUBLEVEL_BEGIN : '') + hook + (pattern ? settings.other.SUBLEVEL_END : ''), value, prev);
                                                }
                                            };
                                            var nodes       = getNodes(begin, end),
                                                inserted    = getValue(content),
                                                wrapper     = null,
                                                tag         = null,
                                                safely      = typeof safely === 'boolean' ? safely : true,
                                                model       = this;
                                            if (nodes instanceof Array && nodes.length > 0) {
                                                //Remove nodes
                                                nodes.forEach(function (node) {
                                                    node.parentNode.removeChild(node);
                                                });
                                                //Inserting
                                                if (typeof inserted === 'string' && !safely) {
                                                    tag = helpers.getFirstTag(inserted);
                                                    if (tag !== null) {
                                                        wrapper = helpers.getParentFor(tag);
                                                        if (wrapper !== null) {
                                                            wrapper.innerHTML = inserted;
                                                            Array.prototype.forEach.call(wrapper.childNodes, function (child) {
                                                                end.parentNode.insertBefore(child, end);
                                                            });
                                                        } else {
                                                            flex.logs.log(signature() + logs.pattern.CANNOT_DETECT_HTML + '. Hook name: (' + path + ')', flex.logs.types.WARNING);
                                                        }
                                                    } else {
                                                        end.parentNode.insertBefore(document.createTextNode(inserted), end);
                                                    }
                                                    setModelValue(model.model, model.hook, inserted, false);
                                                } else if (typeof inserted === 'string' && safely){
                                                    end.parentNode.insertBefore(document.createTextNode(inserted), end);
                                                    setModelValue(model.model, model.hook, inserted, false);
                                                } else if (inserted instanceof settings.classes.CALLER) {
                                                    inserted.render({
                                                        replace : false,
                                                        before  : end,
                                                        callback: function (result) {
                                                            setModelValue(model.model, model.hook, result.model, true);
                                                            return result;
                                                        }
                                                    });
                                                } else {
                                                    flex.logs.log(signature() + logs.pattern.TEXT_HOOK_VALUE_CANBE_ONLY_TEXT + '. Hook name: (' + path + ')', flex.logs.types.WARNING);
                                                    end.parentNode.insertBefore(document.createTextNode(Object.prototype.toString.call(inserted)), end);
                                                    setModelValue(model.model, model.hook, Object.prototype.toString.call(inserted), false);
                                                }
                                            }
                                        };
                                    };
                                    if (helpers.isArray(accessors)) {
                                        if (accessors[settings.other.HOOK_COM_BEGIN] !== void 0 && accessors[settings.other.HOOK_COM_END] !== void 0) {
                                            accessors[settings.other.HOOK_ACCESSOR_FUNC_NAME] = makeAccessor(convert(accessors[settings.other.HOOK_COM_BEGIN]), convert(accessors[settings.other.HOOK_COM_END]), path);
                                            delete accessors[settings.other.HOOK_COM_BEGIN];
                                            delete accessors[settings.other.HOOK_COM_END];
                                        }
                                        accessors.forEach(function (accessors) {
                                            converHooksAccessors(accessors, name, path);
                                        });
                                    } else if (typeof accessors === 'object' && accessors !== null) {
                                        if (accessors[settings.other.HOOK_COM_BEGIN ] !== void 0 && accessors[settings.other.HOOK_COM_END] !== void 0) {
                                            accessors[settings.other.HOOK_ACCESSOR_FUNC_NAME] = makeAccessor(convert(accessors[settings.other.HOOK_COM_BEGIN]), convert(accessors[settings.other.HOOK_COM_END]), path);
                                            delete accessors[settings.other.HOOK_COM_BEGIN];
                                            delete accessors[settings.other.HOOK_COM_END];
                                            _object(accessors).forEach(function (prop, accessors) {
                                                if (prop !== settings.other.HOOK_COM_BEGIN && prop !== settings.other.HOOK_COM_END) {
                                                    converHooksAccessors(accessors, prop, path + (path === '' ? '' : '.') + prop);
                                                }
                                            });
                                        } else {
                                            _object(accessors).forEach(function (prop, accessors) {
                                                converHooksAccessors(accessors, prop, path + (path === '' ? '' : '.') + prop);
                                            });
                                        }
                                    }
                                };
                                var cursor          = { __root : 0 },
                                    accessors       = [{}],
                                    ends            = {},
                                    remove          = [],
                                    treeWalker      = document.createTreeWalker(
                                        privates.wrapper,
                                        NodeFilter.SHOW_COMMENT,
                                        {
                                            acceptNode: function (node) {
                                                function getObj(ref) {
                                                    var path    = ref.split('.'),
                                                        trg     = accessors[cursor.__root],
                                                        cur     = '',
                                                        prev    = null,
                                                        _trg    = null;
                                                    path.forEach(function (step, index) {
                                                        _trg = trg;
                                                        cur += (cur === '' ? '' : '.') + step;
                                                        if (prev === null && trg[step] !== void 0 && index === path.length - 1) {
                                                            accessors.push({});
                                                            cursor.__root   += 1;
                                                            trg             = accessors[cursor.__root];
                                                        }
                                                        if (trg[step] === void 0) {
                                                            trg[step]   = {};
                                                            trg         = trg[step];
                                                        } else {
                                                            if (trg[step] instanceof Array) {
                                                                if (index === path.length - 1) {
                                                                    trg[step].push({});
                                                                    cursor[cur] += 1;
                                                                    trg         = trg[step][cursor[cur]];
                                                                } else {
                                                                    trg         = trg[step][cursor[cur]];
                                                                }
                                                            } else {
                                                                if (index === path.length - 1) {
                                                                    if (prev.trg[prev.step] instanceof Array) {
                                                                        prev.trg[prev.step].push({});
                                                                        cursor[prev.cur]    += 1;
                                                                        trg                 = prev.trg[prev.step][cursor[prev.cur]];
                                                                        trg[step]           = {};
                                                                        trg                 = trg[step];
                                                                    } else {
                                                                        prev.trg[prev.step] = [prev.trg[prev.step], {}];
                                                                        if (prev.trg[prev.step][0][settings.other.HOOK_COM_BEGIN] !== void 0 ){
                                                                            prev.trg[prev.step][settings.other.HOOK_COM_BEGIN]  = prev.trg[prev.step][0][settings.other.HOOK_COM_BEGIN];
                                                                            prev.trg[prev.step][0][ref_perent]                  = prev.trg[prev.step];
                                                                            delete prev.trg[prev.step][0][settings.other.HOOK_COM_BEGIN];
                                                                        }
                                                                        trg                 = prev.trg[prev.step][1];
                                                                        trg[step]           = {};
                                                                        trg                 = trg[step];
                                                                        cursor[prev.cur]    = 1;
                                                                    }
                                                                } else {
                                                                    trg = trg[step];
                                                                }
                                                            }
                                                        }
                                                        prev = {
                                                            cur : cur,
                                                            trg : _trg,
                                                            step: step
                                                        };
                                                    });
                                                    return trg;
                                                };
                                                var obj         = null,
                                                    clr         = null,
                                                    ref_perent  = '__REF_TO_PARENT_ARR',
                                                    _parent     = null;
                                                if (config.get().ACCESSORS) {
                                                    if (~(node.nodeValue.indexOf(settings.other.HOOK_COM_BEGIN))) {
                                                        clr                                 = node.nodeValue.replace(settings.other.HOOK_COM_BEGIN, '');
                                                        obj                                 = getObj(clr);
                                                        obj[settings.other.HOOK_COM_BEGIN]  = node;
                                                        ends[clr]                           = obj;
                                                    }
                                                    if (~(node.nodeValue.indexOf(settings.other.HOOK_COM_END))) {
                                                        clr                                     = node.nodeValue.replace(settings.other.HOOK_COM_END, '');
                                                        if (ends[clr][ref_perent] !== void 0){
                                                            _parent     = ends[clr][ref_perent];
                                                            delete ends[clr][ref_perent];
                                                            ends[clr]   = _parent;
                                                        }
                                                        ends[clr][settings.other.HOOK_COM_END]  = node;
                                                    }
                                                } else {
                                                    if (~(node.nodeValue.indexOf(settings.other.HOOK_COM_BEGIN)) || ~(node.nodeValue.indexOf(settings.other.HOOK_COM_END))) {
                                                        remove.push(node);
                                                    }
                                                }
                                                return ~(node.nodeValue.indexOf(settings.other.ANCHOR)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                                            }
                                        },
                                        false
                                    ),
                                    nodeList        = [],
                                    anchors         = {};
                                while (treeWalker.nextNode()) {
                                    nodeList.push(treeWalker.currentNode);
                                }
                                remove.forEach(function (node) {
                                    node.parentNode.removeChild(node);
                                });
                                nodeList.forEach(function (node) {
                                    var anchor  = document.createTextNode(''),
                                        ref     = node.nodeValue.replace(settings.other.ANCHOR, '');
                                    anchors[ref] === void 0 && (anchors[ref] = []);
                                    anchors[ref].push(anchor);
                                    node.parentNode.insertBefore(anchor, node);
                                    node.parentNode.removeChild(node);
                                });
                                config.get().ACCESSORS && converHooksAccessors(accessors, '', '');
                                privates.map.anchors    = anchors;
                                privates.map.accessors  = accessors;
                            },
                            get     : function (path) {
                                var anchor = null;
                                if (privates.map.anchors !== null) {
                                    if (privates.map.anchors[path] instanceof Array && privates.map.anchors[path].length > 0) {
                                        anchor = privates.map.anchors[path][0];
                                        privates.map.anchors[path].splice(0, 1);
                                    }
                                }
                                return anchor;
                            }
                        },
                    };
                    condition   = {
                        find        : function () {
                            function proccess(_conditions, hooks) {
                                if (helpers.isArray(hooks)) {
                                    hooks.forEach(function (hooks) {
                                        proccess(_conditions, hooks);
                                    });
                                } else if (typeof hooks === 'object') {
                                    _object(hooks).forEach(function (prop, val) {
                                        var _prop = null,
                                            _cond = null;
                                        if (val instanceof settings.classes.CALLER) {
                                            if (_urls[val.url] === void 0) {
                                                _prop               = settings.other.SUBLEVEL_BEGIN + prop + settings.other.SUBLEVEL_END;
                                                _cond               = _object(val.conditions).copy();
                                                _cond               = Object.keys(_cond).length === 0 ? conditions.storage.get(val.url) : _cond;
                                                _conditions[_prop]  = _cond !== null ? _cond : {};
                                                proccess(_conditions[_prop], val.hooks);
                                            }
                                        } else if (typeof val === 'object') {
                                            _conditions[prop] = {};
                                            proccess(_conditions[prop], val);
                                        }
                                    });
                                }
                            };
                            var _urls = {};
                            if (Object.keys(privates.conditions).length === 0) {
                                privates.conditions = conditions.storage.get(self.url);
                                privates.conditions = privates.conditions === null ? {} : privates.conditions;
                            }
                            proccess(privates.conditions, privates.hooks);
                            return privates.conditions;
                        },
                        html        : function (fragment, conditions, hooks, parent){
                            var source  = null,
                                res     = null,
                                path    = parent !== false ? parent + '.' : '',
                                cache   = null,
                                map     = null,
                                refs    = '';
                            privates.cache.html_conds   = privates.cache.html_conds === void 0 ? { regs : {}, matches : {}, removed: {}} : privates.cache.html_conds;
                            cache                       = privates.cache.html_conds;
                            if (conditions !== false) {
                                source = Source.storage.get(self.url);
                                if (source !== null && source.flags().has_conditions && !source.flags().has_model) {
                                    map = source.map().conditions;
                                    _object(conditions).forEach(function (prop, val) {
                                        var res     = null,
                                            ref     = null,
                                            match   = null;
                                        if (val instanceof Function) {
                                            res                 = val(hooks);
                                            ref                 = path + prop + '=' + res;
                                            match               = null;
                                            cache.regs[ref]     = cache.regs[ref] !== void 0 ? cache.regs[ref] : new RegExp(settings.regs.CONDITION_CONTENT.replace('[open]', ref.replace('.', '\\.')).
                                                                                                                                                            replace('[close]', (path + prop).replace('.', '\\.')), 'gi');
                                            match = fragment.match(cache.regs[ref]);
                                            if (match instanceof Array && match.length > 0) {
                                                match.forEach(function (match) {
                                                    fragment = fragment.replace(match, match.replace('<!--' + ref + '-->', '').replace('<!--' + path + prop + '-->', ''));
                                                });
                                            }
                                            cache.regs[prop] = cache.regs[prop] !== void 0 ? cache.regs[prop] : new RegExp(settings.regs.CONDITION_CONTENT_ANY. replace('[open]', (path + prop).replace('.', '\\.')).
                                                                                                                                                                replace('[close]', (path + prop).replace('.', '\\.')), 'gi');
                                            fragment    = fragment.replace(cache.regs[prop], '');
                                            refs        += refs === '' ? path + prop : '|' + path + prop;
                                        }
                                    });
                                    cache.regs[refs]    = cache.regs[refs] !== void 0 ? cache.regs[refs] : new RegExp(settings.css.attrs.CONDITION + '=".*?(' + refs + ').*?"', 'gi');
                                    fragment            = fragment.replace(cache.regs[refs], '');
                                } else {
                                    _object(conditions).forEach(function (prop, val) {
                                        var ref     = path + prop,
                                            open    = 'OPEN-' + ref,
                                            close   = 'CLOSE-' + ref;
                                        cache.removed[open]     = cache.removed[open]   !== void 0 ? cache.removed[open]    : new RegExp('<\\!--' + ref.replace('.', '\\.') + '=.{1,}?' + '-->', 'gi');
                                        cache.removed[close]    = cache.removed[close]  !== void 0 ? cache.removed[close]   : new RegExp('<\\!--' + ref.replace('.', '\\.') + '-->', 'gi');
                                        fragment = fragment.replace(cache.removed[open], '');
                                        fragment = fragment.replace(cache.removed[close], '');
                                    });
                                }
                            }
                            return fragment;
                        },
                        getByPath   : function (path, conditions){
                            var parts   = path.split('.'),
                                dest    = conditions !== void 0 ? (conditions !== false ? conditions : privates.conditions) : privates.conditions,
                                cache   = privates.cache.conditions;
                            if (path !== '' && cache[path] === void 0) {
                                parts.forEach(function (part) {
                                    if (dest !== null && dest[part] !== void 0 && typeof dest === 'object') {
                                        dest = dest[part];
                                    } else {
                                        dest = null;
                                    }
                                });
                                cache[path] = dest !== null ? (Object.keys(dest).length > 0 ? dest : null) : dest;
                            }
                            return path !== '' ? cache[path] : dest;
                        },
                        apply       : function () {
                            function addAnchors() {
                                if (!anchored) {
                                    Array.prototype.forEach.call(list, function (node, index) {
                                        var anchor = document.createTextNode('');
                                        node.parentNode.insertBefore(anchor, node);
                                        node.__anchor = anchor;
                                    });
                                    anchored = true;
                                }
                            };
                            function proccess(hooks, path, model, count) {
                                function instance(hooks, model, funcs, conds) {
                                    var Instance = function (hooks, model, funcs, conds) {
                                        this.hooks  = hooks;
                                        this.model  = model;
                                        this.funcs  = funcs;
                                        this.conds  = conds;
                                    };
                                    Instance.prototype = {
                                        getter  : function () {
                                            var self = this,
                                                data = {};
                                            _object(this.hooks).forEach(function (prop, val) {
                                                data[prop] = self.model[prop] !== void 0 ? self.model[prop] : val;
                                            });
                                            return data;
                                        },
                                        results : function (_prop, _val){
                                            var res     = {},
                                                data    = this.getter();
                                            if (_prop !== void 0) {
                                                data[_prop] = _val;
                                            }
                                            _object(funcs).forEach(function (prop, val) {
                                                res[prop] = val(data);
                                            });
                                            return res;
                                        },
                                        update  : function (_prop, _val) {
                                            var res = this.results(_prop, _val);
                                            _object(this.conds).forEach(function (prop, val) {
                                                var visible = true;
                                                val.conds.forEach(function (con) {
                                                    visible = !visible ? visible : (res[con.con] === con.val);
                                                });
                                                if (!visible) {
                                                    val.nodes.forEach(function (node) {
                                                        node.parentNode !== null && node.parentNode.removeChild(node);
                                                    });
                                                } else {
                                                    val.nodes.forEach(function (node) {
                                                        node.__anchor !== void 0 && node.__anchor.parentNode.insertBefore(node, node.__anchor);
                                                    });
                                                }
                                            });
                                        }
                                    };
                                    return new Instance(hooks, model, funcs, conds);
                                };
                                function bind(inst) {
                                    _object(model).forEach(function (prop, val) {
                                        if (typeof val !== 'object' && model[settings.other.BIND_PREFIX + prop] !== void 0) {
                                            model[settings.other.BIND_PREFIX + prop].bind(function (current, previous) {
                                                inst.update(prop, current);
                                            });
                                        }
                                    });
                                };
                                var _conds  = {},
                                    funcs   = {},
                                    res     = {},
                                    inst    = [];
                                if (helpers.isArray(hooks)) {
                                    hooks.forEach(function (_hooks, index) {
                                        proccess(_hooks, path, model !== null ? (model[index] !== void 0 ? model[index] : null) : null, hooks.length);
                                    });
                                } else if (typeof hooks === 'object'){
                                    _object(conds).forEach(function (prop, val) {
                                        var _count = null;
                                        if (val.path === path) {
                                            _count          = counts[prop] === void 0 ? nodes[prop].length / count : counts[prop];
                                            counts[prop]    = _count;
                                            if (nodes[prop].length >= _count) {
                                                _conds[prop] = {
                                                    conds: val.conditions,
                                                    nodes: nodes[prop].slice(0, _count)
                                                };
                                                nodes[prop].splice(0, _count);
                                            }
                                        }
                                    });
                                    if (Object.keys(_conds).length > 0) {
                                        funcs = condition.getByPath(path);
                                        if (funcs !== null) {
                                            inst = instance(hooks, model, funcs, _conds);
                                            if (model !== null && Object.keys(model).length > 0) {
                                                addAnchors();
                                                bind(inst);
                                                inst.update();
                                            } else {
                                                inst.update();
                                            }
                                        }
                                    }
                                    _object(hooks).forEach(function (prop, val) {
                                        var _prop = null;
                                        if (val instanceof settings.classes.CALLER) {
                                            _prop = settings.other.SUBLEVEL_BEGIN + prop + settings.other.SUBLEVEL_END;
                                            proccess(   val.hooks,
                                                        (path === '' ? '' : path + '.') + _prop,
                                                        model !== null ? (model[_prop] !== void 0 ? model[_prop] : null) : null,
                                                        -1);
                                        } else if (helpers.isArray(val)) {
                                            hooks.forEach(function (_hooks, index) {
                                                proccess(_hooks, path, model !== null ? (model[index] !== void 0 ? model[index] : null) : null, -1);
                                            });
                                        }
                                    });
                                }
                            };
                            var list        = _nodes('*[' + settings.css.attrs.CONDITION + ']', false, privates.wrapper).target,
                                nodes       = null,
                                conds       = {},
                                counts      = {},
                                anchored    = false;
                            if (list instanceof NodeList) {
                                Array.prototype.forEach.call(list, function (node, index) {
                                    var attr    = node.getAttribute(settings.css.attrs.CONDITION);
                                    conds[attr] = conds[attr] === void 0 ? [] : conds[attr];
                                    conds[attr].push(node);
                                    node.removeAttribute(settings.css.attrs.CONDITION);
                                });
                                nodes = conds;
                                conds = {};
                                _object(nodes).forEach(function (prop, val) {
                                    var conditions  = prop.split(','),
                                        path        = conditions[0].split('=')[0];
                                    conds[prop] = {
                                        path        : path.indexOf('.') === -1 ? '' : path.replace(/\.[\w\d_]{1,}$/gi, ''),
                                        conditions  : conditions.map(function (con) {
                                            con = con.split('=');
                                            return {
                                                con: con[0].indexOf('.') === -1 ? con[0] : con[0].replace(/.*[^\w\d]/gi, ''),
                                                val: con[1]
                                            };
                                        })
                                    };
                                });
                                proccess(   privates.hooks,
                                            '', 
                                            privates.map.model, 
                                            helpers.isArray(privates.hooks)? privates.hooks.length : 1);
                            }
                        }
                    };
                    controller  = {
                        convert     : function (controller, url){
                            controller = controller !== null ? controller : controllers.storage.get(url);
                            if (controller instanceof Function && (controller.prototype[settings.events.ONREADY] !== void 0 || controller.prototype[settings.events.ONUPDATE] !== void 0 || controller.prototype[settings.events.SETINSTNCE] !== void 0)) {
                                return new controller(privates.__instance);
                            } else {
                                return controller;
                            }
                        },
                        init        : function () {
                            privates.controller = controller.convert(privates.caller.controller, self.url);
                            privates.listener   = privates.listener === null ? new addition.listener.create(privates.__instance) : privates.listener;
                        },
                        events      : function () {
                            function process(refs, controllers) {
                                var paths = null;
                                if (typeof refs === 'object' && refs !== null) {
                                    controllers.push({
                                        path        : refs.path,
                                        controller  : refs.controller
                                    });
                                    if (refs.events instanceof Array && refs.events.length > 0) {
                                        paths = controllers.map(function (ref) {
                                            return ref.path;
                                        });
                                        paths = paths.reverse();
                                        refs.events.forEach(function (event) {
                                            controllers.forEach(function (contr, index) {
                                                var path    = paths[index] + (paths[index] !== '' ? '.' : '') + event.handle,
                                                    handle  = null;
                                                if (contr.controller !== null && typeof contr.controller === 'object') {
                                                    handle = _object(contr.controller).getByPath(path);
                                                    if (doms[event.id] !== void 0) {
                                                        if (handle instanceof Function) {
                                                            doms[event.id].forEach(function (item) {
                                                                if (~paths.indexOf(item.path)) {
                                                                    handle = handle.bind(contr.controller);
                                                                    item.nodeList.on(event.event, handle);
                                                                }
                                                            });
                                                        } else if (handle instanceof Array && handle.length === doms[event.id].length) {
                                                            doms[event.id].forEach(function (item, index) {
                                                                if (~paths.indexOf(item.path) && handle[index] instanceof Function) {
                                                                    handle[index] = handle[index].bind(contr.controller);
                                                                    item.nodeList.on(event.event, handle[index]);
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                    }
                                    if (refs.hooks !== void 0 && typeof refs.hooks === 'object' && refs.hooks !== null) {
                                        _object(refs.hooks).forEach(function (prop, val) {
                                            process(val, controllers.filter(function () { return true;}));
                                        });
                                    }
                                }
                            };
                            var refs = privates.map.refs,
                                doms = privates.cache.dom;
                            process(refs, []);
                        },
                        apply       : function (update) {
                            function process(hooks, model, _controller, exchange) {
                                if (hooks instanceof settings.classes.CALLER) {
                                    _controller = hooks.controller !== null ? hooks.controller : controllers.storage.get(hooks.url);
                                    process(hooks.hooks, model, _controller, hooks.exchange !== null ? hooks.exchange : exchange);
                                } else if (helpers.isArray(hooks)) {
                                    hooks.forEach(function (hooks, index) {
                                        if (hooks instanceof settings.classes.CALLER || typeof hooks === 'object' || helpers.isArray(hooks)) {
                                            process(hooks,
                                                    model !== null ? (model[index] !== void 0 ? model[index] : null) : null,
                                                    _controller,
                                                    exchange);
                                        }
                                    });
                                } else if (typeof hooks === 'object' && !helpers.isArray(hooks)) {
                                    if (_controller !== null) {
                                        controller.handle(_controller, model, exchange, update);
                                    }
                                    _object(hooks).forEach(function (name, hooks) {
                                        var ref = name;
                                        if (hooks instanceof settings.classes.CALLER) {
                                            ref = settings.other.SUBLEVEL_BEGIN + name + settings.other.SUBLEVEL_END;
                                        }
                                        if (hooks instanceof settings.classes.CALLER || typeof hooks === 'object' || helpers.isArray(hooks)) {
                                            process(hooks,
                                                    model !== null ? (model[ref] !== void 0 ? model[ref] : null) : null,
                                                    null,
                                                    exchange);
                                        }
                                    });
                                }
                            }
                            process(privates.hooks,
                                    privates.map.model,
                                    privates.controller,
                                    privates.caller.exchange === null ? null : privates.caller.exchange);
                        },
                        handle      : function (handle, model, exchange, update) {
                            function call(handle, _this) {
                                var _this = _this !== void 0 ? _this : privates.__instance;
                                handle.call(_this, {
                                    model   : model,
                                    listener: privates.listener,
                                    exchange: exchange,
                                    instance: privates.__instance
                                });
                            };
                            var update = typeof update === 'boolean' ? update : false;
                            if (handle instanceof Function) {
                                call(handle);
                            } else if (typeof handle === 'object' && handle !== null) {
                                if (update) {
                                    handle[settings.events.ONUPDATE] instanceof Function && call(handle[settings.events.ONUPDATE], handle);
                                } else {
                                    handle[settings.events.ONREADY] instanceof Function && call(handle[settings.events.ONREADY], handle);
                                }
                                if (handle[settings.events.SETINSTNCE] instanceof Function) {
                                    call(handle[settings.events.SETINSTNCE], handle)
                                } else {
                                    handle.model    = model;
                                    handle.listener = privates.listener;
                                    handle.exchange = exchange;
                                    handle.instance = privates.__instance;
                                }
                            }
                        }
                    };
                    cache       = {
                        reset   : function () {
                            privates.cache = {
                                regs        : {},
                                conditions  : {},
                                html        : {},
                                dom         : {}
                            };
                            return privates.cache;
                        },
                    };
                    hash        = {
                        getString   : function () {
                            function toString(obj) {
                                var _obj = null;
                                if (helpers.isArray(obj)) {
                                    return obj.map(function (obj) {
                                        return toString(obj);
                                    });
                                } else if (obj instanceof settings.classes.CALLER) {
                                    return {
                                        url     : obj.url,
                                        hooks   : toString(obj.hooks)
                                    };
                                } else if (typeof obj === 'object') {
                                    _obj = {};
                                    _object(obj).forEach(function (prop, obj) {
                                        _obj[prop] = toString(obj);
                                    });
                                    return _obj;
                                } else {
                                    return obj;
                                }
                            };
                            var res = {
                                url     : self.url,
                                hooks   : toString(privates.hooks)
                            };
                            return JSON.stringify(res);
                        },
                        setHash     : function () {
                            privates.hash = config.get().CACHE_PATTERNS ? (settings.other.CACHE_PATTERNS_PREFIX + helpers.getHash(hash.getString())): null;
                        },
                        getCache    : function (){
                            var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PATTERN_CACHE, {}),
                                target  = null;
                            if (config.get().CACHE_PATTERNS && privates.hash !== void 0 && privates.hash !== null) {
                                if (storage === null || storage[privates.hash] === void 0) {
                                    target = flex.localStorage.getJSON(privates.hash);
                                    if (target !== null) {
                                        storage[privates.hash] = target;
                                        return _object(storage[privates.hash]).copy();
                                    } else {
                                        return null;
                                    }
                                } else if (storage[privates.hash] !== void 0) {
                                    return _object(storage[privates.hash]).copy();
                                }
                            } else {
                                return null;
                            }
                        },
                        setCache    : function (obj) {
                            if (config.get().CACHE_PATTERNS && privates.hash !== void 0 && privates.hash !== null) {
                                flex.localStorage.addJSON(privates.hash, obj);
                            }
                        }
                    };
                    methods     = {
                        make    : function (update){
                            var update = typeof update === 'boolean' ? update : false;
                            html.build(false, privates.conditions);
                            hooks.anchors.html();
                            html.wrap();
                            hooks.anchors.convert();
                            model.bind();
                            model.combine();
                            model.accessors();
                            model.finalize();
                            dom.indexes();
                            condition.apply();
                            controller.apply(update);
                            controller.events();
                            html.map();
                        },
                        build   : function (callback) {
                            cache.reset();
                            hash.setHash();
                            condition.find();
                            controller.init();
                            mapping.refs();
                            methods.make(false);
                            controller.handle(privates.caller.onReady, privates.map.model, privates.caller.exchange);
                            controller.handle(callback, privates.map.model, privates.caller.exchange);
                            return {
                                nodes   : privates.wrapper.children,
                                model   : privates.map.model,
                            };
                        },
                        update  : function (hooks){
                            function getHooks(src, org, refs) {
                                var _hooks = [];
                                if (helpers.isArray(src) && helpers.isArray(org)) {
                                    if (src.length !== org.length) {
                                        org = null;
                                    }
                                } else {
                                    org = null;
                                }
                                src.forEach(function (hooks, index) {
                                    var item = {};
                                    if (typeof hooks === 'object') {
                                        _object(hooks).forEach(function (prop, val) {
                                            if (refs.hooks[prop] !== void 0) {
                                                item[prop] = Caller.instance({
                                                    url     : refs.hooks[prop].url,
                                                    hooks   : getHooks(val instanceof Array ? val : [val], org !== null ? (org[index][prop] instanceof settings.classes.CALLER ? org[index][prop].hooks : null) : null, refs.hooks[prop])
                                                });
                                            } else {
                                                item[prop] = val;
                                            }
                                        });
                                        org !== null && (_object(org[index]).forEach(function (prop, val) {
                                            item[prop] === void 0 && (item[prop] = val);
                                        }));
                                        _hooks.push(item);
                                    }
                                });
                                return _hooks;
                            };
                            var hooks   = helpers.isArray(hooks) ? hooks : [hooks],
                                _hooks  = null;
                            if (privates.map.refs !== null) {
                                _hooks          = getHooks(hooks, privates.hooks, privates.map.refs);
                                privates.hooks  = _hooks;
                                privates.caller.unmount();
                                methods.make(true);
                                controller.handle(privates.caller.onUpdate, privates.map.model, privates.caller.exchange);
                                privates.caller.mount(privates.wrapper.children);
                            }
                        },
                        html    : function (parent, conditions) {
                            var fragments = html.build(parent, conditions);
                            return {
                                html        : privates.html,
                                fragments   : fragments,
                            };
                        },
                    };
                    signature   = function () {
                        return logs.SIGNATURE + ':: pattern (' + self.url + ')';
                    };
                    returning   = {
                        build   : methods.build,
                        html    : methods.html,
                        update  : methods.update
                    };
                    return {
                        build   : returning.build,
                        html    : returning.html,
                        update  : returning.update,
                    };
                },
                instance: function (parameters) {
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',                  type: 'string'                                                          },
                                                                { name: 'conditions',           type: 'object',                                     value: {}           },
                                                                { name: 'caller',               type: 'object',                                     value: null         },
                                                                { name: 'hooks',                type: ['object', 'array'],                          value: null         }]) !== false) {
                        return _object({
                            parent          : settings.classes.PATTERN,
                            constr          : function () {
                                this.id     = flex.unique();
                                this.url    = flex.system.url.restore(parameters.url);
                                this.source = Source.storage.get(parameters.url);
                                if (this.source === null) {
                                    flex.logs.log(logs.pattern.CANNOT_FIND_SOURCE_OF_TEMPLATE + ': ' + this.url, flex.logs.types.CRITICAL);
                                    throw new Error(logs.pattern.CANNOT_FIND_SOURCE_OF_TEMPLATE + ': ' + this.url);
                                }
                            },
                            privates        : {
                                caller      : parameters.caller,
                                hooks       : parameters.hooks,
                                conditions  : parameters.conditions,
                                html        : null,
                                wrapper     : null,
                                map         : {
                                    model   : null,
                                    html    : null,
                                    hooks   : null,
                                    refs    : null,
                                    anchors : null,
                                },
                                listener    : null,
                                model       : null,
                                cache       : {
                                    html    : null,
                                    regs    : null
                                }
                            },
                            prototype       : Pattern.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                }
            };
            //BEGIN: caller class ===============================================
            Caller          = {
                proto   : function (privates){
                    var self        = this,
                        render      = null,
                        build       = null,
                        patterns    = null,
                        mount       = null,
                        unmount     = null,
                        signature   = null,
                        returning   = null;
                    patterns    = {
                        inHooks : function (hooks) {
                            var hooks = hooks === void 0 ? privates.hooks : hooks;
                            hooks = helpers.isArray(hooks) ? hooks : (hooks !== null ? new ExArray([hooks]) : null);
                            if (hooks !== null) {
                                hooks.forEach(function (_hooks) {
                                    _object(_hooks).forEach(function (hook_name, hook_value) {
                                        if (hook_value instanceof settings.classes.CALLER) {
                                            if (privates.patterns.indexOf(hook_value.url) === -1) {
                                                privates.patterns.push(hook_value.url);
                                                patterns.inHooks(hook_value.hooks);
                                            }
                                        }
                                    });
                                });
                            }
                            privates.patterns.indexOf(self.url) === -1 && privates.patterns.push(self.url);
                        },
                        inMap   : function (map) {
                            var map = map === void 0 ? privates.map : map;
                            if (map !== null && typeof map === 'object') {
                                _object(map).forEach(function (prop, val) {
                                    var url = null;
                                    if (val !== null && typeof val === 'object') {
                                        url = val.url !== void 0 ? flex.system.url.restore(val.url) : null;
                                        val.url     !== void 0 && (!~privates.patterns.indexOf(url) && privates.patterns.push(url));
                                        val.hooks   !== void 0 && patterns.inMap(val.hooks);
                                    }
                                });
                            }
                        },
                    };
                    mount       = function (nodes) {
                        var nodes   = nodes === void 0 ? privates.pattern.nodes : nodes,
                            context = [];
                        privates.mounted = Array.prototype.filter.call(nodes, function () { return true; });
                        if (privates.node !== null) {
                            Array.prototype.forEach.call(privates.node, function (parent) {
                                for (var i = 0, max = nodes.length; i < max; i += 1) {
                                    if (!privates.replace) {
                                        parent.appendChild(nodes[max !== nodes.length ? 0 : i]);
                                    } else {
                                        parent.parentNode.insertBefore(nodes[max !== nodes.length ? 0 : i], parent);
                                    }
                                }
                                if (privates.replace) {
                                    parent.parentNode.removeChild(parent);
                                }
                                !~context.indexOf(parent.parentNode) && context.push(parent.parentNode);
                            });
                        } else if (privates.before !== null) {
                            Array.prototype.forEach.call(privates.before, function (parent) {
                                for (var i = 0, max = nodes.length; i < max; i += 1){
                                    parent.parentNode !== null && parent.parentNode.insertBefore(nodes[max !== nodes.length ? 0 : i], parent);
                                }
                                !~context.indexOf(parent.parentNode) && context.push(parent.parentNode);
                            });
                        } else if (privates.after !== null) {
                            Array.prototype.forEach.call(privates.after, function (parent) {
                                var _before = parent.nextSibling !== void 0 ? parent.nextSibling : null;
                                if (_before !== null) {
                                    for (var i = 0, max = nodes.length; i < max; i += 1) {
                                        _before.parentNode.insertBefore(nodes[max !== nodes.length ? 0 : i], _before);
                                    }
                                } else {
                                    for (var i = 0, max = nodes.length; i < max; i += 1) {
                                        parent.parentNode && parent.parentNode.appendChild(nodes[max !== nodes.length ? 0 : i]);
                                    }
                                }
                                !~context.indexOf(parent.parentNode) && context.push(parent.parentNode);
                            });
                        }
                        if (mount.ui_created === void 0) {
                            mount.ui_created = true;
                            flex.oop.namespace.get('flex.libraries.ui.window.move'      ) !== null && flex.libraries.ui.window.move.    create();
                            flex.oop.namespace.get('flex.libraries.ui.window.focus'     ) !== null && flex.libraries.ui.window.focus.   create();
                            flex.oop.namespace.get('flex.libraries.ui.window.resize'    ) !== null && flex.libraries.ui.window.resize.  create();
                            flex.oop.namespace.get('flex.libraries.ui.window.maximize'  ) !== null && flex.libraries.ui.window.maximize.create();
                        }
                        layout.init(true, self.url);
                        flex.events.core.fire(flex.registry.events.ui.patterns.GROUP, flex.registry.events.ui.patterns.MOUNTED, context);
                    };
                    unmount     = function () {
                        var parent = null;
                        if (privates.mounted instanceof Array && privates.mounted.length > 0) {
                            parent = privates.mounted[0].parentNode !== void 0 ? (privates.mounted[0].parentNode !== null ? privates.mounted[0].parentNode : null) : null;
                            if (parent !== null) {
                                privates.mounted.forEach(function (node) {
                                    parent.removeChild(node);
                                });
                            }
                        }
                    };
                    render      = function (parameters) {
                        function makeComponentCaller(map) {
                            function getHooks(map, hooks) {
                                function obj(map, hooks) {
                                    var _hooks = {};
                                    _object(hooks).forEach(function (prop, val) {
                                        if (map.hooks[prop] !== void 0) {
                                            _hooks[prop] = Caller.instance({
                                                url     : map.hooks[prop].src,
                                                hooks   : getHooks(map.hooks[prop], val)
                                            });
                                        } else {
                                            _hooks[prop] = val;
                                        }
                                    });
                                    return _hooks;
                                };
                                if (helpers.isArray(hooks)) {
                                    return hooks.map(function (hooks) {
                                        return obj(map, hooks);
                                    });
                                } else {
                                    return obj(map, hooks);
                                }
                            };
                            var caller      = null,
                                _map        = _object(map).copy(),
                                params      = {
                                    id                  : privates.id,
                                    node                : privates.node,
                                    before              : privates.before,
                                    after               : privates.after,
                                    replace             : privates.replace,
                                    conditions          : privates.conditions,
                                    controller          : privates.controller === null ? controllers.storage.get(self.url) : privates.controller,
                                    onReady             : privates.onReady,
                                    exchange            : privates.exchange,
                                    remove_missing_hooks: privates.remove_missing_hooks,
                                    map                 : privates.map,
                                };
                            if (privates.hooks !== null) {
                                params.url      = map.src;
                                params.hooks    = getHooks(map, privates.hooks);
                                caller          = Caller.instance(params);
                                caller.render();
                            }
                            return caller;
                        };
                        function correctCallers() {
                            function check(hooks, map) {
                                if (helpers.isArray(hooks)) {
                                    hooks.forEach(function (_hooks) {
                                        _object(_hooks).forEach(function (name, obj) {
                                            if (map[name] !== void 0 && !(obj instanceof settings.classes.CALLER)) {
                                                _hooks[name] = Caller.instance({
                                                    url     : map[name].url,
                                                    hooks   : obj
                                                });
                                                map[name].hooks !== void 0 && check(_hooks[name].hooks, map[name].hooks);
                                            } else if (map[name] !== void 0 && map[name].hooks !== void 0 && obj instanceof settings.classes.CALLER) {
                                                check(obj.hooks, map[name].hooks);
                                            }
                                        });
                                    });
                                }
                            };
                            var map = Object.keys(privates.map).length === 0 ? defaultsmap.storage.get(self.url) : privates.map;
                            if (map !== null) {
                                if (privates.hooks !== null) {
                                    check(privates.hooks, map);
                                }
                            }
                        };
                        function checkAdditionRefs(callback) {
                            var map     = Object.keys(privates.map).length === 0 ? defaultsmap.storage.get(self.url) : privates.map,
                                count   = privates.patterns.length;
                            patterns.inMap(map);
                            if (count !== privates.patterns.length) {
                                Source.init(privates.patterns, callback, onFail);
                            } else {
                                callback();
                            }
                        };
                        function checkURLs(callback) {
                            function check(hooks) {
                                function asObj(hooks) {
                                    _object(hooks).forEach(function (name, obj) {
                                        if (obj instanceof settings.classes.URL) {
                                            flex.overhead.register.add(URL_REGISTER, name + obj.url);
                                            obj.load(function (response) {
                                                hooks[name] = response;
                                                flex.overhead.register.done(URL_REGISTER, name + obj.url);
                                            });
                                        } else if (obj instanceof settings.classes.CALLER) {
                                            check(obj.hooks);
                                        } else if (typeof obj === 'object' && obj !== null) {
                                            asObj(obj);
                                        } else if (helpers.isArray(obj)) {
                                            check(hooks);
                                        }
                                    });
                                };
                                if (helpers.isArray(hooks)) {
                                    hooks.forEach(function (_hooks, index) {
                                        if (_hooks instanceof settings.classes.URL) {
                                            flex.overhead.register.add(URL_REGISTER, _hooks.url);
                                            _hooks.load(function (response) {
                                                if (helpers.isArray(response)) {
                                                    hooks.splice(0, hooks.length);
                                                    response.forEach(function (item) {
                                                        hooks.push(item);
                                                    });
                                                } else {
                                                    hooks[index] = response;
                                                }
                                                flex.overhead.register.done(URL_REGISTER, _hooks.url);
                                            });
                                        } else {
                                            asObj(_hooks);
                                        }
                                    });
                                }
                            };
                            var URL_REGISTER = 'PATTERNS.URLS.REGISTER';
                            if (privates.hooks !== null) {
                                flex.overhead.register.open(URL_REGISTER, [], callback);
                                check(privates.hooks);
                                flex.overhead.register.isReady(URL_REGISTER) && callback();
                            } else {
                                callback();
                            }
                        };
                        function onSuccess(sources) {
                            //Check addition references
                            checkAdditionRefs(function () {
                                checkURLs(function () {
                                    //Setup default hooks
                                    if (helpers.isArray(privates.hooks)) {
                                        privates.hooks.forEach(function(hooks, index){
                                            privates.hooks[index] = defaultshooks.apply(hooks, self.url);
                                        });
                                    } else {
                                        privates.hooks = defaultshooks.apply({}, self.url);
                                        Object.keys(privates.hooks).length > 0  && (privates.hooks = new ExArray([privates.hooks]));
                                        !helpers.isArray(privates.hooks)        && (privates.hooks = null);
                                    }
                                    if (sources.length === 1 && sources[0].map().component !== null) {
                                        //This is component
                                        makeComponentCaller(sources[0].map().component);
                                    } else {
                                        //Correct callers
                                        correctCallers();
                                        //This is pattern
                                        privates.pattern = Pattern.instance({
                                            id      : privates.id,
                                            url     : self.url,
                                            hooks   : privates.hooks,
                                            caller  : privates.__instance
                                        }).build(parameters.callback);
                                        mount();
                                        return true;
                                    }
                                });
                            });
                        };
                        function onFail() {
                            flex.logs.log(signature() + logs.caller.CANNOT_INIT_PATTERN, flex.logs.types.CRITICAL);
                            privates.onReady(null, logs.caller.CANNOT_INIT_PATTERN, self.url);
                            throw logs.caller.CANNOT_INIT_PATTERN;
                        };
                        parameters = parameters === void 0 ? {} : parameters;
                        if (flex.oop.objects.validate(parameters, [ { name: 'node',     type: ['node', 'string', 'array', 'NodeList'],  value: privates.node    },
                                                                    { name: 'before',   type: ['node', 'string', 'array', 'NodeList'],  value: privates.before  },
                                                                    { name: 'after',    type: ['node', 'string', 'array', 'NodeList'],  value: privates.after   },
                                                                    { name: 'replace',  type: 'boolean',                                value: privates.replace },
                                                                    { name: 'callback', type: 'function',                               value: null             }]) !== false) {
                            privates.node       = parameters.node   !== null ? (typeof parameters.node      === 'string' ? _nodes(parameters.node   ).target : (parameters.node     instanceof Array ? parameters.node      : (parameters.node      instanceof NodeList ? parameters.node   : [parameters.node]     ))) : null;
                            privates.before     = parameters.before !== null ? (typeof parameters.before    === 'string' ? _nodes(parameters.before ).target : (parameters.before   instanceof Array ? parameters.before    : (parameters.before    instanceof NodeList ? parameters.before : [parameters.before]   ))) : null;
                            privates.after      = parameters.after  !== null ? (typeof parameters.after     === 'string' ? _nodes(parameters.after  ).target : (parameters.after    instanceof Array ? parameters.after     : (parameters.after     instanceof NodeList ? parameters.after  : [parameters.after]    ))) : null;
                            privates.replace    = parameters.replace;
                            checkURLs(function () {
                                patterns.inHooks();
                                patterns.inMap();
                                Source.init(privates.patterns, onSuccess, onFail);
                            });
                        }
                    };
                    build       = function () {
                        return Pattern.instance({
                            id      : privates.id,
                            url     : self.url,
                            hooks   : privates.hooks,
                            caller  : privates.__instance
                        }).build();
                    };
                    signature   = function () {
                        return logs.SIGNATURE + ':: caller (' + self.url + ')';
                    };
                    returning   = {
                        render      : render,
                        build       : build,
                        mount       : mount,
                        unmount     : unmount
                    };
                    return {
                        render      : returning.render,
                        build       : returning.build,
                        mount       : returning.mount,
                        unmount     : returning.unmount,
                        hooks       : privates.hooks,
                        map         : privates.map,
                        conditions  : privates.conditions,
                        controller  : privates.controller,
                        exchange    : privates.exchange,
                        onReady     : privates.onReady,
                    };
                },
                instance: function (parameters) {
                    /// <summary>
                    /// Load template; save it in virtual storage and local storage (if it's allowed)
                    /// </summary>
                    /// <param name="parameters" type="Object">Template parameters: &#13;&#10;
                    /// {   [string]            url                     (source of template),                                               &#13;&#10;
                    ///     [string || node]    node                    (target node for mount),                                            &#13;&#10;
                    ///     [boolean]           replace                 (true - replace node by template; false - append template to node), &#13;&#10;
                    ///     [object || array]   hooks                   (bind data),                                                        &#13;&#10;
                    ///     [object]            conditions              (conditions),                                                       &#13;&#10;
                    ///     [object]            onReady                 (onReady(res) in success, onReady(null, error, url) in fail,        &#13;&#10;
                    ///     [object]            exchange                (resources),                                                        &#13;&#10;
                    ///     [boolean]           remove_missing_hooks    (remove missed bind data),                                          &#13;&#10;
                    /// }</param>
                    /// <returns type="boolean">true - success; false - fail</returns>
                    if (flex.oop.objects.validate(parameters, [ //For public usage
                                                                { name: 'url',                  type: 'string'                                              },
                                                                { name: 'node',                 type: ['node', 'string', 'array', 'NodeList'],      value: null         },
                                                                { name: 'before',               type: ['node', 'string', 'array', 'NodeList'],      value: null         },
                                                                { name: 'after',                type: ['node', 'string', 'array', 'NodeList'],      value: null         },
                                                                { name: 'id',                   type: 'string',                                     value: flex.unique()},
                                                                { name: 'replace',              type: 'boolean',                                    value: false        },
                                                                { name: 'hooks',                type: ['object', 'array', settings.classes.URL],        value: null         },
                                                                { name: 'conditions',           type: 'object',                                     value: {}           },
                                                                { name: 'controller',           type: ['function', 'object'],                       value: null         },
                                                                { name: settings.events.ONREADY, type: 'function', value: function () { } },
                                                                { name: 'map',                  type: 'object',                                     value: {}           },
                                                                { name: 'exchange',             type: 'object',                                     value: null         },
                                                                { name: 'remove_missing_hooks', type: 'boolean',                                    value: true         },
                                                                //For internal usage
                                                                { name: 'component',            type: 'string',                                     value: null         }]) !== false) {
                        return _object({
                            parent          : settings.classes.CALLER,
                            constr          : function () {
                                this.id     = parameters.id;
                                this.url    = flex.system.url.restore(parameters.url);
                            },
                            privates        : {
                                //From parameters
                                id                  : parameters.id,
                                node                : parameters.node   !== null ? (typeof parameters.node      === 'string' ? _nodes(parameters.node   ).target : (parameters.node     instanceof Array ? parameters.node      : (parameters.node      instanceof NodeList ? parameters.node   : [parameters.node]     ))) : null,
                                before              : parameters.before !== null ? (typeof parameters.before    === 'string' ? _nodes(parameters.before ).target : (parameters.before   instanceof Array ? parameters.before    : (parameters.before    instanceof NodeList ? parameters.before : [parameters.before]   ))) : null,
                                after               : parameters.after  !== null ? (typeof parameters.after     === 'string' ? _nodes(parameters.after  ).target : (parameters.after    instanceof Array ? parameters.after     : (parameters.after     instanceof NodeList ? parameters.after  : [parameters.after]    ))) : null,
                                hooks               : parameters.hooks  !== null ? (parameters.hooks instanceof Array ? new ExArray(parameters.hooks) : new ExArray([parameters.hooks])) : null,
                                replace             : parameters.replace,
                                conditions          : parameters.conditions,
                                controller          : parameters.controller,
                                onReady             : parameters.onReady,
                                exchange            : parameters.exchange,
                                remove_missing_hooks: parameters.remove_missing_hooks,
                                map                 : parameters.map,
                                //Local
                                component           : parameters.component,
                                pattern             : null,
                                mounted             : null,
                                patterns            : []
                            },
                            prototype       : Caller.proto
                        }).createInstanceClass();
                    } else {
                        return null;
                    }
                }
            };
            //END: caller class ===============================================
            addition        = {
                nodeList: {
                    NODE_LIST   : function (nodeList){
                        function addID(smth) {
                            smth.collection_id  = flex.unique();
                            smth.indexes        = null;
                            return smth;
                        };
                        if (nodeList instanceof NodeList || nodeList instanceof Array) {
                            this.collections = [addID(nodeList)];
                        } else if (helpers.isNode(nodeList)) {
                            this.collections = [addID([nodeList])];
                        } else {
                            this.collections = [];
                        }
                    },
                    init        : function () {
                        addition.nodeList.NODE_LIST.prototype = {
                            add         : function (nodeList) {
                                function addID(smth) {
                                    smth.collection_id  = flex.unique();
                                    smth.indexes        = null;
                                    return smth;
                                };
                                if (nodeList instanceof NodeList || nodeList instanceof Array) {
                                    this.collections.push(addID(nodeList));
                                } else if (nodeList instanceof addition.nodeList.NODE_LIST) {
                                    this.collections = this.collections.concat(nodeList.collections);
                                } else if (helpers.isNode(nodeList)) {
                                    this.collections.push(addID([nodeList]));
                                }
                            },
                            setIndexes  : function (indexes) {
                                this.collections.forEach(function (collection) {
                                    collection.indexes = indexes;
                                });
                            },
                            exclude     : function (nodeList) {
                                var IDs     = [],
                                    indexes = [],
                                    self    = this;
                                if (nodeList instanceof addition.nodeList.NODE_LIST) {
                                    IDs     = nodeList.collections.map(function (collection) { return collection.collection_id; });
                                    self.collections.forEach(function (collection, index) {
                                        ~IDs.indexOf(collection.collection_id) && indexes.unshift(index);
                                    });
                                    indexes.forEach(function (index) {
                                        self.collections.splice(index, 1);
                                    });
                                }
                            },
                            css         : function (css) {
                                var self = this;
                                if (typeof css === 'object' && css !== null) {
                                    _object(css).forEach(function (name, value) {
                                        self.collections.forEach(function (nodeList) {
                                            Array.prototype.forEach.call(nodeList, function (node) {
                                                if (node.style[name] !== void 0) {
                                                    node.style[name] = value;
                                                }
                                            });
                                        });
                                    });
                                }
                            },
                            addClass    : function (className){
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        var classes = node.className.replace(/\s{2,}/gi, '').split(' ');
                                        if (classes.indexOf(className) === -1) {
                                            classes.push(className);
                                            node.className = classes.join(' ');
                                        }
                                    });
                                });
                            },
                            removeClass : function (className){
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        var classes = node.className.replace(/\s{2,}/gi, '').split(' '),
                                            index   = classes.indexOf(className);
                                        if (index !== -1) {
                                            classes.splice(index, 1);
                                            node.className = classes.join(' ');
                                        }
                                    });
                                });
                            },
                            show        : function () {
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        node.style.display = node.__display !== void 0 ? node.__display : 'block';
                                    });
                                });
                            },
                            hide        : function () {
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        node.__display      = node.style.display;
                                        node.style.display  = 'none';
                                    });
                                });
                            },
                            remove      : function (){
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        if (node.parentNode !== void 0 && node.parentNode !== null) {
                                            node.parentNode.removeChild(node);
                                        }
                                    });
                                });
                                this.collections = [];
                            },
                            append      : function (parent){
                                if (typeof parent.appendChild === 'function') {
                                    this.collections.forEach(function (nodeList) {
                                        Array.prototype.forEach.call(nodeList, function (node) {
                                            parent.appendChild(node);
                                        });
                                    });
                                }
                            },
                            insertBefore: function (before) {
                                if (before.parentNode !== void 0 && before.parentNode !== null && typeof before.parentNode.insertBefore === 'function' && helpers.isNode(before)) {
                                    this.collections.forEach(function (nodeList) {
                                        Array.prototype.forEach.call(nodeList, function (node) {
                                            before.parentNode.insertBefore(node, before);
                                        });
                                    });
                                }
                            },
                            attr        : function (name, value){
                                var result = [];
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        if (value !== void 0) {
                                            node.setAttribute(name, value);
                                            result.push(true);
                                        } else {
                                            result.push(node.getAttribute(name));
                                        }
                                    });
                                });
                                return result.length === 1 ? result[0] : result;
                            },
                            removeAttr  : function (name) {
                                var result = [];
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        result.push(node.removeAttribute(name));
                                    });
                                });
                                return result.length === 1 ? result[0] : result;
                            },
                            on          : function (event, handle){
                                var self = this;
                                if (typeof handle === 'function') {
                                    this.collections.forEach(function (collection) {
                                        Array.prototype.forEach.call(collection, function (node) {
                                            flex.events.DOM.add(node, event, function (event) { 
                                                handle(event, collection.indexes);
                                            });
                                        });
                                    });
                                } else {
                                    throw Error('Defined [handle] is not a function');
                                }
                            },
                            getAsArray  : function () {
                                var result = [];
                                this.collections.forEach(function (nodeList) {
                                    Array.prototype.forEach.call(nodeList, function (node) {
                                        result.push(node);
                                    });
                                });
                                return result;
                            }
                        };
                    },
                    create      : function (nodeList) {
                        return new addition.nodeList.NODE_LIST(nodeList);
                    },
                    addMethod   : function (name, method) {
                        if (typeof name === 'string' && typeof method === 'function') {
                            if (addition.nodeList.NODE_LIST.prototype[name] !== void 0) {
                                flex.logs.log('Method [' + name + '] of NODE_LIST list class was overwritten.', flex.logs.types.NOTIFICATION);
                            }
                            addition.nodeList.NODE_LIST.prototype[name] = method;
                        }
                    }
                },
                listener: {
                    LISTENER: function (instance) {
                        var instance        = instance,
                            handles         = {},
                            globals         = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.GLOBAL_EVENTS, {}),
                            bind            = null,
                            unbind          = null,
                            trigger         = null;
                        bind    = function bind(event, handle, id, globaly) {
                            var id      = ~['string', 'number'].indexOf(typeof id) ? id : flex.unique(),
                                globaly = typeof globaly    === 'boolean' ? globaly : false;
                            if (handle instanceof Function && ~['string', 'number'].indexOf(typeof event)) {
                                handles[event] !== void 0 ? handles[event] : {};
                                globaly     && (handles[event][id] = handle);
                                !globaly    && (globals[event][id] = handle);
                                handle[settings.other.EVENTS_HANDLE_ID] = id;
                                return id;
                            }
                            return false;
                        };
                        unbind  = function unbind(event, handle, id) {
                            var id      = ~['string', 'number'].indexOf(typeof id)      ? id    : null,
                                event   = ~['string', 'number'].indexOf(typeof event)   ? event : null,
                                handle  = handle instanceof Function ? handle : null;
                            if (event !== null) {
                                if (id === null && handle !== null) {
                                    id = handle[settings.other.EVENTS_HANDLE_ID] !== void 0 ? handle[settings.other.EVENTS_HANDLE_ID] : null;
                                }
                                if (id !== null) {
                                    handles[event][id] !== void 0 && (delete handles[event][id]);
                                    globals[event][id] !== void 0 && (delete globals[event][id]);
                                    Object.keys(handles[event]).length === 0 && (delete handles[event]);
                                    Object.keys(globals[event]).length === 0 && (delete globals[event]);
                                    return true;
                                }
                            }
                            return false;
                        };
                        trigger = function trigger(event, params, globaly) {
                            var event   = ~['string', 'number'].indexOf(typeof event) ? event : null,
                                globaly = typeof globaly    === 'boolean' ? globaly : false,
                                root    = typeof root       === 'boolean' ? root    : false,
                                storage = globaly ? globals : handles;
                            if (event !== null) {
                                if (storage[event] !== void 0) {
                                    _object(storage[event]).forEach(function (handle) {
                                        handle.call(instance, params);
                                    });
                                    return true;
                                }
                            }
                            return false;
                        };
                        this.bind           = function bind(event, handle, id) {
                            return bind(event, handle, id, false);
                        };
                        this.bindGlobal     = function bindGlobal(event, handle, id) {
                            return bind(event, handle, id, true);
                        };
                        this.unbind         = function unbind(event, handle, id) {
                            return unbind(event, handle, id);
                        };
                        this.trigger        = function trigger(event, params) {
                            return trigger(event, params, false);
                        };
                        this.triggerGlobal  = function triggerGlobal(event, params) {
                            return trigger(event, params, true);
                        };
                    },
                    create  : function () {
                        return new addition.listener.LISTENER(instance);
                    }
                },
                map     : {
                    MAP     : function (context) {
                        if (context !== void 0 && context.nodeType !== void 0) {
                            this.context = context;
                        } else {
                            throw Error('Context [context] should be a node.');
                        }
                    },
                    init    : function () {
                        addition.map.MAP.prototype = {
                            select: function (selector) {
                                var results = _nodes(selector, false, this.context);
                                if (results.target !== null && results.target.length > 0) {
                                    return results.target.length > 1 ? results.target : results.target[0];
                                } else {
                                    return null;
                                }
                            }
                        };
                    },
                    create  : function (context) {
                        return new addition.map.MAP(context);
                    }
                },
                url: {
                    create: function (url, parameters) {
                        return _object({
                            parent  : settings.classes.URL,
                            constr  : function () {
                                this.url                            = typeof url        === 'string' ? url          : null;
                                this.parameters                     = typeof parameters === 'object' ? parameters : {};
                                this.callback                       = null;
                                this.parameters.parser              = this.parameters.parser            !== void 0 ? this.parameters.parser             : null;
                                this.parameters.method              = this.parameters.method            !== void 0 ? this.parameters.method             : flex.ajax.methods.GET;
                                this.parameters.parameters          = this.parameters.parameters        !== void 0 ? this.parameters.parameters         : void 0;
                                this.parameters.settings            = this.parameters.settings          !== void 0 ? this.parameters.settings           : void 0;
                                this.parameters.callbacks           = this.parameters.callbacks         !== void 0 ? this.parameters.callbacks          : {};
                                this.parameters.callbacks.success   = this.parameters.callbacks.success !== void 0 ? this.parameters.callbacks.success  : null;
                                this.parameters.callbacks._success  = this.parameters.callbacks.success;
                                this.parameters.callbacks           = this.parameters.callbacks         !== void 0 ? this.parameters.callbacks          : {};
                                this.parameters.callbacks.fail      = this.parameters.callbacks.fail    !== void 0 ? this.parameters.callbacks.fail     : null;
                                this.parameters.callbacks._fail     = this.parameters.callbacks.fail;
                                if (this.url === null) {
                                    throw logs.url.URL_SHOULD_BE_DEFINED_AS_STRING;
                                }
                            },
                            privates    : { },
                            prototype   : function(){
                                var self        = this,
                                    onSuccess   = null,
                                    onFail      = null,
                                    load        = null,
                                    update      = null;
                                onSuccess   = function (response, event) {
                                    response = typeof self.parameters.parser === 'function' ? self.parameters.parser(response.parsed !== void 0 ? response.parsed : response.original) : (response.parsed !== void 0 ? response.parsed : response.original);
                                    typeof self.parameters.callbacks._success   === 'function' && self.parameters.callbacks._success(response, event);
                                    typeof self.callback                        === 'function' && self.callback(response, event);

                                };
                                onFail      = function (response, event) {
                                    typeof self.parameters.callbacks._fail  === 'function' && self.parameters.callbacks._fail(event);
                                    typeof self.callback                    === 'function' && self.callback(response, event);
                                };
                                load        = function (callback) {
                                    self.parameters.callbacks.success   = onSuccess;
                                    self.parameters.callbacks.fail      = onFail;
                                    self.callback                       = callback;
                                    var request = flex.ajax.send(
                                        self.url,
                                        self.parameters.method      !== void 0 ? self.parameters.method     : void 0,
                                        self.parameters.parameters  !== void 0 ? self.parameters.parameters : void 0,
                                        self.parameters.callbacks   !== void 0 ? self.parameters.callbacks  : void 0,
                                        self.parameters.settings    !== void 0 ? self.parameters.settings   : void 0
                                    );
                                    request.send();
                                };
                                update      = function (callback) {
                                    load(callback);
                                };
                                return {
                                    load : load
                                };
                            }
                        }).createInstanceClass();
                    }
                },
            };
            layout          = {
                journal     : {
                    data    : [],
                    add     : function (url) {
                        layout.journal.data.push(flex.system.url.restore(url));
                    },
                    done    : function (url) {
                        var index = layout.journal.data.indexOf(url);
                        index !== -1 && (layout.journal.data.splice(index, 1));
                        if (layout.journal.data.length === 0) {
                            if (typeof config.get().onLayoutBuildFinish === 'function' && config.get().onLayoutBuildFinish.started === void 0) {
                                config.get().onLayoutBuildFinish.started = true;
                                config.get().onLayoutBuildFinish();
                            }
                        }
                    }
                },
                getScheme   : function(){
                    var patterns = null,
                        scheme   = null;
                    layout.getScheme.scheme === void 0 && (layout.getScheme.scheme = {});
                    scheme = layout.getScheme.scheme;
                    if (Object.keys(scheme).length === 0) {
                        patterns = _nodes('link[rel="' + config.get().PATTERN_NODE + '"]').target;
                        if (patterns !== null && patterns instanceof NodeList && patterns.length > 0) {
                            Array.prototype.forEach.call(patterns, function (pattern) {
                                var name        = null,
                                    src         = null,
                                    hooks_set   = null;
                                if (pattern.hasAttribute('name') && pattern.hasAttribute('src')) {
                                    name        = pattern.getAttribute('name').toLowerCase();
                                    src         = pattern.getAttribute('src');
                                    hooks_set   = pattern.hasAttribute(config.get().HOOKS_SET) ? pattern.getAttribute(config.get().HOOKS_SET) : '';
                                    if (name.length > 0 && src.length > 0 && scheme[name] === void 0) {
                                        scheme[name] = {
                                            name        : name,
                                            src         : src,
                                            hooks_set   : hooks_set
                                        };
                                    } else {
                                        if (scheme[name] !== void 0) {
                                            flex.logs.log(logs.layout.PATTERN_SRC_DEFINED_TWICE_OR_MORE, flex.logs.types.WARNING);
                                        } else {
                                            flex.logs.log(logs.layout.PATTERN_SRC_OR_NAME_IS_TOO_SHORT, flex.logs.types.WARNING);
                                        }
                                    }
                                }
                            });
                        }
                    }
                    return scheme;
                },
                getHooksMap : function(){
                    var hooks   = null,
                        map     = null;
                    layout.getHooksMap.map === void 0 && (layout.getHooksMap.map = {});
                    map = layout.getHooksMap.map;
                    if (Object.keys(map).length === 0) {
                        hooks = _nodes('link[rel="hook"]').target;
                        if (hooks !== null && hooks instanceof NodeList && hooks.length > 0) {
                            Array.prototype.forEach.call(hooks, function (hook) {
                                var name    = null,
                                    src     = null;
                                if (hook.hasAttribute('name') && hook.hasAttribute('src')) {
                                    name    = hook.getAttribute('name').toLowerCase();
                                    src     = hook.getAttribute('src');
                                    if (name.length > 0 && src.length > 0 && map[name] === void 0) {
                                        map[name] = {
                                            name: name,
                                            src : src
                                        };
                                    } else {
                                        if (map[name] !== void 0) {
                                            flex.logs.log(logs.layout.HOOK_SRC_DEFINED_TWICE_OR_MORE, flex.logs.types.WARNING);
                                        } else {
                                            flex.logs.log(logs.layout.HOOK_SRC_OR_NAME_IS_TOO_SHORT, flex.logs.types.WARNING);
                                        }
                                    }
                                }
                            });
                        }
                    }
                    return map;
                },
                initByScheme: function (is_auto) {
                    var scheme  = layout.getScheme(),
                        nodes   = [];
                    if (Object.keys(scheme).length > 0) {
                        _object(scheme).forEach(function (prop, val) {
                            var patterns = _nodes(prop).target;
                            if (patterns !== null && patterns instanceof NodeList && patterns.length > 0) {
                                Array.prototype.forEach.call(patterns, function (pattern, index) {
                                    if (pattern.__in_work === void 0 && !layout.helpers.isNested(pattern)) {
                                        pattern.__in_work = true;
                                        layout.journal.add(val.src);
                                        nodes.push({
                                            node    : pattern,
                                            scheme  : val
                                        });
                                    }
                                });
                            }
                        });
                        nodes.forEach(function (pattern) {
                            pattern.node.setAttribute(config.get().PATTERN_SRC, pattern.scheme.src);
                            !pattern.node.hasAttribute(config.get().HOOKS_SET) && pattern.node.setAttribute(config.get().HOOKS_SET, pattern.scheme.hooks_set);
                            if (!pattern.node.hasAttribute(settings.events.ONREADY) || !is_auto) {
                                layout.caller(pattern.node);
                            }
                        });
                    }
                },
                initByHTML  : function (is_auto){
                    var patterns    = _nodes(config.get().PATTERN_NODE).target,
                        is_auto     = typeof is_auto === 'boolean' ? is_auto : false,
                        nodes       = [];
                    if (patterns !== null && patterns instanceof NodeList && patterns.length > 0) {
                        Array.prototype.forEach.call(patterns, function (pattern) {
                            if (pattern.__in_work === void 0 && !layout.helpers.isNested(pattern) && pattern.hasAttribute(config.get().PATTERN_SRC)) {
                                pattern.__in_work = true;
                                layout.journal.add(pattern.getAttribute(config.get().PATTERN_SRC));
                                nodes.push(pattern);
                            }
                        });
                        nodes.forEach(function (pattern) {
                            if (!layout.helpers.isNested(pattern)) {
                                if (!pattern.hasAttribute(settings.events.ONREADY) || !is_auto) {
                                    layout.caller(pattern);
                                }
                            }
                        });
                    }
                },
                init        : function (is_auto, url){
                    layout.initByScheme(is_auto);
                    layout.initByHTML(is_auto);
                    url !== void 0 && (layout.journal.done(url));
                },
                caller      : function (pattern, is_child, path, hooks_set) {
                    function getIndex(source, hook) {
                        var index = -1;
                        try{
                            source.forEach(function(hooks, _index){
                                if (hooks[hook] === void 0){
                                    index = _index;
                                    throw 'found';
                                }
                            });
                        }catch(e){}
                        return index;
                    };
                    function getCallback(pattern, type) {
                        var callback = pattern.getAttribute(type),
                            parts       = null;
                        if (typeof callback === 'string' && callback !== '') {
                            parts       = callback.split('.');
                            callback    = window;
                            parts.forEach(function (part) {
                                if (callback !== null && callback[part] !== void 0) {
                                    callback = callback[part];
                                } else {
                                    callback = null;
                                }
                            });
                            return callback;
                        } else {
                            return null;
                        }
                    };
                    function hasHooks(pattern, url, hooks_set) {
                        var status = -1;
                        if (pattern.children !== void 0 && pattern.children.length > 0) {
                            Array.prototype.forEach.call(pattern.children, function (child) {
                                var hook    = child.nodeName.toLowerCase(),
                                    is_hook = hook.indexOf(config.get().HOOK_PREFIX) === 0 ? true : (hooks_set.indexOf(hook) !== -1);
                                status = status === -1 ? is_hook : (status ? (!is_hook ? null : status) : (is_hook ? null : status));
                                if (status === null) {
                                    flex.logs.log(logs.layout.HOOK_CANNOT_BE_DEFINED_WITH_OTHER_TAGS + ' (' + url + ')', flex.logs.types.CRITICAL);
                                    throw new Error(logs.layout.HOOK_CANNOT_BE_DEFINED_WITH_OTHER_TAGS + ' (' + url + ')');
                                }
                            });
                        }
                        status === -1 && (status = false);
                        return status;
                    };
                    function getHookName(nodeName) {
                        return nodeName.indexOf(config.get().HOOK_PREFIX) === 0 ? nodeName.replace(config.get().HOOK_PREFIX, '') : nodeName;
                    };
                    function getHooksSet(pattern) {
                        var hooks_set = pattern.hasAttribute(config.get().HOOKS_SET) ? pattern.getAttribute(config.get().HOOKS_SET) : [];
                        if (typeof hooks_set === 'string') {
                            hooks_set = hooks_set.split(',');
                            hooks_set = hooks_set.map(function (hook) {
                                return hook.replace(/\s/gi, '');
                            });
                        }
                        return hooks_set;
                    };
                    function processing(child, hook) {
                        var index   = 0,
                            hook    = hook === void 0 ? getHookName(child.nodeName.toLowerCase()) : hook;
                        if (_caller.hooks[hook] !== void 0 && !(_caller.hooks instanceof Array)) {
                            _caller.hooks = [_caller.hooks];
                        }
                        if (_caller.hooks instanceof Array) {
                            index = getIndex(_caller.hooks, hook);
                            if (index === -1) {
                                _caller.hooks.push({});
                                index = _caller.hooks.length - 1;
                            }
                            if (!hasHooks(child, _caller.url, hooks_set)) {
                                _caller.hooks[index][hook] = child.innerHTML;
                            } else {
                                _caller.hooks[index][hook] = layout.caller(child, true, path + (path === '' ? '' : '.') + hook, hooks_set);
                            }
                        } else {
                            if (!hasHooks(child, _caller.url, hooks_set)) {
                                _caller.hooks[hook] = child.innerHTML;
                            } else {
                                _caller.hooks[hook] = layout.caller(child, true, path + (path === '' ? '' : '.') + hook, hooks_set);
                            }
                        }
                    };
                    var _caller     = null,
                        is_child    = is_child !== void 0 ? is_child : false,
                        path        = path !== void 0 ? path : pattern.nodeName.toLowerCase(),
                        url         = null,
                        map         = layout.getHooksMap(),
                        single      = hooks_set instanceof Array ? false : true,
                        hooks_set   = hooks_set instanceof Array ? hooks_set.concat(getHooksSet(pattern)) : getHooksSet(pattern),
                        hooks_src   = pattern.hasAttribute(config.get().HOOKS_SRC) ? pattern.getAttribute(config.get().HOOKS_SRC) : null;
                    if (hooks_src !== null && hooks_src !== '') {
                        _caller = {
                            url     : pattern.hasAttribute(config.get().PATTERN_SRC) ? pattern.getAttribute(config.get().PATTERN_SRC) : (map[path] !== void 0 ? map[path].src : null),
                            hooks   : addition.url.create(hooks_src)
                        };
                    } else {
                        single = single ? (hooks_set.length === 1 ? hooks_set[0] : false) : false;
                        _caller = {
                            url     : pattern.hasAttribute(config.get().PATTERN_SRC) ? pattern.getAttribute(config.get().PATTERN_SRC) : (map[path] !== void 0 ? map[path].src : null),
                            hooks   : {}
                        };
                        if (single !== false && !hasHooks(pattern, _caller.url, hooks_set)) {
                            processing(pattern, single);
                        } else {
                            Array.prototype.forEach.call(pattern.children, function (child) {
                                processing(child);
                            });
                        }
                        if (typeof _caller.hooks === 'object' && Object.keys(_caller.hooks).length === 0) {
                            delete _caller.hooks;
                        }
                    }
                    if (!is_child && _caller.url !== null) {
                        _caller.node        = pattern;
                        _caller.replace     = true;
                        _caller.onReady     = getCallback(pattern, settings.events.ONREADY);
                        _caller             = Caller.instance(_caller).render();
                        return _caller;
                    } else {
                        if (_caller.url !== null) {
                            _caller = Caller.instance(_caller);
                            return _caller;
                        }
                    }
                    return _caller.hooks;
                },
                attach      : function () {
                    if (document.readyState !== 'complete') {
                        flex.events.DOM.add(window, 'load', function () {
                            layout.init(true);
                        });
                    } else {
                        layout.init(true);
                    }
                },
                helpers     : {
                    isNested: function (pattern) {
                        var nodeName    = null,
                            scheme      = layout.getScheme();
                        if (pattern.parentNode !== void 0 && pattern.parentNode !== null) {
                            nodeName = pattern.parentNode.nodeName.toLowerCase();
                            return nodeName === config.get().PATTERN_NODE.toLowerCase() ? true : (scheme[nodeName] !== void 0 ? true : (nodeName === 'body' ? false : layout.helpers.isNested(pattern.parentNode)));
                        } else {
                            return false;
                        }
                    }
                }
            };
            controllers     = {
                references  : {
                    assign          : function (url, pattern_url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_LINKS, {});
                        if (storage[url] === void 0) {
                            storage[url] = pattern_url;
                        }
                    },
                    getPatternURL   : function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_LINKS, {});
                        return storage[url] !== void 0 ? storage[url] : null;
                    }
                },
                storage     : {
                    add : function (pattern_url, controller) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_STORAGE, {});
                        if (storage[pattern_url] === void 0) {
                            storage[pattern_url] = controller;
                        } else {
                            flex.logs.log('[' + pattern_url + ']' + logs.controller.CONTROLLER_DEFINED_MORE_THAN_ONCE, flex.logs.types.WARNING);
                        }
                    },
                    get : function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONTROLLERS_STORAGE, {});
                        return storage[url] !== void 0 ? storage[url] : null;
                    },
                },
                current     : {
                    data    : null,
                    set     : function (url){
                        controllers.current.data = url;
                    },
                    get     : function () {
                        return controllers.current.data;
                    },
                    reset   : function () {
                        controllers.current.data = null;
                    },
                },
                attach      : function (controller) {
                    var url     = null,
                        _source = null;
                    if (~['function', 'object'].indexOf(typeof controller)) {
                        url = controllers.current.get() !== null ? controllers.current.get() : flex.resources.attach.js.getCurrentSRC();
                        if (url !== null) {
                            _source = controllers.references.getPatternURL(url);
                            controllers.storage.add(_source, controller);
                        }
                    }
                },
            };
            storage         = {
                virtual : {
                    add: function (url, content) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            if (storage[url] === void 0) {
                                storage[url] = content;
                                return true;
                            }
                        }
                    },
                    get: function (url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            return (storage[url] !== void 0 ? storage[url] : null);
                        }
                        return null;
                    }
                },
                local   : {
                    add: function (url, content) {
                        if (config.get().USE_LOCALSTORAGE === true) {
                            return flex.localStorage.addJSON(url, {
                                html: content,
                                hash: flex.hashes.get(url)
                            });
                        }
                        return false;
                    },
                    get: function (url) {
                        function resetPatternsCache() {
                            if (storage.local.resetPatternsCache === void 0) {
                                flex.localStorage.reset(settings.other.CACHE_PATTERNS_PREFIX);
                                storage.local.resetPatternsCache = true;
                            }
                        };
                        var target = null;
                        if (config.get().USE_LOCALSTORAGE === true) {
                            flex.hashes.update(url);
                            target = flex.localStorage.getJSON(url);
                            if (target !== null) {
                                if (target.hash === flex.hashes.get(url)) {
                                    return target.html;
                                } else {
                                    resetPatternsCache();
                                }
                            }
                        } else {
                            resetPatternsCache();
                        }
                        return null;
                    }
                },
                add     : function (url, content) {
                    storage.local.  add(url, content);
                    storage.virtual.add(url, content);
                },
                get     : function (url) {
                    var result = storage.virtual.get(url);
                    if (result === null) {
                        result = storage.local.get(url);
                    }
                    return result;
                },
            };
            measuring       = {
                measure: (function () {
                    var storage = {};
                    return function (id, operation) {
                        if (settings.measuring.MEASURE) {
                            var id = id === void 0 ? flex.unique() : id;
                            if (storage[id] === void 0) {
                                storage[id] = performance.now();
                            } else {
                                flex.logs.log(logs.SIGNATURE + 'Operation [' + operation + '] was taken ' + (performance.now() - storage[id]).toFixed(4) + 'ms.', flex.logs.types.NOTIFICATION);
                                delete storage[id];
                            }
                            return id;
                        }
                    };
                }())
            };
            conditions      = {
                storage : {
                    add: function (pattern_url, _conditions) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONDITIONS_STORAGE, {});
                        storage[pattern_url] = _conditions;
                    },
                    get : function (pattern_url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CONDITIONS_STORAGE, {});
                        return storage[pattern_url] !== void 0 ? storage[pattern_url] : null;
                    },
                },
                attach  : function (_conditions) {
                    var url     = null,
                        _source = null;
                    if (typeof _conditions === 'object' && _conditions !== null) {
                        url = controllers.current.get() !== null ? controllers.current.get() : flex.resources.attach.js.getCurrentSRC();
                        if (url !== null) {
                            _source = controllers.references.getPatternURL(url);
                            conditions.storage.add(_source, _conditions);
                        }
                    }
                }
            };
            defaultshooks   = {
                storage : {
                    add: function (pattern_url, _hooks) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.HOOKS_STORAGE, {});
                        storage[pattern_url] = _hooks;
                    },
                    get : function (pattern_url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.HOOKS_STORAGE, {});
                        return storage[pattern_url] !== void 0 ? storage[pattern_url] : null;
                    },
                },
                attach  : function (_hooks) {
                    var url     = null,
                        _source = null;
                    if (typeof _hooks === 'object' && _hooks !== null) {
                        url = controllers.current.get() !== null ? controllers.current.get() : flex.resources.attach.js.getCurrentSRC();
                        if (url !== null) {
                            _source = controllers.references.getPatternURL(url);
                            defaultshooks.storage.add(_source, _hooks);
                        }
                    }
                },
                apply   : function (hooks, url) {
                    function process(source, destination) {
                        _object(source).forEach(function (hook_name, hook_value) {
                            if (destination[hook_name] === void 0) {
                                destination[hook_name] = hook_value;
                            } else {
                                if (destination[hook_name] !== null && typeof destination[hook_name] === 'object') {
                                    process(hook_value, destination[hook_name]);
                                }
                            }
                        });
                    };
                    var defaults = defaultshooks.storage.get(url);
                    if (defaults !== null && typeof defaults === 'object') {
                        process(defaults, hooks);
                    }
                    return hooks;
                }
            };
            defaultsmap     = {
                storage : {
                    add: function (pattern_url, _hooks) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.MAPS_STORAGE, {});
                        storage[pattern_url] = _hooks;
                    },
                    get : function (pattern_url) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.MAPS_STORAGE, {});
                        return storage[pattern_url] !== void 0 ? storage[pattern_url] : null;
                    },
                },
                attach  : function (_map) {
                    var url     = null,
                        _source = null;
                    if (typeof _map === 'object' && _map !== null) {
                        url = controllers.current.get() !== null ? controllers.current.get() : flex.resources.attach.js.getCurrentSRC();
                        if (url !== null) {
                            _source = controllers.references.getPatternURL(url);
                            defaultsmap.storage.add(_source, _map);
                        }
                    }
                }
            };
            helpers         = {
                testReg     : function(reg, str){
                    reg.lastIndex = 0;
                    return reg.test(str);
                },
                binds       : {
                    data        : {
                        value: [
                            //Group #1
                            {
                                nodes   : ['input', 'textarea'],
                                event   : 'change',
                                getter  : function () { return this.value; },
                                setter  : function (value) { this.value = value; }
                            }
                        ],
                    },
                    assing      : function (node, prop_name, handle) {
                        var node_name   = node.nodeName.toLowerCase(),
                            group       = null;
                        if (helpers.binds.data[prop_name] !== void 0) {
                            helpers.binds.data[prop_name].forEach(function (_group) {
                                if (_group.nodes.indexOf(node_name) !== -1) {
                                    group = _group;
                                }
                            });
                            if (group !== null) {
                                (function (event, node, getter, setter, handle) {
                                    _node(node).events().add(event, function (event) {
                                        handle.call(node, event, getter, setter);
                                    });
                                }(group.event, node, group.getter.bind(node), group.setter.bind(node), handle));
                            }
                        }
                        return false;
                    },
                    isPossible  : function (node, prop_name) {
                        var node_name = node.nodeName.toLowerCase();
                        if (helpers.binds.data[prop_name] !== void 0) {
                            try{
                                helpers.binds.data[prop_name].forEach(function (_group) {
                                    if (_group.nodes.indexOf(node_name) !== -1) {
                                        throw 'found';
                                    }
                                });
                            } catch (e) {
                                return e === 'found' ? true : false;
                            }
                        }
                        return false;
                    }
                },
                isNode      : function (something) {
                    if (something !== void 0 && something.nodeName !== void 0 && something.parentNode !== void 0 && something.nodeType !== void 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                isArray     : function (arr) { return arr instanceof Array ? true : arr instanceof ExArray;},
                getTextNode : function (node, text, index) {
                    var target  = null,
                        index   = index !== void 0 ? index : null;
                    if (node.childNodes !== void 0) {
                        if (index !== null && node.childNodes[index] !== void 0 && node.childNodes[index].nodeValue === text) {
                            target = node.childNodes[index];
                        } else {
                            try {
                                Array.prototype.forEach.call(node.childNodes, function (child) {
                                    if (child.nodeType === 3 && child.nodeValue === text) {
                                        target = child;
                                        throw 'found';
                                    }
                                });
                            } catch (e) { }
                        }
                    }
                    return target;
                },
                getPattern  : function (html){
                    var tag = helpers.getFirstTag(html);
                    if (tag !== null){
                        return helpers.getParentFor(tag);
                    }
                    return null;
                },
                getHash     : function (str){
                    //Source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
                    var hash = 0, i, chr, len;
                    if (str.length === 0) return hash;
                    for (i = 0, len = str.length; i < len; i++) {
                        chr = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + chr;
                        hash |= 0; // Convert to 32bit integer
                    }
                    return hash.toString();
                },
                getFirstTag : function (html) {
                    var tag = html.match(settings.regs.FIRST_TAG);
                    if (tag !== null) {
                        if (tag.length === 1) {
                            return tag[0].replace(settings.regs.TAG_BORDERS, '').replace(/\s/gi, '').match(settings.regs.FIRST_WORD)[0].toLowerCase()
                        }
                    }
                    return null;
                },
                getParentFor: function (child_tag) {
                    if (typeof child_tag === 'string') {
                        if (settings.compatibility.CHILD_TO_PARENT[child_tag] !== void 0) {
                            return document.createElement(settings.compatibility.CHILD_TO_PARENT[child_tag]);
                        } else {
                            return document.createElement(settings.compatibility.BASE);
                        }
                    } else {
                        return null;
                    }
                }
            };
            callers         = {
                init    : function () {
                    flex.callers.define.node('ui.patterns.append', function (parameters) {
                        if (typeof parameters === 'object' && this.target) {
                            parameters.node = this.target;
                        }
                        return Caller.instance(parameters);
                    });
                    flex.callers.define.nodes('ui.patterns.append', function () {
                        var result = [];
                        Array.prototype.forEach.call(this.target, function (target) {
                            if (typeof parameters === 'object' && this.target) {
                                parameters.node = this.target;
                            }
                            result.push(Caller.instance(parameters));
                        });
                        return result;
                    });
                }
            };
            //Init addition classes
            addition.nodeList.init();
            addition.map.init();
            //Add events
            (function () {
                flex.registry.events.ui             === void 0 && (flex.registry.events.ui          = {});
                flex.registry.events.ui.patterns    === void 0 && (flex.registry.events.ui.patterns = {
                    GROUP   : 'flex.registry.events.ui.patterns',
                    MOUNTED : 'MOUNTED'
                });
            }());
            //Private part
            privates    = {
                preload     : Source.init,
                get         : Caller.instance,
                controller  : {
                    attach  : controllers.attach
                },
                conditions  : {
                    attach  : conditions.attach
                },
                hooks       : {
                    attach  : defaultshooks.attach
                },
                map         : {
                    attach  : defaultsmap.attach
                },
                classes     : {
                    NODE_LIST: {
                        addMethod : addition.nodeList.addMethod
                    }
                },
                setup       : config.setup,
                debug       : config.debug,
                layout      : layout.init,
                url         : addition.url.create
            };
            //Global callers
            callers.init();
            window['_controller'] = privates.controller.attach;
            window['_conditions'] = privates.conditions.attach;
            window['_hooks'     ] = privates.hooks.attach;
            window['_map'       ] = privates.map.attach;
            //Run layout parser
            layout.attach();
            //Public part
            return {
                preload : privates.preload,
                get     : privates.get,
                classes : {
                    NODE_LIST: {
                        addMethod: privates.classes.NODE_LIST.addMethod
                    }
                },
                setup   : privates.setup,
                debug   : privates.debug,
                layout  : privates.layout,
                url     : privates.url
            };
        };
        flex.modules.attach({
            name            : 'ui.patterns',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html', 'flex.binds', 'flex.types.array'],
            onAfterAttach   : function () {
                flex.libraries.events.      create();
                flex.libraries.html.        create();
                flex.libraries.binds.       create();
                flex.libraries.types.array.create();
                window['_patterns'] = flex.libraries.ui.patterns.create();
            }
        });
    }
}());