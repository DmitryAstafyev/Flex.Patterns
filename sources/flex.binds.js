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