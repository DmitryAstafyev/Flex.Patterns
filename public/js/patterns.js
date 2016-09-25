/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright � 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
* This file (core / module) is released under the Apache License (Version 2.0). See [LICENSE] file for details.    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/// <reference path='intellisense/flex.callers.node.intellisense.js' />
/// <reference path='intellisense/flex.callers.nodes.intellisense.js' />
/// <reference path='intellisense/flex.callers.object.intellisense.js' />
/// <reference path="intellisense/flex.intellisense.js" />
/// <module>
///     <summary>
///         Basic module of [flex].
///     </summary>
/// </module>
(function () {
    "use strict";
    //Create class
    var Flex = function () {};
    //Define class
    Flex.prototype = (function () {
        var information     = {
                name    : "Flex::: web tools",
                version : "0.58",
                author  : "Dmitry Astafyev",
            },
            config          = {},
            coreEvents      = {},
            options         = {},
            ajax            = {},
            events          = {},
            oop             = {},
            arrays          = {},
            patterns        = {},
            privates        = {},
            hashes          = {},
            cache           = {},
            modules         = {},
            external        = {},
            asynchronous    = {},
            overhead        = {},
            parsing         = {},
            system          = {},
            IDs             = {},
            wrappers        = {},
            logs            = {};
        config          = {
            defaults    : {
                resources   : {
                    USE_STORAGED        : { type: 'boolean',    value: false    },
                    WAIT_ASYNCHRONOUS   : { type: 'boolean',    value: true     },
                    MODULES             : { type: 'array',      value: []       },
                    EXTERNAL            : { type: 'array',      value: []       },
                    ASYNCHRONOUS        : { type: 'array',      value: []       }
                },
                paths       : {
                    CORE    : {
                        type    : 'string',
                        value   : function () {
                            function accept(url) {
                                url                     = system.url.parse(url.toLowerCase());
                                options.files.CORE      = url.target;
                                options.files.CORE_URL  = url.url;
                                url                     = url.path;
                                return url;
                            };
                            var url     = system.resources.js.getCurrentSRC(true),
                                script  = null;
                            if (url !== null) {
                                return accept(url);
                            } else {
                                script = document.querySelector('script[src*="' + options.files.CORE + '"]');
                                if (script !== null) {
                                    return accept(script.src);
                                }
                            }
                            throw new Error('Cannot detect URL and PATH to core script (default name: flex.core.js)');
                        }
                    },
                    ATTACH  : { type: 'string',     value: '/app'       },
                },
                events      : {
                    /// <field type = 'function'>This event fires after FLEX finished loading all (module + external resources)</field>
                    onFlexLoad      : { type: 'function',   value: null         },
                    /// <field type = 'function'>This event fires on [window.onLoad], but not early than [onFlexLoad]</field>
                    onPageLoad      : { type: 'function',   value: null         },
                },
                settings    : {
                    /// <field type = 'boolean'>True - in all parsed CSS files will be done correction of paths (path like this "../step/step/some.some" will be corrected to "fullpath/step/step/some.some"</field>
                    CHECK_PATHS_IN_CSS      : { type: 'boolean',    value: false        },
                    ATTACH_PATH_SIGNATURE   : { type: 'string',     value: 'ATTACH::'   },
                    KERNEL_PATH_SIGNATURE   : { type: 'string',     value: 'KERNEL::'   },
                },
                patterns    : {
                    TEST_FUNCTION : 'flexPatternTest'
                },
                cache       : {
                    reset   : {
                        /// <field type = 'boolean'>Reset whole cache if some new resource detected</field>
                        ON_NEW_MODULE       : { type: 'boolean', value: true },
                        /// <field type = 'boolean'>Reset whole cache if some resource is updated</field>
                        ON_UPDATED_MODULE   : { type: 'boolean', value: false },
                        /// <field type = 'boolean'>Reset whole cache if some new resource detected</field>
                        ON_NEW_RESOURCE     : { type: 'boolean', value: false },
                        /// <field type = 'boolean'>Reset whole cache if some resource is updated</field>
                        ON_UPDATED_RESOURCE : { type: 'boolean', value: false },
                        /// <field type = 'boolean'>Reset whole cache if some critical error was</field>
                        ON_CRITICAL_ERROR   : { type: 'boolean', value: true },
                    }
                },
                logs        : {
                    SHOW: { type: 'array', value: ['CRITICAL', 'LOGICAL', 'WARNING'] }
                },
            },
            init        : function (settings) {
                function validate(section, settings, path) {
                    function getType(property) {
                        if (property instanceof Array) {
                            return 'array';
                        } else {
                            return typeof property;
                        }
                    };
                    var path    = path || '',
                        setting = null;
                    if (typeof section.content === 'object') {
                        if (section.content.type !== void 0 && section.content.value !== void 0) {
                            setting = oop.namespace.get(path, settings);
                            if (getType(setting) === section.content.type) {
                                section.parent[section.name] = setting;
                            } else {
                                section.parent[section.name] = typeof section.content.value === 'function' ? section.content.value() : section.content.value;
                            }
                        } else {
                            for (var property in section.content) {
                                validate(
                                    {
                                        content : section.content[property],
                                        parent  : section.content,
                                        name    : property
                                    },
                                    settings,
                                    path + (path === '' ? '' : '.') + property
                                );
                            }
                        }
                    }
                };
                var backup      = overhead.globaly.get(options.storage.GROUP, options.storage.DEFAULT_CONFIG),
                    inited      = overhead.globaly.get(options.storage.GROUP, options.storage.DEFAULT_CONFIG_FLAG);
                if (inited === null) {
                    if (backup === null) {
                        overhead.globaly.set(options.storage.GROUP, options.storage.DEFAULT_CONFIG, oop.objects.copy(config.defaults))
                    } else {
                        config.defaults = oop.objects.copy(backup);
                    }
                    if (settings) {
                        inited = overhead.globaly.set(options.storage.GROUP, options.storage.DEFAULT_CONFIG_FLAG, true);
                    }
                    validate(
                        {
                            content : config.defaults,
                            parent  : null,
                            name    : null
                        },
                        settings || {}
                    );
                    if (settings !== void 0) {
                        patterns.modification();
                        cache.init();
                        modules.preload();
                        asynchronous.preload();
                    }
                } else {
                    logs.log('[CORE]:: flex was initialized before. Initialization can be done only once per session.', logs.types.WARNING);
                }
            },
            get         : function () {
                return config.defaults;
            },
            set         : function (_config) {
                for (var key in _config) {
                    if (config.defaults[key] !== void 0 && typeof config.defaults[key] === typeof _config[key]) {
                        config.defaults[key] = _config[key];
                    }
                }
            }
        };
        coreEvents      = {
            onFlexLoad: function () {
                var inited  = overhead.globaly.get(options.storage.GROUP, options.storage.DEFAULT_CONFIG_FLAG),
                    ready   = false;
                if (inited !== null) {
                    if (modules.isReady() && external.isReady() && asynchronous.isReady() && modules.attach.unexpected.isReady()) {
                        ready = true;
                    }
                } else {
                    if (modules.isReady() && modules.attach.unexpected.isReady()) {
                        ready = true;
                    }
                }
                if (ready) {
                    if (coreEvents.onFlexLoad.__inited === void 0) {
                        if (!patterns.execution()) {
                            coreEvents.onFlexLoad.__inited = true;
                            system.handle(config.defaults.events.onFlexLoad, null, 'config.defaults.events.onFlexLoad', this);
                            if (config.defaults.events.onPageLoad !== null) {
                                if (document.readyState !== 'complete') {
                                    events.DOM.add(window, 'load', config.defaults.events.onPageLoad);
                                } else {
                                    system.handle(config.defaults.events.onPageLoad, null, 'config.defaults.events.onPageLoad', this);
                                }
                            }
                        }
                        //Launch self-lanuched appended modules
                        modules.attach.unexpected.launched.accept();
                        //Run hashes updates
                        hashes.update.queue.unlock();
                    } else {
                        logs.log('Double start of [onFlexLoad]', logs.types.CRITICAL);
                    }
                } else {
                    if (modules.attach.unexpected.isReady()) {

                    }
                }
            }
        };
        options         = {
            storage     : {
                GROUP                   : 'flex.core',
                RESOURCES_JOURNAL       : 'flex.modules.resources.journal',
                UNEXPECTED_JOURNAL      : 'flex.modules.unexpected.journal',
                DEFAULT_CONFIG          : 'flex.defualt.config',
                DEFAULT_CONFIG_FLAG     : 'flex.defualt.config.flag',
                WAITING_REGISTER_TASKS  : 'flex.register.wait.tasts',
            },
            resources   : {
                types   : {
                    CSS: '.css',
                    JS: '.js',
                }
            },
            regs        : {
                urls    : {
                    PARAMS          : /\?.*/gi,
                    EXTENSION       : /(\.[\w\n]*)$/gi,
                    JS_URL          : /[\w]*:\/\/[\w\n:\/\.]*\.js/gi,
                    NOT_URL_SYMBOLS : /[\s\t\n\r]/gi,
                    JS_EXP_IN_URL   : /\.js$/gi,
                    CSS_EXP_IN_URL  : /\.css$/gi
                }
            },
            register    : {
                EXTERNAL_HISTROY        : 'flex.external.history',
                MODULES_HISTROY         : 'flex.modules.history',
                MODULES_HISTROY_CREATION: 'flex.modules.history.created',
                RESOURCES_HISTORY       : 'flex.modules.resources.history',
                ASYNCHRONOUS_HISTORY    : 'asynchronous.history',
            },
            hashes      : {
                LOCAL_STORAGE_NAME : 'flex.hash.storage'
            },
            cache       : {
                STORAGE             : 'flex.cache.storage.reset_data',
                URL_PARAM_VERSION   : 'flexhash'
            },
            files       : {
                CORE    : '', //This is default value, will be apply in case of fail auto-detection
                CORE_URL: '', //URL to flex core
                ROOT    : '', //Place, where all JS should be. In ideal for sure.
                FLEX    : '', //Folder with flex core and modules
                detect  : function () {
                    function accept(url) {
                        url                     = system.url.parse(url.toLowerCase());
                        options.files.CORE      = url.target;
                        options.files.CORE_URL  = url.url;
                        options.files.ROOT      = url.home + '/' + (url.dirs.filter(function(it, i, its){ return i === its.length - 1 ? false : true;})).join('/');
                        options.files.FLEX      = url.path;
                        if (url.dirs.length === 0) {
                            setTimeout(function () {
                                logs.log('Flex core file [' + url.target + '] attached in root [' + url.home + ']. Recommendation: attach flex\'s libraries (include core) in some subfolder (for example, "core", "flex", "kernel" or any other).', logs.types.NOTIFICATION);
                            }, 10);
                        }
                        return url.path;
                    };
                    var url     = system.resources.js.getCurrentSRC(true),
                        script  = null;
                    if (url !== null) {
                        return accept(url);
                    } else if (options.files.CORE !== '') {
                        script = document.querySelector('script[src*="' + options.files.CORE + '"]');
                        if (script !== null) {
                            return accept(script.src);
                        }
                    }
                    throw new Error('Cannot detect URL and PATH to core script. Setup name of manually [options.files.CORE]');
                }
            },
            other       : {
                STORAGE_PREFIX  : '[FLEX_SYSTEM_RESURCES]'
            }
        };
        ajax            = {
            settings    : {
                DEFAULT_TIMEOUT : 15000, //ms ==> 1000 ms = 1 s
                DEFAULT_METHOD  : 'POST',
                methods         : {
                    POST    : 'POST',
                    GET     : 'GET',
                    PUT     : 'PUT',
                    DELETE  : 'DELETE',
                    OPTIONS : 'OPTIONS',
                },
                regs            : {
                    URLENCODED  : /-urlencoded/gi,
                    JSON        : /application\/json/gi
                },
                headers         :{
                    CONTENT_TYPE    : 'Content-Type',
                    ACCEPT          : 'Accept'
                }
            },
            requests    : {
                storage     : {},
                add         : function (request) {
                    var storage = ajax.requests.storage;
                    if (storage[request.settings.id] === void 0) {
                        storage[request.settings.id] = request;
                        return true;
                    }
                    return false;
                },
                remove      : function (request) {
                    var storage = ajax.requests.storage;
                    if (storage[request.settings.id] !== void 0) {
                        storage[request.settings.id] = null;
                        delete storage[request.settings.id];
                        return true;
                    }
                    return false;
                },
                isConflict  : function (id) {
                    return ajax.requests.storage[id] === void 0 ? false : true;
                }
            },
            create      : function (url, method, parameters, callbacks, settings) {
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                ///     <param name="callbacks"     type="object"                   >[optional] Collection of callbacks [before, success, fail, reaction, timeout, headers]. </param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                ///     <param name="callbacks"     type="object"                   >[optional] Collection of callbacks [before, success, fail, reaction, timeout, headers]. </param>
                ///     <param name="settings"      type="object"                   >[optional] Settings of request. </param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                var request = null,
                    Request = null;
                //Parse parameters
                url         = (typeof url       === 'string' ? url      : null);
                method      = (typeof method    === 'string' ? ([
                    ajax.settings.methods.POST,
                    ajax.settings.methods.GET,
                    ajax.settings.methods.PUT,
                    ajax.settings.methods.DELETE,
                    ajax.settings.methods.OPTIONS].indexOf(method.toUpperCase()) !== -1 ? method.toUpperCase() : ajax.settings.DEFAULT_METHOD) : ajax.settings.DEFAULT_METHOD);
                settings    = ajax.parse.settings(settings);
                parameters  = ajax.parse.parameters(parameters, settings);
                callbacks   = ajax.parse.callbacks(callbacks);
                if (url !== null) {
                    //Define class for request
                    Request             = function (url, method, parameters, callbacks, settings) {
                        this.settings           = settings;
                        this.url                = url;
                        this.method             = method;
                        this.parameters         = parameters;
                        this.callbacks          = callbacks;
                        this.timerID            = null;
                        this.response           = null;
                        this.responseHeaders    = null;
                        this.httpRequest        = null;
                    };
                    Request.prototype   = {
                        send            : function(){
                            var self = this;
                            try {
                                //Add request to journal
                                ajax.requests.add(self);
                                self.httpRequest = new XMLHttpRequest();
                                for (var event_name in self.events) {
                                    (function (event_name, self) {
                                        events.DOM.add(
                                            self.httpRequest,
                                            event_name,
                                            function (event) {
                                                return self.events[event_name](event, self);
                                            }
                                        );
                                    }(event_name, self));
                                }
                                if (self.httpRequest !== null) {
                                    self.callback(self.callbacks.before);
                                    switch (self.method) {
                                        case ajax.settings.methods.POST:
                                            self.httpRequest.open(self.method, self.url, true);
                                            self.setHeaders(self);
                                            self.httpRequest.send(self.parameters._parameters);
                                            break;
                                        case ajax.settings.methods.GET:
                                            self.httpRequest.open(self.method, self.url + (self.parameters._parameters !== '' ? '?' : '') + self.parameters._parameters, true);
                                            self.setHeaders(self);
                                            self.httpRequest.send();
                                            break;
                                        default:
                                            self.httpRequest.open(self.method, self.url, true);
                                            self.setHeaders(self);
                                            self.httpRequest.send(self.parameters._parameters);
                                            break;
                                    }
                                    //Set manual timeout
                                    self.timerID = setTimeout(
                                        function () {
                                            self.events.timeout(null, self);
                                        },
                                        self.settings.timeout
                                    );
                                    return true;
                                } else {
                                    throw 'Fail create XMLHttpRequest';
                                }
                            } catch (e) {
                                self.callback(self.callbacks.fail, e);
                                self.destroy(self);
                            }
                        },
                        setHeaders      : function(self){
                            //Set headers
                            if (self.settings.headers !== null) {
                                for (var key in self.settings.headers) {
                                    self.httpRequest.setRequestHeader(key, self.settings.headers[key]);
                                }
                            }
                        },
                        events          : {
                            readystatechange: function (event, self) {
                                if (ajax.requests.isConflict(self.settings.id) !== false) {
                                    if (event.target) {
                                        if (event.target.readyState) {
                                            self.callback(self.callbacks.reaction, event);
                                            switch (event.target.readyState) {
                                                case 2:
                                                    //Get headers
                                                    self.responseHeaders = self.parseHeaders(event.target.getAllResponseHeaders());
                                                    self.callback(self.callbacks.headers, event);
                                                    break;
                                                case 4:
                                                    //Get response
                                                    if (event.target.status === 200) {
                                                        //Success
                                                        self.response = self.parse(event.target.responseText);
                                                        self.destroy(self);
                                                        self.callback(self.callbacks.success, event);
                                                        return true;
                                                    } else {
                                                        //Fail
                                                        self.destroy(self);
                                                        self.callback(self.callbacks.fail, event);
                                                        return false;
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                }
                            },
                            timeout         : function (event, self) {
                                if (ajax.requests.isConflict(self.settings.id) !== false) {
                                    self.callback(self.callbacks.timeout, event);
                                    self.destroy(self);
                                }
                            }
                        },
                        parse           : function (response){
                            var result = {
                                    original: response,
                                    parsed  : null
                                };
                            try {
                                //Try get JSON object
                                result.parsed = JSON.parse(response);
                            } catch (e) {
                                //Do nothing
                            } finally {
                                return result;
                            }
                        },
                        parseHeaders    : function (headers) {
                            var result  = {
                                    _headers: headers,
                                    headers : {}
                                },
                                temp    = null;
                            if (typeof headers === 'string') {
                                temp = headers.split('\r\n');
                                if (temp instanceof Array) {
                                    temp.forEach(function (header) {
                                        var data = header.split(':');
                                        if (data instanceof Array) {
                                            if (data[0] !== '') {
                                                result.headers[data[0]] = header.replace(data[0] + ':', '');
                                            }
                                        }
                                    });
                                }
                            }
                            return result;
                        },
                        callback        : function (callback, event) {
                            if (callback !== null) {
                                system.handle(
                                    callback,
                                    [
                                        this.response,
                                        {
                                            id          : this.id,
                                            event       : event !== void 0 ? event : null,
                                            headers     : this.responseHeaders,
                                            response    : this.response,
                                            parameters  : this.parameters,
                                            url         : this.url,
                                            abort       : this.abort.bind(this)
                                        }
                                    ],
                                    'ajax.callback:: request ID:: ' + this.id + ' URL:: ' + this.url,
                                    this
                                );
                            }
                        },
                        abort           : function () {
                            if (this.httpRequest !== null) {
                                if (typeof this.httpRequest.abort === 'function') {
                                    this.httpRequest.abort();
                                }
                            }
                        },
                        destroy         : function (self) {
                            clearTimeout(self.timerID);
                            ajax.requests.remove(self);
                        }
                    };
                    //Create and return request
                    return new Request(url, method, parameters, callbacks, settings);
                }
                return null;
            },
            parse       : {
                settings    : function (settings){
                    var settings                        = typeof settings === 'object' ? (settings !== null ? settings : {}) : {};
                    settings.id                         = (typeof settings.id === 'string' ? settings.id : (typeof settings.id === 'number' ? settings.id : IDs.id()));
                    settings.id                         = (ajax.requests.isConflict(settings.id) === false      ? settings.id                       : IDs.id());
                    settings.timeout                    = (typeof settings.timeout                      === 'number'    ? settings.timeout                      : ajax.settings.DEFAULT_TIMEOUT);
                    settings.doNotChangeHeaders         = typeof settings.doNotChangeHeaders            === 'boolean'   ? settings.doNotChangeHeaders           : false,
                    settings.doNotChangeParameters      = typeof settings.doNotChangeParameters         === 'boolean'   ? settings.doNotChangeParameters        : false,
                    settings.doNotEncodeParametersAsURL = typeof settings.doNotEncodeParametersAsURL    === 'boolean'   ? settings.doNotEncodeParametersAsURL   : false,
                    settings.headers                    = ajax.parse.headers(settings);
                    return settings;
                },
                parameters  : function (_parameters, settings) {
                    var parameters  = _parameters,
                        params      = {},
                        str_params  = '',
                        excluded    = [],
                        encodeURI   = null;
                    if (!settings.doNotChangeParameters) {
                        if (parameters instanceof Array) {
                            //If as parameters we have string (after it was convert to array)
                            Array.prototype.forEach.call(
                                parameters,
                                function (parameter, index) {
                                    var property = null;
                                    parameters[index]   = param.replace(/^\s*\?/gi, '');
                                    property            = parameters[index].split('=');
                                    if (property instanceof Array) {
                                        if (property.length === 2) {
                                            params[property[0]] = property[1];
                                        } else {
                                            excluded.push(parameters[index]);
                                        }
                                    } else {
                                        excluded.push(parameters[index]);
                                    }
                                }
                            );
                        } else if (typeof parameters === 'object' && parameters !== null) {
                            //If as parameters we have object
                            for (var key in parameters) {
                                switch(typeof parameters[key]){
                                    case 'string':
                                        params[key] = parameters[key];
                                        break;
                                    case 'boolean':
                                        params[key] = parameters[key].toString();
                                        break;
                                    case 'number':
                                        params[key] = parameters[key].toString();
                                        break;
                                    case 'object':
                                        params[key] = JSON.stringify(parameters[key]);
                                        break;
                                    default:
                                        try{
                                            params[key] = JSON.stringify(parameters[key]);
                                        } catch (e) { }
                                        break;
                                }
                                params[key] = params[key];
                            }
                        }
                        if (typeof _parameters !== 'string') {
                            //Make parameters string
                            ajax.settings.regs.JSON.lastIndex       = 0;
                            ajax.settings.regs.URLENCODED.lastIndex = 0;
                            if (ajax.settings.regs.JSON.test(settings.headers[ajax.settings.headers.CONTENT_TYPE])) {
                                str_params = JSON.stringify(params);
                            } else {
                                encodeURI = ajax.settings.regs.URLENCODED.test(settings.headers[ajax.settings.headers.CONTENT_TYPE]);
                                encodeURI = settings.doNotEncodeParametersAsURL ? false : encodeURI;
                                for (var key in params) {
                                    str_params += '&' + key + '=' + encodeURI ? encodeURIComponent(params[key]) : params[key];
                                }
                                str_params = str_params.replace(/^\s*\&/gi, '');
                            }
                        } else {
                            str_params = _parameters;
                        }
                    } else {
                        str_params  = _parameters;
                    }
                    //Return result
                    return {
                        original    : _parameters,
                        parameters  : params,
                        _parameters : str_params,
                        excluded    : excluded
                    }
                },
                callbacks   : function (_callbacks) {
                    var callbacks = {
                        before      : null,
                        success     : null,
                        fail        : null,
                        reaction    : null,
                        timeout     : null
                    };
                    if (typeof _callbacks === 'object') {
                        if (_callbacks !== null) {
                            callbacks.before    = typeof _callbacks.before      === 'function' ? _callbacks.before      : null;
                            callbacks.success   = typeof _callbacks.success     === 'function' ? _callbacks.success     : null;
                            callbacks.fail      = typeof _callbacks.fail        === 'function' ? _callbacks.fail        : null;
                            callbacks.reaction  = typeof _callbacks.reaction    === 'function' ? _callbacks.reaction    : null;
                            callbacks.timeout   = typeof _callbacks.timeout     === 'function' ? _callbacks.timeout     : null;
                            callbacks.headers   = typeof _callbacks.headers     === 'function' ? _callbacks.headers     : null;
                        }
                    }
                    return callbacks;
                },
                headers     : function (settings) {
                    var _headers = {};
                    if (!settings.doNotChangeHeaders) {
                        if (typeof settings.headers === 'object' && settings.headers !== null) {
                            oop.objects.forEach(settings.headers, function (key, value) {
                                var parts = key.split('-');
                                parts.forEach(function (part, index) {
                                    parts[index] = part.charAt(0).toUpperCase() + part.slice(1);
                                });
                                _headers[parts.join('-')] = value;
                            });
                        }
                        //Default headers
                        if (_headers[ajax.settings.headers.CONTENT_TYPE] === void 0) {
                            _headers[ajax.settings.headers.CONTENT_TYPE] = 'application/x-www-form-urlencoded';
                        }
                        if (_headers[ajax.settings.headers.ACCEPT] === void 0) {
                            _headers[ajax.settings.headers.ACCEPT] = '*/*';
                        }
                    } else {
                        _headers = typeof settings.headers === 'object' ? (settings.headers !== null ? settings.headers : {}) : {};
                    }
                    settings.headers = _headers;
                    return settings.headers;
                }
            },
        };
        oop             = {
            namespace   : {
                create  : function (namespace, root) {
                    /// <signature>
                    ///     <summary>Create namespace from root.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <returns type="Object" value="{ target: root, parent: parent }" mayBeNull="true">Namespace data</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Create namespace from root.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <param name="root"      type="Object">[optional] Root object. Default - window</param>
                    ///     <returns type="Object" value="{ target: root, parent: parent }" mayBeNull="true">Namespace data</returns>
                    /// </signature>
                    var root    = root || window,
                        parent  = null,
                        target  = root,
                        name    = null;
                    if (typeof namespace === 'string') {
                        try{
                            Array.prototype.forEach.call(
                                namespace.split('.'),
                                function (part) {
                                    parent  = target;
                                    if (!(part in target)) {
                                        target[part] = {};
                                    }
                                    target  = target[part];
                                    name    = part;
                                }
                            );
                            return {
                                target  : target,
                                parent  : parent,
                                root    : root,
                                name    : name
                            };
                        } catch (error) {
                            return null;
                        }
                    }
                    return null;
                },
                get     : function (namespace, root) {
                    /// <signature>
                    ///     <summary>Get last child in namespace.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <returns type="Object" mayBeNull="true">Last child of namespace</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get last child in namespace.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <param name="root"      type="Object">[optional] Root object. Default - window</param>
                    ///     <returns type="Object" mayBeNull="true">Last child of namespace</returns>
                    /// </signature>
                    var root    = root || window,
                        target  = root;
                    if (typeof namespace === 'string') {
                        try{
                            Array.prototype.forEach.call(
                                namespace.split('.'),
                                function (part) {
                                    if (!(part in target)) {
                                        throw 'Property [' + target  + '] was not found';
                                    }
                                    target = target[part];
                                }
                            );
                            return target;
                        } catch (error) {
                            return null;
                        }
                    }
                    return null;
                }
            },
            classes     : {
                of      : function (object) {
                    /// <summary>
                    /// Returns class's name of object. 
                    /// </summary>
                    /// <param name="object" type="Object">Object</param>
                    /// <returns type="String">Name of class</returns>
                    if (object === null) return null;
                    if (object === void 0) return null;
                    return Object.prototype.toString.call(object).slice(8, -1);
                },
                create  : function (parameters) {
                    ///     <summary>
                    ///         Create instance of class with closed variables
                    ///     </summary>
                    ///     <param name="parameters"    type="object">Parameters of class:  &#13;&#10;
                    ///     {   [function]              constr,                             &#13;&#10;
                    ///         [function]              parent                              &#13;&#10;
                    ///         [object]                privates,                           &#13;&#10;
                    ///         [function || object]    prototype                           &#13;&#10;
                    ///     }</param>
                    ///     <returns type="object">Instance of class</returns>
                    /*
                    =============EXAMPLE=============
                        pattern = flex.oop.classes.create({
                            constr      : function () {
                                this.one = 'one';
                            },
                            parent      : [function],
                            privates    : {
                                two         : 'two',
                                three       : 'three',
                                __instance  : instance //--> automaticaly attached: instance of class
                            },
                            prototype   : function (privates) {
                                var self        = this,         //->one
                                    privates    = privates;     //->two; ->three
                                var show = function () {
                                    alert(self.one);
                                    alert(privates.two);
                                    alert(privates.three);
                                };
                                return {
                                    show : show
                                };
                            }
                        });
                    =============EXAMPLE=============
                    Parameter [parent] also allows to identify instance within instance of.
                    */
                    var constr          = typeof parameters.constr          === 'function'  ? parameters.constr         : null,
                        parent          = typeof parameters.parent          === 'function'  ? parameters.parent         : null,
                        privates        = parameters.privates               !== void 0      ? parameters.privates       : {},
                        prototype       = parameters.prototype              !== void 0      ? parameters.prototype      : {},
                        instance        = null,
                        temp            = null,
                        proto           = null;
                    if (!(this instanceof oop.classes.create)) {
                        if (parent !== null) {
                            temp                = parent;
                            temp.prototype      = parent.prototype;
                            proto               = typeof prototype === 'function' ? prototype.call(new constr(), privates) : prototype;
                            constr.prototype    = new temp();
                            for (var prop in proto) {
                                constr.prototype[prop] = proto[prop];
                            }
                        } else {
                            constr.prototype    = typeof prototype === 'function' ? prototype.call(new constr(), privates) : prototype;
                        }
                        privates.__instance = new constr();
                        return privates.__instance;
                    } else {
                        throw Error('Method [flex.oop.classes.create] cannot be used with derective NEW');
                    }
                },
            },
            objects     : {
                forEach         : function (object, callback) {
                    /// <summary>
                    /// Apply callback function to each enumerable property of object. 
                    /// </summary>
                    /// <param name="object" type="Object">Object</param>
                    /// <param name="function" type="Object">Callback function(property_name, object)</param>
                    /// <returns type="String">Name of class</returns>
                    if (typeof object === 'object') {
                        for (var property in object) {
                            (function (property, object, callback) {
                                callback(property, object[property]);
                            }(property, object, callback));
                        }
                        if (!('toString' in { toString: null })) {
                            //Hello, IE8 :)
                            Array.prototype.forEach.call(
                                ['toString', 'valueOf', 'constructor', 'hasOwnPropery', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString'],
                                function (protoprop) {
                                    if (object.hasOwnProperty(prototype)) {
                                        callback(protoprop, object[property]);
                                    }
                                }
                            );
                        }
                    }
                },
                extend          : function (sources, target, exclusion) {
                    /// <signature>
                    ///     <summary>
                    ///     Copy all properties from source object to target object. And miss exclusion. 
                    ///     </summary>
                    ///     <param name="sources" type="Object">Object</param>
                    ///     <param name="target" type="Object">Object (can be null, in this case new object will be created)</param>
                    ///     <param name="exclusion" type="Array">String array with properties names</param>
                    ///     <returns type="Object">Updated target object</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>
                    ///     Copy all properties from source object to target object. 
                    ///     </summary>
                    ///     <param name="sources" type="Object">Object</param>
                    ///     <param name="target" type="Object">Object (can be null, in this case new object will be created)</param>
                    ///     <returns type="Object">New object</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>
                    ///     Create new object from all properties from source object. 
                    ///     </summary>
                    ///     <param name="sources" type="Object">Object</param>
                    ///     <returns type="Object">New object</returns>
                    /// </signature>
                    var exclusion   = (oop.classes.of(exclusion) === 'Array' ? exclusion : []),
                        target      = (target !== null ? (target !== void 0 ? (typeof target === 'object' ? target : {}) : {}) : {}),
                        sources     = (typeof sources === 'object' ? [sources] : (oop.classes.of(sources) === 'Array' ? sources : null));
                    if (sources !== null) {
                        Array.prototype.forEach.call(
                            sources,
                            function (source) {
                                if (typeof source === 'object') {
                                    for (var property in source) {
                                        if (exclusion.indexOf(property) === -1) {
                                            target[property] = source[property];
                                        }
                                    }
                                }
                            }
                        );
                    }
                    return target;
                },
                copy            : function (source, target) {
                    /// <signature>
                    ///     <summary>Copy object</summary>
                    ///     <param name="source" type="object">Object - source</param>
                    ///     <returns type="object">object</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Copy object</summary>
                    ///     <param name="source" type="object">Object - source</param>
                    ///     <param name="target" type="object">Object - target</param>
                    ///     <returns type="object">object</returns>
                    /// </signature>
                    function copyProperty(property) {
                        var result = null;
                        if (property instanceof Array) {
                            result = [];
                            Array.prototype.forEach.call(
                                property,
                                function (item) {
                                    if (!(item instanceof Array) && typeof item !== 'object' && typeof item !== 'function') {
                                        result.push(item);
                                    } else {
                                        result.push(copyProperty(item));
                                    }
                                }
                            );
                        } else if (typeof property === 'object' && property !== null && typeof property !== 'function') {
                            result = copy(property);
                        } else {
                            result = property;
                        }
                        return result;
                    };
                    var target  = target || {},
                        source  = (typeof source === "object" ? source : null),
                        copy    = oop.objects.copy;
                    if (source !== null) {
                        for (var key in source) {
                            if (source.hasOwnProperty(key)) {
                                target[key] = copyProperty(source[key]);
                            }
                        }
                        return target;
                    }
                    return null;
                },
                validate        : function (object, properties) {
                    /// <signature>
                    ///     <summary>
                    ///         Validate object
                    ///     </summary>
                    ///     <param name="object"        type="object">Object for validate</param>
                    ///     <param name="properties"    type="object">Parameters of validation:     &#13;&#10;
                    ///     {   [string]            name,                                           &#13;&#10;
                    ///         [string || array]   type,                                           &#13;&#10;
                    ///         [any]               value       (default value),                    &#13;&#10;
                    ///         [any || array]      values      (allowed values)                    &#13;&#10;
                    ///         [function]          handle      (value = handle(value))             &#13;&#10;
                    ///     }</param>
                    ///     <returns type="boolean">true - valid; false - isn't valid</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>
                    ///         Validate object
                    ///     </summary>
                    ///     <param name="object"        type="object"   >Object for validate</param>
                    ///     <param name="properties"    type="array"    >Array of parameters of validation</param>
                    ///     <returns type="boolean">true - valid; false - isn't valid</returns>
                    /// </signature>
                    var object          = (typeof object === "object" ? object : null),
                        properties      = properties || null,
                        types           = null,
                        status          = null,
                        values_check    = null;
                    if (object !== null && properties !== null) {
                        properties = (properties instanceof Array ? properties : [properties]);
                        try{
                            properties.forEach(function (property) {
                                if (property.name && property.type) {
                                    if (object[property.name] || typeof object[property.name] === 'boolean' || typeof object[property.name] === 'number') {
                                        property.type = (typeof property.type === "string" ? [property.type] : property.type);
                                        if (property.type instanceof Array) {
                                            status = false;
                                            try {
                                                property.type.forEach(function (type) {
                                                    if (type === "node") {
                                                        if (object[property.name]) {
                                                            status = (object[property.name].nodeName ? true : status);
                                                        }
                                                    } else if (type === "array") {
                                                        status = (object[property.name] instanceof Array === true ? true : status);
                                                    } else if (window[type] !== void 0 && ['string', 'number', 'bool'].indexOf(type) === -1){
                                                        status = (object[property.name] instanceof window[type] ? true : status);
                                                    } else {
                                                        status = (typeof object[property.name] === type ? true : status);
                                                    }
                                                    if (status !== false){
                                                        throw 'found';
                                                    }
                                                });
                                            } catch (e) {
                                                if (e !== 'found') {
                                                    status = false;
                                                }
                                            } finally {
                                                if (status === false) {
                                                    if (property.value !== void 0) {
                                                        object[property.name] = property.value;
                                                    } else {
                                                        throw 'deny';
                                                    }
                                                } else {
                                                    if (property.values !== void 0) {
                                                        if (property.values instanceof Array) {
                                                            try {
                                                                values_check = false;
                                                                property.values.forEach(function (value) {
                                                                    if (object[property.name] === value) {
                                                                        values_check = true;
                                                                        throw 'found';
                                                                    }
                                                                });
                                                            } catch (e) {
                                                            }
                                                            if (values_check === false) {
                                                                throw 'deny';
                                                            }
                                                        }
                                                    }
                                                    if (typeof property.handle === 'function') {
                                                        try {
                                                            object[property.name] = property.handle(object[property.name]);
                                                        } catch (e) {
                                                            if (property.value) {
                                                                object[property.name] = property.value;
                                                            } else {
                                                                throw 'deny';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (property.value !== void 0) {
                                            object[property.name] = property.value;
                                        } else {
                                            throw 'deny';
                                        }
                                    }
                                }
                            });
                        } catch (e) {
                            return false;
                        }
                        return true;
                    }
                    return null;
                },
                isValueIn       : function (target, value, deep) {
                    /// <signature>
                    ///     <summary>Search defined value in object</summary>
                    ///     <param name="source"    type="object"   >Object</param>
                    ///     <param name="value"     type="any"      >Searching value</param>
                    ///     <returns type="boolean">true - value is found; false - value isn't found</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Search defined value in object</summary>
                    ///     <param name="source"    type="object"   >Object</param>
                    ///     <param name="value"     type="any"      >Searching value</param>
                    ///     <param name="deep"      type="boolean"  >True - search in nested objects</param>
                    ///     <returns type="boolean">true - value is found; false - value isn't found</returns>
                    /// </signature>
                    var deep = typeof deep === 'boolean' ? deep : false;
                    if (target instanceof Array) {
                        try{
                            target.forEach(function (property) {
                                if (property === value) {
                                    throw 'found';
                                }
                            });
                            if (deep !== false) {
                                target.forEach(function (property) {
                                    if (typeof property === 'object' || property instanceof Array) {
                                        if (oop.objects.isValueIn(property, value, deep) === true) {
                                            throw 'found';
                                        }
                                    }
                                });
                            }
                        } catch (e) {
                            return true;
                        }
                        return false;
                    } else if (typeof target === 'object') {
                        try {
                            oop.objects.forEach(target, function (key, property) {
                                if (property === value) {
                                    throw 'found';
                                }
                            });
                            if (deep !== false) {
                                oop.objects.forEach(target, function (key, property) {
                                    if (typeof property === 'object' || property instanceof Array) {
                                        if (oop.objects.isValueIn(property, value, deep) === true) {
                                            throw 'found';
                                        }
                                    }
                                });
                            }
                        } catch (e) {
                            return true;
                        }
                        return false;
                    }
                    return null;
                },
                getByPath       : function (target, path) {
                    ///     <summary>Get property by path</summary>
                    ///     <param name="target"    type="object"   >Object</param>
                    ///     <param name="path"      type="any"      >Path to property</param>
                    ///     <returns type="any">Final value or UNDEFINED</returns>
                    var target      = typeof target     === 'object'    ? target    : null,
                        path        = typeof path       === 'string'    ? path      : (path instanceof Array ? path : null),
                        steps       = null,
                        errors      = {
                            NO_BY_PATH: 'NO_BY_PATH'
                        },
                        result      = target,
                        finished    = false;
                    if (target !== null && path !== null) {
                        steps = path instanceof Array ? path : path.split('.');
                        try {
                            steps.forEach(function (step) {
                                if (result[step] !== void 0) {
                                    result = result[step];
                                } else {
                                    throw errors.NO_BY_PATH;
                                }
                            });
                            finished = true;
                        } catch (e) {
                            if (e !== errors.NO_BY_PATH) {
                                throw e;
                            }
                        }
                    }
                    return finished ? result : void 0;
                },
                findBy          : function (target, path, value, multiple) {
                    /// <signature>
                    ///     <summary>Search defined value in properties of object</summary>
                    ///     <param name="target"    type="object"   >Object</param>
                    ///     <param name="path"      type="any"      >Path to property</param>
                    ///     <param name="value"     type="any"      >Compared value</param>
                    ///     <returns type="any">Match(s)</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Search defined value in properties of object</summary>
                    ///     <param name="target"    type="object"   >Object</param>
                    ///     <param name="path"      type="any"      >Path to property</param>
                    ///     <param name="value"     type="any"      >Compared value</param>
                    ///     <param name="multiple"  type="boolean"  >True - return all matches; False - return only first</param>
                    ///     <returns type="any">Match(s)</returns>
                    /// </signature>
                    var target      = typeof target     === 'object'    ? target    : null,
                        path        = typeof path       === 'string'    ? path      : null,
                        multiple    = typeof multiple   === 'boolean'   ? multiple  : false,
                        result      = multiple ? [] : null,
                        errors      = {
                            FOUND       : '1'
                        };
                    if (target !== null && path !== null) {
                        path = path.split('.');
                        try {
                            oop.objects.forEach(target, function (property, _value) {
                                var _result = oop.objects.getByPath(_value, path);
                                if (_result !== void 0) {
                                    if (_result === value) {
                                        if (multiple) {
                                            result.push(_value);
                                        } else {
                                            result = _value;
                                            throw errors.FOUND;
                                        }
                                    }
                                }
                            });
                        } catch (e) {
                            if (e !== errors.FOUND) {
                                throw e;
                            }
                        }
                    }
                    return result;
                }
            },
            wrappers    : {
                objects: function () {
                    wrappers.prototypes.add.object('forEach',   function (callback)             {
                        return oop.objects.forEach(this.target, callback);
                    });
                    wrappers.prototypes.add.object('extend',    function (target, exclusion)    {
                        return oop.objects.extend(this.target, target, exclusion);
                    });
                    wrappers.prototypes.add.object('copy',      function (target)               {
                        return oop.objects.copy(this.target, target);
                    });
                    wrappers.prototypes.add.object('validate',  function (properties)           {
                        return oop.objects.validate(this.target, properties);
                    });
                    wrappers.prototypes.add.object('isValueIn', function (value, deep)          {
                        return oop.objects.isValueIn(this.target, value, deep);
                    });
                    wrappers.prototypes.add.object('getByPath', function (path) {
                        return oop.objects.getByPath(this.target, path);
                    });
                    wrappers.prototypes.add.object('findBy',    function (path, value, multiple) {
                        return oop.objects.findBy(this.target, path, value, multiple);
                    });
                    wrappers.prototypes.add.object('createInstanceClass', function () {
                        return oop.classes.create(this.target);
                    });
                }
            }
        };
        arrays          = {
            findBy      : function (target, path, value, multiple) {
                /// <signature>
                ///     <summary>Search defined value in items of array (if items are objects)</summary>
                ///     <param name="target"    type="array"    >Array of objects</param>
                ///     <param name="path"      type="any"      >Path to property</param>
                ///     <param name="value"     type="any"      >Compared value</param>
                ///     <returns type="any">Match(s)</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Search defined value in items of array (if items are objects)</summary>
                ///     <param name="target"    type="array"    >Array of objects</param>
                ///     <param name="path"      type="any"      >Path to property</param>
                ///     <param name="value"     type="any"      >Compared value</param>
                ///     <param name="multiple"  type="boolean"  >True - return all matches; False - return only first</param>
                ///     <returns type="any">Match(s)</returns>
                /// </signature>
                var target      = target instanceof Array           ? target    : null,
                    path        = typeof path       === 'string'    ? path      : null,
                    multiple    = typeof multiple   === 'boolean'   ? multiple  : false,
                    result      = multiple ? [] : null,
                    errors      = {
                        FOUND       : '1'
                    };
                if (target !== null && path !== null) {
                    path = path.split('.');
                    try {
                        target.forEach(function (item) {
                            var _result = oop.objects.getByPath(item, path);
                            if (_result !== void 0) {
                                if (_result === value) {
                                    if (multiple) {
                                        result.push(item);
                                    } else {
                                        result = item;
                                        throw errors.FOUND;
                                    }
                                }
                            }
                        });
                    } catch (e) {
                        if (e !== errors.FOUND) {
                            throw e;
                        }
                    }
                }
                return result;
            },
            wrappers    : {
                array   : function () {
                    wrappers.prototypes.add.array('findBy', function (path, value, multiple) {
                        return arrays.findBy(this.target, path, value, multiple);
                    });
                }
            }
        };
        cache           = {
            init    : function(){
                if (system.localStorage.isAvailable() !== false) {
                    cache.storage.load();
                    cache.actions.hash();
                    if (config.defaults.resources.USE_STORAGED === true) {
                        //Looking for events only if cache is using
                        cache.attach();
                    }
                }
            },
            attach  : function () {
                ['ON_NEW_MODULE', 'ON_UPDATED_MODULE', 'ON_NEW_RESOURCE', 'ON_UPDATED_RESOURCE'].forEach(function (event) {
                    events.core.listen(
                        flex.registry.events.system.cache.GROUP,
                        flex.registry.events.system.cache[event],
                        function (param) {
                            cache.events.on(config.defaults.cache.reset[event], param);
                        }
                    );
                });
                events.core.listen(
                    flex.registry.events.system.logs.GROUP,
                    flex.registry.events.system.logs.CRITICAL,
                    function (param) {
                        cache.events.on(config.defaults.cache.reset.ON_CRITICAL_ERROR, param);
                    }
                );
            },
            events  : {
                on  : function (reset, url) {
                    if (reset === true) {
                        cache.actions.reset(url);
                    }
                },
                fire: {
                    ON_NEW_MODULE       : function (url) {
                        events.core.fire(flex.registry.events.system.cache.GROUP, flex.registry.events.system.cache.ON_NEW_MODULE, url);
                    },
                    ON_UPDATED_MODULE   : function (url) {
                        events.core.fire(flex.registry.events.system.cache.GROUP, flex.registry.events.system.cache.ON_UPDATED_MODULE, url);
                    },
                    ON_NEW_RESOURCE     : function (url) {
                        events.core.fire(flex.registry.events.system.cache.GROUP, flex.registry.events.system.cache.ON_NEW_RESOURCE, url);
                    },
                    ON_UPDATED_RESOURCE : function (url) {
                        events.core.fire(flex.registry.events.system.cache.GROUP, flex.registry.events.system.cache.ON_UPDATED_RESOURCE, url);
                    },
                }
            },
            actions : {
                reset   : (function () {
                    var done = false;
                    return function (url, force) {
                        var force = typeof force === 'boolean' ? force : false;
                        if (done === false) {
                            done = true;
                            if (cache.storage.data.reseted === false || force === true) {
                                system.localStorage.reset(options.other.STORAGE_PREFIX);
                                logs.log('[CACHE]: cache was reseted. The reason is "' + url + '"', logs.types.WARNING);
                                cache.storage.data.reseted = true;
                                cache.storage.save();
                            } else {
                                cache.storage.data.reseted = false;
                                cache.storage.save();
                            }
                        }
                    };
                }()),
                hash    : function () {
                    var hash    = null,
                        script  = document.querySelector('script[src*="' + options.files.CORE + '"]');
                    if (script !== null) {
                        hash = system.url.parse(script.src.toLowerCase());
                        if (hash.params !== null) {
                            if (hash.params[options.cache.URL_PARAM_VERSION]) {
                                hash = hash.params[options.cache.URL_PARAM_VERSION];
                                if (cache.storage.data.hash !== hash) {
                                    cache.storage.data.hash = hash;
                                    cache.storage.save();
                                    cache.actions.reset(hash, true);
                                }
                            }
                        }
                    }
                    return hash;
                }
            },
            storage : {
                data        : {
                    reseted : true,
                    hash    : null
                },
                load        : function () {
                    function validate(data) {
                        for (var key in cache.storage.data) {
                            if (data[key] === void 0) {
                                //It means that flex.core.js was updated (block cache)
                                return false;
                            }
                        }
                        return true;
                    };
                    var data = system.localStorage.getJSON(options.cache.STORAGE);
                    if (data !== null) {
                        if (validate(data) === true) {
                            cache.storage.data = data;
                        } else {
                            cache.storage.save();
                        }
                    }
                    return false;
                },
                save        : function(){
                    system.localStorage.setJSON(options.cache.STORAGE, cache.storage.data);
                },
            },
        };
        hashes          = {
            storage: {
                data    : {},
                get     : function (){
                    hashes.storage.data = system.localStorage.getJSON(options.hashes.LOCAL_STORAGE_NAME, options.other.STORAGE_PREFIX);
                    if (typeof hashes.storage.data !== 'object' || hashes.storage.data === null) {
                        hashes.storage.create();
                    }
                    return hashes.storage.data;
                },
                create  : function () {
                    hashes.storage.data = {};
                    hashes.storage.update();
                },
                update  : function () {
                    system.localStorage.setJSON(options.hashes.LOCAL_STORAGE_NAME, hashes.storage.data, options.other.STORAGE_PREFIX);
                }
            },
            get     : function (url) {
                /// <signature>
                ///     <summary>Get hash for defined resource</summary>
                ///     <param name="url" type="string">URL to resource</param>
                ///     <returns type="string">HASH</returns>
                /// </signature>
                var storage = hashes.storage.get();
                return typeof storage[url] === 'object' ? storage[url].hash : null;
            },
            set     : function (url, hash) {
                var storage = hashes.storage.get();
                if (typeof hash === 'string') {
                    storage[url] = {
                        url     : url,
                        hash    : hash
                    };
                    hashes.storage.update();
                    return true;
                }
                return false;
            },
            update  : {
                add         : function(url){
                    /// <signature>
                    ///     <summary>Update hash of defined resource</summary>
                    ///     <param name="url" type="string">URL to resource</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                    hashes.update.queue.add(url);
                },
                queue       : {
                    queue       : {},
                    journal     : {},
                    isLock      : true,
                    unlock      : function () {
                        hashes.update.queue.isLock = false;
                        hashes.update.proceed();
                    },
                    add         : function (url) {
                        if (typeof url === 'string') {
                            if (hashes.update.queue.journal[url] === void 0) {
                                hashes.update.queue.journal [url] = true;
                                hashes.update.queue.queue   [url] = { url: url, working : false };
                            }
                        }
                        if (!hashes.update.queue.isLock) {
                            hashes.update.proceed();
                        }
                    },
                    del         : function (url) {
                        if (typeof url === 'string') {
                            hashes.update.queue.queue[url] = null;
                            delete hashes.update.queue.queue[url];
                        }
                    },
                    work        : function (url) {
                        if (typeof hashes.update.queue.queue[url] === 'object') {
                            hashes.update.queue.queue[url].working = true;
                        }
                    },
                    isWorking   : function (url) {
                        if (typeof hashes.update.queue.queue[url] === 'object') {
                            return hashes.update.queue.queue[url].working;
                        }
                    },
                },
                proceed     : function () {
                    oop.objects.forEach(hashes.update.queue.queue, function (key, value) {
                        var request = null;
                        if (hashes.update.queue.isWorking(key) === false) {
                            hashes.update.queue.work(key);
                            request = ajax.create(
                                value.url,
                                ajax.settings.methods.GET,
                                null,
                                {
                                    headers : function (response, request) { hashes.update.processing   (key, value.url, request); },
                                    fail    : function (response, request) { hashes.update.fail         (key, value.url, request); }
                                }
                            );
                            request.send();
                        }
                    });
                },
                processing  : function (key, url, request) {
                    var hash    = '',
                        _hash   = hashes.get(url);
                    if (request.headers !== null) {
                        if (request.headers._headers !== '') {
                            hashes.update.queue.del(key);
                            oop.objects.forEach(request.headers.headers, function (key, value) {
                                if (key.toLowerCase() !== 'date') {
                                    hash += value;
                                }
                            });
                            if (hashes.get(url) !== hash) {
                                if (_hash === null) {
                                    logs.log('[HASHES]:: hash for resource [' + url + '] was generated. Next updating of page, resource will be loaded again.', logs.types.KERNEL_LOGS);
                                } else {
                                    logs.log('[HASHES]:: resource [' + url + '] have to be updated.', logs.types.KERNEL_LOGS);
                                    hashes.resources.update(url);
                                }
                                //Update hash
                                hashes.set(url, hash);
                            }
                            request.abort();
                        }
                    }
                },
                fail        : function (key, url, request) {
                    if (request.headers === null) {
                        logs.log('[HASHES]:: fail to load hash for resource [' + url + '].', logs.types.KERNEL_LOGS);
                        hashes.update.queue.del(key);
                    }
                }
            },
            resources   : {
                update  : function(url){
                    if (hashes.resources.css.update(url) === true) {
                        return true;
                    }
                    logs.log('[HASHES]:: resource [' + url + '] cannot be updated in current session. It will be done after page be reloaded.', logs.types.KERNEL_LOGS);
                },
                css     : {
                    update: function (url) {
                        var style = document.querySelector('style[' + system.resources.css.settings.attr.SRC + '$="' + url + '"]');
                        if (style !== null) {
                            system.resources.css.connect(url, function () {
                                style.parentNode.removeChild(style);
                                logs.log('[HASHES]:: resource [' + url + '] have been updated in current session.', logs.types.KERNEL_LOGS);
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }
        };
        modules         = {
            isReady     : function(){
                return overhead.register.isReady(options.register.MODULES_HISTROY);
            },
            preload     : function () {
                var libraries = config.defaults.resources.MODULES;
                if (libraries instanceof Array) {
                    if (libraries.length > 0) {
                        overhead.register.open(
                            options.register.MODULES_HISTROY,
                            libraries.map(function (library) { return modules.tools.clearName(library); }),
                            external.preload
                        );
                        Array.prototype.forEach.call(
                            libraries,
                            function (library) {
                                var src = modules.reference.getSource(library);
                                if (modules.registry.getSettings(library.replace(/^flex\./gi, '')) === null) {
                                    modules.registry.add({
                                        name        : library,
                                        hash        : hashes.get(src),
                                        autoHash    : true,
                                        source      : src
                                    });
                                }
                                modules.reference.history.add(library);
                                modules.repository.call(library);
                            }
                        );
                    } else {
                        external.preload();
                    }
                }
            },
            reference   : {
                history     : {
                    data    : [],
                    add     : function (name) {
                        modules.reference.history.data.push(name.replace('flex.libraries.', '').replace(/^flex\./gi, ''));
                    },
                    isIn    : function (name) {
                        return (modules.reference.history.data.indexOf(name.replace('flex.libraries.', '').replace(/^flex\./gi, '')) !== -1 ? true : false);
                    }
                },
                caller      : {
                    name    : null,
                    ready   : null
                },
                getSource   : function(lib){
                    var parts = lib.split('.'),
                        src = '';
                    if (parts.length > 0) {
                        if (parts[0] === 'flex') {
                            src = options.files.FLEX + lib;
                        } else {
                            src = options.files.ROOT + parts[0] + '/' + lib.replace(parts[0] + '.', '');
                        }
                    } else {
                        src = options.files.ROOT + lib;
                    }
                    return src + '.js';
                },
                call    : function (library) {
                    var caller  = modules.reference.caller,
                        histroy = modules.reference.history;
                    if (caller.name !== null) {
                        if (modules.storage.get(library) === null) {
                            caller.ready = false;
                            if (histroy.isIn(library) === false) {
                                histroy.add(library);
                                modules.repository.call(library);
                            }
                        } else {
                            caller.ready = (caller.ready === false ? false : true);
                        }
                    }
                },
                check   : function (library, callback) {
                    var caller          = modules.reference.caller,
                        storaged        = modules.storage.get(library),
                        callback        = typeof callback === 'function' ? callback : false,
                        waited          = [];
                    if (storaged !== null) {
                        try {
                            caller.name     = library;
                            caller.ready    = true;
                            if (storaged.reference instanceof Array) {
                                storaged.reference.forEach(function (lib) {
                                    var src     = modules.reference.getSource(lib),
                                        name    = modules.tools.fullName(lib.replace(/^flex\./gi, '')),
                                        constr  = null;
                                    if (modules.registry.getSettings(lib.replace(/^flex\./gi, '')) === null) {
                                        modules.registry.add({
                                            name        : lib,
                                            hash        : hashes.get(src),
                                            autoHash    : true,
                                            source      : src
                                        });
                                    }
                                    if (callback){
                                        constr = oop.namespace.get(name);
                                        if (constr === null || constr.create === void 0){
                                            waited.push(name);
                                        }
                                    }
                                    modules.reference.call(lib);
                                });
                            }
                        } catch (e) {
                            logs.log('[MODULES]:: module [' + library + '] generated error during request for references:\n\r' + logs.parseError(e), logs.types.CRITICAL);
                            caller.ready    = false;
                        } finally {
                            storaged.ready  = caller.ready;
                            caller.name     = null;
                            caller.ready    = null;
                            if (callback) {
                                if (waited.length > 0) {
                                    waited = waited.filter(function (lib) {
                                        var constr = oop.namespace.get(lib);
                                        return constr === null ? true : (constr.create === void 0 ? true : false);
                                    });
                                    if (waited.length > 0) {
                                        overhead.register.open(
                                            options.register.MODULES_HISTROY_CREATION + ':' + library,
                                            waited,
                                            callback
                                        );
                                        modules.reference.waited.add(library);
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    } else {
                        callback && callback();
                    }
                },
                pending : function () {
                    var libraries   = modules.storage.pending(),
                        check       = modules.reference.check;
                    if (libraries.length > 0) {
                        Array.prototype.forEach.call(
                            libraries,
                            function (library) {
                                check(library);
                            }
                        );
                    }
                },
                waited  : {
                    tasks   : [],
                    add     : function (lib) {
                        modules.reference.waited.tasks.push(lib);
                    },
                    done    : function (lib){
                        modules.reference.waited.tasks.forEach(function (task) {
                            overhead.register.done(options.register.MODULES_HISTROY_CREATION + ':' + task, lib);
                        });
                    }
                }
            },
            registry    : {
                makeCaller  : function (library){
                    var property    = oop.namespace.create(library.name.replace(/^flex\./gi, ''), flex.libraries),
                        full_name   = null;
                    if (property !== null) {
                        full_name = modules.tools.fullName(library.name.replace(/^flex\./gi, ''));
                        Object.defineProperty(
                            property.parent,
                            property.name,
                            {
                                enumerable  : false,
                                configurable: false,
                                value       : function () { modules.reference.call(full_name); }
                            }
                        );
                    }
                },
                getSettings : function (name) {
                    /// <summary>
                    /// Get settings of library
                    /// </summary>
                    /// <param name="name" type="string">Library name</param>
                    /// <returns type="object">Settings if it was found or NULL in fail</returns>
                    var name = name.indexOf('flex.libraries.') === 0 ? name.replace('flex.libraries.', '') : name;
                    return oop.namespace.get(name, flex.libraries_data);
                },
                add         : function (library) {
                    var property    = null,
                        name        = library.name.replace(/^flex\./gi, '');
                    if (modules.registry.getSettings(name) === null) {
                        //Add to list
                        property = oop.namespace.create(name, flex.libraries_data);
                        if (property !== null) {
                            property.target.name        = library.name;
                            property.target.source      = library.source;
                            property.target.hash        = library.hash;
                            property.target.autoHash    = library.autoHash;
                            //Add caller
                            modules.registry.makeCaller(library);
                            return true;
                        }
                    }
                    return false;
                },
                validateSRC : function (url) {
                    return system.url.sterilize(url.replace(config.defaults.settings.KERNEL_PATH_SIGNATURE, config.defaults.paths.CORE + '/'));
                }
            },
            storage     : {
                data    : {},
                add     : function (parameters) {
                    /// <summary>
                    /// Add module data to virtual storage
                    /// </summary>
                    /// <param name="parameters" type="Object">Object of module</param>
                    /// <returns type="boolean">true if success and false if fail</returns>
                    var storage = modules.storage.data;
                    if (storage[parameters.name] === void 0) {
                        storage[parameters.name] = {
                            name            : parameters.name,
                            protofunction   : parameters.protofunction,
                            onBeforeAttach  : parameters.onBeforeAttach,
                            onAfterAttach   : parameters.onAfterAttach,
                            extend          : parameters.extend,
                            reference       : parameters.reference,
                            ready           : false
                        };
                        return true;
                    }
                    return false;
                },
                get     : function (name) {
                    /// <summary>
                    /// Get module data from virtual storage
                    /// </summary>
                    /// <param name="name" type="string">Name of module</param>
                    /// <returns type="Object">Object of module</returns>
                    return (modules.storage.data[name] === void 0 ? null : modules.storage.data[name]);
                },
                pending : function () {
                    /// <summary>
                    /// Get pending modules data from virtual storage
                    /// </summary>
                    /// <returns type="Array">Array of names of pending modules</returns>
                    var libraries = [];
                    for (var library in modules.storage.data) {
                        if (modules.storage.data[library].ready === false) {
                            libraries.push(library);
                        }
                    }
                    return libraries;
                },
            },
            attach      : {
                queue       : {
                    data    : [],
                    add     : function (parameters) {
                        /// <summary>
                        /// Add module to queue of initialization (until registry will be ready)
                        /// </summary>
                        /// <param name="parameters" type="Object">Object of module</param>
                        /// <returns type="void">void</returns>
                        modules.attach.queue.data.push(parameters);
                    },
                    reset   : function () {
                        /// <summary>
                        /// Reset a queue of initialization
                        /// </summary>
                        /// <returns type="void">void</returns>
                        modules.attach.queue.data = [];
                    },
                    proceed : function () {
                        /// <summary>
                        /// Processing of queue of initialization
                        /// </summary>
                        /// <returns type="void">void</returns>
                        var queue = modules.attach.queue;
                        Array.prototype.forEach.call(
                            queue.data,
                            function (parameters, index) {
                                if (typeof parameters.going !== 'boolean') {
                                    queue.data[index].going = true;
                                    modules.attach.embody.procceed(parameters);
                                }
                            }
                        );
                        queue.reset();
                    }
                },
                safely      : function (parameters) {
                    /// <summary>
                    /// Safely attach module. Method attaches module with queue
                    /// </summary>
                    /// <param name="parameters" type="Object">Object of module:    &#13;&#10;
                    /// {   [string]    name,                                       &#13;&#10;
                    ///     [function]  protofunction,                              &#13;&#10;
                    ///     [function]  reference       (optional),                 &#13;&#10;
                    ///     [array]     resources       (optional),                 &#13;&#10;
                    ///     [function]  onBeforeAttach  (optional),                 &#13;&#10;
                    ///     [function]  onAfterAttach   (optional),                 &#13;&#10;
                    ///     [array]     extend          (optional)}</param>
                    /// <returns type="boolean">true if success and false if module placed in queue</returns>
                    var queue = modules.attach.queue;
                    queue.add(parameters);
                    queue.proceed();
                    return false;
                },
                embody      : {
                    createConstructor   : function (name, protofunction) {
                        var library         = modules.storage.get(name),
                            protofunction   = typeof protofunction === 'function' ? protofunction : null;
                        if (protofunction !== null || library !== null) {
                            protofunction = protofunction !== null ? protofunction : library.protofunction;
                            //First time prototype of function should be a function
                            if (typeof protofunction.prototype === 'function') {
                                return function () {
                                    //Initialize prototype if it's necessary
                                    if (typeof protofunction.prototype === 'function') {
                                        protofunction.prototype = protofunction.prototype();
                                    }
                                    return new protofunction();
                                };
                            } else {
                                logs.log('[MODULES]:: cannot create caller for module [' + name + ']. Prototype of module should be a function.', logs.types.CRITICAL);
                                return null;
                            }
                        }
                        logs.log('[MODULES]:: cannot create caller for module [' + name + ']. Incorrect prototype function.', logs.types.CRITICAL);
                        return null;
                    },
                    procceed            : function (parameters) {
                        /// <summary>
                        /// Attach module. Method attaches module directly without queue
                        /// </summary>
                        /// <param name="parameters" type="Object">Object of module:    &#13;&#10;
                        /// {   [string]    name,                                       &#13;&#10;
                        ///     [function]  protofunction,                              &#13;&#10;
                        ///     [function]  reference           (optional),             &#13;&#10;
                        ///     [array]     resources           (optional),             &#13;&#10;
                        ///     [function]  onBeforeAttach      (optional),             &#13;&#10;
                        ///     [function]  onAfterAttach       (optional),             &#13;&#10;
                        ///     [array]     extend              (optional)}</param>
                        /// <returns type="boolean">true if success and false if fail</returns>
                        var constructor_storage = null;
                        if (oop.objects.validate(parameters, [  { name: 'name',             type: 'string'                          },
                                                                { name: 'protofunction',    type: 'function'                        },
                                                                { name: 'reference',        type: 'array',              value: null },
                                                                { name: 'resources',        type: 'array',              value: []   },
                                                                { name: 'onBeforeAttach',   type: 'function',           value: null },
                                                                { name: 'onAfterAttach',    type: 'function',           value: null },
                                                                { name: 'extend',           type: ['array', 'object'],  value: [] } ]) !== false) {
                            if (modules.reference.history.isIn(parameters.name)) {
                                //Module was loaded from separeted file
                                //Correct namespace
                                parameters.name     = modules.tools.fullName(parameters.name);
                                //Get link to storage of library. Also it checks is library in registry or not
                                constructor_storage = oop.namespace.get(parameters.name);
                                if (constructor_storage !== null && constructor_storage !== false) {
                                    //Check is library attached or not
                                    if (constructor_storage.create === void 0) {
                                        //Save library data in storage
                                        modules.storage.add(parameters);
                                        //Make constructor
                                        constructor_storage.create = modules.attach.embody.createConstructor(parameters.name, parameters.protofunction);
                                        if (constructor_storage.create !== null) {
                                            //Add to repository
                                            modules.repository.add(parameters);
                                            //Check references of this library
                                            modules.reference.check(parameters.name, function () {
                                                //Start events
                                                system.handle(parameters.onBeforeAttach);
                                                //Check resources of module and continue after resources will be loaded
                                                modules.resources.check(
                                                    parameters.name,
                                                    parameters.resources,
                                                    function () {
                                                        //Restart references of pending libraries
                                                        modules.reference.pending();
                                                        //Mark as done
                                                        overhead.register.done(options.register.MODULES_HISTROY, parameters.name);
                                                        //Start events
                                                        system.handle(parameters.onAfterAttach);
                                                        //Done event
                                                        modules.reference.waited.done(parameters.name);
                                                        logs.log('[MODULES]:: [' + parameters.name + '] was initialized.', logs.types.KERNEL_LOGS);
                                                    }
                                                );
                                            });
                                            return true;
                                        }
                                    }
                                }
                            } else {
                                //Module is buildin 
                                //Add settings
                                if (modules.registry.getSettings(parameters.name.replace(/^flex\./gi, '')) === null) {
                                    modules.registry.add({
                                        name        : parameters.name,
                                        hash        : null,
                                        autoHash    : false,
                                        source      : null
                                    });
                                }
                                //Correct namespace
                                parameters.name = modules.tools.fullName(parameters.name);
                                //Add to virtual repository
                                modules.storage.add(parameters);
                                //Add to repository
                                modules.repository.add(parameters);
                            }
                        }
                        return false;
                    },
                },
                unexpected  : {
                    isReady     : function(){
                        return modules.attach.unexpected.journal.isReady(true);
                    },
                    journal     : {
                        consts      : {
                            MODULES     : '(modules)',
                            RESOURCES   : '(resources)'
                        },
                        modules     : {
                            add     : function (url) {
                                return modules.attach.unexpected.journal.add(url, true);
                            },
                            done    : function (url) {
                                modules.attach.unexpected.journal.done(url, true);
                                if (modules.attach.unexpected.journal.isReady(true)) {
                                    coreEvents.onFlexLoad();
                                }
                            },
                            isIn    : function (url) {
                                return modules.attach.unexpected.journal.isIn(url, true);
                            },
                            isReady : function () {
                                return modules.attach.unexpected.journal.isReady(true);
                            }
                        },
                        resource    : {
                            add : function (url) {
                                return modules.attach.unexpected.journal.add(url, false);
                            },
                            done: function (url) {
                                return modules.attach.unexpected.journal.done(url, false);
                            },
                            isIn: function (url) {
                                return modules.attach.unexpected.journal.isIn(url, false);
                            }
                        },
                        add         : function (url, isModule) {
                            var consts  = modules.attach.unexpected.journal.consts,
                                journal = overhead.globaly.get(options.storage.GROUP, (isModule ? consts.MODULES : consts.RESOURCES) + options.storage.UNEXPECTED_JOURNAL, {});
                            if (!journal[url]) {
                                journal[url] = false;
                            }
                        },
                        done        : function (url, isModule) {
                            var consts  = modules.attach.unexpected.journal.consts,
                                journal = overhead.globaly.get(options.storage.GROUP, (isModule ? consts.MODULES : consts.RESOURCES) + options.storage.UNEXPECTED_JOURNAL, {});
                            if (journal[url] !== void 0) {
                                journal[url] = true;
                            }
                        },
                        isIn        : function (url, isModule) {
                            var consts  = modules.attach.unexpected.journal.consts,
                                journal = overhead.globaly.get(options.storage.GROUP, (isModule ? consts.MODULES : consts.RESOURCES) + options.storage.UNEXPECTED_JOURNAL, {});
                            return journal[url] === void 0 ? false : true;
                        },
                        isReady     : function (isModule) {
                            var consts  = modules.attach.unexpected.journal.consts,
                                journal = overhead.globaly.get(options.storage.GROUP, (isModule ? consts.MODULES : consts.RESOURCES) + options.storage.UNEXPECTED_JOURNAL, {}),
                                ready   = true;
                            oop.objects.forEach(journal, function (url, value) {
                                ready = ready === false ? false : value;
                            });
                            return ready;
                        },
                    },
                    launched    : {
                        storage : [],
                        add     : function (handle) {
                            modules.attach.unexpected.launched.storage.push(handle);
                        },
                        reset   : function (handle) {
                            modules.attach.unexpected.launched.storage = null;
                        },
                        accept  : function () {
                            modules.attach.unexpected.launched.storage.forEach(function (handle) {
                                handle.call(window);
                            });
                            modules.attach.unexpected.launched.reset();
                        },
                    },
                    safely      : function (parameters, do_not_detect_url) {
                        function validateSRC(src) {
                            if (typeof src === 'string') {
                                return system.url.sterilize(src. replace(config.defaults.settings.ATTACH_PATH_SIGNATURE, config.defaults.paths.ATTACH + '/'));
                            } else {
                                return null;
                            }
                        };
                        function proceed() {
                            //Add module to journal
                            modules.attach.unexpected.journal.modules.add(parameters.src);
                            //Correct paths in resources
                            parameters.require = parameters.require.map(function (resource) {
                                if (typeof resource.url === 'string') {
                                    resource.url = validateSRC(resource.url);
                                    if (resource !== null) {
                                        //Remove all already loaded resources
                                        resource = modules.attach.unexpected.journal.resource.isIn(resource.url) === false ? resource : null;
                                    }
                                    return resource;
                                } else {
                                    logs.log('[' + parameters.name + ']:: some resource was defined incorrectly. Field [url] was not found.', logs.types.CRITICAL);
                                }
                                return null;
                            });
                            parameters.require = parameters.require.filter(function (resource) {
                                return resource !== null ? true : false;
                            });
                            //Add hash to update
                            hashes.update.add(parameters.src);
                            //Try init module
                            if (parameters.require.length > 0) {
                                //Create queue to wait for all requared resources
                                requaredPackageID = IDs.id(parameters.src);
                                overhead.register.open(
                                    requaredPackageID,
                                    parameters.require.map(function (resource) { return resource.url; }),
                                    function () {
                                        //After all resources are loaded -> init module
                                        modules.attach.unexpected.embody(parameters);
                                    }
                                );
                                //Add resources to journal (it can be modules too)
                                parameters.require.forEach(function (resource) {
                                    modules.attach.unexpected.journal.resource.add(resource.url);
                                });
                                //Load resources
                                parameters.require.forEach(function (resource) {
                                    //Add update of hash
                                    hashes.update.add(resource.url);
                                    //Call resource
                                    external.repository.call(resource.url, hashes.get(resource.url), function () {
                                        //Done in package
                                        overhead.register.done(requaredPackageID, resource.url);
                                        //Done in journal
                                        modules.attach.unexpected.journal.resource.done(resource.url);
                                    });
                                });
                            } else {
                                //Init module
                                modules.attach.unexpected.embody(parameters);
                            }
                        };
                        var requaredPackageID = null,
                            do_not_detect_url = typeof do_not_detect_url === 'boolean' ? do_not_detect_url : false;
                        if (oop.objects.validate(parameters, [  { name: 'name',             type: 'string'                          },
                                                                { name: 'launch',           type: 'function',           value: null },
                                                                { name: 'constructor',      type: 'function',           value: null },
                                                                { name: 'module',           type: 'function',           value: null },
                                                                { name: 'require',          type: 'array',              value: []   },
                                                                { name: 'onBeforeAttach',   type: 'function',           value: null },
                                                                { name: 'onAfterAttach',    type: 'function',           value: null },
                                                                { name: 'extend',           type: ['array', 'object'],  value: null }]) !== false) {
                            //Try get URL of script, like script is attached via tag.
                            if (!do_not_detect_url) {
                                parameters.src = system.resources.js.getCurrentSRC();
                            }
                            //Try get URL of script, like it was inbuilt
                            parameters.src = parameters.src === null ? external.inbuilt.get.js() : parameters.src;
                            if (parameters.src !== null) {
                                if (modules.attach.unexpected.journal.modules.isIn(parameters.src) === false) {
                                    if (parameters.launch !== null) {
                                        //Attauch as self-launched
                                        proceed();
                                    } else if (parameters.module !== null) {
                                        //Attach as module
                                        if (modules.registry.add({
                                                name        : parameters.name,
                                                source      : parameters.src,
                                                hash        : hashes.get(parameters.src),
                                                autoHash    : true
                                        }) !== false) {
                                            proceed();
                                        } else {
                                            logs.log('[' + parameters.name + ']:: attempt to attach module twice', logs.types.WARNING);
                                        }
                                    }
                                }
                            } else {
                                logs.log('[' + parameters.name + ']:: unexpected error with module. Cannot detect URL', logs.types.CRITICAL);
                            }
                        } else {
                            if (typeof parameters.name === 'string') {
                                if (typeof parameters.module !== 'function') {
                                    logs.log('[' + parameters.name + ']:: to attach new module, should be defined parameter [module] as function', logs.types.CRITICAL);
                                }
                            } else {
                                logs.log('Fail to attach new module.', logs.types.CRITICAL);
                            }
                        }
                    },
                    embody      : function (parameters) {
                        /// <summary>
                        /// Attach module. Method attaches module directly without queue
                        /// </summary>
                        /// <param name="parameters" type="Object">Object of module:    &#13;&#10;
                        /// {   [string]    name,                                       &#13;&#10;
                        ///     [string]    src,                                        &#13;&#10;
                        ///     [function]  constructor,                                &#13;&#10;
                        ///     [function]  module,                                     &#13;&#10;
                        ///     [function]  onBeforeAttach      (optional),             &#13;&#10;
                        ///     [function]  onAfterAttach       (optional),             &#13;&#10;
                        ///     [array]     extend              (optional)}</param>
                        /// <returns type="boolean">true if success and false if fail</returns>
                        var constructor_storage = null;
                        if (oop.objects.validate(parameters, [  { name: 'name',             type: 'string'                          },
                                                                { name: 'src',              type: 'string'                          },
                                                                { name: 'launch',           type: 'function',           value: null },
                                                                { name: 'constructor',      type: 'function',           value: null },
                                                                { name: 'module',           type: 'function',           value: null },
                                                                { name: 'onBeforeAttach',   type: 'function',           value: null },
                                                                { name: 'onAfterAttach',    type: 'function',           value: null },
                                                                { name: 'extend',           type: ['array', 'object'],  value: [] } ]) !== false) {
                            if (parameters.launch !== null) {
                                //Attauch as self-launched
                                modules.attach.unexpected.launched.add(parameters.launch);
                                //Accept module
                                modules.attach.unexpected.journal.modules.done(parameters.src);
                                return true;
                            } else if (parameters.module !== null) {
                                //Attauch as module
                                //Correct namespace
                                parameters.name = modules.tools.fullName(parameters.name);
                                //Get link to storage of library. Also it checks is library in registry or not
                                constructor_storage = oop.namespace.get(parameters.name);
                                if (constructor_storage !== null && constructor_storage !== false) {
                                    //Check is library attached or not
                                    if (constructor_storage.create === void 0) {
                                        //Add protofunction
                                        parameters.protofunction            = parameters.constructor === null ? function(){} : parameters.constructor;
                                        parameters.protofunction.prototype  = parameters.module;
                                        //Make constructor
                                        constructor_storage.create          = modules.attach.embody.createConstructor(parameters.name, parameters.protofunction);
                                        //Accept module
                                        modules.attach.unexpected.journal.modules.done(parameters.src);
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    },
                },
            },
            resources   : {
                loader: {
                    load    : function (url, hash, autoHash) {
                        var request = ajax.create(
                                url,
                                ajax.settings.methods.GET,
                                null,
                                {
                                    success : function (response, request) {
                                        modules.resources.loader.success(url, response, hash);
                                    },
                                    fail    : function (response, request) {
                                        modules.resources.loader.fail(request, url, response, hash);
                                    },
                                }
                            );
                        request.send();
                    },
                    success : function (url, response, hash) {
                        system.localStorage.setJSON(
                            url,
                            {
                                value   : response.original,
                                url     : url,
                                hash    : hash
                            },
                            options.other.STORAGE_PREFIX
                        );
                    },
                    fail    : function (request, url, response, hash) {
                        logs.log('[MODULES]:: cannot load resource: [' + url + ']. Resource will be attached.', logs.types.WARNING);
                    },
                },
                check   : function (name, resources, callback) {
                    var settings    = modules.registry.getSettings(name),
                        repository  = null;
                    if (settings !== null) {
                        if (resources !== null) {
                            if (!(resources instanceof Array)) {
                                resources = [resources];
                            }
                            if (resources.length > 0) {
                                //Validate resources links
                                resources = resources.map(function (resource) {
                                    if (typeof resource.url === 'string') {
                                        return {
                                            url     : modules.registry.validateSRC(resource.url),
                                            hash    : settings.autoHash === true ? hashes.get(resource.url) : settings.hash,
                                            autoHash:settings.autoHash
                                        }
                                    }
                                });
                                //Registry resources of module
                                overhead.register.open(
                                    options.register.RESOURCES_HISTORY + ':' + name,
                                    resources.map(function (resource) { return resource.url; }),
                                    callback
                                );
                                //Try get resources
                                modules.resources.get(resources, name);
                            } else {
                                callback();
                            }
                        }
                    }
                },
                get     : function (resources, name) {
                    var journal = overhead.globaly.get(options.storage.GROUP, options.storage.RESOURCES_JOURNAL, {});
                    Array.prototype.forEach.call(
                        resources,
                        function (resource) {
                            if (!journal[resource.url]) {
                                modules.resources.load(name, resource);
                                journal[resource.url] = name;
                            }
                        }
                    );
                },
                load    : function (name, resource) {
                    function restore(name, resource) {
                        var wrapper         = null,
                            resourceType    = system.url.getTypeOfResource(resource.url);
                        if (resourceType === options.resources.types.CSS) {
                            //Resource: CSS
                            system.resources.css.adoption(resource.value, null, system.url.restoreFullURL(resource.url));
                        } else if (resourceType === options.resources.types.JS) {
                            //Resource: JS
                            wrapper = new Function(resource.value);
                            try {
                                wrapper.call(window);
                                logs.log('[MODULES]:: resource: [' + resource.url + '] was adopted.', logs.types.KERNEL_LOGS);
                            } catch (e) {
                                logs.log('[MODULES]:: during initialization of resource: [' + resource.url + '] happened error:/n/r' + logs.parseError(e), logs.types.WARNING);
                            }
                        }
                        overhead.register.done(options.register.RESOURCES_HISTORY + ':' + name, resource.url);
                    };
                    function reload(name, resource) {
                        var resourceType = system.url.getTypeOfResource(resource.url);
                        if (resourceType === options.resources.types.CSS) {
                            //Resource: CSS
                            system.resources.css.connect(
                                resource.url,
                                function () {
                                    overhead.register.done(options.register.RESOURCES_HISTORY + ':' + name, resource.url);
                                    logs.log('[MODULES]:: resource of module [' + name + '] (file: [' + resource.url + ']) is reloaded.', logs.types.KERNEL_LOGS);
                                },
                                null
                            );
                        } else if (resourceType === options.resources.types.JS) {
                            //Resource: JS
                            system.resources.js.connect(
                                resource.url,
                                function () {
                                    overhead.register.done(options.register.RESOURCES_HISTORY + ':' + name, resource.url);
                                    logs.log('[MODULES]:: resource of module [' + name + '] (file: [' + resource.url + ']) is reloaded.', logs.types.KERNEL_LOGS);
                                },
                                null
                            );
                        }
                        //Try get same resources and cache it
                        modules.resources.loader.load(resource.url, resource.hash, resource.autoHash);
                    };
                    var localStorage    = system.localStorage,
                        storaged        = localStorage.getJSON(resource.url, options.other.STORAGE_PREFIX);
                    if (storaged !== null && config.defaults.resources.USE_STORAGED !== false) {
                        if (resource.hash === storaged.hash) {
                            restore(name, storaged);
                        } else {
                            reload(name, resource);
                            logs.log('[MODULES]:: resource of module [' + name + '] (file: [' + resource.url + ']) will be reloaded.', logs.types.KERNEL_LOGS);
                        }
                    } else {
                        reload(name, resource);
                    }
                    //Update hash
                    if (resource.autoHash === true) {
                        hashes.update.add(resource.url);
                    }
                },
            },
            repository  : {
                add         : function (parameters) {
                    /// <summary>
                    /// Add resource into repository
                    /// </summary>
                    /// <param name="parameters" type="Object">Object of data. Same as in [attach.embody.procceed]</param>
                    /// <returns type="boolean">true if success and false if not</returns>
                    var settings    = modules.registry.getSettings(parameters.name),
                        data        = {
                            name            : parameters.name                       || null,
                            constr          : parameters.protofunction              || null,
                            protofunction   : parameters.protofunction.prototype    || null,
                            reference       : parameters.reference                  || null,
                            resources       : parameters.resources                  || null,
                            onBeforeAttach  : parameters.onBeforeAttach             || null,
                            onAfterAttach   : parameters.onAfterAttach              || null,
                            extend          : parameters.extend                     || null,
                            unexpected      : parameters.unexpected                 || null,
                        },
                        hash        = modules.repository.getHash(parameters.name);
                    data.constr         = (typeof data.constr           === 'function'  ? parsing.js.stringify(data.constr           ) : null);
                    data.protofunction  = (typeof data.protofunction    === 'function'  ? parsing.js.stringify(data.protofunction    ) : null);
                    data.reference      = (data.reference instanceof Array              ? data.reference                               : null);
                    data.onBeforeAttach = (typeof data.onBeforeAttach   === 'function'  ? parsing.js.stringify(data.onBeforeAttach   ) : null);
                    data.onAfterAttach  = (typeof data.onAfterAttach    === 'function'  ? parsing.js.stringify(data.onAfterAttach    ) : null);
                    if (data.constr !== null && data.protofunction !== null) {
                        //Log message
                        logs.log('[MODULES]:: module [' + parameters.name + '] was updated.', logs.types.KERNEL_LOGS);
                        //Save hash
                        if (settings.autoHash === true) {
                            settings.hash = hashes.get(settings.source);
                            hashes.set(settings.source, settings.hash);
                            hashes.update.add(settings.source);
                        }
                        //Return result
                        return system.localStorage.set(
                            parameters.name,
                            JSON.stringify(
                                {
                                    data: data,
                                    hash: settings.hash
                                }
                            ),
                            true,
                            options.other.STORAGE_PREFIX
                        );
                    }
                    return null;
                },
                get         : function (name, hash) {
                    /// <summary>
                    /// Get resource from repository
                    /// </summary>
                    /// <param name="name" type="string">Name of resource</param>
                    /// <param name="hash" type="string">Control hash for resource</param>
                    /// <returns type="object">Value of resource if success and NULL if not</returns>
                    var localStorage    = system.localStorage,
                        storaged        = localStorage.get(name, true, options.other.STORAGE_PREFIX),
                        settings        = modules.registry.getSettings(name);
                    if ((settings.source === null && storaged !== null) || (storaged !== null && config.defaults.resources.USE_STORAGED !== false)) {
                        try{
                            storaged = JSON.parse(storaged);
                            if (storaged.hash === hash || settings.source === null) {
                                storaged.data.protofunction = parsing.js.parse({
                                    constr  : { params: storaged.data.constr.params,        body: storaged.data.constr.body         },
                                    proto   : { params: storaged.data.protofunction.params, body: storaged.data.protofunction.body  }
                                });
                                if (storaged.data.onBeforeAttach !== null) {
                                    storaged.data.onBeforeAttach = parsing.js.parseFunction(storaged.data.onBeforeAttach.params, storaged.data.onBeforeAttach.body);
                                }
                                if (storaged.data.onAfterAttach !== null) {
                                    storaged.data.onAfterAttach = parsing.js.parseFunction(storaged.data.onAfterAttach.params, storaged.data.onAfterAttach.body);
                                }
                                storaged.data.constr = null;
                                delete storaged.data.constr;
                                return storaged.data;
                            } else {
                                //Log message
                                logs.log('[MODULES]:: module [' + name + '] will be updated.', logs.types.KERNEL_LOGS);
                                cache.events.fire.ON_UPDATED_MODULE(name);
                                localStorage.del(name, options.other.STORAGE_PREFIX);
                                return null;
                            }
                        } catch (e) {
                            logs.log('[MODULES]:: new module [' + name + '] is detected.', logs.types.WARNING);
                            cache.events.fire.ON_NEW_MODULE(name);
                            localStorage.del(name, options.other.STORAGE_PREFIX);
                            return null;
                        }
                    } else {
                        logs.log('[MODULES]:: new module [' + name + '] new module is detected.', logs.types.WARNING);
                        cache.events.fire.ON_NEW_MODULE(name);
                    }
                    return null;
                },
                getHash     : function (name){
                    /// <summary>
                    /// Returns hash of resource from repository
                    /// </summary>
                    /// <param name="name" type="string">Name of resource</param>
                    /// <returns type="string">Value of hash</returns>
                    var localStorage    = system.localStorage,
                        storaged        = localStorage.get(name, true, options.other.STORAGE_PREFIX);
                    if (storaged !== null) {
                        try{
                            storaged = JSON.parse(storaged);
                            return storaged.hash;
                        } catch (e) {
                            return null;
                        }
                    }
                    return null;
                },
                call        : function (name) {
                    /// <summary>
                    /// Try find resource into repository and load it if necessary 
                    /// </summary>
                    /// <param name="name" type="string">Name of resource</param>
                    /// <returns type="void">void</returns>
                    var name        = modules.tools.clearName(name),
                        settings    = modules.registry.getSettings(name),
                        repository  = null;
                    if (settings !== null) {
                        if (settings.hash !== void 0) {
                            overhead.register.add(options.register.MODULES_HISTROY, modules.tools.clearName(name));
                            repository = modules.storage.get(modules.tools.fullName(name));
                            repository = repository !== null ? repository : modules.repository.get(modules.tools.fullName(name), settings.hash);
                            if (repository !== null) {
                                modules.attach.safely(repository);
                                return true;
                            } else {
                                if (system.url.is.js(settings.source)) {
                                    system.resources.js.connect(settings.source, null, null);
                                    return true;
                                }
                                if (system.url.is.css(settings.source)) {
                                    system.resources.css.connect(settings.source, null, null);
                                    return true;
                                }
                            }
                        }
                    }
                    logs.log('[MODULES]:: module [' + name + '] cannot be called. Check definitions in registry [flex.registry.modules.js].', logs.types.CRITICAL);
                    return false;
                },
            },
            tools       : {
                fullName    : function (library) {
                    library = library.toLowerCase();
                    return (library.indexOf('flex.libraries.') !== 0 ? 'flex.libraries.' + library : library).replace(/\.\./gi, '.');
                },
                clearName   : function (library) {
                    library = library.toLowerCase().replace('flex.', '');
                    return (library.indexOf('libraries.') === -1 ? 'flex.libraries.' + library : 'flex.' + library);
                }
            }
        };
        external        = {
            isReady     : function(){
                return external.preload.__started === void 0 ? false : overhead.register.isReady(options.register.EXTERNAL_HISTROY);
            },
            queue       : {
                create  : function (resources) {
                    overhead.register.open(
                        options.register.EXTERNAL_HISTROY,
                        resources.map(function (resource) { return resource.url; }),
                        coreEvents.onFlexLoad
                    );
                },
                add     : function (url) {
                    if (typeof url === 'string') {
                        return overhead.register.add(options.register.EXTERNAL_HISTROY, url);
                    }
                    return false;
                },
                done    : function (url) {
                    if (typeof url === 'string') {
                        return overhead.register.done(options.register.EXTERNAL_HISTROY, url);
                    }
                    return false;
                }
            },
            preload     : function () {
                var resources = config.defaults.resources.EXTERNAL;
                external.preload.__started = true;
                if (resources instanceof Array) {
                    if (resources.length > 0) {
                        external.queue.create(resources);
                        Array.prototype.forEach.call(
                            resources,
                            function (resource) {
                                if (oop.objects.validate(resource, [{ name: 'url',  type: 'string'                  },
                                                                    { name: 'hash', type: 'string', value: false    }]) !== false) {
                                    resource.autoHash   = resource.hash === false ? true : false;
                                    resource.hash       = resource.hash === false ? hashes.get(resource.url) : resource.hash;
                                    external.repository.call(resource.url, resource.hash);
                                    if (resource.autoHash === true) {
                                        hashes.update.add(resource.url);
                                    }
                                }
                            }
                        );
                    } else {
                        coreEvents.onFlexLoad();
                    }
                } else {
                    coreEvents.onFlexLoad();
                }
            },
            embody      : function (parameters) {
                function JS(content, url, onLoad, onError) {
                    var wrapper = null;
                    if (config.defaults.resources.USE_STORAGED === false || parameters.body === null) {
                        system.resources.js.connect(url, onLoad, onError);
                    } else {
                        wrapper = new Function(content);
                        try {
                            external.inbuilt.set.js(url);
                            wrapper.call(window);
                            external.inbuilt.set.js(null);
                            system.handle(onLoad, null, 'external.embody', this);
                            return true;
                        } catch (e) {
                            logs.log('During initialization of resource: [' + url + '] happened error:/n/r' + logs.parseError(e), logs.types.WARNING);
                            system.handle(onError, null, 'external.embody', this);
                            return false;
                        }
                    }
                };
                function CSS(content, url, onLoad, onError) {
                    if (config.defaults.resources.USE_STORAGED === false || parameters.body === null) {
                        system.resources.css.connect(url, onLoad, onError);
                    } else {
                        external.inbuilt.set.css(url);
                        system.resources.css.adoption(content, null, system.url.restoreFullURL(url));
                        external.inbuilt.set.css(null);
                        system.handle(onLoad, null, 'external.embody', this);
                    }
                    return true;
                };
                /// <summary>
                /// Try to initialize external resource
                /// </summary>
                /// <param name="parameters" type="Object">Object of resource:  &#13;&#10;
                /// {   [string]    url,                                        &#13;&#10;
                ///     [string]    body,                                       &#13;&#10;
                ///     [string]    hash                                        &#13;&#10;
                ///     [function]  [option] callback                           &#13;&#10;
                /// }</param>
                /// <returns type="boolean">true if success and false if not</returns>
                var Embody          = null,
                    resourceType    = system.url.getTypeOfResource(parameters.url);
                if (resourceType === options.resources.types.JS) {
                    Embody = JS;
                } else if (resourceType === options.resources.types.CSS) {
                    Embody = CSS;
                }
                if (Embody !== null) {
                    Embody(
                        parameters.body,
                        parameters.url,
                        function () {
                            if (parameters.callback !== null) {
                                system.handle(parameters.callback, parameters.url, '[flex]external.embody');
                            } else {
                                external.queue.done(parameters.url);
                            }
                        },
                        function () {
                            logs.log('Resource [' + parameters.url + '] was not load. But FLEX continues loading.', logs.types.CRITICAL);
                            if (parameters.callback === null) {
                                external.queue.done(parameters.url);
                            }
                        }
                    );
                }
            },
            inbuilt     : {
                storage : {
                    js  : null,
                    css : null
                },
                set     : {
                    js  : function (url) {
                        external.inbuilt.storage.js = url;
                    },
                    css : function (url) {
                        external.inbuilt.storage.css = url;
                    },
                },
                get     : {
                    js  : function () {
                        return external.inbuilt.storage.js;
                    },
                    css : function () {
                        return external.inbuilt.storage.css;
                    },
                }
            },
            repository  : {
                add     : function (parameters) {
                    /// <summary>
                    /// Add resource into repository
                    /// </summary>
                    /// <param name="parameters" type="Object">Object of module:    &#13;&#10;
                    /// {   [string]    url,                                        &#13;&#10;
                    ///     [string]    body,                                       &#13;&#10;
                    ///     [string]    hash                                        &#13;&#10;
                    /// }</param>
                    /// <returns type="boolean">true if success and false if not</returns>
                    var hash = external.repository.getHash(parameters.url);
                    if (hash !== parameters.hash && config.defaults.resources.USE_STORAGED !== false && parameters.body !== null) {
                        return system.localStorage.set(
                            parameters.url,
                            JSON.stringify(
                                {
                                    body: parameters.body,
                                    hash: parameters.hash
                                }
                            ),
                            true,
                            options.other.STORAGE_PREFIX
                        );
                    }
                    return null;
                },
                get     : function (url, hash) {
                    /// <summary>
                    /// Get resource from repository
                    /// </summary>
                    /// <param name="url"   type="string">URL of resource</param>
                    /// <param name="hash"  type="string">Control hash for resource</param>
                    /// <returns type="object">Value of resource if success and NULL if not</returns>
                    var localStorage    = system.localStorage,
                        storaged        = localStorage.get(url, true, options.other.STORAGE_PREFIX);
                    if (storaged !== null && config.defaults.resources.USE_STORAGED !== false) {
                        try {
                            storaged = JSON.parse(storaged);
                            if (storaged.hash === hash) {
                                return storaged;
                            } else {
                                localStorage.del(url, options.other.STORAGE_PREFIX);
                                cache.events.fire.ON_UPDATED_RESOURCE(url);
                                return null;
                            }
                        } catch (e) {
                            cache.events.fire.ON_NEW_RESOURCE(url);
                            localStorage.del(url, options.other.STORAGE_PREFIX);
                            return null;
                        }
                    } else {
                        cache.events.fire.ON_NEW_RESOURCE(url);
                    }
                    return null;
                },
                getHash : function (url) {
                    /// <summary>
                    /// Returns hash of resource from repository
                    /// </summary>
                    /// <param name="url" type="string">URL of resource</param>
                    /// <returns type="string">Value of hash</returns>
                    var localStorage    = system.localStorage,
                        storaged        = localStorage.get(url, true, options.other.STORAGE_PREFIX);
                    if (storaged !== null) {
                        try {
                            storaged = JSON.parse(storaged);
                            return storaged.hash;
                        } catch (e) {
                            return null;
                        }
                    }
                    return null;
                },
                call    : function (url, hash, callback) {
                    /// <summary>
                    /// Try find resource in repository and load it if necessary 
                    /// </summary>
                    /// <param name="url"   type="string">URL of resource</param>
                    /// <param name="hash"  type="string">Control hash for resource</param>
                    /// <returns type="void">void</returns>
                    var repository  = external.repository.get(url, hash),
                        callback    = typeof callback === 'function' ? callback : null;
                    if (repository !== null) {
                        if (repository.hash === hash) {
                            external.embody({
                                url     : url,
                                hash    : hash,
                                body    : repository.body,
                                callback: callback
                            });
                        } else {
                            external.loader.load(url, hash, true, callback);
                        }
                    } else {
                        external.loader.load(url, hash, true, callback);
                    }
                }
            },
            loader      : {
                load    : function (url, hash, embody, callback) {
                    var request = ajax.create(
                            url,
                            ajax.settings.methods.GET,
                            null,
                            {
                                success : function (response, request) {
                                    external.loader.success(url, response, hash, embody, callback);
                                },
                                fail    : function (response, request) {
                                    external.loader.fail(request, url, hash, embody, callback);
                                }
                            }
                        );
                    request.send();
                    logs.log('[EXTERNAL]:: resource: [' + url + '] will be reloaded.', logs.types.KERNEL_LOGS);
                },
                success : function (url, response, hash, embody, callback) {
                    external.repository.add({
                        url : url,
                        hash: hash,
                        body: response !== null ? response.original : null
                    });
                    if (embody === true) {
                        external.embody({
                            url     : url,
                            hash    : hash,
                            body    : response !== null ? response.original : null,
                            callback: callback
                        });
                    }
                    logs.log('[EXTERNAL]:: resource: [' + url + '] is reloaded.', logs.types.KERNEL_LOGS);
                },
                fail    : function (request, url, hash, embody, callback) {
                    //Try attach JS
                    logs.log('[EXTERNAL]:: cannot load resource: [' + url + '] cannot be loaded by XMLHttpRequest.', logs.types.WARNING);
                    external.embody({
                        url     : url,
                        hash    : hash,
                        body    : null,
                        callback: callback
                    });
                }
            },
        };
        asynchronous    = {
            isReady: function () {
                return asynchronous.preload.__started === void 0 ? false : (config.defaults.resources.WAIT_ASYNCHRONOUS ? overhead.register.isReady(options.register.ASYNCHRONOUS_HISTORY) : true);
            },
            preload: function () {
                var groups = config.defaults.resources.ASYNCHRONOUS;
                asynchronous.preload.__started = true;
                if (groups instanceof Array) {
                    if (groups.length > 0) {
                        //Global journal
                        overhead.register.open(
                            options.register.ASYNCHRONOUS_HISTORY,
                            Array.prototype.map.call(groups, function (group, index) { return index; }),
                            function () {
                                coreEvents.onFlexLoad();
                            }
                        );
                        Array.prototype.forEach.call(
                            groups,
                            function (group, index) {
                                var id = IDs.id();
                                if (oop.objects.validate(group, [{ name: 'resources', type: 'array' },
                                                                    { name: 'storage', type: 'boolean', value: true },
                                                                    { name: 'finish', type: 'function', value: null }]) !== false) {
                                    //Validate resources
                                    group.resources = group.resources.filter(function (resource) { return typeof resource.url === 'string' ? true : false; });
                                    //Make register
                                    overhead.register.open(
                                        id,
                                        group.resources.map(function (resource) { return resource.url; }),
                                        function () {
                                            system.handle(group.finish);
                                            overhead.register.done(options.register.ASYNCHRONOUS_HISTORY, index);
                                        }
                                    );
                                    //Make calls
                                    group.resources.forEach(function (resource) {
                                        if (oop.objects.validate(resource, [{ name: 'url', type: 'string' },
                                                                            { name: 'hash', type: 'string', value: false },
                                                                            { name: 'after', type: 'array', value: false }]) !== false) {
                                            if (resource.hash === false) {
                                                resource.hash = hashes.get(resource.url);
                                                hashes.update.add(resource.url);
                                            }
                                            asynchronous.repository.call(resource, id, group.storage);
                                        }
                                    });
                                }
                            }
                        );
                    } else {
                        coreEvents.onFlexLoad();
                    }
                } else {
                    coreEvents.onFlexLoad();
                }
            },
            embody      : function (parameters) {
                function JS(id, content, url, storage) {
                    var wrapper = null;
                    if (config.defaults.resources.USE_STORAGED === false || storage === false || parameters.body === null) {
                        system.resources.js.connect(
                            url,
                            function(){
                                overhead.register.done(id, url);
                                asynchronous.wait.check();
                            },
                            function () {
                                logs.log('[ASYNCHRONOUS]:: cannot load resource: [' + url + '].', logs.types.CRITICAL);
                            }
                        );
                        return false;
                    } else {
                        wrapper = new Function(content);
                        try {
                            wrapper.call(window);
                            return true;
                        } catch (e) {
                            logs.log('[ASYNCHRONOUS]:: during initialization of resource: [' + url + '] happened error:/n/r' + logs.parseError(e), logs.types.WARNING);
                            return false;
                        }
                    }
                };
                function CSS(id, content, url, storage) {
                    if (config.defaults.resources.USE_STORAGED === false || storage === false || parameters.body === null) {
                        system.resources.css.connect(
                            url,
                            null,
                            function () {
                                logs.log('[ASYNCHRONOUS]:: cannot load resource: [' + url + '].', logs.types.CRITICAL);
                            }
                        );
                    } else {
                        system.resources.css.adoption(content, null, system.url.restoreFullURL(url));
                    }
                    return true;
                };
                /// <summary>
                /// Try to initialize external resource
                /// </summary>
                /// <param name="parameters" type="Object">Object of resource:  &#13;&#10;
                /// {   [string]    url,                                        &#13;&#10;
                ///     [string]    body,                                       &#13;&#10;
                ///     [string]    id                                          &#13;&#10;
                ///     [string]    storage                                     &#13;&#10;
                /// }</param>
                /// <returns type="boolean">true if success and false if not</returns>
                var resourceType    = system.url.getTypeOfResource(parameters.url),
                    Embody          = null;
                if (resourceType === options.resources.types.JS) {
                    Embody = JS;
                } else if (resourceType === options.resources.types.CSS) {
                    Embody = CSS;
                }
                if (Embody !== null) {
                    if (Embody(parameters.id, parameters.body, parameters.url, parameters.storage) !== false) {
                        overhead.register.done(parameters.id, parameters.url);
                        asynchronous.wait.check();
                    }
                }
            },
            repository  : {
                add : function (parameters) {
                    /// <summary>
                    /// Add resource into repository
                    /// </summary>
                    /// <param name="parameters" type="Object">Object of module:    &#13;&#10;
                    /// {   [string]    url,                                        &#13;&#10;
                    ///     [string]    body,                                       &#13;&#10;
                    ///     [string]    hash,                                       &#13;&#10;
                    /// }</param>
                    /// <returns type="boolean">true if success and false if not</returns>
                    if (config.defaults.resources.USE_STORAGED !== false && parameters.body !== null) {
                        return system.localStorage.set(
                            parameters.url,
                            JSON.stringify(
                                {
                                    body: parameters.body,
                                    hash: parameters.hash,
                                }
                            ),
                            true,
                            options.other.STORAGE_PREFIX
                        );
                    }
                    return null;
                },
                get : function (url, hash) {
                    /// <summary>
                    /// Get resource from repository
                    /// </summary>
                    /// <param name="url" type="string">URL of resource</param>
                    /// <returns type="object">Value of resource if success and NULL if not</returns>
                    var localStorage    = system.localStorage,
                        storaged        = localStorage.get(url, true, options.other.STORAGE_PREFIX);
                    if (storaged !== null && config.defaults.resources.USE_STORAGED !== false) {
                        try {
                            storaged = JSON.parse(storaged);
                            if (storaged.hash !== hash) {
                                logs.log('[ASYNCHRONOUS]:: resource [' + url + '] will be updated.', logs.types.KERNEL_LOGS);
                                localStorage.del(url, options.other.STORAGE_PREFIX);
                                cache.events.fire.ON_UPDATED_RESOURCE(url);
                                return null;
                            } else {
                                return storaged;
                            }
                        } catch (e) {
                            localStorage.del(url, options.other.STORAGE_PREFIX);
                            cache.events.fire.ON_NEW_RESOURCE(url);
                            return null;
                        }
                    } else {
                        cache.events.fire.ON_NEW_RESOURCE(url);
                    }
                    return null;
                },
                call: function (resource, id, storage) {
                    function load(resource, id, storage) {
                        var repository = asynchronous.repository.get(resource.url, resource.hash);
                        if (repository !== null || storage === false) {
                            asynchronous.embody({
                                url     : resource.url,
                                id      : id,
                                body    : repository !== null ? repository.body : null,
                                storage : storage
                            });
                        } else {
                            asynchronous.loader.load(resource.url, id, true, storage, resource.hash);
                        }
                    };
                    /// <summary>
                    /// Try find resource in repository and load it if necessary 
                    /// </summary>
                    /// <param name="resource"  type="string">resource</param>
                    /// <param name="hash"      type="string">Control hash for resource</param>
                    /// <returns type="void">void</returns>
                    var status = true;
                    if (resource.after === false) {
                        load(resource, id, storage);
                    } else {
                        resource.after.forEach(function (url) {
                            status = status === false ? false : overhead.register.isDone(id, url);
                        });
                        if (status !== false) {
                            load(resource, id, storage);
                            asynchronous.wait.remove(resource.url);
                        } else {
                            asynchronous.wait.add(resource, id, storage);
                        }
                    }
                }
            },
            loader      : {
                load    : function (url, id, embody, storage, hash) {
                    var request = ajax.create(
                            url,
                            ajax.settings.methods.GET,
                            null,
                            {
                                success : function (response, request) {
                                    asynchronous.loader.success(url, response, id, embody, storage, hash);
                                },
                                fail    : function (response, request) {
                                    asynchronous.loader.fail(request, url, response, id, embody, storage, hash);
                                }
                            }
                        );
                    request.send();
                },
                success : function (url, response, id, embody, storage, hash) {
                    if (storage !== false && response !== null && response.original !== void 0) {
                        asynchronous.repository.add({
                            url : url,
                            body: response.original,
                            hash: hash
                        });
                    }
                    if (embody !== false) {
                        asynchronous.embody({
                            url     : url,
                            id      : id,
                            body    : response !== null ? response.original : null,
                            storage : storage
                        });
                    }
                },
                fail    : function (request, url, response, id, embody, storage, hash) {
                    //Try attach JS
                    logs.log('[ASYNCHRONOUS]:: cannot load resource: [' + url + '] cannot be loaded by XMLHttpRequest.', logs.types.WARNING);
                    asynchronous.embody({
                        url     : url,
                        id      : id,
                        body    : null,
                        storage : false
                    });
                }
            },
            wait        : {
                storage : {},
                add     : function (resource, id, _storage) {
                    var storage = asynchronous.wait.storage;
                    if (!storage[resource.url]) {
                        storage[resource.url]           = resource;
                        storage[resource.url].id        = id;
                        storage[resource.url].storage   = _storage;
                    }
                },
                remove  : function (url) {
                    var storage = asynchronous.wait.storage;
                    if (storage[url]) {
                        storage[url] = null;
                        delete storage[url];
                    }
                },
                check   : function () {
                    var storage = asynchronous.wait.storage;
                    for (var key in storage) {
                        asynchronous.repository.call(storage[key], storage[key].id, storage[key].storage);
                    }
                }
            }
        };
        parsing         = {
            js  : {
                stringify       : function (_function) {
                    /// <summary>
                    /// Get string from function
                    /// </summary>
                    /// <param name="name" type="string">Function body</param>
                    /// <returns type="object" value="{params:string,body:string}">Function as object</returns>
                    var tools           = parsing.js.tools,
                        str_function    = null,
                        result          = null;
                    if (typeof _function === 'function') {
                        str_function    = _function.toString();
                        result          = {
                            params  : tools.getParams(str_function),
                            body    : tools.getBody(str_function)
                        };
                        if (result.params !== null && result.body !== null) {
                            return result;
                        }
                        return null;
                    }
                },
                parse           : function (data) {
                    /// <summary>
                    /// Make prototype function and constructor from string data
                    /// </summary>
                    /// <param name="parameters" type="Object"> 
                    /// {   [object] constr:                    &#13;&#10;
                    ///     {   [string] params,                &#13;&#10;
                    ///         [string] body                   &#13;&#10;
                    ///     },                                  &#13;&#10;
                    /// {   [object] proto:                     &#13;&#10;
                    ///     {   [string] params,                &#13;&#10;
                    ///         [string] body                   &#13;&#10;
                    ///     },                                  &#13;&#10;
                    /// }</param>
                    /// <returns type="function">Prototype function</returns>
                    var protofunction = parsing.js.parseFunction(data.constr.params, data.constr.body);
                    if (typeof protofunction === 'function') {
                        protofunction.prototype = parsing.js.parseFunction(data.proto.params, data.proto.body);
                        if (typeof protofunction.prototype === 'function') {
                            return protofunction;
                        }
                    }
                    return null;
                },
                parseFunction   : function (params, body) {
                    /// <summary>
                    /// Make function from string data
                    /// </summary>
                    /// <param name="params" type="string">Parameters of function</param>
                    /// <param name="body" type="string">Body of function</param>
                    /// <returns type="function">Function</returns>
                    if (typeof params === 'string' && typeof body === 'string') {
                        if (params === ''){
                            return new Function(body);
                        } else {
                            return new Function(params, body);
                        }
                    }
                    return null;
                },
                tools           : {
                    regs    : {
                        FUNCTION            : /^\(?function\s.*?\(.*?\)\s*?\{/gi,
                        ARGUMENTS           : /\(.*?\)/gi,
                        ARGUMENTS_BORDERS   : /[\(\)]/gi,
                        BODY_END            : /\}$/gi,
                        STRICT              : /(use strict)/gi,
                    },
                    getBody     : function (function_str) {
                        /// <summary>
                        /// Get body of function from string representation
                        /// </summary>
                        /// <param name="function_str" type="string">String representation of function</param>
                        /// <returns type="string">String representation of function's body</returns>
                        function_str = function_str.replace(parsing.js.tools.regs.FUNCTION, '');
                        function_str = function_str.replace(parsing.js.tools.regs.BODY_END, '');
                        if (function_str.search(parsing.js.tools.regs.STRICT) === -1) {
                            function_str = '"use strict";' + function_str;
                        }
                        return function_str;
                    },
                    getParams   : function (function_str) {
                        /// <summary>
                        /// Get parameters of function from string representation
                        /// </summary>
                        /// <param name="function_str" type="string">String representation of function</param>
                        /// <returns type="string">String representation of function's parameters</returns>
                        var matches = function_str.match(parsing.js.tools.regs.FUNCTION);
                        if (matches !== null) {
                            if (matches.length === 1) {
                                matches = matches[0].match(parsing.js.tools.regs.ARGUMENTS);
                                if (matches.length === 1) {
                                    matches = matches[0].replace(parsing.js.tools.regs.ARGUMENTS_BORDERS, '');
                                    return matches;
                                }
                            }
                        }
                        return null;
                    }
                }
            },
            css : {
                stringify       : function (href) {
                    /// <summary>
                    /// Get string from CSS resource
                    /// </summary>
                    /// <param name="resource" type="string">URL of CSS resource</param>
                    /// <returns type="string">String representation of CSS resource</returns>
                    function getCSSText(sheet) {
                        function getKeyframesIE(rule) {
                            var keyframe = '';
                            if (rule.cssRules) {
                                keyframe = '@keyframes ' + rule.name + ' {\n\r';
                                Array.prototype.forEach.call(
                                    rule.cssRules,
                                    function (sub_rule) {
                                        keyframe += sub_rule.keyText + ' { ' + sub_rule.style.cssText + ' }\n\r';
                                    }
                                );
                                keyframe += '}';
                            }
                            return keyframe;
                        };
                        var CSSText = '',
                            doc     = document;
                        if (sheet.cssRules || sheet.rules) {
                            Array.prototype.forEach.call(
                                (sheet.cssRules || sheet.rules),
                                function (rule) {
                                    if (typeof rule.cssText === 'string') {
                                        CSSText += rule.cssText + '\n\r';
                                    } else {
                                        CSSText += getKeyframesIE(rule) + '\n\r';
                                    }
                                }
                            );
                        } else if (typeof sheet.cssText === 'string') {
                            CSSText = sheet.cssText;
                        }
                        return CSSText;
                    };
                    var sheets      = document.styleSheets,
                        styles      = null;
                    try{
                        Array.prototype.forEach.call(
                            document.styleSheets,
                            function (sheet) {
                                if (sheet.href) {
                                    if (sheet.href.indexOf(href) !== -1) {
                                        styles = getCSSText(sheet);
                                        throw 'found';
                                    }
                                }
                            }
                        );
                    } catch (e) {
                    } finally {
                        return styles;
                    }
                }
            }
        };
        overhead        = {
            globaly : {
                storage : {},
                get     : function (group, name, default_value) {
                    /// <signature>
                    ///     <summary>Return value from closed space</summary>
                    ///     <param name="group" type="string"   >Name of storage group</param>
                    ///     <param name="name"  type="string"   >Name of storage</param>
                    ///     <returns type="any">returns saved value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Return value from closed space</summary>
                    ///     <param name="group"         type="string"   >Name of storage group</param>
                    ///     <param name="name"          type="string"   >Name of storage</param>
                    ///     <param name="default_value" type="any"      >Default value, if property will not be found</param>
                    ///     <returns type="any">returns saved value</returns>
                    /// </signature>
                    var storage = overhead.globaly.storage;
                    if (group in storage) {
                        if (name in storage[group]) {
                            return storage[group][name];
                        }
                    }
                    if (default_value) {
                        return overhead.globaly.set(group, name, default_value);
                    }
                    return null;
                },
                set     : function (group, name, value) {
                    /// <summary>Create value in closed space</summary>
                    /// <param name="group" type="string"   >Name of storage group</param>
                    /// <param name="name"  type="string"   >Name of storage</param>
                    /// <param name="value" type="any"      >Value</param>
                    /// <returns type="any">returns saved value</returns>
                    var storage = overhead.globaly.storage;
                    storage[group] = (group in storage ? storage[group] : {});
                    storage[group][name] = value;
                    return storage[group][name];
                },
                remove  : function (group, name) {
                    /// <summary>Return value from closed space</summary>
                    /// <param name="group" type="string"   >Name of storage group</param>
                    /// <param name="name"  type="string"   >Name of storage</param>
                    /// <returns type="boolean">true - if removed; false - if not found</returns>
                    var storage = overhead.globaly.storage;
                    if (group in storage) {
                        if (name in storage[group]) {
                            storage[group][name] = null;
                            delete storage[group][name];
                            if (Object.keys(storage[group]).length === 0) {
                                storage[group] = null;
                                delete storage[group];
                            }
                            return true;
                        }
                    }
                    return false;
                }
            },
            objecty : {
                settings: {
                    COMMON_STORAGE_NAME : 'FlexObjectStorage'
                },
                set     : function (element, property, value, rewrite) {
                    /// <signature>
                    ///     <summary>Add property to virtual storage based on element</summary>
                    ///     <param name="element"   type="object"   >Object for attach storage</param>
                    ///     <param name="property"  type="string"   >Name of property</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Add property to virtual storage based on element</summary>
                    ///     <param name="element"   type="object"   >Object for attach storage</param>
                    ///     <param name="property"  type="string"   >Name of property</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <param name="rewrite"   type="boolean"  >[optional] rewrite or not value</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    var rewrite     = (typeof rewrite === "boolean" ? rewrite : true),
                        settings    = overhead.objecty.settings;
                    if (typeof element === "object" && typeof property === "string" && value !== void 0) {
                        if (typeof element[settings.COMMON_STORAGE_NAME] !== "object") {
                            element[settings.COMMON_STORAGE_NAME] = {};
                        }
                        if (rewrite === false) {
                            if (element[settings.COMMON_STORAGE_NAME][property] === void 0) {
                                element[settings.COMMON_STORAGE_NAME][property] = value;
                            }
                        } else {
                            element[settings.COMMON_STORAGE_NAME][property] = value;
                        }
                        return value;
                    }
                    return null; 
                },
                get     : function (element, property, remove, default_value) {
                    /// <signature>
                    ///     <summary>Get property from virtual storage based on element</summary>
                    ///     <param name="element"       type="object"   >Object for attach storage</param>
                    ///     <param name="property"      type="string"   >Name of property</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get property from virtual storage based on element</summary>
                    ///     <param name="element"       type="object"   >Object for attach storage</param>
                    ///     <param name="property"      type="string"   >Name of property</param>
                    ///     <param name="remove"        type="boolean"  >[optional] remove or not property from storage after value will be read</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get property from virtual storage based on element</summary>
                    ///     <param name="element"       type="object"   >Object for attach storage</param>
                    ///     <param name="property"      type="string"   >Name of property</param>
                    ///     <param name="remove"        type="boolean"  >[optional] remove or not property from storage after value will be read</param>
                    ///     <param name="default_value" type="any"      >[optional] default value of property</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    var remove          = (typeof remove === "boolean" ? remove : false),
                        default_value   = (default_value !== void 0 ? default_value : null),
						value           = null,
                        settings        = overhead.objecty.settings,
						tools           = overhead.objecty.tools;
                    if (typeof element === "object" && typeof property === "string") {
                        if (typeof element[settings.COMMON_STORAGE_NAME] === "object") {
                            if (element[settings.COMMON_STORAGE_NAME][property] !== void 0) {
                                value = element[settings.COMMON_STORAGE_NAME][property];
                                if (remove === true) {
                                    element[settings.COMMON_STORAGE_NAME][property] = null;
                                    tools.deleteAttribute(element, property);
                                    tools.clear(element);
                                }
                                return value;
                            } else {
                                if (default_value !== null) {
                                    element[settings.COMMON_STORAGE_NAME][property] = default_value;
                                    return element[settings.COMMON_STORAGE_NAME][property];
                                }
                            }
                        } else {
                            if (default_value !== null) {
                                element[settings.COMMON_STORAGE_NAME]           = {};
                                element[settings.COMMON_STORAGE_NAME][property] = default_value;
                                return element[settings.COMMON_STORAGE_NAME][property];
                            }
                        }
                    }
                    return null;
                },
                remove  : function (element, property) {
                    /// <summary>Remove property from virtual storage based on element</summary>
                    /// <param name="element"   type="object"   >Object for attach storage</param>
                    /// <param name="property"  type="string"   >Name of property</param>
                    /// <returns type="boolean">true - removed; false - not found; null - bad parameters</returns>
                    var remove      = (typeof remove === "boolean" ? remove : false),
						value       = null,
                        settings    = overhead.objecty.settings,
						tools       = overhead.objecty.tools;
                    if (typeof element === "object" && typeof property === "string") {
                        if (typeof element[settings.COMMON_STORAGE_NAME] === "object") {
                            if (element[settings.COMMON_STORAGE_NAME][property] !== void 0) {
                                element[settings.COMMON_STORAGE_NAME][property] = null;
                                tools.deleteAttribute(element, property);
                                tools.clear(element);
                                return true;
                            }
                        }
                        return false;
                    }
                    return null;
                },
                tools   : {
                    deleteAttribute : function (element, property) {
                        try {
                            delete element[property];
                        } catch (e) {
                            element.removeAttribute(property);
                        }
                    },
                    clear           : function (element) {
                        var settings    = overhead.objecty.settings,
                            tools       = overhead.objecty.tools;
                        if (Object.keys(element[settings.COMMON_STORAGE_NAME]).length === 0) {
                            element[settings.COMMON_STORAGE_NAME] = null;
                            tools.deleteAttribute(element, settings.COMMON_STORAGE_NAME);
                        }
                    }
                }
            },
            register: {
                settings: {
                    COMMON_STORAGE_NAME: 'FlexRegisterStorage'
                },
                build   : function (name, onReadyHandle) {
                    //Define class of register
                    var Register        = function (name, onReadyHandle) {
                        this.name       = name;
                        this.onReady    = onReadyHandle;
                        this.items      = {};
                    };
                    Register.prototype  = {
                        add     : function (key) {
                            if (!this.items[key]) {
                                this.items[key] = {
                                    isDone  : false,
                                    key     : key
                                };
                                return true;
                            }
                            return false;
                        },
                        done    : function (key, do_not_check) {
                            var do_not_check = typeof do_not_check === 'boolean' ? do_not_check : false;
                            if (this.items[key]) {
                                this.items[key].isDone = true;
                            }
                            if (do_not_check === false) {
                                if (this.isReady() !== false) {
                                    if (this.onReady !== null && this.handled === void 0) {
                                        this.handled = true;
                                        system.handle(this.onReady, null, 'Register: ' + this.name, this);
                                    }
                                    return true;
                                }
                            }
                            return false;
                        },
                        isReady : function () {
                            for (var key in this.items) {
                                if (this.items[key].isDone === false) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        isIn    : function (key) {
                            return (this.items[key] ? true : false);
                        },
                        isDone  : function (key) {
                            if (this.items[key]) {
                                return this.items[key].isDone;
                            }
                            return null;
                        }
                    };
                    //Create register
                    return new Register(name, onReadyHandle);
                },
                open    : function (name, keys, onReadyHandle) {
                    /// <summary>Create new register</summary>
                    /// <param name="name"          type="string"       >Name of register</param>
                    /// <param name="keys"          type="array || any" >Default keys for register</param>
                    /// <param name="onReadyHandle" type="function"     >onReady handle, handle, which will be fired on all items will be done</param>
                    /// <returns type="boolean">true / false</returns>
                    var name            = (typeof name === 'string' ? name : null),
                        keys            = (keys instanceof Array ? keys : (keys !== void 0 ? [keys] : null)),
                        onReadyHandle   = (typeof onReadyHandle === 'function' ? onReadyHandle : null),
                        register        = null,
                        storage         = overhead.globaly.get(options.storage.GROUP, overhead.register.settings.COMMON_STORAGE_NAME, {});
                    if (name !== null) {
                        if (!storage[name]) {
                            //Create register
                            register = overhead.register.build(name, onReadyHandle);
                            //Add keys
                            keys.forEach(function (key) {
                                register.add(key);
                            });
                            //Save register
                            storage[name] = register;
                            return true;
                        }
                    }
                    return false;
                },
                add     : function (name, key) {
                    /// <summary>Add new key into register</summary>
                    /// <param name="name"  type="string">Name of register</param>
                    /// <param name="key"   type="string">New key name</param>
                    /// <returns type="boolean">true / false</returns>
                    var storage = overhead.globaly.get(options.storage.GROUP, overhead.register.settings.COMMON_STORAGE_NAME, {});
                    if (storage[name]) {
                        return storage[name].add(key);
                    }
                    return false;
                },
                done    : function (name, key, do_not_check) {
                    /// <signature>
                    ///     <summary>Set item of register to DONE</summary>
                    ///     <param name="name"          type="string"   >Name of register</param>
                    ///     <param name="key"           type="string"   >New key name</param>
                    ///     <returns type="boolean">true / false</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Set item of register to DONE</summary>
                    ///     <param name="name"          type="string"   >Name of register</param>
                    ///     <param name="key"           type="string"   >New key name</param>
                    ///     <param name="do_not_check"  type="boolean"  >true - check is all items are ready; false - do not check</param>
                    ///     <returns type="boolean">true / false</returns>
                    /// </signature>
                    var storage         = overhead.globaly.get(options.storage.GROUP, overhead.register.settings.COMMON_STORAGE_NAME, {}),
                        do_not_check    = typeof do_not_check === 'boolean' ? do_not_check : false;
                    if (storage[name]) {
                        if (storage[name].done(key, do_not_check) !== false) {
                            storage[name] = null;
                            delete storage[name];
                        }
                    }
                    return false;
                },
                isIn    : function (name, key) {
                    /// <summary>
                    /// Is key in register
                    /// </summary>
                    /// <param name="name"  type="string">Name of register</param>
                    /// <param name="key"   type="string">New key name</param>
                    /// <returns type="boolean">true / false</returns>
                    var storage = overhead.globaly.get(options.storage.GROUP, overhead.register.settings.COMMON_STORAGE_NAME, {});
                    if (storage[name]) {
                        return storage[name].isIn(key);
                    }
                    return false;
                },
                isDone  : function (name, key) {
                    /// <summary>
                    /// Is key done
                    /// </summary>
                    /// <param name="name"  type="string">Name of register</param>
                    /// <param name="key"   type="string">New key name</param>
                    /// <returns type="boolean">true / false</returns>
                    var storage = overhead.globaly.get(options.storage.GROUP, overhead.register.settings.COMMON_STORAGE_NAME, {});
                    if (storage[name]) {
                        return storage[name].isDone(key);
                    }
                    return false;
                },
                isReady : function (name) {
                    /// <summary>
                    /// Is register done
                    /// </summary>
                    /// <param name="name"  type="string">Name of register</param>
                    /// <returns type="boolean">true / false</returns>
                    var storage = overhead.globaly.get(options.storage.GROUP, overhead.register.settings.COMMON_STORAGE_NAME, {});
                    if (storage[name]) {
                        return storage[name].isReady();
                    }
                    return true;
                },
            }
        };
        events          = {
            DOM     : {
                add     : (function () {
                    if (typeof window.addEventListener === "function") {
                        return function (element, eventName, handle) {
                            /// <summary>
                            /// Add DOM's events listener 
                            /// </summary>
                            /// <param name="element"   type="node"     >Node</param>
                            /// <param name="eventName" type="string"   >Name of event</param>
                            /// <param name="handle"    type="function" >Handle</param>
                            /// <returns type="void">void</returns>
                            var events = (eventName instanceof Array ? eventName : [eventName]);
                            Array.prototype.forEach.call(
                                events,
                                function (event) {
                                    element.addEventListener(event, handle, false);
                                }
                            );
                        };
                    } else if (typeof document.attachEvent === "function") {
                        return function (element, eventName, handle) {
                            /// <summary>
                            /// Add DOM's events listener 
                            /// </summary>
                            /// <param name="element"   type="node"     >Node</param>
                            /// <param name="eventName" type="string"   >Name of event</param>
                            /// <param name="handle"    type="function" >Handle</param>
                            /// <returns type="void">void</returns>
                            var events = (eventName instanceof Array ? eventName : [eventName]);
                            Array.prototype.forEach.call(
                                events,
                                function (event) {
                                    element.attachEvent(("on" + event), handle);
                                }
                            );
                        };
                    } else {
                        return function (element, eventName, handle) {
                            /// <summary>
                            /// Add DOM's events listener 
                            /// </summary>
                            /// <param name="element"   type="node"     >Node</param>
                            /// <param name="eventName" type="string"   >Name of event</param>
                            /// <param name="handle"    type="function" >Handle</param>
                            /// <returns type="void">void</returns>
                            var events = (eventName instanceof Array ? eventName : [eventName]);
                            Array.prototype.forEach.call(
                                events,
                                function (event) {
                                    element[("on" + event)] = handle;
                                }
                            );
                        };
                    };
                }()),
                remove  : (function () {
                    if (typeof window.removeEventListener === "function") {
                        return function (element, eventName, handle) {
                            /// <summary>
                            /// Remove DOM's events listener 
                            /// </summary>
                            /// <param name="element"   type="node"     >Node</param>
                            /// <param name="eventName" type="string"   >Name of event</param>
                            /// <param name="handle"    type="function" >Handle</param>
                            /// <returns type="void">void</returns>
                            element.removeEventListener(eventName, handle, false);
                        };
                    } else if (typeof document.detachEvent === "function") {
                        return function (element, eventName, handle) {
                            /// <summary>
                            /// Remove DOM's events listener 
                            /// </summary>
                            /// <param name="element"   type="node"     >Node</param>
                            /// <param name="eventName" type="string"   >Name of event</param>
                            /// <param name="handle"    type="function" >Handle</param>
                            /// <returns type="void">void</returns>
                            element.detachEvent(("on" + eventName), handle);
                        };
                    } else {
                        return function (element, eventName, handle) {
                            /// <summary>
                            /// Remove DOM's events listener 
                            /// </summary>
                            /// <param name="element"   type="node"     >Node</param>
                            /// <param name="eventName" type="string"   >Name of event</param>
                            /// <param name="handle"    type="function" >Handle</param>
                            /// <returns type="void">void</returns>
                            element[("on" + eventName)] = null;
                        };
                    };
                }())
            },
            core    : {
                storage : {},
                listen  : function (group, name, handle, id, registered_only) {
                    /// <signature>
                    ///     <summary>Add core's events listener </summary>
                    ///     <param name="group"             type="string"   >Name of event group</param>
                    ///     <param name="name"              type="string"   >Name of event</param>
                    ///     <param name="handle"            type="function" >Handle</param>
                    ///     <param name="id"                type="string"   >[optional][unique ID] ID of event</param>
                    ///     <returns type="boolean / string">return ID of listener - if attached; false - if not</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Add core's events listener </summary>
                    ///     <param name="group"             type="string"   >Name of event group</param>
                    ///     <param name="name"              type="string"   >Name of event</param>
                    ///     <param name="handle"            type="function" >Handle</param>
                    ///     <param name="id"                type="string"   >[optional][unique ID] ID of event</param>
                    ///     <param name="registered_only"   type="boolean"  >[optional][false] Add listener only if event was registered before</param>
                    ///     <returns type="boolean / string">return ID of listener - if attached; false - if not</returns>
                    /// </signature>
                    var group           = group || null,
                        name            = name      || null,
                        handle          = handle    || null,
                        id              = id        || IDs.id(),
                        registered_only = typeof registered_only !== 'boolean' ? false : registered_only,
                        storage         = null,
                        core            = events.core;
                    if (group !== null && name !== null && handle !== null) {
                        if (registered_only !== false) {
                            if (core.get(group, name) === null) {
                                return false;
                            }
                        }
                        storage = core.register(group, name);
                        if (id in storage) {
                            //Here should be message about rewrite existing handle
                            //LOGS!
                        }
                        storage[id] = handle;
                        return id;
                    }
                    return false;
                },
                remove  : function (group, name, id) {
                    /// <summary>
                    /// Remove core's events listener 
                    /// </summary>
                    /// <param name="group" type="string">Name of event group</param>
                    /// <param name="name"  type="string">Name of event</param>
                    /// <param name="id"    type="string">ID of event</param>
                    /// <returns type="boolean">true - removed; false - not found</returns>
                    var group = group || null,
                        name            = name      || null,
                        id              = id        || null,
                        storage         = null,
                        global_starage  = events.core.storage,
                        core            = events.core;
                    if (group !== null && name !== null && id !== null) {
                        storage = core.register(group, name);
                        if (id in storage) {
                            storage[id] = null;
                            delete storage[id];
                            if (Object.keys(storage).length === 0) {
                                global_starage[group][name] = null;
                                delete global_starage[group][name];
                                if (Object.keys(global_starage[group]).length === 0) {
                                    global_starage[group] = null;
                                    delete global_starage[group];
                                }
                            }
                            return true;
                        }
                    }
                    return false;
                },
                register: function (group, name) {
                    /// <summary>
                    /// Register core's event 
                    /// </summary>
                    /// <param name="group" type="string">Name of event group</param>
                    /// <param name="name"  type="string">Name of event</param>
                    /// <returns type="object">Storage of registered event</returns>
                    var storage = events.core.storage;
                    if (!(group in storage      )) { storage[group]         = {}; }
                    if (!(name in storage[group])) { storage[group][name]   = {}; }
                    return storage[group][name];
                },
                get     : function (group, name) {
                    /// <summary>
                    /// Get storage of registered core's event 
                    /// </summary>
                    /// <param name="group" type="string">Name of event group</param>
                    /// <param name="name"  type="string">Name of event</param>
                    /// <returns type="object" mayBeNull="true">Storage of registered event. NULL if event isn't registered</returns>
                    var storage = events.core.storage;
                    if (!(group in storage      )) { return null; }
                    if (!(name in storage[group])) { return null; }
                    return storage[group][name];
                },
                fire    : function (group, name, params) {
                    /// <signature>
                    ///     <summary>Call handles of registered core's event</summary>
                    ///     <param name="group"     type="string"   >Name of event group</param>
                    ///     <param name="name"      type="string"   >Name of event</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Call handles of registered core's event</summary>
                    ///     <param name="group"     type="string"   >Name of event group</param>
                    ///     <param name="name"      type="string"   >Name of event</param>
                    ///     <param name="params"    type="any"      >Parameters for all called handles</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                    var handles = events.core.get(group, name);
                    if (handles !== null) {
                        for (var id in handles) {
                            try{
                                handles[id](params);
                            } catch (e) {
                                //LOGS!
                            }
                        }
                    }
                }
            }
        };
        system          = {
            handle      : function (handle_body, handle_arguments, call_point, this_argument, safely) {
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <param name="arguments"     type="any"      >Arguments for handle</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <param name="arguments"     type="any"      >Arguments for handle</param>
                ///     <param name="call_point"    type="string"   >Text for log message.</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <param name="arguments"     type="any"      >Arguments for handle</param>
                ///     <param name="call_point"    type="string"   >Text for log message.</param>
                ///     <param name="this"          type="object"   >Context of handle</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <param name="arguments"     type="any"      >Arguments for handle</param>
                ///     <param name="call_point"    type="string"   >Text for log message.</param>
                ///     <param name="this"          type="object"   >Context of handle</param>
                ///     <param name="safely"        type="boolean"  >Wrap into try / catch </param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                function proceed() {
                    if (handle_arguments === null) {
                        return handle_body.call(this_argument);
                    } else {
                        if (typeof handle_arguments.length === "number" && typeof handle_arguments === "object") {
                            return handle_body.apply(this_argument, handle_arguments);
                        } else {
                            return handle_body.call(this_argument, handle_arguments);
                        }
                    }
                };
                var handle_body         = handle_body       || null,
                    handle_arguments    = handle_arguments  || null,
                    call_point          = call_point        || null,
                    this_argument       = this_argument     || null,
                    safely              = safely            || false;
                if (handle_body !== null) {
                    if (safely) {
                        try {
                            return proceed();
                        } catch (e) {
                            logs.log(
                                "Initializer runFunction method catch error: \r\n" +
                                logs.parseError(e) + "\r\n Call point: " + call_point,
                                logs.types.WARNING
                            );
                            return null;
                        }
                    } else {
                        return proceed();
                    }
                }
                return null;
            },
            localStorage: {
                get         : function (key, decode, prefix) {
                    /// <signature>
                    ///     <summary>Get value from localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value in localStorage</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get value from localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value in localStorage</param>
                    ///     <param name="decode"    type="boolean"  >True - decode from BASE64String</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get value from localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value in localStorage</param>
                    ///     <param name="decode"    type="boolean"  >True - decode from BASE64String</param>
                    ///     <param name="prefix"    type="string"   >Prefix for key of value</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    var value = null,
                        decode  = typeof decode === 'boolean' ? decode : false,
                        prefix  = typeof prefix === 'string' ? prefix : '';
                    try {
                        value = window.localStorage.getItem(prefix + key);
                        if (typeof value !== "string") {
                            value = null;
                        }
                        if (decode !== false) {
                            value = system.convertor.BASE64.decode(value);
                            value = system.convertor.UTF8.  decode(value);
                        }
                        return value;
                    } catch (e) {
                        return null;
                    }
                },
                set         : function (key, value, encode, prefix) {
                    /// <signature>
                    ///     <summary>Save value in localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Save value in localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <param name="decode"    type="boolean"  >True - encode to BASE64String</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Save value in localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <param name="decode"    type="boolean"  >True - encode to BASE64String</param>
                    ///     <param name="prefix"    type="string"   >Prefix for key of value</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    var result_value = value,
                        encode          = typeof encode === 'boolean' ? encode : false,
                        prefix          = typeof prefix === 'string' ? prefix : '';
                    try {
                        window.localStorage.removeItem(prefix + key);
                        if (encode !== false) {
                            result_value = typeof value !== 'string' ? JSON.stringify(value) : result_value;
                            result_value = system.convertor.UTF8.   encode(result_value);
                            result_value = system.convertor.BASE64. encode(result_value);
                        }
                        window.localStorage.setItem(prefix + key, result_value);
                        return true;
                    } catch (e) {
                        logs.log('Error during saving data into localStorage. [key]:[' + key + ']', logs.types.WARNING);
                        return false;
                    }
                },
                del         : function (key, prefix) {
                    /// <signature>
                    ///     <summary>Remove value from localStorage</summary>
                    ///     <param name="key" type="string">Key of value</param>
                    ///     <returns type="boolean">True - success, False - fail</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Remove value from localStorage</summary>
                    ///     <param name="key"       type="string">Key of value</param>
                    ///     <param name="prefix"    type="string">Prefix for key of value</param>
                    ///     <returns type="boolean">True - success, False - fail</returns>
                    /// </signature>
                    var prefix = typeof prefix === 'string' ? prefix : '';
                    try {
                        window.localStorage.removeItem(prefix + key);
                        return true;
                    } catch (e) {
                        logs.log('Error during deleting data from localStorage. [key]:[' + key + ']', logs.types.WARNING);
                        return null;
                    }
                },
                getJSON     : function (key, prefix) {
                    /// <signature>
                    ///     <summary>Get value from localStorage and convert it to JSON</summary>
                    ///     <param name="key" type="string">Key of value in localStorage</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get value from localStorage and convert it to JSON</summary>
                    ///     <param name="key"       type="string">Key of value in localStorage</param>
                    ///     <param name="prefix"    type="string">Prefix for key of value</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    var storaged = system.localStorage.get(key, true, prefix);
                    if (storaged !== null) {
                        try{
                            storaged = JSON.parse(storaged);
                            return storaged;
                        } catch (e) {
                            return null;
                        }
                    }
                    return null;
                },
                setJSON     : function (key, value, prefix) {
                    /// <signature>
                    ///     <summary>Stringify object from JSON and save it in localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Stringify object from JSON and save it in localStorage</summary>
                    ///     <param name="key"       type="string"   >Key of value</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <param name="prefix"    type="string"   >Prefix for key of value</param>
                    ///     <returns type="any">Value from localStorage</returns>
                    /// </signature>
                    return system.localStorage.set(key, JSON.stringify(value), true, prefix);
                },
                reset       : function (prefix) {
                    /// <signature>
                    ///     <summary>Clear all data from localStorage</summary>
                    ///     <returns type="boolean">true - success; false - fail</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Clear all data from localStorage</summary>
                    ///     <param name="prefix" type="string">Remove value with key started with prefix</param>
                    ///     <returns type="boolean">true - success; false - fail</returns>
                    /// </signature>
                    var prefix  = typeof prefix === 'string' ? prefix : '',
                        keys    = [];
                    try {
                        if (prefix !== null) {
                            for (var key in window.localStorage) {
                                if (key.indexOf(prefix) === 0) {
                                    keys.push(key);
                                }
                            }
                            keys.forEach(function (key) {
                                window.localStorage.removeItem(key);
                            });
                        } else {
                            window.localStorage.clear();
                        }
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                isAvailable : function () {
                    var id      = IDs.id(),
                        result  = false;
                    system.localStorage.set(id, id);
                    result = system.localStorage.get(id) === id ? true : false;
                    system.localStorage.del(id);
                    return result;
                }
            },
            resources   : {
                settings    : {
                    RESOURCES_MARK_ATTR: { name: 'data-flex-connect-mark', value: 'dynamically' },
                    CSS_TIMER_PROPERTY : 'flex_css_load_event_timer',
                    CSS_TIMER_DURATION : 5000,
                },
                css         : {
                    settings    : {
                        URLS    : [
                            {
                                reg     : /url\('([^\)'].*?)'\)/gi,
                                left    : /url\('/gi,
                                right   : /'\)/gi,
                                _left   : 'url("',
                                _right  : '")',
                            },
                            {
                                reg     : /url\("([^\)"].*?)"\)/gi,
                                left    : /url\("/gi,
                                right   : /"\)/gi,
                                _left   : 'url("',
                                _right  : '")',
                            },
                        ],
                        attr    : {
                            SRC : 'data-flex-src'
                        }
                    },
                    connect     : function (url, onLoad, onError) {
                        /// <signature>
                        ///     <summary>Connect CSS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <returns type="boolean">true / false</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect CSS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <returns type="boolean">true / false</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect CSS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <param name="onError"   type="function" >Callback on some error</param>
                        ///     <returns type="boolean">true / false</returns>
                        /// </signature>
                        function addLink(url) {
                            var settings    = system.resources.settings,
                                link        = document.createElement("LINK");
                            link.type   = "text/css";
                            link.href   = url;
                            link.rel    = "stylesheet";
                            link.setAttribute(settings.RESOURCES_MARK_ATTR.name, settings.RESOURCES_MARK_ATTR.value);
                            return {
                                link    : link,
                                append  : function () { document.head.appendChild(link); }
                            };
                        };
                        function addLoadListener(link, url, onLoad) {
                            function resetTimer(link, setting) {
                                clearTimeout(link[settings.CSS_TIMER_PROPERTY]);
                                link[settings.CSS_TIMER_PROPERTY] = null;
                                delete link[settings.CSS_TIMER_PROPERTY];
                            };
                            var settings = system.resources.settings;
                            //Not all browsers supports load event for CSS. That's why using <IMG> to emulate load event
                            link[settings.CSS_TIMER_PROPERTY] = setTimeout(
                                function () {
                                    if (link[settings.CSS_TIMER_PROPERTY] !== void 0) {
                                        var img = document.createElement("IMG");
                                        resetTimer(link, settings);
                                        events.DOM.add(
                                            img,
                                            ['load', 'error'],
                                            function (event) {
                                                system.handle(onLoad, url, 'system.resources.css.connect', this);
                                            }
                                        );
                                        img.src = url;
                                    }
                                },
                                settings.CSS_TIMER_DURATION
                            );
                            events.DOM.add(
                                link,
                                'load',
                                function (event) {
                                    if (link[settings.CSS_TIMER_PROPERTY] !== void 0) {
                                        resetTimer(link, settings);
                                        system.handle(onLoad, url, 'system.resources.css.connect', this);
                                    }
                                }
                            );
                        };
                        function isConnected(url) {
                            var sheets = document.styleSheets;
                            try{
                                Array.prototype.forEach.call(
                                    document.styleSheets,
                                    function (sheet) {
                                        if (sheet.href.indexOf(url) !== -1) {
                                            throw 'found';
                                        }
                                    }
                                );
                            } catch (e) {
                                if (e === 'found') {
                                    return true;
                                }
                            }
                            return false;
                        };
                        var link            = null,
                            onLoad          = onLoad || null,
                            onError         = onError || null,
                            url             = url || null,
                            onLoadContainer = null;
                        if (url !== null) {
                            if (isConnected(url) === false) {
                                link = addLink(url);
                                //Attach common handle for error
                                events.DOM.add(
                                    link.link,
                                    'error',
                                    function (event) {
                                        logs.log(
                                            "During loading CSS resource [" + url + "] was error",
                                            logs.types.WARNING
                                        );
                                    }
                                );
                                if (onError !== null) {
                                    //Attach user error handle
                                    events.DOM.add(link.link, 'error', onError);
                                }
                                if (onLoad !== null) {
                                    addLoadListener(link.link, url, onLoad);
                                } else {
                                    system.handle(onLoad, null, 'system.resources.css.connect', this);
                                }
                                link.append();
                                return true;
                            }
                        }
                        return false;
                    },
                    adoption    : function (cssText, documentLink, url) {
                        /// <signature>
                        ///     <summary>Inject CSS text as STYLE into HEAD</summary>
                        ///     <param name="cssText"       type="string"   >CSS text</param>
                        ///     <returns type="object">link to created node STYLE</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Inject CSS text as STYLE into HEAD</summary>
                        ///     <param name="cssText"       type="string"   >CSS text</param>
                        ///     <param name="documentLink"  type="object"   >Link to document</param>
                        ///     <returns type="object">link to created node STYLE</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Inject CSS text as STYLE into HEAD</summary>
                        ///     <param name="cssText"       type="string"   >CSS text</param>
                        ///     <param name="documentLink"  type="object"   >Link to document</param>
                        ///     <param name="url"           type="string"   >URL of parent to correct paths in CSS text</param>
                        ///     <returns type="object">link to created node STYLE</returns>
                        /// </signature>
                        var documentLink    = documentLink !== null ? (typeof documentLink === "object" ? (documentLink.body !== void 0 ? documentLink : document) : document) : document,
                            style           = documentLink.createElement("style"),
                            url             = typeof url === 'string' ? url : null;
                        if (typeof cssText === 'string') {
                            try {
                                if (url !== null) {
                                    cssText = system.resources.css.correctPaths(cssText, url);
                                    style.setAttribute(system.resources.css.settings.attr.SRC, url);
                                }
                                style.type  = "text/css";
                                if (style.styleSheet) {
                                    style.styleSheet.cssText = cssText;
                                } else {
                                    style.appendChild(documentLink.createTextNode(cssText));
                                }
                                documentLink.head.appendChild(style);
                                return style;
                            } catch (e) {
                                logs.log(
                                    'Error during adoption of CSS resource: url = [' + url + '], cssText starts from [' + cssText.substr(0, 50) + ' (...)]',
                                    logs.types.CRITICAL
                                );
                                return null;
                            }
                        }
                        return null;
                    },
                    correctPaths: function (cssText, parent_url) {
                        function correct(target_url, parent_url) {
                            var url = null;
                            if (target_url.trim().toLowerCase().indexOf('data:') !== 0) {
                                url = system.url.parse(target_url, parent_url);
                                if (url !== null) {
                                    return url.url;
                                } else {
                                    return target_url;
                                }
                            } else {
                                return target_url;
                            }
                        };
                        if (config.defaults.settings.CHECK_PATHS_IN_CSS !== false && typeof parent_url === 'string') {
                            if (parent_url !== '') {
                                system.resources.css.settings.URLS.forEach(function (sets) {
                                    var urls = cssText.match(sets.reg);
                                    if (urls instanceof Array) {
                                        urls.forEach(function (url) {
                                            var href = url;
                                            href = href.replace(sets.left, '');
                                            href = href.replace(sets.right, '');
                                            href = correct(href, parent_url);
                                            if (href !== null) {
                                                cssText = cssText.replace(url, sets._left + href + sets._right);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        return cssText;
                    }
                },
                js          : {
                    connect         : function (url, onLoad, onError) {
                        /// <signature>
                        ///     <summary>Connect JS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <returns type="boolean">link to created node SCRIPT</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect JS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <returns type="boolean">link to created node SCRIPT</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect JS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <param name="onError"   type="function" >Callback on some error</param>
                        ///     <returns type="boolean">link to created node SCRIPT</returns>
                        /// </signature>
                        function addScript(url) {
                            var settings    = system.resources.settings,
                                script      = document.createElement("SCRIPT");
                            script.type = "application/javascript";
                            script.src  = url;
                            script.setAttribute(settings.RESOURCES_MARK_ATTR.name, settings.RESOURCES_MARK_ATTR.value);
                            return {
                                script: script,
                                append: function () { document.head.appendChild(script); }
                            };
                        };
                        var script  = null,
                            onLoad  = onLoad || null,
                            onError = onError || null,
                            url     = url || null;
                        if (url !== null) {
                            script = addScript(url);
                            if (onLoad !== null) {
                                events.DOM.add(script.script, "load", onLoad);
                            }
                            if (onError !== null) {
                                events.DOM.add(script.script, "error", onError);
                            }
                            script.append();
                            return script.script;
                        }
                        return false;
                    },
                    adoption        : function (jsScript, onFinish) {
                        /// <signature>
                        ///     <summary>Generate script within JS text</summary>
                        ///     <param name="jsScript"  type="string"   >JS text</param>
                        ///     <returns type="void">void</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Generate script within JS text</summary>
                        ///     <param name="jsScript"  type="string"   >JS text</param>
                        ///     <param name="onFinish"  type="function" >Callback on finish</param>
                        ///     <returns type="void">void</returns>
                        /// </signature>
                        var resourceJS  = document.createElement("SCRIPT"),
                            onFinish    = onFinish || null,
                            jsScript    = jsScript || null;
                        if (jsScript !== null) {
                            resourceJS.type = "application/javascript";
                            resourceJS.appendChild(document.createTextNode(jsScript));
                            document.body.insertBefore(resourceJS, document.body.childNodes[0]);
                            if (onFinish !== null) {
                                system.handle(onFinish, null, 'system.resources.js.adoption', this);
                            }
                        }
                    },
                    getCurrentSRC   : function (detect_core) {
                        ///     <summary>Try to get URL of current (running) script</summary>
                        ///     <returns type="STRING">URL</returns>
                        var urls        = null,
                            detect_core = typeof detect_core === 'boolean' ? detect_core : false;
                        try {
                            throw new Error('Script URL detection');
                        } catch (e) {
                            if (typeof e.stack === 'string') {
                                urls = e.stack.match(options.regs.urls.JS_URL);
                                if (urls instanceof Array) {
                                    if (urls.length > 0) {
                                        return detect_core ? urls[urls.length - 1] : (urls[urls.length - 1].indexOf(options.files.CORE_URL) === -1 ? urls[urls.length - 1] : null);
                                    }
                                }
                            }
                            return null;
                        }
                    }
                }
            },
            convertor   : {
                UTF8: {
                    encode: function (s) {
                        return unescape(encodeURIComponent(s));
                    },
                    decode: function (s) {
                        return decodeURIComponent(escape(s));
                    }
                },
                BASE64: {
                    decode: function (s) {
                        var e = {}, i, k, v = [], r = "", w = String.fromCharCode, z,
                            n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]],
                            b = 0, c, x, l = 0, o = 0, char, num;
                        for (z in n) { for (i = n[z][0]; i < n[z][1]; i++) { v.push(w(i)); } }
                        for (i = 0; i < 64; i++) { e[v[i]] = i; }
                        if (s.length < 100) {
                            var stop = true;
                        }
                        for (i = 0; i < s.length; i += 72) {
                            o = s.substring(i, i + 72);
                            for (x = 0; x < o.length; x++) {
                                c = e[o.charAt(x)]; b = (b << 6) + c; l += 6;
                                while (l >= 8) {
                                    char = w((b >>> (l -= 8)) % 256);
                                    num = char.charCodeAt(0);
                                    r = (num !== 0 ? r + char : r);
                                }
                            }
                        }
                        return r;
                    },
                    encode: function (s) {
                        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                            o1, o2, o3, h1, h2, h3, h4, r, bits, i = 0,
                            ac = 0,
                            enc = "",
                            tmp_arr = [];
                        if (!s) {
                            return s;
                        }
                        do { // pack three octets into four hexets
                            o1 = s.charCodeAt(i++);
                            o2 = s.charCodeAt(i++);
                            o3 = s.charCodeAt(i++);
                            bits = o1 << 16 | o2 << 8 | o3;
                            h1 = bits >> 18 & 0x3f;
                            h2 = bits >> 12 & 0x3f;
                            h3 = bits >> 6 & 0x3f;
                            h4 = bits & 0x3f;
                            // use hexets to index into b64, and append result to encoded string
                            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                        } while (i < s.length);
                        enc = tmp_arr.join('');
                        r = s.length % 3;
                        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
                    }
                }
            },
            url         : {
                settings            : {
                    parser: {
                        LAST        : /([^\/]*)$/gi,
                        CORRECTION  : /[\/\\]$/gi,
                        BAD_SLASH   : /\\/gi,
                        PROTOCOL    : /:\/\//gi,
                        DOUBLE      : /\/{2,}/gi
                    }
                },
                getURLInfo          : function (url) {
                    var a       = document.createElement('a'),
                        result  = null;
                    if (typeof url === 'string') {
                        a.setAttribute('href', url);
                        result = {
                            hostname: a.hostname,
                            host    : a.host,
                            port    : a.port,
                            protocol: a.protocol,
                            isFull  : false
                        };
                        if (result.hostname !== '') {
                            result.isFull = url.indexOf(result.protocol + '//' + result.hostname) !== 0 ? false : true;
                        } else {
                            result.isFull = false;
                        }
                    }
                    return result;
                },
                getCurrentDomain    : function () {
                    var url = null;
                    if (window.location.origin) {
                        url = window.location.origin;
                    } else {
                        url = window.location.protocol + '//' + window.location.host;
                    }
                    return url;
                },
                getParams           : function (url) {
                    /// <signature>
                    ///     <summary>Parsing of parameters in URL</summary>
                    ///     <param name="url"       type="string">URL</param>
                    ///     <returns type="object">{url: string; params: object}</returns>
                    /// </signature>
                    var params = null,
                        _params = null;
                    url     = url.split('?');
                    params  = url.length === 2 ? url[1] : null;
                    url     = url[0];
                    if (params !== null) {
                        _params = params.split('&');
                        params  = {};
                        _params.forEach(function (param) {
                            var pear = param.split('=');
                            if (pear.length === 2) {
                                params[pear[0]] = pear[1];
                            }
                        });
                    }
                    return {
                        url     : url,
                        params  : params
                    };
                },
                restoreFullURL      : function (url){
                    /// <signature>
                    ///     <summary>Add current domain to URL (if there are no definition of domain)</summary>
                    ///     <param name="url"type="string">URL</param>
                    ///     <returns type="object">Restored URL</returns>
                    /// </signature>
                    var _url = url;
                    if (typeof url === 'string') {
                        _url = system.url.getURLInfo(_url);
                        if (_url.isFull === false) {
                            if (_url.hostname === '') {
                                return system.url.getCurrentDomain() + (url.indexOf('/') !== 0 ? '/' : '') + url;
                            } else {
                                return _url.protocol + '//' + _url.host + (url.indexOf('/') !== 0 ? '/' : '') + url;
                            }
                        } else {
                            return url;
                        }
                    }
                    return null;
                },
                parse               : function (url, origin) {
                    /// <signature>
                    ///     <summary>Parsing of URL</summary>
                    ///     <param name="url"       type="string">URL</param>
                    ///     <returns type="object">Parsed URL</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Parsing of URL</summary>
                    ///     <param name="url"       type="string">URL</param>
                    ///     <param name="origin"    type="string">Original URL (i can be needed if URL hasn't domain definition. Like this ../folder/resource.ext</param>
                    ///     <returns type="object">Parsed URL</returns>
                    /// </signature>
                    function steps(url) {
                        var count       = 0,
                            valid       = true,
                            previous    = -1,
                            clear_url   = '';
                        url.split('/').forEach(function (part, index) {
                            if (part === '..') {
                                count += 1;
                                if (previous !== -1) {
                                    if (previous !== index - 1) {
                                        valid = false;
                                    }
                                }
                                previous = index;
                            } else {
                                clear_url += '/' + part;
                            }
                        });
                        return (valid === true ? { count: count, url: clear_url } : false);
                    };
                    function correction(url) {
                        url = url.replace(system.url.settings.parser.CORRECTION, '');
                        url = url.replace(system.url.settings.parser.BAD_SLASH, '/');
                        return url;
                    };
                    var result      = null,
                        info        = null,
                        origin      = typeof origin === 'string' ? origin : null,
                        back_steps  = 0,
                        _origin     = null,
                        params      = null;
                    if (typeof url === 'string') {
                        url     = correction(url);
                        params  = system.url.getParams(url);
                        url     = params.url;
                        params  = params.params;
                        info    = system.url.getURLInfo(url);
                        if (info !== null) {
                            back_steps = steps(url);
                            if (back_steps !== false) {
                                if (back_steps.count > 0) {
                                    /*If URL has some "back" direction like [../../folder/resource.ext]
                                    * In this case we need origin URL to build valid path
                                    * */
                                    if (origin !== null) {
                                        _origin = system.url.parse(origin);
                                        if (_origin !== null) {
                                            if (back_steps.count < _origin.parts.length - 1) {
                                                _origin.parts.splice(_origin.parts.length - back_steps.count, back_steps.count);
                                                _origin.parts = _origin.parts.map(function (item) {
                                                    return (item === '//' ? '' : item);
                                                });
                                                url = _origin.parts.join('/') + back_steps.url;
                                                return system.url.parse(url);
                                            }
                                        }
                                    }
                                } else {
                                    if (info.isFull === false){
                                        /*If URL has not root path. URL looks like [folder/resource.ext] or [resource.ext]
                                        * In this case we need origin URL to build valid path
                                        */
                                        origin  = origin === null ? system.url.getCurrentDomain() : origin;
                                        _origin = system.url.parse(origin);
                                        if (_origin !== null) {
                                            if (url.indexOf('~/') === 0) {
                                                url = url.replace('~', _origin.home);
                                            } else {
                                                _origin.parts = _origin.parts.map(function (item) {
                                                    return (item === '//' ? '' : item);
                                                });
                                                url = _origin.parts.join('/') + (url.indexOf('/') !== 0 ? '/' : '') + url;
                                            }
                                            return system.url.parse(url);
                                        }
                                    } else {
                                        /*If we are in this section, it means that we have everything to parse URL*/
                                        result  = {
                                            target      : url.match(system.url.settings.parser.LAST),
                                            _path       : '',
                                            _url        : url,
                                            _hostname   : info.hostname,
                                            hostname    : info.hostname !== '' ? info.hostname  : window.location.hostname,
                                            _host       : info.host,
                                            host        : info.host     !== '' ? info.host      : window.location.host,
                                            _port       : info.port,
                                            port        : info.port     !== '' ? info.port      : window.location.port,
                                            _protocol   : info.protocol,
                                            protocol    : info.protocol !== ':'? info.protocol  : window.location.protocol,
                                            home        : info.hostname === '' ? window.location.protocol   + '//' + window.location.host   : info.protocol + '//' + info.host,
                                            _home       : info.hostname !== '' ? info.protocol + '//' + info.host : '',
                                            params      : params,
                                            dirs        : null,
                                            parts       : null
                                        };
                                        if (result.target instanceof Array && result.target.length > 0) {
                                            result.target   = result.target[0];
                                            if (result.target.indexOf('.') === -1) {
                                                result.target = '';
                                            }
                                            result._path    = url.replace(result.target, '');
                                        } else {
                                            result.target   = '';
                                        }
                                        if (result._home === '') {
                                            result.path = result.home + (result._path.  indexOf('/') === 0 ? '' : '/') + result._path;
                                            result.url  = result.home + (result._url.   indexOf('/') === 0 ? '' : '/') + result._url;
                                        } else {
                                            result.path = result._path;
                                            result.url  = result._url;
                                        }
                                        result.parts = result.url.split('/').map(function (item) {
                                            return (item === '' ? '//' : item);
                                        });
                                        if (result.parts.indexOf(result.target) !== -1) {
                                            result.parts.splice(result.parts.indexOf(result.target), 1);
                                        }
                                        result.dirs = result.path.replace(result.home, '').split('/');
                                        result.dirs = result.dirs.filter(function (dir) { return dir !== '' ? true : false; });
                                        return result;
                                    }
                                }
                            }
                        }
                    }
                    return null;
                },
                sterilize           : function (url) {
                    var protocol = IDs.id();
                    return url. replace(system.url.settings.parser.PROTOCOL, protocol).
                                replace(system.url.settings.parser.BAD_SLASH, '/').
                                replace(system.url.settings.parser.DOUBLE, '/').
                                replace(protocol, '://');
                },
                getTypeOfResource   : function (url) {
                    var _url = url.replace(options.regs.urls.PARAMS, '');
                    _url = _url.match(options.regs.urls.EXTENSION);
                    if (_url instanceof Array) {
                        if (_url.length === 1) {
                            return _url[0].toLowerCase();
                        }
                    }
                    return null;
                },
                is                  : {
                    clear   : function(url){
                        if (typeof url === 'string') {
                            url = url.split('?');
                            url = url[0];
                            url = url.replace(options.regs.urls.NOT_URL_SYMBOLS, '');
                            return url;
                        }
                        return null;
                    },
                    js      : function (url) {
                        url = system.url.is.clear(url);
                        if (url !== null) {
                            options.regs.urls.JS_EXP_IN_URL.lastIndex = 0;
                            return options.regs.urls.JS_EXP_IN_URL.test(url);
                        }
                        return false;
                    },
                    css     : function (url) {
                        url = system.url.is.clear(url);
                        if (url !== null) {
                            options.regs.urls.CSS_EXP_IN_URL.lastIndex = 0;
                            return options.regs.urls.CSS_EXP_IN_URL.test(url);
                        }
                        return false;
                    },
                }
            },
        };
        IDs             = {
            id: (function () {
                var index = 0;
                return function (prefix) {
                    index += 1;
                    return (prefix || '') + (new Date()).valueOf() + '_' + index;
                };
            }()),
        };
        logs            = {
            types       : {
                CRITICAL        : 'CRITICAL',
                LOGICAL         : 'LOGICAL',
                WARNING         : 'WARNING',
                NOTIFICATION    : 'NOTIFICATION',
                LOGS            : 'LOG',
                KERNEL_LOGS     : 'KERNEL_LOGS',
            },
            rendering   : {
                CRITICAL        : 'color: #FF0000;font-weight:bold;',
                LOGICAL         : 'color: #00FFF7;font-weight:bold;',
                WARNING         : 'color: #A69600;font-weight:bold;',
                NOTIFICATION    : 'color: #988DFF;font-weight:bold;',
                LOGS            : 'color: #6C6C6C;',
                KERNEL_LOGS     : 'color: #008B0E;font-weight:bold;',
            },
            parseError  : function (e) {
                /// <signature>
                ///     <summary>Create string from error object</summary>
                ///     <param name="error" type="object">Error object</param>
                ///     <returns type="string">String</returns>
                /// </signature>
                var message = e.name + ": " + e.message + "\r\n--------------------------------------------";
                for (var property in e) {
                    if (property !== "name" && property !== "message") {
                        message = message + "\r\n  " + property + "=" + e[property];
                    }
                }
                return message;
            },
            log         : function (message, type) {
                /// <signature>
                ///     <summary>Add log message to console</summary>
                ///     <param name="message"   type="string">Message</param>
                ///     <returns type="void">void</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Add log message to console</summary>
                ///     <param name="message"   type="string">Message</param>
                ///     <param name="type"      type="string">Type of message</param>
                ///     <returns type="void">void</returns>
                /// </signature>
                var type = type || 'LOGS';
                if (console && logs.types[type]) {
                    if (console.log !== void 0) {
                        if (config.defaults.logs.SHOW.indexOf(type) !== -1) {
                            console.log('%c [' + type + ']' + '%c' + message, logs.rendering[type], logs.rendering.LOGS);
                            logs.callEvent(message, type);
                        }
                    }
                }
            },
            callEvent: function (message, type) {
                if (oop.namespace.get('flex.registry.events.system.logs') !== null) {
                    if (flex.registry.events.system.logs[type] !== void 0) {
                        events.core.fire(flex.registry.events.system.logs.GROUP, flex.registry.events.system.logs[type], message);
                    }
                }
            }
        };
        wrappers        = {
            callers     : {
                node    : (function () {
                    var cache = {};
                    return function (selector, use_cache, document_link) {
                        var node        = null,
                            use_cache   = typeof use_cache === 'boolean' ? use_cache : false;
                        if (typeof selector === 'string') {
                            if (use_cache) {
                                if (cache[selector]) {
                                    if (cache[selector] !== null) {
                                        node = cache[selector];
                                    }
                                }
                            }
                            node = node !== null ? node : (document_link || document).querySelector(selector);
                            if (use_cache && !cache[selector] && node !== null) {
                                cache[selector] = node;
                            }
                            return new wrappers.constructors.node(node);
                        } else {
                            if (selector !== void 0) {
                                if (typeof selector.nodeName === 'string' || selector == window) {
                                    return new wrappers.constructors.node(selector);
                                }
                            }
                        }
                        return null;
                    };
                }()),
                nodes   : (function () {
                    var cache = {};
                    return function (selector, use_cache, document_link) {
                        var nodes       = null,
                            use_cache   = typeof use_cache === 'boolean' ? use_cache : false;
                        if (typeof selector === 'string') {
                            if (use_cache) {
                                if (cache[selector]) {
                                    if (cache[selector] !== null) {
                                        if (cache[selector].length > 0) {
                                            nodes = cache[selector];
                                        }
                                    }
                                }
                            }
                            nodes = nodes !== null ? nodes : (document_link || document).querySelectorAll(selector);
                            if (use_cache && !cache[selector] && nodes !== null) {
                                if (nodes.length > 0) {
                                    cache[selector] = nodes;
                                }
                            }
                            return new wrappers.constructors.nodes(nodes);
                        } else {
                            if (selector !== void 0) {
                                if (typeof selector.length === 'number') {
                                    if (selector.length > 0) {
                                        if (typeof selector[0] === 'string') {
                                            nodes = [];
                                            Array.prototype.forEach.call(selector, function (selector, index) {
                                                var node = (document_link || document).querySelector(selector);
                                                if (node !== null) {
                                                    nodes.push(node);
                                                }
                                            });
                                            return new wrappers.constructors.nodes(nodes);
                                        } else if (typeof selector[0].nodeName === 'string') {
                                            return new wrappers.constructors.nodes(selector);
                                        }
                                    }
                                }
                            }
                        }
                        return null;
                    };
                }()),
                array   : function (_array) {
                    if (_array instanceof Array) {
                        return new wrappers.constructors.array(_array);
                    } else {
                        return null;
                    }
                },
                string  : function (_string) {
                    if (typeof _string === 'string') {
                        return new wrappers.constructors.string(_string);
                    } else {
                        return null;
                    }
                },
                boolean : function (_boolean) {
                    if (typeof _boolean === 'boolean') {
                        return new wrappers.constructors.boolean(_boolean);
                    } else {
                        return null;
                    }
                },
                object  : function (_object) {
                    if (typeof _object === 'object') {
                        return new wrappers.constructors.object(_object);
                    } else {
                        return null;
                    }
                },
            },
            prototypes  : {
                node    : {},
                nodes   : {},
                array   : {},
                string  : {},
                boolean : {},
                object  : {},
                update  : {
                    update  : function (target) {
                        function update(obj) {
                            var updated = null;
                            for (var pro in obj) {
                                if (obj.hasOwnProperty(pro)) {
                                    if (typeof obj[pro] === 'object' && pro !== 'target') {
                                        updated = function () { updated.target = this.target; return updated; };
                                        for (var subpro in obj[pro]) {
                                            updated[subpro] = obj[pro][subpro];
                                        }
                                        obj[pro] = updated;
                                    } else if (typeof obj[pro] === 'function') {
                                        update(obj[pro]);
                                    }
                                }
                            }
                        };
                        if (wrappers.prototypes[target]) {
                            update(wrappers.prototypes[target]);
                        }
                    },
                    node    : function () { wrappers.prototypes.update.update('node'    ); },
                    nodes   : function () { wrappers.prototypes.update.update('nodes'   ); },
                    array   : function () { wrappers.prototypes.update.update('array'   ); },
                    string  : function () { wrappers.prototypes.update.update('string'  ); },
                    boolean : function () { wrappers.prototypes.update.update('boolean' ); },
                    object  : function () { wrappers.prototypes.update.update('object'  ); }
                },
                add     : {
                    add     : function (target, path, value) {
                        var steps = null,
                            proto = null;
                        if (typeof target === 'string' && typeof path === 'string' && value !== void 0) {
                            if (wrappers.prototypes[target]) {
                                steps = path.split('.');
                                proto = wrappers.prototypes[target];
                                steps.forEach(function (property, index) {
                                    if (proto[property] === void 0) {
                                        if (index === steps.length - 1) {
                                            proto[property] = value;
                                        } else {
                                            proto[property] = {};
                                            proto           = proto[property];
                                        }
                                    } else if (typeof proto[property] === 'object' || typeof proto[property] === 'function') {
                                        proto           = proto[property];
                                    } else {
                                        proto[property] = {};
                                        proto           = proto[property];
                                    }
                                });
                                wrappers.prototypes.update[target]();
                            }
                        }
                    },
                    node    : function (path, value) { wrappers.prototypes.add.add('node',      path, value); },
                    nodes   : function (path, value) { wrappers.prototypes.add.add('nodes',     path, value); },
                    array   : function (path, value) { wrappers.prototypes.add.add('array',     path, value); },
                    string  : function (path, value) { wrappers.prototypes.add.add('string',    path, value); },
                    boolean : function (path, value) { wrappers.prototypes.add.add('boolean',   path, value); },
                    object  : function (path, value) { wrappers.prototypes.add.add('object',    path, value); }
                }
            },
            constructors: {
                node    : function (node    ) { this.target = node;     },
                nodes   : function (nodes   ) { this.target = nodes;    },
                array   : function (array   ) { this.target = array;    },
                string  : function (string  ) { this.target = string;   },
                boolean : function (boolean ) { this.target = boolean;  },
                object  : function (object  ) { this.target = object;   }
            },
            build       : function () {
                for (var constructor in wrappers.constructors) {
                    wrappers.constructors[constructor].prototype = wrappers.prototypes[constructor];
                }
                return true;
            }
        };
        patterns        = {
            execution       : function () {
                if (typeof window[config.defaults.patterns.TEST_FUNCTION] === 'function') {
                    system.handle(window[config.defaults.patterns.TEST_FUNCTION], null, config.defaults.patterns.TEST_FUNCTION, this);
                    return true;
                }
                return false;
            },
            modification    : function () {
                function processing(patternsFunction, operation) {
                    if (patternsFunction[operation] instanceof Array && config.defaults.resources.MODULES instanceof Array) {
                        patternsFunction[operation].forEach(function (module) {
                            if (typeof module === 'string') {
                                switch (operation) {
                                    case 'include':
                                        if (config.defaults.resources.MODULES.indexOf(module) === -1) {
                                            config.defaults.resources.MODULES.push(module);
                                        }
                                        break;
                                    case 'exclude':
                                        if (config.defaults.resources.MODULES.indexOf(module) !== -1) {
                                            config.defaults.resources.MODULES.splice(config.defaults.resources.MODULES.indexOf(module), 1);
                                        }
                                        break;
                                }
                            }
                        });
                    }
                };
                var patternsFunction = window[config.defaults.patterns.TEST_FUNCTION];
                if (typeof patternsFunction === 'function') {
                    processing(patternsFunction, 'include');
                    processing(patternsFunction, 'exclude');
                }
            }
        };
        //Private part
        privates        = {
            init            : config.init,
            oop             : {
                objects     : {
                    copy        : oop.objects.copy,
                    extend      : oop.objects.extend,
                    forEach     : oop.objects.forEach,
                    validate    : oop.objects.validate,
                    isValueIn   : oop.objects.isValueIn,
                },
                classes     : {
                    of      : oop.classes.of,
                    create  : oop.classes.create
                },
                namespace   : {
                    create      : oop.namespace.create,
                    get         : oop.namespace.get,
                }
            },
            modules         : {
                attach : modules.attach.safely,
                append : modules.attach.unexpected.safely
            },
            unique          : IDs.id,
            events          : {
                DOM : {
                    add     : events.DOM.add,
                    remove  : events.DOM.remove,
                },
                core: {
                    fire    : events.core.fire,
                    listen  : events.core.listen,
                    register: events.core.register,
                    remove  : events.core.remove,
                }
            },
            overhead        : {
                globaly: {
                    set: overhead.globaly.set,
                    get: overhead.globaly.get,
                    del: overhead.globaly.remove
                },
                objecty: {
                    set: overhead.objecty.set,
                    get: overhead.objecty.get,
                    del: overhead.objecty.remove
                },
                register: {
                    open: overhead.register.open,
                    add : overhead.register.add,
                    done: overhead.register.done,
                }
            },
            ajax            : {
                send    : ajax.create,
                methods : {
                    POST    : ajax.settings.methods.POST,
                    GET     : ajax.settings.methods.GET,
                    PUT     : ajax.settings.methods.PUT,
                    DELETE  : ajax.settings.methods.DELETE,
                    OPTIONS : ajax.settings.methods.OPTIONS,
                }
            },
            logs            : {
                parseError  : logs.parseError,
                log         : logs.log,
                types       : logs.types
            },
            callers         : {
                node    : wrappers.callers.node,
                nodes   : wrappers.callers.nodes,
                array   : wrappers.callers.array,
                object  : wrappers.callers.object,
                string  : wrappers.callers.string,
                boolean : wrappers.callers.boolean,
                define  : {
                    node    : wrappers.prototypes.add.node,
                    nodes   : wrappers.prototypes.add.nodes,
                    array   : wrappers.prototypes.add.array,
                    object  : wrappers.prototypes.add.object,
                    string  : wrappers.prototypes.add.string,
                    boolean : wrappers.prototypes.add.boolean,
                }
            },
            resources       : {
                parse   : {
                    css : {
                        stringify: parsing.css.stringify
                    }
                },
                attach  : {
                    css : {
                        connect : system.resources.css.connect,
                        adoption: system.resources.css.adoption,
                    },
                    js  : {
                        connect         : system.resources.js.connect,
                        adoption        : system.resources.js.adoption,
                        getCurrentSRC   : system.resources.js.getCurrentSRC
                    }
                }
            },
            system          : {
                handle      : system.handle,
                convertor   : {
                    UTF8    : {
                        encode  : system.convertor.UTF8.encode,
                        decode  : system.convertor.UTF8.decode,
                    },
                    BASE64  : {
                        encode  : system.convertor.BASE64.encode,
                        decode  : system.convertor.BASE64.decode,
                    },
                },
                url     : {
                    parse   : system.url.parse,
                    restore : system.url.restoreFullURL
                }
            },
            localStorage    : {
                add     : system.localStorage.set,
                get     : system.localStorage.get,
                del     : system.localStorage.del,
                addJSON : system.localStorage.setJSON,
                getJSON : system.localStorage.getJSON,
                reset   : system.localStorage.reset,
            },
            hashes          : {
                get     : hashes.get,
                update  : hashes.update.add
            },
            config          : {
                get: config.get,
                set: config.set
            }
        };
        //Detect core file
        options.files.detect();
        //Settings of flex
        config.init();
        //Module events
        events.core.listen('modules.registry', 'ready', modules.attach.queue.proceed);
        //Build wrappers
        wrappers.build();
        //Add wrappers
        oop.    wrappers.objects();
        arrays. wrappers.array  ();
        //Public methods and properties
        return {
            init            : privates.init,
            oop             : {
                objects     : {
                    copy        : privates.oop.objects.copy,
                    extend      : privates.oop.objects.extend,
                    forEach     : privates.oop.objects.forEach,
                    validate    : privates.oop.objects.validate,
                    isValueIn   : privates.oop.objects.isValueIn,
                },
                classes     : {
                    of      : privates.oop.classes.of,
                    create  : privates.oop.classes.create
                },
                namespace   : {
                    create      : privates.oop.namespace.create,
                    get         : privates.oop.namespace.get,
                }
            },
            modules         : {
                attach: privates.modules.attach,
                append: privates.modules.append
            },
            unique          : privates.unique,
            events          : {
                DOM : {
                    add     : privates.events.DOM.add,
                    remove  : privates.events.DOM.remove,
                },
                core: {
                    fire    : privates.events.core.fire,
                    listen  : privates.events.core.listen,
                    register: privates.events.core.register,
                    remove  : privates.events.core.remove,
                }
            },
            overhead        : {
                globaly: {
                    set: privates.overhead.globaly.set,
                    get: privates.overhead.globaly.get,
                    del: privates.overhead.globaly.del
                },
                objecty: {
                    set: privates.overhead.objecty.set,
                    get: privates.overhead.objecty.get,
                    del: privates.overhead.objecty.del
                },
                register: {
                    open: privates.overhead.register.open,
                    add : privates.overhead.register.add,
                    done: privates.overhead.register.done,
                }
            },
            ajax            : {
                send    : privates.ajax.send,
                methods : privates.ajax.methods
            },
            resources       : {
                parse   : {
                    css : {
                        stringify: privates.resources.parse.css.stringify
                    }
                },
                attach  : {
                    css : {
                        connect : privates.resources.attach.css.connect,
                        adoption: privates.resources.attach.css.adoption,
                    },
                    js  : {
                        connect         : privates.resources.attach.js.connect,
                        adoption        : privates.resources.attach.js.adoption,
                        getCurrentSRC   : privates.resources.attach.js.getCurrentSRC
                    }
                }
            },
            localStorage    : {
                add     : privates.localStorage.add,
                get     : privates.localStorage.get,
                del     : privates.localStorage.del,
                addJSON : privates.localStorage.addJSON,
                getJSON : privates.localStorage.getJSON,
                reset   : privates.localStorage.reset,
            },
            system          : {
                handle      : privates.system.handle,
                convertor   : {
                    UTF8    : {
                        encode  : privates.system.convertor.UTF8.encode,
                        decode  : privates.system.convertor.UTF8.decode,
                    },
                    BASE64  : {
                        encode  : privates.system.convertor.BASE64.encode,
                        decode  : privates.system.convertor.BASE64.decode,
                    },
                },
                url         : {
                    parse   : privates.system.url.parse,
                    restore : privates.system.url.restore
                }
            },
            logs            : {
                parseError  : privates.logs.parseError,
                log         : privates.logs.log,
                types       : privates.logs.types
            },
            hashes          : {
                get     : privates.hashes.get,
                update  : privates.hashes.update
            },
            callers         : {
                node    : privates.callers.node,
                nodes   : privates.callers.nodes,
                array   : privates.callers.array,
                object  : privates.callers.object,
                string  : privates.callers.string,
                boolean : privates.callers.boolean,
                define  : {
                    node    : privates.callers.define.node,
                    nodes   : privates.callers.define.nodes,
                    array   : privates.callers.define.array,
                    object  : privates.callers.define.object,
                    string  : privates.callers.define.string,
                    boolean : privates.callers.define.boolean,
                }
            },
            config          : {
                get: privates.config.get,
                set: privates.config.set
            },
            libraries       : {},
            libraries_data  : {},
            registry        : {}
        };
    }());
    //Core of flex is in global space
    window['flex'       ] = new Flex();
    //Default events
    flex.registry.events = {
        system: {
            logs: {
                GROUP       : 'flex.system.logs.messages',
                CRITICAL    : 'critical',
                LOGICAL     : 'logical',
                WARNING     : 'warning',
                NOTIFICATION: 'notification',
                LOGS        : 'log',
                KERNEL_LOGS : 'kernel_logs',
            },
            cache: {
                GROUP               : 'flex.system.cache.events',
                ON_NEW_MODULE       : 'ON_NEW_MODULE',
                ON_UPDATED_MODULE   : 'ON_UPDATED_MODULE',
                ON_NEW_RESOURCE     : 'ON_NEW_RESOURCE',
                ON_UPDATED_RESOURCE : 'ON_UPDATED_RESOURCE',
            }
        }
    };
    //Define short callers
    window['_node'      ] = flex.callers.node;
    window['_nodes'     ] = flex.callers.nodes;
    window['_array'     ] = flex.callers.array;
    window['_object'    ] = flex.callers.object;
    window['_string'    ] = flex.callers.string;
    window['_boolean'   ] = flex.callers.boolean;
    //Other shorts
    window['_append'    ] = flex.modules.append;
}());
/*TODO:
* fix problem with IE9 -> limit for CSS - 4095 selectors per one stylesheet
* Prevent double initialization (and do not damage intellisense)
* parseFunction -> has potential error with parsing params. There are should be array, but not string
*/

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright � 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
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
            var objects         = null,
                attrs           = null,
                props           = null,
                mutationCross   = null,
                privates        = null,
                callers         = null,
                settings        = null,
                errors          = null,
                support         = null;
            settings        = {
                objects : {
                    STORAGE_PROPERTY    : 'flex.object.bind.storage',
                    HANDLE_ID_PROPERTY  : 'flex.object.bind.handle.id'
                },
                attrs   : {
                    STORAGE_PROPERTY    : 'flex.attrs.bind.storage',
                    NODE_ID_PROPERTY    : 'flex.attrs.bind.node.id',
                    HANDLE_ID_PROPERTY  : 'flex.attrs.bind.handle.id'
                },
                props   : {
                    STORAGE_PROPERTY    : 'flex.props.bind.storage',
                    NODE_ID_PROPERTY    : 'flex.props.bind.node.id',
                    HANDLE_ID_PROPERTY  : 'flex.props.bind.handle.id'
                },
            };
            errors          = {
                objects: {
                    INCORRECT_ARGUMENTS : 'defined incorrect arguments or not defined at all',
                    PROPERTY_IS_CONST   : 'cannot kill bind with property, because property now is constant'
                },
                support: {
                    DEFINE_PROPERTY     : 'flex.binds: Current browser does not support Object.defineProperty',
                    MUTATION_SCANNING   : 'flex.attrs: Current browser does not support any avaliable way to scanning mutation of attributes',
                }
            };
            //Binding properies of objects
            objects         = {
                storage : {
                    create : function (object) {
                        var Storage = function (object) {
                                this.parent     = object;
                                this.binds      = {};
                            };
                        Storage.prototype = {
                            make            : function (property, value) {
                                var self = this;
                                if (!this.binds[property]) {
                                    this.binds[property] = {
                                        current     : value,
                                        previous    : value,
                                        setter      : function (value) { 
                                            self.binds[property].previous   = self.binds[property].current;
                                            self.binds[property].current    = value;
                                            for (var id in self.binds[property].handles) {
                                                self.binds[property].handles[id].call(self.parent, self.binds[property].current, self.binds[property].previous, id);
                                            }
                                        },
                                        getter      : function () {
                                            return self.binds[property].current;
                                        },
                                        handles     : {}
                                    };
                                    return true;
                                }
                                return false;
                            },
                            add             : function (property, handle) {
                                var handleID = flex.unique();
                                //Save handle ID in handle
                                handle[settings.objects.HANDLE_ID_PROPERTY] = handleID;
                                //Add handle in storage
                                this.binds[property].handles[handleID]      = handle;
                                //Return handle ID
                                return handleID;
                            },
                            remove          : function (property, id) {
                                if (this.binds[property]) {
                                    if (this.binds[property].handles[id]) {
                                        delete this.binds[property].handles[id];
                                        if (Object.keys(this.binds[property].handles).length === 0) {
                                            return delete this.binds[property];
                                        }
                                    }
                                }
                                return null;
                            },
                            kill            : function (property) {
                                if (this.binds[property]) {
                                    return delete this.binds[property];
                                }
                                return null;
                            },
                            isPropertyReady : function (property){
                                return this.binds[property] !== void 0 ? true : false;
                            },
                            destroy         : function (){
                                if (Object.keys(this.binds).length === 0) {
                                    return delete this.parent[settings.objects.STORAGE_PROPERTY];
                                }
                                return false;
                            },
                            setter          : function (property) {
                                return this.binds[property].setter;
                            },
                            getter          : function (property) {
                                return this.binds[property].getter;
                            }
                        };
                        return new Storage(object);
                    }
                },
                bind    : function (object, property, handle) {
                    /// <signature>
                    ///     <summary>Bind handle to property of object</summary>
                    ///     <param name="object"    type="OBJECT"   >Parent object</param>
                    ///     <param name="property"  type="STRING"   >Property</param>
                    ///     <param name="handle"    type="FUNCTION" >Handle of property changing</param>
                    ///     <returns type="STRING"/>
                    /// </signature>
                    var storage = settings.objects.STORAGE_PROPERTY,
                        value   = null;
                    if (Object.defineProperty) {
                        if (typeof object === 'object' && typeof property === 'string' && typeof handle === 'function') {
                            value = object[property];
                            if (!object[storage]) {
                                //Object isn't listening
                                object[storage] = objects.storage.create(object);
                            }
                            storage = object[storage];
                            //Prepare property if needed
                            if (!storage.isPropertyReady(property)) {
                                //First handle for property
                                if (delete object[property]) {
                                    //Prepare property storage
                                    storage.make(property, value);
                                    //Bind
                                    Object.defineProperty(object, property, {
                                        get         : storage.getter(property),
                                        set         : storage.setter(property),
                                        configurable: true
                                    });
                                } else {
                                    storage.destroy();
                                    return false;
                                }
                            }
                            //Add handle
                            return storage.add(property, handle);
                        }
                        throw 'object.bind::' + errors.objects.INCORRECT_ARGUMENTS;
                    }
                },
                unbind  : function (object, property, id) {
                    /// <signature>
                    ///     <summary>Unbind handle to property of object by handle's ID</summary>
                    ///     <param name="object"    type="OBJECT">Parent object</param>
                    ///     <param name="property"  type="STRING">Property</param>
                    ///     <param name="id"        type="STRING">ID of handle</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.objects.STORAGE_PROPERTY,
                        value   = null;
                    if (typeof object === 'object' && typeof property === 'string' && typeof id === 'string') {
                        if (object[storage]) {
                            storage = object[storage];
                            if (storage.isPropertyReady(property)) {
                                value = object[property];
                                storage.remove(property, id);
                                if (!storage.isPropertyReady(property)) {
                                    try {
                                        delete object[property];
                                        object[property] = value;
                                        return true;
                                    } catch (e) {
                                        throw 'object.unbind::' + errors.objects.PROPERTY_IS_CONST;
                                        return false;
                                    }
                                }
                            }
                        }
                        return null;
                    }
                    throw 'object.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
                kill    : function (object, property) {
                    /// <signature>
                    ///     <summary>Unbind all handles, which was attached to property of object</summary>
                    ///     <param name="object"    type="OBJECT">Parent object</param>
                    ///     <param name="property"  type="STRING">Property</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.objects.STORAGE_PROPERTY,
                        value   = null;
                    if (typeof object === 'object' && typeof property === 'string') {
                        if (object[storage]) {
                            value   = object[property];
                            storage = object[storage];
                            try {
                                if (storage.kill(property)) {
                                    delete object[property];
                                    object[property] = value;
                                    return true;
                                } else {
                                    return false;
                                }
                            } catch (e) {
                                throw 'object.kill::' + errors.objects.PROPERTY_IS_CONST;
                                return false;
                            }
                        }
                        return null;
                    }
                    throw 'object.kill::' + errors.objects.INCORRECT_ARGUMENTS;
                },
            };
            //Binding attributes of nodes
            attrs           = {
                storage : {
                    create : function (node) {
                        var Storage = function (node) {
                                this.node       = node;
                                this.binds      = {};
                                this._destroy   = null;
                            };
                        Storage.prototype = {
                            init            : function (){
                                this._destroy = mutationCross.attach(this.node,
                                    this.handle,
                                    this,
                                    {
                                        attributes              : true,
                                        childList               : false,
                                        subtree                 : true,
                                        characterData           : true,
                                        attributeOldValue       : false,
                                        characterDataOldValue   : false
                                    }
                                );
                            },
                            handle          : function (attr, mutation) {
                                var self        = this,
                                    attr_value  = null,
                                    target      = mutation.target,
                                    node_id     = target[settings.attrs.NODE_ID_PROPERTY] !== void 0 ? target[settings.attrs.NODE_ID_PROPERTY] : null;
                                if (node_id !== null && this.binds[node_id] !== void 0 && this.binds[node_id][attr] !== void 0) {
                                    attr_value = target.getAttribute(attr);
                                    if (attr_value !== this.binds[node_id][attr].current) {
                                        this.binds[node_id][attr].previous  = this.binds[node_id][attr].current;
                                        this.binds[node_id][attr].current   = attr_value;
                                        _object(this.binds[node_id][attr].handles).forEach(function (id, handle) {
                                            handle.call(target, attr, self.binds[node_id][attr].current, self.binds[node_id][attr].previous, mutation, id);
                                        });
                                    }
                                }
                            },
                            make            : function (node, attr) {
                                var node_id                 = this.setID(node);
                                this.binds[node_id]         = this.binds[node_id]       === void 0 ? {} : this.binds[node_id];
                                this.binds[node_id][attr]   = this.binds[node_id][attr] === void 0 ?
                                    {
                                        handles : {},
                                        previous: null,
                                        current : node.getAttribute(attr)
                                    } : this.binds[node_id][attr];
                            },
                            add             : function (node, attr, handle) {
                                var node_id     = node[settings.attrs.NODE_ID_PROPERTY],
                                    handle_id   = flex.unique();
                                //Save handle ID in handle
                                handle[settings.attrs.HANDLE_ID_PROPERTY] = handle_id;
                                //Add handle in storage
                                this.binds[node_id][attr].handles[handle_id] = handle;
                                //Return handle ID
                                return handle_id;
                            },
                            remove          : function (node, attr, id) {
                                var result  = null,
                                    node_id = node[settings.attrs.NODE_ID_PROPERTY];
                                if (this.binds[node_id] !== void 0 && this.binds[node_id][attr] !== void 0) {
                                    if (this.binds[node_id][attr].handles[id] !== void 0) {
                                        delete this.binds[node_id][attr].handles[id];
                                        if (Object.keys(this.binds[node_id][attr].handles).length === 0) {
                                            result = delete this.binds[node_id][attr];
                                            if (Object.keys(this.binds[node_id]).length === 0) {
                                                result = delete this.binds[node_id];
                                                this.destroy();
                                            }
                                            return result;
                                        }
                                    }
                                }
                                return result;
                            },
                            kill            : function (node, attr) {
                                var result  = null,
                                    node_id = node[settings.attrs.NODE_ID_PROPERTY];
                                if (this.binds[node_id] !== void 0 && this.binds[node_id][attr] !== void 0) {
                                    result = delete this.binds[node_id][attr];
                                    if (Object.keys(this.binds[node_id]).length === 0) {
                                        result = delete this.binds[node_id];
                                        this.destroy();
                                    }
                                    return result;
                                }
                                return result;
                            },
                            setID           : function (node){
                                if (node[settings.attrs.NODE_ID_PROPERTY] === void 0) {
                                    node[settings.attrs.NODE_ID_PROPERTY] = flex.unique();
                                }
                                return node[settings.attrs.NODE_ID_PROPERTY];
                            },
                            destroy         : function (){
                                if (Object.keys(this.binds).length === 0) {
                                    this._destroy();
                                    return delete this.node[settings.attrs.STORAGE_PROPERTY];
                                }
                                return false;
                            },
                        };
                        return new Storage(node);
                    }
                },
                bind    : function (node, attr, handle, parent) {
                    /// <signature>
                    ///     <summary>Bind handle to attribute of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="attr"      type="STRING"   >Attribute name</param>
                    ///     <param name="handle"    type="FUNCTION" >Handle of attribute changing</param>
                    ///     <returns type="STRING"/>
                    /// </signature>
                    var storage = settings.attrs.STORAGE_PROPERTY,
                        parent  = parent !== void 0 ? parent : node;
                    if (mutationCross.attach !== null) {
                        if (node !== void 0 && typeof attr === 'string' && typeof handle === 'function') {
                            if (node.nodeName) {
                                if (!parent[storage]) {
                                    //Node isn't listening
                                    parent[storage] = attrs.storage.create(parent);
                                    parent[storage].init();
                                }
                                storage = parent[storage];
                                //Prepare attr if needed
                                storage.make(node, attr);
                                //Add handle
                                return storage.add(node, attr, handle);
                            }
                        }
                        throw 'attrs.bind::' + errors.objects.INCORRECT_ARGUMENTS;
                    }
                },
                unbind  : function (node, attr, id, parent) {
                    /// <signature>
                    ///     <summary>Unbind handle to attribute of node by handle's ID</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="attr"      type="STRING"   >Attribute name</param>
                    ///     <param name="id"        type="STRING"   >ID of handle</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.attrs.STORAGE_PROPERTY,
                        parent  = parent !== void 0 ? parent : node;
                    if (typeof node === 'object' && typeof attr === 'string' && typeof id === 'string') {
                        if (parent[storage]) {
                            storage = parent[storage];
                            return storage.remove(node, attr, id);
                        }
                        return null;
                    }
                    throw 'attrs.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
                kill    : function (node, attr, parent) {
                    /// <signature>
                    ///     <summary>Unbind all handles, which was attached to attribute of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="attr"      type="STRING"   >Attribute name</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.attrs.STORAGE_PROPERTY,
                        parent  = parent !== void 0 ? parent : node;
                    if (typeof node === 'object' && typeof attr === 'string') {
                        if (parent[storage]) {
                            storage = parent[storage];
                            return storage.kill(node, attr);
                        }
                        return null;
                    }
                    throw 'attrs.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
            };
            //Binding properties of nodes
            props           = {
                storage : {
                    create : function (node) {
                        var Storage = function (node) {
                                this.node       = node;
                                this.binds      = {};
                                this._destroy   = null;
                            };
                        Storage.prototype = {
                            init            : function (){
                                this._destroy = mutationCross.attach(
                                    this.node,
                                    this.handle,
                                    this,
                                    {
                                        attributes              : true,
                                        childList               : true,
                                        subtree                 : true,
                                        characterData           : true,
                                        attributeOldValue       : false,
                                        characterDataOldValue   : false
                                    }
                                );
                            },
                            prop            : function (node, prop){
                                var res = null;
                                prop.split('.').forEach(function (step, index, steps) {
                                    if (node[step] !== void 0 && index < steps.length - 1) {
                                        node = node[step];
                                    } else if (node[step] !== void 0 && index === steps.length - 1) {
                                        res = {
                                            parent  : node,
                                            name    : step
                                        };
                                    }
                                });
                                return res;
                            },
                            handle          : function (attr, mutation) {
                                var self        = this,
                                    target      = mutation.target,
                                    node_id     = target[settings.props.NODE_ID_PROPERTY] !== void 0 ? target[settings.props.NODE_ID_PROPERTY] : null;
                                if (node_id !== null && this.binds[node_id] !== void 0) {
                                    _object(this.binds[node_id]).forEach(function (prop, bind_data) {
                                        var prop_value = bind_data.parent[prop];
                                        if (prop_value !== bind_data.current) {
                                            bind_data.previous    = bind_data.current;
                                            bind_data.current     = prop_value;
                                            _object(bind_data.handles).forEach(function (id, handle) {
                                                handle.call(bind_data.parent, prop, bind_data.current, bind_data.previous, mutation, id);
                                            });
                                        }
                                    });
                                }
                            },
                            make            : function (node, prop) {
                                var node_id                     = this.setID(node),
                                    prop                        = this.prop(node, prop);
                                this.binds[node_id]             = this.binds[node_id] === void 0 ? {} : this.binds[node_id];
                                this.binds[node_id][prop.name]  = this.binds[node_id][prop.name] === void 0 ?
                                    {
                                        handles : {},
                                        previous: null,
                                        current : prop.parent[prop.name],
                                        parent  : prop.parent
                                    } : this.binds[node_id][prop.name];
                            },
                            add             : function (node, prop, handle) {
                                var handle_id   = flex.unique(),
                                    node_id     = node[settings.props.NODE_ID_PROPERTY] !== void 0 ? node[settings.props.NODE_ID_PROPERTY] : null,
                                    prop        = this.prop(node, prop);
                                //Save handle ID in handle
                                handle[settings.props.HANDLE_ID_PROPERTY] = handle_id;
                                //Add handle in storage
                                this.binds[node_id][prop.name].handles[handle_id] = handle;
                                //Return handle ID
                                return handle_id;
                            },
                            remove          : function (node, prop, id) {
                                var result  = null,
                                    node_id = node[settings.props.NODE_ID_PROPERTY] !== void 0 ? node[settings.props.NODE_ID_PROPERTY] : null,
                                    prop    = this.prop(node, prop);
                                if (node_id !== null && this.binds[node_id] !== void 0 && this.binds[node_id][prop.name] !== void 0) {
                                    if (this.binds[node_id][prop.name].handles[id]) {
                                        delete this.binds[node_id][prop.name].handles[id];
                                        if (Object.keys(this.binds[node_id][prop.name].handles).length === 0) {
                                            result = delete this.binds[node_id][prop.name];
                                            if (Object.keys(this.binds[node_id]).length === 0) {
                                                result = delete this.binds[node_id];
                                                this.destroy();
                                            }
                                        }
                                    }
                                }
                                return result;
                            },
                            kill            : function (node, prop) {
                                var result  = null,
                                    node_id = node[settings.props.NODE_ID_PROPERTY] !== void 0 ? node[settings.props.NODE_ID_PROPERTY] : null,
                                    prop    = this.prop(node, prop);
                                if (node_id !== null && this.binds[node_id] !== void 0 && this.binds[node_id][prop.name] !== void 0) {
                                    result = delete this.binds[node_id][prop.name];
                                    if (Object.keys(this.binds[node_id]).length === 0) {
                                        result = delete this.binds[node_id];
                                        this.destroy();
                                    }
                                }
                                return result;
                            },
                            setID           : function (node){
                                if (node[settings.props.NODE_ID_PROPERTY] === void 0) {
                                    node[settings.props.NODE_ID_PROPERTY] = flex.unique();
                                }
                                return node[settings.props.NODE_ID_PROPERTY];
                            },
                            destroy         : function (){
                                if (Object.keys(this.binds).length === 0) {
                                    this._destroy();
                                    return delete this.node[settings.props.STORAGE_PROPERTY];
                                }
                                return false;
                            },
                        };
                        return new Storage(node);
                    }
                },
                bind    : function (node, prop, handle, parent) {
                    /// <signature>
                    ///     <summary>Bind handle to prop of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="prop"      type="STRING"   >Prop name</param>
                    ///     <param name="handle"    type="FUNCTION" >Handle of prop changing</param>
                    ///     <returns type="STRING"/>
                    /// </signature>
                    function isValidProp(node, prop) {
                        var res = false;
                        prop.split('.').forEach(function (step, index, steps) {
                            if (node[step] !== void 0 && index < steps.length - 1) {
                                node = node[step];
                            } else if (node[step] !== void 0 && index === steps.length - 1) {
                                res = true;
                            }
                        });
                        return res;
                    };
                    var storage = settings.props.STORAGE_PROPERTY,
                        parent  = parent !== void 0 ? parent : node;
                    if (mutationCross.attach !== null) {
                        if (node !== void 0 && typeof prop === 'string' && typeof handle === 'function') {
                            if (node.nodeName !== void 0) {
                                if (isValidProp(node, prop)) {
                                    if (parent[storage] === void 0) {
                                        //Node isn't listening
                                        parent[storage] = props.storage.create(parent);
                                        parent[storage].init();
                                    }
                                    storage = parent[storage];
                                    storage.make(node, prop);
                                    //Add handle
                                    return storage.add(node, prop, handle);
                                }
                            }
                        }
                        throw 'props.bind::' + errors.objects.INCORRECT_ARGUMENTS;
                    }
                },
                unbind  : function (node, prop, id, parent) {
                    /// <signature>
                    ///     <summary>Unbind handle to prop of node by handle's ID</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="prop"      type="STRING"   >Prop name</param>
                    ///     <param name="id"        type="STRING"   >ID of handle</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.props.STORAGE_PROPERTY,
                        parent  = parent !== void 0 ? parent : node;
                    if (typeof node === 'object' && typeof prop === 'string' && typeof id === 'string') {
                        if (parent[storage]) {
                            storage = parent[storage];
                            return storage.remove(node, prop, id);
                        }
                        return null;
                    }
                    throw 'props.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
                kill    : function (node, prop, parent) {
                    /// <signature>
                    ///     <summary>Unbind all handles, which was attached to prop of node</summary>
                    ///     <param name="node"      type="DOMNode"  >Target node</param>
                    ///     <param name="prop"      type="STRING"   >Prop name</param>
                    ///     <returns type="BOOLEAN"/>
                    /// </signature>
                    var storage = settings.props.STORAGE_PROPERTY,
                        parent  = parent !== void 0 ? parent : node;
                    if (typeof node === 'object' && typeof prop === 'string') {
                        if (parent[storage]) {
                            storage = parent[storage];
                            return storage.kill(node, prop);
                        }
                        return null;
                    }
                    throw 'props.unbind::' + errors.objects.INCORRECT_ARGUMENTS;
                },
            };
            mutationCross   = {
                init                : function () {
                    mutationCross.attach = mutationCross.attach();
                },
                //Modern
                mutationObserver    : function (node, handle, self, parameters) {
                    var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver,
                        observer            = null;
                    observer = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            handle.call(self, mutation.attributeName, mutation);
                        });
                    });
                    observer.observe(node, parameters);
                    //Return distroy / disconnect method
                    return function () {
                        observer.disconnect();
                    };
                },
                //Old
                DOMAttrModified     : function (node, handle, self) {
                    flex.events.DOM.add(node, 'DOMAttrModified', function (mutation) {
                        handle.call(self, event.attrName, mutation);
                    });
                    //Return distroy / disconnect method
                    return function () {
                        //Do nothing
                    };
                },
                //IE < 11
                onPropertyChange    : function (node, handle, self) {
                    flex.events.DOM.add(node, 'propertychange', function (mutation) {
                        handle.call(self, event.attributeName, mutation);
                    });
                    //Return distroy / disconnect method
                    return function () {
                        //Do nothing
                    };
                },
                //Common accessor to browser API
                attach              : function () {
                    function isDOMAttrModified() {
                        var node = document.createElement('DIV'),
                            flag = false;
                        flex.events.DOM.add(node, 'DOMAttrModified', function () {
                            flag = true;
                        });
                        node.setAttribute('id', 'test');
                        return flag;
                    };
                    if (window.MutationObserver || window.WebKitMutationObserver) {
                        return mutationCross.mutationObserver;
                    }
                    if (isDOMAttrModified()) {
                        return mutationCross.DOMAttrModified;
                    }
                    if ('onpropertychange' in document.body) {
                        return mutationCross.onPropertyChange;
                    }
                    return null;
                }
            };
            callers         = {
                init: function () {
                    flex.callers.define.object('binding.bind',          function (property, handle) {
                        return objects.bind(this.target, property, handle);
                    });
                    flex.callers.define.object('binding.unbind',        function (property, id) {
                        return objects.unbind(this.target, property, id);
                    });
                    flex.callers.define.object('binding.kill',          function (property) {
                        return objects.kill(this.target, property);
                    });

                    flex.callers.define.node('bindingAttrs.bind',       function (attr, handle, parent) {
                        return attrs.bind(this.target, attr, handle, parent);
                    });
                    flex.callers.define.node('bindingAttrs.unbind',     function (attr, id, parent) {
                        return attrs.unbind(this.target, attr, id, parent);
                    });
                    flex.callers.define.node('bindingAttrs.kill',       function (attr, parent) {
                        return attrs.kill(this.target, attr, parent);
                    });

                    flex.callers.define.nodes('bindingAttrs.bind',      function (attr, handle, parent) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target,       function (target) {
                            result.push(attrs.bind(target, attr, handle, parent));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingAttrs.unbind',    function (attr, id, parent) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target,       function (target) {
                            result.push(attrs.unbind(target, attr, id, parent));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingAttrs.kill',      function (attr, parent) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target,       function (target) {
                            result.push(attrs.kill(target, attr, parent));
                        });
                        return result;
                    });

                    flex.callers.define.node('bindingProps.bind',       function (prop, handle, parent) {
                        return props.bind(this.target, prop, handle, parent);
                    });
                    flex.callers.define.node('bindingProps.unbind',     function (prop, id, parent) {
                        return props.unbind(this.target, prop, id, parent);
                    });
                    flex.callers.define.node('bindingProps.kill',       function (prop, parent) {
                        return props.kill(this.target, prop, parent);
                    });

                    flex.callers.define.nodes('bindingProps.bind',      function (prop, handle, parent) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(props.bind(target, prop, handle, parent));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingProps.unbind',    function (prop, id, parent) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(props.unbind(target, prop, id, parent));
                        });
                        return result;
                    });
                    flex.callers.define.nodes('bindingProps.kill',      function (prop, parent) {
                        var result = [];
                        SelectorClass();
                        Array.prototype.forEach.call(this.target, function (target) {
                            result.push(props.kill(target, prop, parent));
                        });
                        return result;
                    });
                }
            };
            support         = {
                check   : function () {
                    if (!Object.defineProperty) {
                        throw errors.support.DEFINE_PROPERTY;
                    }
                    if (mutationCross.attach === null) {
                        throw errors.support.MUTATION_SCANNING;
                    }
                }
            };
            //Init 
            mutationCross.init();
            //Initialization of callers
            callers.init();
            //Check support
            support.check();
            //Public part
            privates        = {
            };
            return {
            };
        };
        flex.modules.attach({
            name            : 'binds',
            protofunction   : protofunction,
        });
    }
}());
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright � 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
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
            var instance    = null,
                DOM         = null,
                callers     = null,
                privates    = null;
            DOM         = function () {
                if (instance === null) {
                    instance            = function () { };
                    instance.prototype  = (function () {
                        var tools       = null,
                            touches     = null,
                            storage     = null,
                            settings    = {
                                STORAGE_NAME                : 'FlexEventsStorage',
                                HANDLE_EVENT_ID_PROPERTY    : 'FlexEventIDProrerty'
                            },
                            Handle      = null,
                            privates    = null;
                        //Handle class
                        Handle              = function (id, handle, once, touch, safely) {
                            this.id             = id;
                            this.handle         = handle;
                            this.once           = once;
                            this.touch          = touch;
                            this.safely         = safely;
                            this.remove         = false;
                            this.interaction    = null;
                            this.working        = false;
                            this.device         = null;
                        };
                        Handle.prototype    = {
                            launch      : function (context, event) {
                                var error = null;
                                if (this.remove === false && this.isDouble(event) === false) {
                                    try {
                                        this.working = true;
                                        this.remove = this.once;
                                        return this.handle.call(context, event);
                                    } catch (e) {
                                        if (this.safely) {
                                            this.error(event, e);
                                            return null;
                                        } else {
                                            error = e;
                                        }
                                    } finally {
                                        this.working = false;
                                        if (this.once === true && this.remove === false) {
                                            flex.logs.log(
                                                'Unexpected behavior DOM.fire. Flag [once] is true, but [remove] is false; \n\r ' +
                                                '>event id' + this.id,
                                                flex.logs.types.WARNING
                                            );
                                        }
                                    }
                                    if (error !== null) {
                                        throw error;
                                    }
                                }
                                return null;
                            },
                            isWorking   : function(){
                                return this.working;
                            },
                            isRemoving  : function(){
                                return this.remove;
                            },
                            toRemove    : function(){
                                this.remove = true;
                            },
                            error       : function (event, e) {
                                flex.logs.log(
                                    "event: " + event.type + "; ID: " + this.id + "; generated error: \r\n" + flex.logs.parseError(e),
                                    flex.logs.types.WARNING
                                );
                            },
                            isDouble   : function (event) {
                                var device = '';
                                if (event.flex.singleTouch) {
                                    device = 'touch';
                                } else {
                                    device = 'mouse';
                                }
                                this.device = (this.device === null ? device : this.device);
                                return this.device === device ? false : true;
                            }
                        };
                        //Methods
                        function add(parameters) {
                            /// <summary>
                            /// Attach to element event handle
                            /// </summary>
                            /// <param name="parameters" type="Object">Events parameters:               &#13;&#10;
                            /// {   [node]      element,                                                &#13;&#10;
                            ///     [string]    name,                                                   &#13;&#10;
                            ///     [function]  handle,                                                 &#13;&#10;
                            ///     [string]    id     (optional),                                      &#13;&#10;
                            ///     [boolean]   once   (optional, def:false) -> true - remove after handle will be once used}</param>
                            ///     [boolean]   touch  (optional, def:false) -> true - try find analog of touch event and attach it}</param>
                            ///     [boolean]   safely (optional, def:false) -> true - will block all throws and show log in console instead.}</param>
                            /// <returns type="boolean">true if success and false if fail</returns>
                            function validate(parameters) {
                                parameters.element  = parameters.element        !== void 0      ? parameters.element    : null;
                                parameters.name     = typeof parameters.name    === 'string'    ? parameters.name       : null;
                                parameters.handle   = typeof parameters.handle  === 'function'  ? parameters.handle     : null;
                                parameters.id       = typeof parameters.id      === 'string'    ? parameters.id         : flex.unique();
                                parameters.once     = typeof parameters.once    === 'boolean'   ? parameters.once       : false;
                                parameters.touch    = typeof parameters.touch   === 'boolean'   ? parameters.touch      : true;
                                parameters.safely   = typeof parameters.safely  === 'boolean'   ? parameters.safely     : false;
                                //Prevent double attaching for touch events
                                if (touches.has(parameters.name) === false) {
                                    parameters.touch = false;
                                }
                                return parameters;
                            };
                            var parameters  = validate(parameters),
                                handles     = null;
                            if (parameters.element !== null && parameters.handle !== null && parameters.name !== null) {
                                handles = storage.get(parameters.element, false);
                                if (handles !== null) {
                                    handles = tools.buildCommonHandle(parameters.element, parameters.name, handles, parameters.touch, parameters.safely);
                                    if (handles instanceof Array) {
                                        handles.push(
                                            new Handle(parameters.id, parameters.handle, parameters.once, parameters.touch)
                                        );
                                        return parameters.id;
                                    }
                                }
                            }
                            return null;
                        };
                        function fire(element, event, element_id, original_type, safely) {
                            /// <summary>
                            /// Common handle of events
                            /// </summary>
                            /// <param name="element" type="node"       >Element        </param>
                            /// <param name="event" type="string"       >Event name     </param>
                            /// <param name="element_id" type="string"  >ID of event    </param>
                            /// <returns type="boolean">true if success and false if fail</returns>
                            var event               = event !== void 0 ? event : tools.fixEvent(),
                                handles_storage     = storage.get(this, true),
                                handles             = null,
                                interaction         = flex.unique(),
                                isPrevent           = null,
                                self                = this,
                                needRemoveChecking  = false,
                                event_type          = (event.type !== original_type ? original_type : event.type),
                                error               = null;
                            if (event && element && element_id && handles_storage !== null) {
                                event = tools.unificationEvent(event);
                                if (handles_storage[event_type]) {
                                    handles_storage = handles_storage[event_type];
                                    if (handles_storage.element_id === element_id) {
                                        handles = handles_storage.handles;
                                        try {
                                            Array.prototype.forEach.call(
                                                handles,
                                                function (handle) {
                                                    if (handle.interaction !== interaction) {
                                                        handle.interaction  = interaction;
                                                        isPrevent           = handle.launch(self, event);
                                                        needRemoveChecking  = needRemoveChecking === true ? true : (handle.isRemoving() === false ? false : true);
                                                        if (isPrevent === false) {//It's correct. Here false means prevent other handles
                                                            event.flex.stop();
                                                            flex.logs.log(
                                                                'Break event in DOM.fire; \n\r ' +
                                                                '>event: '      + event.type    + '\n\r ' +
                                                                '>handle_id'    + handle.id     + '\n\r ' +
                                                                '>element_id'   + element_id,
                                                                flex.logs.types.WARNING
                                                            );
                                                            throw 'prevent';
                                                        }
                                                    } else {
                                                        flex.logs.log(
                                                            'Unexpected behavior of handle event in DOM.fire. Attempt to call handle twice. \n\r ' +
                                                            '>event: '      + event.type    + '\n\r ' +
                                                            '>handle_id'    + handle.id     + '\n\r ' +
                                                            '>element_id'   + element_id,
                                                            flex.logs.types.LOGICAL
                                                        );
                                                    }
                                                }
                                            );
                                        } catch (e) {
                                            if (e !== 'prevent') {
                                                if (safely) {
                                                    flex.logs.log(
                                                        'Unexpected error in DOM.fire; \n\r ' +
                                                        '>event: ' + event.type + '\n\r ' +
                                                        '>element_id' + element_id,
                                                        flex.logs.types.CRITICAL
                                                    );
                                                } else {
                                                    error = e;
                                                }
                                            }
                                        } finally {
                                            if (needRemoveChecking !== false) {
                                                //Remove all handles, which should be removed
                                                handles_storage.handles = handles.filter(
                                                    function (handle) {
                                                        if (handle.isWorking() === false && handle.isRemoving() !== false) {
                                                            return false;
                                                        } else {
                                                            return true;
                                                        }
                                                    }
                                                );
                                                if (handles_storage.handles.length === 0) {
                                                    tools.destroyCommonHandle(element, event_type);
                                                    storage.clear(element);
                                                }
                                            }
                                        }
                                        if (error !== null) {
                                            throw error;
                                        }
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };
                        function remove(parameters) {
                            /// <summary>
                            /// Attach to element event handle
                            /// </summary>
                            /// <param name="parameters" type="Object">Events parameters:               &#13;&#10;
                            /// {   [node]      element,                                                &#13;&#10;
                            ///     [string]    name,                                                   &#13;&#10;
                            ///     [function]  handle,                                                 &#13;&#10;
                            ///     [string]    id     (optional) }</param>
                            /// <returns type="boolean">true if success and false if fail</returns>
                            function getIDByHandle(handle) {
                                return handle[settings.HANDLE_EVENT_ID_PROPERTY] !== void 0 ? handle[settings.HANDLE_EVENT_ID_PROPERTY] : null;
                            };
                            function validate(parameters) {
                                parameters.element  = parameters.element        !== void 0      ? parameters.element    : null;
                                parameters.name     = typeof parameters.name    === 'string'    ? parameters.name       : null;
                                parameters.handle   = typeof parameters.handle  === 'function'  ? parameters.handle     : null;
                                parameters.id       = typeof parameters.id      === 'string'    ? parameters.id         : getIDByHandle(parameters.handle);
                                return parameters;
                            };
                            var parameters      = validate(parameters),
                                handles_storage = null,
                                handles         = null;
                            if (parameters.element !== null && parameters.name !== null) {
                                if (parameters.id === null && parameters.handle !== null) {
                                    if (parameters.handle[settings.HANDLE_EVENT_ID_PROPERTY] !== void 0) {
                                        parameters.id = parameters.handle[settings.HANDLE_EVENT_ID_PROPERTY];
                                    }
                                }
                                if (parameters.id !== null) {
                                    handles_storage = storage.get(parameters.element, true);
                                    if (typeof handles_storage[parameters.name] === 'object') {
                                        handles_storage = handles_storage[parameters.name];
                                        handles         = handles_storage.handles;
                                        try {
                                            Array.prototype.forEach.call(
                                                handles,
                                                function (handle) {
                                                    if (handle.id === parameters.id) {
                                                        handle.toRemove();
                                                        throw 'handle found';
                                                    }
                                                }
                                            );
                                        } catch (e) {
                                            if (e !== 'handle found') {
                                                flex.logs.log(
                                                    'Unexpected error in DOM.remove; \n\r ' +
                                                    '>event: ' + parameters.name + '\n\r ' +
                                                    '>event_id' + parameters.id,
                                                    flex.logs.types.CRITICAL
                                                );
                                            }
                                        } finally {
                                            handles = handles.filter(
                                                function (handle) {
                                                    if (handle.isWorking() === false && handle.isRemoving() !== false) {
                                                        return false;
                                                    } else {
                                                        return true;
                                                    }
                                                }
                                            );
                                            if (handles.length === 0) {
                                                tools.destroyCommonHandle(parameters.element, parameters.name);
                                                storage.clear(parameters.element);
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        function clear(element, event, fire) {
                            /// <summary>
                            /// Remove all handles of event's type
                            /// </summary>
                            /// <param name="element"   type="node"     >target element</param>
                            /// <param name="type"      type="string"   >event type</param>
                            /// <param name="fire"      type="boolean"  >fire all handles before remove</param>
                            /// <returns type="boolean">true if success and false if fail</returns>
                            var handles_storage = null,
                                handles         = null,
                                fire            = typeof fire === 'boolean' ? fire : false;
                            if (element && event) {
                                handles_storage = storage.get(element, true);
                                if (handles_storage !== null) {
                                    if (typeof handles_storage[event] === 'object') {
                                        handles_storage = handles_storage[event];
                                        if (fire !== false) {
                                            try {
                                                Array.prototype.forEach.call(
                                                    handles_storage.handles,
                                                    function (handle) {
                                                        flex.logs.log(
                                                            'Event fired in DOM.clear.fire; \n\r' +
                                                            '>event: '      + event + '\n\r'+
                                                            '>handle_id: '  + handle.id,
                                                            flex.logs.types.NOTIFICATION
                                                        );
                                                        if (handle.launch(element, null) === false) {
                                                            throw 'prevent';
                                                        }
                                                    }
                                                );
                                            } catch (e) {
                                                if (e === 'prevent') {
                                                    flex.logs.log(
                                                        'Break event in DOM.clear.fire; \n\r ' +
                                                        '>event: ' + event,
                                                        flex.logs.types.WARNING
                                                    );
                                                } else {
                                                    flex.logs.log(
                                                        'Fatal error event in DOM.clear.fire; \n\r ' +
                                                        '>event: ' + event,
                                                        flex.logs.types.WARNING
                                                    );
                                                }
                                            }
                                        }
                                        handles_storage.handles = [];
                                        tools.destroyCommonHandle(element, event);
                                        storage.clear(element);
                                        return true;
                                    }
                                }
                                return false;
                            }
                            return null;
                        };
                        function call(element, name) {
                            /// <summary>
                            /// Emulate (call) event on some node
                            /// </summary>
                            /// <param name="element" type="Object" >Node           </param>
                            /// <param name="name" type="string"    >Type of event  </param>
                            /// <returns type="Object">returns node in success or throw new syntax error in fail</returns>
                            function extend(destination, source) {
                                for (var property in source)
                                    destination[property] = source[property];
                                return destination;
                            }
                            var oEvent          = null,
                                eventType       = null,
                                evt             = null,
                                eventMatchers   = {
                                    'HTMLEvents'    : /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
                                    'MouseEvents'   : /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
                                },
                                defaultOptions  = {
                                    type            : name,
                                    canBubble       : true,
                                    cancelable      : true,
                                    view            : element.ownerDocument.defaultView,
                                    detail          : 1,
                                    screenX         : 0,
                                    screenY         : 0,
                                    clientX         : 0,
                                    clientY         : 0,
                                    pointerX        : 0,
                                    pointerY        : 0,
                                    ctrlKey         : false,
                                    altKey          : false,
                                    shiftKey        : false,
                                    metaKey         : false,
                                    button          : 0,
                                    relatedTarget   : null
                                },
                                options = extend(defaultOptions, arguments[2] || {});
                            for (var name in eventMatchers) {
                                if (eventMatchers[name].test(name)) { eventType = name; break; }
                            }
                            if (!eventType) {
                                throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
                            }
                            if (document.createEvent) {
                                oEvent = document.createEvent(eventType);
                                if (eventType == 'HTMLEvents') {
                                    oEvent.initEvent(name, options.bubbles, options.cancelable);
                                } else {
                                    oEvent.initMouseEvent(
                                        options.type,       options.canBubble,  options.cancelable, options.view,
                                        options.detail,     options.screenX,    options.screenY,    options.clientX,
                                        options.clientY,    options.ctrlKey,    options.altKey,     options.shiftKey,
                                        options.metaKey,    options.button,     options.relatedTarget
                                    );
                                }
                                element.dispatchEvent(oEvent);
                            } else {
                                options.clientX = options.pointerX;
                                options.clientY = options.pointerY;
                                evt             = document.createEventObject();
                                oEvent          = extend(evt, options);
                                element.fireEvent('on' + name, oEvent);
                            }
                            return element;
                        };
                        storage = {
                            get     : function (element, only_get) {
                                /// <summary>
                                /// Get virtual storage from element
                                /// </summary>
                                /// <param name="element"   type="node"     >Element</param>
                                /// <param name="only_get"  type="boolean"  >false - create, if doesn't exist; true - only get</param>
                                /// <returns type="object">virtual storage</returns>
                                var only_get = (typeof only_get === "boolean" ? only_get : true),
                                    storage     = null;
                                if (element) {
                                    storage = flex.overhead.objecty.get(element, settings.STORAGE_NAME);
                                    if (storage === null && only_get === false) {
                                        storage = flex.overhead.objecty.set(element, settings.STORAGE_NAME, {});
                                    }
                                    return storage;
                                }
                                return null;
                            },
                            clear   : function (element) {
                                    /// <summary>
                                    /// Try to clear virtual storage from element (only if storage is empty)
                                    /// </summary>
                                    /// <param name="element"   type="node"     >Element</param>
                                    /// <returns type="object">true - if removed; false - if not.</returns>
                                var handles = storage.get(element, true);
                                if (handles !== null) {
                                    if (Object.keys(handles).length === 0) {
                                        flex.overhead.objecty.del(element, settings.STORAGE_NAME);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                                return false;
                            }
                        };
                        tools = {
                            buildCommonHandle   : function (element, type, storage, touch, safely) {
                                /// <summary>
                                /// Build common handle for element for defined event
                                /// </summary>
                                /// <param name="element"   type="node"     >Element</param>
                                /// <param name="type"      type="string"   >Event name</param>
                                /// <param name="storage"   type="object"   >Virtual storage of element</param>
                                /// <returns type="object">collection of handles</returns>
                                var element_id = flex.unique();
                                if (typeof storage[type] !== "object") {
                                    storage[type] = {
                                        globalHandle    : function (event) {
                                            return fire.call(element, element, event, element_id, type, safely);
                                        },
                                        element_id      : element_id,
                                        handles         : []
                                    };
                                    if (flex.events.DOM.add(element, type, storage[type].globalHandle) === false) {
                                        return null;
                                    }
                                    if (touch !== false) {
                                        if (touches.has(type) !== false) {
                                            flex.events.DOM.add(element, touches.getType(type), storage[type].globalHandle);
                                        }
                                    }
                                }
                                return storage[type].handles;
                            },
                            destroyCommonHandle : function (element, type) {
                                /// <summary>
                                /// Destroy common handle for element for defined event
                                /// </summary>
                                /// <param name="element"   type="node"     >Element</param>
                                /// <param name="type"      type="string"   >Event name</param>
                                /// <returns type="object">true - if removed; false - if not.</returns>
                                var handles_storage = null;
                                if (element && type) {
                                    handles_storage = storage.get(element, true);
                                    if (typeof handles_storage[type] === 'object') {
                                        flex.events.DOM.remove(element, type, handles_storage[type].globalHandle);
                                        if (touches.has(type) !== false) {
                                            flex.events.DOM.remove(element, touches.getType(type), handles_storage[type].globalHandle);
                                        }
                                        handles_storage[type] = null;
                                        delete handles_storage[type];
                                        return true;
                                    }
                                }
                                return null;
                            },
                            fixEvent            : function() {
                                /// <summary>
                                /// Fix IE bug with event object
                                /// </summary>
                                /// <returns type="void">void</returns>
                                if (!event) {
                                    if (window.event) {
                                        return window.event;
                                    }
                                }
                                return null;
                            },
                            unificationEvent    : function (event) {
                                /// <summary>
                                /// Unification of event object
                                /// </summary>
                                /// <param name="event" type="event">Event object</param>
                                /// <returns type="event">Event object</returns>
                                function addContainer(event) {
                                    event.flex = {};
                                    return event;
                                };
                                function getCoordinates(event, source) {
                                    if (source.clientX !== void 0) {
                                        if (source.pageX === void 0) {
                                            event.flex.pageX = null;
                                            event.flex.pageY = null;
                                        }
                                        if (source.pageX === null && source.clientX !== null) {
                                            var DocumentLink    = document.documentElement,
                                                BodyLink        = document.body;
                                            event.flex.pageX = source.clientX + (DocumentLink && DocumentLink.scrollLeft || BodyLink && BodyLink.scrollLeft || 0) - (DocumentLink.clientLeft || 0);
                                            event.flex.pageY = source.clientY + (DocumentLink && DocumentLink.scrollTop || BodyLink && BodyLink.scrollTop || 0) - (DocumentLink.clientTop || 0);
                                        } else {
                                            event.flex.pageX = source.pageX;
                                            event.flex.pageY = source.pageY;
                                        }
                                    } else {
                                        event.flex.pageX = null;
                                        event.flex.pageY = null;
                                    }
                                    event.flex.clientX = (source.clientX !== void 0 ? source.clientX : null);
                                    event.flex.clientY = (source.clientY !== void 0 ? source.clientY : null);
                                    event.flex.offsetX = (source.offsetX !== void 0 ? source.offsetX : (source.layerX !== void 0 ? source.layerX : null));
                                    event.flex.offsetY = (source.offsetY !== void 0 ? source.offsetY : (source.layerY !== void 0 ? source.layerY : null));
                                    return event;
                                };
                                function unificationStop(event) {
                                    if (event.preventDefault === void 0) {
                                        event.preventDefault = function () { try { this.returnValue = false; } catch (e) { } };
                                    }
                                    if (event.stopPropagation === void 0) {
                                        event.stopPropagation = function () { try { this.cancelBubble = true; } catch (e) { } };
                                    }
                                    event.flex.stop = function () {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        return false;
                                    };
                                    return event;
                                };
                                function unificationTarget(event) {
                                    if (event.target === void 0) {
                                        if (event.srcElement !== void 0) {
                                            event.target = event.srcElement;
                                        } else {
                                            event.target = null;
                                        }
                                    }
                                    if (event.target !== null) {
                                        if (event.relatedTarget === void 0) {
                                            if (event.fromElement !== void 0) {
                                                if (event.fromElement === event.target) {
                                                    event.relatedTarget = event.toElement;
                                                } else {
                                                    event.relatedTarget = event.fromElement;
                                                }
                                            } else {
                                                event.relatedTarget = null;
                                                event.fromElement   = null;
                                            }
                                        }
                                    }
                                    event.flex.target = event.target;
                                    return event;
                                };
                                function unificationCoordinate(event) {
                                    return getCoordinates(event, event);
                                };
                                function unificationButtons(event) {
                                    if (event.which === void 0 && event.button !== void 0) {
                                        event.flex.which    = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
                                        event.flex.button   = event.button;
                                    }
                                    return event;
                                };
                                function unificationTouches(event) {
                                    if (typeof event.touches === "object") {
                                        if (event.touches.length === 1) {
                                            event                   = getCoordinates(event, event.touches[0]);
                                            event.flex.target       = event.touches[0].target;
                                            event.flex.singleTouch  = true;
                                        }
                                        event.flex.touches = event.touches;
                                    }
                                    return event;
                                };
                                if (event.flex === void 0) {
                                    event = addContainer            (event);
                                    event = unificationStop         (event);
                                    event = unificationTarget       (event);
                                    event = unificationCoordinate   (event);
                                    event = unificationButtons      (event);
                                    event = unificationTouches      (event);
                                }
                                return event;
                            }
                        };
                        touches = {
                            events          : {
                                click       : { touch: 'touchstart' },
                                dblclick    : { touch: 'touchstart' },
                                mousedown   : { touch: 'touchstart' },
                                mouseenter  : { touch: 'touchenter' },
                                mouseleave  : { touch: 'touchleave' },
                                mousemove   : { touch: 'touchmove' },
                                mouseover   : { touch: '' },
                                mouseout    : { touch: '' },
                                mouseup     : { touch: 'touchend' },
                            },
                            has             : function (type) {
                                for (var key in touches.events) {
                                    if (key === type || 'on' + key === type) {
                                        return true;
                                    }
                                }
                                return false;
                            },
                            getType         : function (type) {
                                for (var key in touches.events) {
                                    if (key === type || 'on' + key === type) {
                                        return touches.events[key].touch;
                                    }
                                }
                                return null;
                            },
                            getOriginalType : function (type) {
                                type = type.toLowerCase();
                                for (var key in touches.events) {
                                    if (touches.events[key].touch === type) {
                                        return key;
                                    }
                                }
                                return null;
                            }
                        };
                        privates = {
                            _add    : add,
                            _remove : remove,
                            add     : function (element, type, handle, id, touch, safely) {
                                return add({
                                    element : element,
                                    name    : type,
                                    handle  : handle,
                                    id      : id,
                                    touch   : touch,
                                    safely  : safely
                                });
                            },
                            remove  : function (element, type, handle, id) {
                                return remove({
                                    element : element,
                                    name    : type,
                                    handle  : handle,
                                    id      : id,
                                });
                            },
                            call    : call,
                            clear   : clear,
                            unify   : tools.unificationEvent
                        };
                        return {
                            add             : privates.add,
                            remove          : privates.remove,
                            clear           : privates.clear,
                            call            : privates.call,
                            unify           : privates.unify,
                            extendedAdd     : privates._add,
                            extendedRemove  : privates._remove,
                        };
                    }());
                    instance            = new instance();
                }
                return instance;
            };
            callers     = {
                init: function () {
                    //_node
                    flex.callers.define.node('events.add',      function (type, handle, id, touch) {
                        return DOM().add(this.target, type, handle, id, touch);
                    });
                    flex.callers.define.node('events.remove',   function (type, handle, id) {
                        return DOM().remove(this.target, type, handle, id);
                    });
                    flex.callers.define.node('events.call',     function (type) {
                        return DOM().call(this.target, type);
                    });
                    //_nodes
                    flex.callers.define.nodes('events.add',     function (type, handle, id, touch) {
                        Array.prototype.forEach.call(this.target, function (target) {
                            DOM().add(target, type, handle, id, touch);
                        });
                    });
                    flex.callers.define.nodes('events.remove',  function (type, handle, id) {
                        Array.prototype.forEach.call(this.target, function (target) {
                            DOM().remove(target, type, handle, id);
                        });
                    });
                    flex.callers.define.nodes('events.call',    function (type) {
                        Array.prototype.forEach.call(this.target, function (target) {
                            DOM().call(target, type);
                        });
                    });
                }
            };
            //Initialization of callers
            callers.init();
            //Public part
            privates    = {
                DOMEvents: DOM,
            };
            return {
                DOMEvents: privates.DOMEvents
            };
        };
        flex.modules.attach({
            name            : 'events',
            protofunction   : protofunction,
        });
    }
}());
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
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright � 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
* This file (core / module) is released under the Apache License (Version 2.0). See [LICENSE] file for details.    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/// <reference path='intellisense/flex.callers.node.intellisense.js' />
/// <reference path='intellisense/flex.callers.nodes.intellisense.js' />
/// <reference path='intellisense/flex.callers.object.intellisense.js' />
/// <reference path="intellisense/flex.intellisense.js" />
/// <module>
///     <summary>
///         Module define class Array with binding features.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            var privates        = null,
                ExArray         = null;
            ExArray     = function (defaults) {
                var self        = this,
                    original    = [],
                    handles     = {
                        'set'       : {},
                        'add'       : {},
                        'remove'    : {}
                    },
                    aliases     = {
                        'set'   : ['update'],
                        'add'   : ['add', 'new', 'push', 'unshift'],
                        'remove': ['remove', 'del', 'delete', 'shift', 'pop'],
                    },
                    errors      = {
                        WRONG_EVENT_NAME        : '0000: WRONG_EVENT_NAME',
                        HANDLE_ISNOT_FUNCTION   : '0001: HANDLE_ISNOT_FUNCTION',
                        SAME_ID_OF_HANDLE       : '0002: SAME_ID_OF_HANDLE',
                        HANDLE_OR_ID_SHOULD_BE  : '0003: HANDLE_OR_ID_SHOULD_BE',
                        INVALID_LENGTH          : '0004: INVALID_LENGTH'
                    };
                function getEventName(type) {
                    var result = handles[type] !== void 0 ? type : null;
                    if (result === null) {
                        for (var key in aliases) {
                            if (aliases[key].indexOf(type) !== -1) {
                                result = key;
                                break;
                            }
                        }
                    }
                    return result;
                }
                function executeHandles(event) {
                    _object(handles[event.type]).forEach(function (id, handle) {
                        handle.call(self, event);
                    });
                }
                function setIndex(index) {
                    if (self[index] === void 0) {
                        Object.defineProperty(self, index, {
                            configurable: true,
                            enumerable  : true,
                            get         : function () {
                                return original[index];
                            },
                            set         : function (value) {
                                original[index] = value;
                                executeHandles({
                                    type    : 'set',
                                    index   : index,
                                    item    : value
                                });
                            }
                        });
                    }
                }
                function delIndex(index) {
                    if (self[index] === void 0) {
                        delete self[index];
                    }
                }
                Object.defineProperty(self, "getOriginal", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function () {
                        return original;
                    }
                });
                Object.defineProperty(self, "bind", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function (type, handle, id) {
                        type = getEventName(type);
                        if (type !== null) {
                            if (typeof handle === 'function') {
                                id = typeof id === 'string' ? id : flex.unique();
                                if (handles[type][id] === void 0) {
                                    handles[type][id] = handle;
                                } else {
                                    throw new Error(errors.SAME_ID_OF_HANDLE);
                                }
                            } else {
                                throw new Error(errors.HANDLE_ISNOT_FUNCTION);
                            }
                        } else {
                            throw new Error(errors.WRONG_EVENT_NAME);
                        }
                    }
                });
                Object.defineProperty(self, "unbind", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function (type, handle_or_id) {
                        type = getEventName(type);
                        if (type !== null) {
                            if (typeof handle_or_id === 'function') {
                                for (var id in handles[type]) {
                                    if (handles[type][id] === handle_or_id) {
                                        delete handles[type][id];
                                        return true;
                                    }
                                }
                                return false;
                            } else if (typeof handle_or_id === 'string') {
                                if (handles[type][handle_or_id] !== void 0) {
                                    delete handles[type][handle_or_id];
                                    return true;
                                }
                                return false;
                            } else {
                                throw new Error(errors.HANDLE_OR_ID_SHOULD_BE);
                            }
                        } else {
                            throw new Error(errors.WRONG_EVENT_NAME);
                        }
                    }
                });
                Object.defineProperty(self, "pop", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function () {
                        if (original.length > -1) {
                            var item = original.pop();
                            delIndex(original.length);
                            executeHandles({
                                type    : "remove",
                                index   : original.length,
                                item    : item,
                                count   : 1
                            });
                            return item;
                        }
                    }
                });
                Object.defineProperty(self, "push", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function () {
                        var added = Array.prototype.filter.call(arguments, function () { return true; }),
                            start = original.length;
                        if (added.length > 0) {
                            added.forEach(function (item) {
                                original.push(item);
                                setIndex(original.length - 1);
                            });
                            executeHandles({
                                type    : "add",
                                index   : start,
                                item    : added,
                                count   : added.length
                            });
                        }
                        return original.length;
                    }
                });
                Object.defineProperty(self, "unshift", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function () {
                        var added = Array.prototype.filter.call(arguments, function () { return true; });
                        if (added.length > 0) {
                            added.forEach(function (item, index) {
                                original.splice(index, 0, item);
                                setIndex(index);
                            });
                            executeHandles({
                                type    : "add",
                                index   : 0,
                                item    : added,
                                count   : added.length
                            });
                        }
                        return original.length;
                    }
                });
                Object.defineProperty(self, "shift", {
                    configurable: false,
                    enumerable  : false,
                    writable    : false,
                    value       : function () {
                        var item = null;
                        if (original.length > 0) {
                            item = original.shift();
                            delIndex(original.length);
                            executeHandles({
                                type    : "remove",
                                index   : 0,
                                item    : item,
                                count   : 1
                            });
                            return item;
                        }
                    }
                });
                Object.defineProperty(self, "splice", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function (start, count /*, item_0, item_1, ... item_n */) {
                        var added   = [],
                            removed = [],
                            item    = null;
                        start   = start !== void 0 ? (start > original.length - 1 ? original.length : start) : 0;
                        start   = start < 0 ? original.length + start : start;
                        count   = count !== void 0 ? count : original.length - start;
                        removed = original.splice(start, count);
                        if (removed.length > 0) {
                            executeHandles({
                                type    : "remove",
                                index   : start,
                                item    : removed,
                                count   : removed.length
                            });
                            for (var i = removed.length - 1; i >= 0; i -= 1) {
                                delIndex(original.length + i);
                            }
                        }
                        added = Array.prototype.slice.call(arguments, 2, arguments.length);
                        if (added.length > 0) {
                            added.forEach(function (item, index) {
                                original.splice(start + index, 0, item);
                                setIndex(original.length - 1);
                            });
                            executeHandles({
                                type    : "add",
                                index   : start,
                                item    : added,
                                count   : added.length
                            });
                        }
                        return removed;
                    }
                });
                Object.defineProperty(self, "fill", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function (value, start, end) {
                        var O               = Object(original),
                            start           = start === void 0 ? 0 : start,
                            end             = end === void 0 ? original.length : end,
                            len             = O.length >>> 0,
                            relativeStart   = start >> 0,
                            k               = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len),
                            relativeEnd     = end === undefined ? len : end >> 0,
                            final           = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
                        while (k < final) {
                            O[k] = value;
                            executeHandles({
                                type    : "set",
                                index   : k,
                                item    : value
                            });
                            k++;
                        }
                        return O;
                    }
                });
                Object.defineProperty(self, "length", {
                    configurable: false,
                    enumerable  : false,
                    get         : function () {
                        return original.length;
                    },
                    set         : function (value) {
                        var n = Number(value);
                        if (n % 1 === 0 && n >= 0) {
                            if (n < original.length) {
                                self.splice(n);
                            } else if (n > original.length) {
                                self.push.apply(self, new Array(n - original.length));
                            }
                        } else {
                            throw new RangeError(errors.INVALID_LENGTH);
                        }
                        return value;
                    }
                });
                Object.defineProperty(self, "concat", {
                    configurable    : false,
                    enumerable      : false,
                    writable        : false,
                    value           : function (/*, item_0, item_1, ... item_n */) {
                        var res = [].concat(original);
                        for (var i = 0, ln = arguments.length; i < ln; i++) {
                            if (arguments[i] instanceof Array) {
                                res = res.concat(arguments[i]);
                            } else if (arguments[i] instanceof ExArray) {
                                res = res.concat(arguments[i].getOriginal());
                            } else {
                                res.push(arguments[i]);
                            }
                        }
                        return new ExArray(res);
                        //return res;
                    }
                });
                Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
                    if (self[name] === void 0) {
                        Object.defineProperty(self, name, {
                            configurable: false,
                            enumerable  : false,
                            writable    : false,
                            value       : Array.prototype[name]
                        });
                    }
                });
                if (defaults instanceof Array) {
                    self.push.apply(self, defaults);
                }
            };
            privates    = {
                ExArray: ExArray
            };
            return {
                ExArray: privates.ExArray
            };
        };
        flex.modules.attach({
            name            : 'types.array',
            protofunction   : protofunction
        });
    }
}());

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright � 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
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
    /*TODO:
    - save ready template as object (with marks only) - is it possible?
    - add modele, DOM, resources into controller
    */
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
                    CONDITIONS              : /<!--[\w_]*=.{1,}-->/gi,
                    CONDITION_CONTENT       : '<!--[open]-->(\\n|\\r|\\s|.)*?<!--[close]-->',
                    CONDITION_CONTENT_ANY   : '<!--[open]=.{1,}-->(\\n|\\r|\\s|.)*?<!--[close]-->',
                    STRING_CON              : /".*?"/gi,
                    STRING_CON_STR          : '".*"',
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
                    SETINSTNCE  : 'setInstance'
                },
                other           : {
                    SUBLEVEL_BEGIN          : '_',
                    SUBLEVEL_END            : '_',
                    BIND_PREFIX             : '$$',
                    DOM_PREFIX              : '$',
                    PARENT_MARK_HTML        : '##parent##',
                    ANCHOR                  : 'ANCHOR::',
                    EVENTS_HANDLE_ID        : 'flex_patterns_listener_handle_id',
                    CACHE_PATTERNS_PREFIX   : 'PATTERNS_CACHE:'
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
                                    attrs = html.match(new RegExp(settings.css.attrs.CONDITION + '=' + settings.regs.STRING_CON_STR, 'gi'));
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
                            processing.fix();
                            processing.hooks.find();
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
                                } else if (hooks instanceof Object) {
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
                                            if (_hooks[prop] !== void 0 && !(_hooks[prop] instanceof settings.classes.CALLER) && !(_hooks[prop] instanceof Object)) {
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
                                        } else if (val instanceof Object) {
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
                                        } else if (val instanceof Object) {
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
                                            if (model instanceof Object) {
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
                                            if (model instanceof Object) {
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
                                } else if (model instanceof Object) {
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
                                    conditions  = conditions instanceof Object ? conditions : false,
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
                            var html    = false,
                                cached  = null,
                                ref     = null,
                                _ref    = (parent === false ? '' : parent + '.') + settings.other.SUBLEVEL_BEGIN + name + settings.other.SUBLEVEL_END;
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
                                conditions  = conditions instanceof Object ? conditions : false,
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
                                } else if (hooks instanceof Object) {
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
                            var cache = privates.cache.regs;
                            if (typeof value === 'object') {
                                _object(getProps(name, value)).forEach(function (name, value) {
                                    fragment = hooks.insert(name, value, fragment);
                                });
                                return fragment;
                            } else {
                                cache[name] = cache[name] === void 0 ? new RegExp(settings.regs.HOOK_OPEN + name + settings.regs.HOOK_CLOSE, 'gi') : cache[name];
                                return fragment.replace(cache[name], hooks.getValue(name, value));
                                //return fragment.replace(cache[name], '<!--BEGIN-->' + hooks.getValue(name, value) + '<!--END-->');
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
                                var treeWalker = document.createTreeWalker(
                                        privates.wrapper,
                                        NodeFilter.SHOW_COMMENT,
                                        { acceptNode: function (node) { return ~(node.nodeValue.indexOf(settings.other.ANCHOR)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } },
                                        false
                                    ),
                                    nodeList    = [],
                                    anchors     = {};
                                while (treeWalker.nextNode()) {
                                    nodeList.push(treeWalker.currentNode);
                                }
                                nodeList.forEach(function (node) {
                                    var anchor  = document.createTextNode(''),
                                        ref     = node.nodeValue.replace(settings.other.ANCHOR, '');
                                    anchors[ref] === void 0 && (anchors[ref] = []);
                                    anchors[ref].push(anchor);
                                    node.parentNode.insertBefore(anchor, node);
                                    node.parentNode.removeChild(node);
                                });
                                privates.map.anchors = anchors;
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
                                        cache.removed[open]     = cache.removed[open]   !== void 0 ? cache.removed[open]    : new RegExp('<\\!--' + ref.replace('.', '\\.') + '=.{1,}' + '-->', 'gi');
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
                                        if (hooks instanceof settings.classes.CALLER || hooks instanceof Object || helpers.isArray(hooks)) {
                                            process(hooks,
                                                    model !== null ? (model[index] !== void 0 ? model[index] : null) : null,
                                                    _controller,
                                                    exchange);
                                        }
                                    });
                                } else if (hooks instanceof Object && !helpers.isArray(hooks)) {
                                    if (_controller !== null) {
                                        controller.handle(_controller, model, exchange, update);
                                    }
                                    _object(hooks).forEach(function (name, hooks) {
                                        var ref = name;
                                        if (hooks instanceof settings.classes.CALLER) {
                                            ref = settings.other.SUBLEVEL_BEGIN + name + settings.other.SUBLEVEL_END;
                                        }
                                        if (hooks instanceof settings.classes.CALLER || hooks instanceof Object || helpers.isArray(hooks)) {
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
                            } else if (handle instanceof Object) {
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
                            model.finalize();
                            dom.indexes();
                            condition.apply();
                            controller.apply(update);
                            controller.events();
                            html.map();
                        },
                        build   : function () {
                            cache.reset();
                            hash.setHash();
                            condition.find();
                            controller.init();
                            mapping.refs();
                            methods.make(false);
                            controller.handle(privates.caller.onReady, privates.map.model, privates.caller.exchange);
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
                                    if (hooks instanceof Object) {
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
                        inHooks    : function (hooks) {
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
                            if (map !== null && map instanceof Object) {
                                _object(map).forEach(function (prop, val) {
                                    var url = null;
                                    if (val !== null && val instanceof Object) {
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
                                Array.prototype.forEach.call(nodes, function (node) {
                                    if (!privates.replace) {
                                        parent.appendChild(node);
                                    } else {
                                        parent.parentNode.insertBefore(node, parent);
                                    }
                                });
                                if (privates.replace) {
                                    parent.parentNode.removeChild(parent);
                                }
                                !~context.indexOf(parent.parentNode) && context.push(parent.parentNode);
                            });
                        } else if (privates.before !== null && privates.before.parentNode !== void 0 && privates.before.parentNode !== null) {
                            Array.prototype.forEach.call(privates.before, function (parent) {
                                Array.prototype.forEach.call(nodes, function (node) {
                                    parent.parentNode.insertBefore(node, privates.before);
                                });
                                !~context.indexOf(parent.parentNode) && context.push(parent.parentNode);
                            });
                        } else if (privates.after !== null && privates.after.parentNode !== void 0 && privates.after.parentNode !== null) {
                            Array.prototype.forEach.call(privates.after, function (parent) {
                                var _before = parent.nextSibling !== void 0 ? parent.nextSibling : null;
                                if (_before !== null) {
                                    Array.prototype.forEach.call(nodes, function (node) {
                                        _before.parentNode.insertBefore(node, _before);
                                    });
                                } else {
                                    Array.prototype.forEach.call(nodes, function (node) {
                                        parent.parentNode.appendChild(node);
                                    });
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
                    render      = function () {
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
                        function onSuccess(sources) {
                            //Check addition references
                            checkAdditionRefs(function () {
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
                                    }).build();
                                    mount();
                                    return true;
                                }
                            });
                        };
                        function onFail() {
                            flex.logs.log(signature() + logs.caller.CANNOT_INIT_PATTERN, flex.logs.types.CRITICAL);
                            privates.onReady(null, logs.caller.CANNOT_INIT_PATTERN, self.url);
                            throw logs.caller.CANNOT_INIT_PATTERN;
                        };
                        patterns.inHooks();
                        patterns.inMap();
                        Source.init(privates.patterns, onSuccess, onFail);
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
                                                                { name: 'hooks',                type: ['object', 'array'],                          value: null         },
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
                    NODE_LIST   : function(nodeList){
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
                }
            };
            layout          = {
                journal: {
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
                        hooks_set   = hooks_set instanceof Array ? hooks_set.concat(getHooksSet(pattern)) : getHooksSet(pattern);
                    single  = single ? (hooks_set.length === 1 ? hooks_set[0] : false) : false;
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
                isArray     : function(arr) { return arr instanceof Array ? true : arr instanceof ExArray;},
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
                    function getParent (child_tag) {
                        if (typeof child_tag === 'string') {
                            if (settings.compatibility.CHILD_TO_PARENT[child_tag] !== void 0) {
                                return document.createElement(settings.compatibility.CHILD_TO_PARENT[child_tag]);
                            } else {
                                return document.createElement(settings.compatibility.BASE);
                            }
                        } else {
                            return null;
                        }
                    };
                    function getTag(html) {
                        var tag = html.match(settings.regs.FIRST_TAG);
                        if (tag !== null) {
                            if (tag.length === 1) {
                                return tag[0].replace(settings.regs.TAG_BORDERS, '').replace(/\s/gi, '').match(settings.regs.FIRST_WORD)[0].toLowerCase()
                            }
                        }
                        return null;
                    }
                    var tag = getTag(html);
                    if (tag !== null){
                        return getParent(tag);
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
                layout      : layout.init
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
                layout  : privates.layout
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
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright © 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
* This file (core / module) is released under the Apache License (Version 2.0). See [LICENSE] file for details.    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
flex.init({
    resources               : {
        MODULES             : ['flex.ui.patterns'],
        USE_STORAGED        : true,
    },
    settings                : {
        CHECK_PATHS_IN_CSS  : true
    },
    logs                    : {
        SHOW                : ['CRITICAL']
    }
});