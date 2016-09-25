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
                //Variables
                initializer     = null,
                render          = null,
                borders         = null,
                coreEvents      = null,
                privates        = null,
                settings        = null;
            settings = {
                /*
                Template of arearesizer container
                <div data-flex-ui-arearesizer="Container">
                </div>

                Template of arearesizer area
                <div data-flex-ui-arearesizer="Area">
                </div>
                */
                layouts     : {
                    BOX         : { node: 'DIV', attrs: [{ name: 'data-flex-ui-arearesizer', value: 'Container'    }, { name: 'data-flex-ui-arearesizer-group',   value: 'id' }] },
                    AREA        : { node: 'DIV', attrs: [{ name: 'data-flex-ui-arearesizer', value: 'Area' }, { name: 'data-flex-ui-arearesizer-area', value: 'id' }] },
                    borders: {
                        HORIZONTAL  : { node: 'DIV', attrs: [{ name: 'data-flex-ui-arearesizer', value: 'BorderTop' }] },
                        VERTICAL    : { node: 'DIV', attrs: [{ name: 'data-flex-ui-arearesizer', value: 'BorderLeft' }] },
                    }
                },
                storage     : {
                    GLOBAL      : 'flex.ui.arearesizer.group',
                    PARAMETERS  : 'flex.ui.arearesizer.parameters'
                },
                attrs       : {
                    GROUP_ID    : 'data-flex-ui-arearesizer-group',
                    ITEM_ID     : 'data-flex-ui-arearesizer-area',
                    ITEM_ORDER  : 'data-flex-ui-arearesizer-order',
                    ITEM_SIZE   : 'data-flex-ui-arearesizer-size',
                },
                directions  : {
                    ROW     : 'row',
                    COLUMN  : 'column'
                }
            };
            initializer = {
                validate: {
                    parameters  : function (parameters) {
                        return flex.oop.objects.validate(parameters, [  { name: 'parent',       type: ['node', 'string'],   value: null, handle: html.helpers.validateNode  },
                                                                        { name: 'content',      type: ['node', 'string'],   value: null, handle: html.helpers.validateNode  },
                                                                        { name: 'events',       type: 'object',             value: {} },
                                                                        { name: 'unfix',        type: 'string',             value: 'columns', values: ['columns', 'rows'] },
                                                                        { name: 'id',           type: 'string',             value: flex.unique()    }]);
                    },
                    events      : function (events) {
                        return flex.oop.objects.validate(events, [{ name: 'resize', type: 'function', value: null }]);
                    },
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
                        parameters.id                           = getItemID(parameters);
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
                                //Calculate size
                                render.sizes.calc(parameters);
                                //Update (render) sizes
                                render.sizes.update(parameters);
                                //Save parameters 
                                storage[parameters.id] = parameters;
                                //Init border
                                borders.init(parameters);
                                //Attach window resize event
                                coreEvents.attach(parameters);
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
                    //Get/set sizes
                    render.sizes.get(parameters);
                    //Do migration
                    Array.prototype.forEach.call(
                        parameters.content.childNodes,
                        function (childNode) {
                            var content = null,
                                id      = getItemID(childNode);
                            if (childNode.nodeName.toLowerCase() !== '#text' && id !== null) {
                                settings.layouts.AREA.attrs[1].value    = id;
                                content                                 = builder.build(settings.layouts.AREA);
                                html.helpers.appendChilds       (content, childNode.childNodes);
                                parameters.container.appendChild(content);
                                removed             .push       (childNode);
                                areas[id] = {
                                    id      : id,
                                    content : content,
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
                    //Define sizes
                    render.sizes.set(parameters);
                },
                ordering    : {
                    defaults: function (parameters) {
                        var order = [],
                            index = 0;
                        Array.prototype.forEach.call(
                            parameters.content.childNodes,
                            function (childNode) {
                                if (childNode.nodeName.toLowerCase() !== '#text') {
                                    order.push({ column: index++, row: 0, columns: 1, rows: 1 });
                                }
                            }
                        );
                        return order;
                    },
                    get     : function (parameters) {
                        function parseValue(value) {
                            //data-flex-ui-arearesizer-order="column,row,width(columns),height(rows)"
                            value = value.split(',');
                            if (value.length === 4) {
                                try {
                                    value[0] = parseInt(value[0], 10);
                                    value[1] = parseInt(value[1], 10);
                                    value[2] = parseInt(value[2], 10);
                                    value[3] = parseInt(value[3], 10);
                                    if (value[0] < 0 || value[1] < 0 || value[2] < 0 || value[3] < 0) { return false; }
                                } catch (e) {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                            return { column: value[0], row: value[1], columns: value[2], rows: value[3] };
                        };
                        var ordering = [];
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
                                                ordering.push(value);
                                            } else {
                                                throw 'finish';
                                            }
                                        }
                                    }
                                }
                            );
                        } catch (e) {
                            ordering = render.ordering.defaults(parameters);
                        }
                        ordering = {
                            all         : ordering,
                            rows        : 0,
                            columns     : 0
                        };
                        parameters.ordering = ordering;
                        render.ordering.update.count(parameters);
                    },
                    set     : function (parameters) {
                        for (var id in parameters.areas) {
                            if (!parameters.areas[id].column) {
                                parameters.areas[id].column     = parameters.ordering.all[parameters.areas[id].index].column;
                                parameters.areas[id].row        = parameters.ordering.all[parameters.areas[id].index].row;
                                parameters.areas[id].columns    = parameters.ordering.all[parameters.areas[id].index].columns;
                                parameters.areas[id].rows       = parameters.ordering.all[parameters.areas[id].index].rows;
                                //Save id
                                parameters.ordering.all[parameters.areas[id].index].id = id;
                            }
                        }
                    },
                    add     : function (parameters, params) {
                        if (params.column === null || params.row === null || params.columns === null || params.rows === null) {
                            //Position undefined
                            params.column   = 0;
                            params.columns  = parameters.ordering.columns;
                            params.row      = parameters.ordering.rows;
                            params.rows     = 1;
                        }
                        if (params.column <= parameters.ordering.columns && params.row <= parameters.ordering.rows) {
                            parameters.ordering.all.push({
                                column  : params.column,
                                row     : params.row,
                                columns : params.columns,
                                rows    : params.rows,
                            });
                            render.ordering.update.count(parameters);
                            return true;
                        }
                        return false;
                    },
                    update  : {
                        count   : function (parameters) {
                            parameters.ordering.all.forEach(function (area) {
                                parameters.ordering.columns = parameters.ordering.columns   < area.column   + area.columns  ? area.column   + area.columns  : parameters.ordering.columns;
                                parameters.ordering.rows    = parameters.ordering.rows      < area.row      + area.rows     ? area.row      + area.rows     : parameters.ordering.rows;
                            });
                        }
                    }
                },
                sizes           : {
                    defaultPercent  : function (parameters, property, columns, rows) {
                        return {
                            value   : ((100 / (property === 'w' ? parameters.ordering.columns : parameters.ordering.rows)) * (property === 'w' ? columns : rows)),
                            unit    : '%'
                        }
                    },
                    defaults        : function (parameters) {
                        var sizes = [];
                        parameters.ordering.all.forEach(function (area) {
                            sizes.push({
                                def: {
                                    w: render.sizes.defaultPercent(parameters, 'w', area.columns, area.rows),
                                    h: render.sizes.defaultPercent(parameters, 'w', area.columns, area.rows)
                                },
                                min: { w: false, h: false },
                                max: { w: false, h: false }
                            });
                        });
                        return sizes;
                    },
                    validate        : function (parameters) {
                        function setProperty(parameters, index, key, metric) {
                            var property = metric === 'w' ? 'columns' : 'rows';
                            parameters.sizes[index][key][metric] = {
                                value   : ((100 / parameters.ordering[property]) * parameters.ordering.all[index][property]),
                                unit    : '%'
                            };
                        };
                        parameters.sizes.forEach(function (area, index) {
                            if (area.def.w === false) {
                                setProperty(parameters, index, 'def', 'w');
                            }
                            if (area.def.h === false) {
                                setProperty(parameters, index, 'def', 'h');
                            }
                            if (parameters.ordering.all[index].columns === parameters.ordering.columns) {
                                //area takes full width and cannot have not min, not max width
                                parameters.sizes[index].min.w = false;
                                parameters.sizes[index].max.w = false;
                            }
                            if (parameters.ordering.all[index].rows === parameters.ordering.rows) {
                                //area takes full height and cannot have not min, not max height
                                parameters.sizes[index].min.h = false;
                                parameters.sizes[index].max.h = false;
                            }
                        });
                    },
                    normalize       : function (parameters){
                        function setupBasis(parameters) {
                            function getProcent(parameters, direction, value) {
                                var result = 0;
                                parameters.ordering.all.forEach(function (area, index) {
                                    if ((area[direction] === value) ||
                                        (area[direction] < value && area[direction] + area[direction + 's'] > value)) {
                                        if (parameters.sizes[index].def[direction === settings.directions.ROW ? 'w' : 'h'].unit === '%') {
                                            result += parameters.sizes[index].def[direction === settings.directions.ROW ? 'w' : 'h'].value;
                                        }
                                    }
                                });
                                return result;
                            }
                            var basis = { width: {}, height: {} };
                            parameters.ordering.all.forEach(function (area) {
                                if (!basis.width[area.row]) {
                                    basis.width[area.row] = getProcent(parameters, settings.directions.ROW, area.row);
                                }
                                if (!basis.height[area.column]) {
                                    basis.height[area.column] = getProcent(parameters, settings.directions.COLUMN, area.column);
                                }
                            });
                            return basis;
                        };
                        function correct(parameters, fields, property, index, basis) {
                            if (parameters.sizes[index][fields][property].unit === '%') {
                                parameters.sizes[index][fields][property].value = (parameters.sizes[index][fields][property].value / basis) * 100;
                            }
                        };
                        var basis = setupBasis(parameters);
                        parameters.ordering.all.forEach(function (area, index) {
                            correct(parameters, 'def', 'w', index, basis.width[area.row]);
                            correct(parameters, 'max', 'w', index, basis.width[area.row]);
                            correct(parameters, 'min', 'w', index, basis.width[area.row]);
                            correct(parameters, 'def', 'h', index, basis.height[area.column]);
                            correct(parameters, 'max', 'h', index, basis.height[area.column]);
                            correct(parameters, 'min', 'h', index, basis.height[area.column]);
                        });
                    },
                    parser          : {
                        unit    : function (value) {
                            var result = { unit: 'px', value: 0 };
                            try {
                                if (typeof value === 'string' || typeof value === 'number') {
                                    result.value = parseInt(value, 10);
                                    if (typeof result.value === 'number' && result.value > 0) {
                                        if (value.indexOf('%') !== -1) {
                                            result.unit = '%';
                                        } else if (value.indexOf('em') !== -1) {
                                            result.value = result.value * units.em();
                                        } else if (value.indexOf('rem') !== -1) {
                                            result.value = result.value * units.rem();
                                        }
                                        return result;
                                    }
                                }
                            } catch (e) { }
                            return false;
                        },
                        attr    : function (value) {
                            //data-flex-ui-arearesizer-size="(default-width,default-height);(min-width,min-height);(max-width,max-height)"
                            var units   = html.units(),
                                values  = { def: { w: 0, h: 0 }, min: { w: 0, h: 0 }, max: { w: 0, h: 0 } };
                            value = value.split(';');
                            if (value.length === 3) {
                                try {
                                    value[0] = value[0].replace(/[\(\)]/gi, '').split(',');
                                    value[1] = value[1].replace(/[\(\)]/gi, '').split(',');
                                    value[2] = value[2].replace(/[\(\)]/gi, '').split(',');
                                    if (value[0].length !== 2 || value[1].length !== 2 || value[2].length !== 2) { return false; }
                                    values.def = {
                                        w: render.sizes.parser.unit(value[0][0]),
                                        h: render.sizes.parser.unit(value[0][1]),
                                    };
                                    values.min = {
                                        w: render.sizes.parser.unit(value[1][0]),
                                        h: render.sizes.parser.unit(value[1][1]),
                                    };
                                    values.max = {
                                        w: render.sizes.parser.unit(value[2][0]),
                                        h: render.sizes.parser.unit(value[2][1]),
                                    };
                                } catch (e) {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                            return values;
                        }
                    },
                    get             : function (parameters) {
                        var sizes = [];
                        try {
                            Array.prototype.forEach.call(
                                parameters.content.childNodes,
                                function (childNode) {
                                    var sizes_defined   = null,
                                        value           = null;
                                    if (childNode.nodeName.toLowerCase() !== '#text') {
                                        sizes_defined = childNode.getAttribute(settings.attrs.ITEM_SIZE);
                                        if (sizes_defined === null && sizes_defined === '') {
                                            throw 'finish';
                                        } else {
                                            value = render.sizes.parser.attr(sizes_defined);
                                            if (value !== false) {
                                                sizes.push(value);
                                            } else {
                                                throw 'finish';
                                            }
                                        }
                                    }
                                }
                            );
                            if (sizes.length === parameters.ordering.all.length) {
                                parameters.sizes = sizes;
                            } else {
                                parameters.sizes = render.sizes.defaults(parameters);
                            }
                        } catch (e) {
                            parameters.sizes = render.sizes.defaults(parameters);
                        }
                        render.sizes.validate   (parameters);
                        render.sizes.normalize  (parameters);
                    },
                    set             : function (parameters) {
                        for (var id in parameters.areas) {
                            parameters.areas[id].size = parameters.sizes[parameters.areas[id].index];
                        }
                        //Clear temporary property
                        parameters.sizes = null;
                        delete parameters.sizes;
                    },
                    calc            : function (parameters) {
                        function setup(parameters, id, property, basis) {
                            if (parameters.areas[id].size.def[property].unit === '%') {
                                parameters.areas[id].size.def[property].px = (parameters.areas[id].size.def[property].value / 100) * basis;
                            } else {
                                parameters.areas[id].size.def[property].px = parameters.areas[id].size.def[property].value;
                            }
                        };
                        function setupBasis(parameters) {
                            function getFixed(parameters, direction, value) {
                                var result = 0;
                                for (var id in parameters.areas) {
                                    if ((parameters.areas[id][direction] === value) ||
                                        (parameters.areas[id][direction] < value && parameters.areas[id][direction] + parameters.areas[id][direction + 's'] > value)) {
                                        if (parameters.areas[id].size.def[direction === settings.directions.ROW ? 'w' : 'h'].unit !== '%') {
                                            result += parameters.areas[id].size.def[direction === settings.directions.ROW ? 'w' : 'h'].value;
                                        }
                                    }
                                }
                                return result;
                            }
                            var Size    = html.size(),
                                size    = Size.node(parameters.container),
                                basis   = { width : {}, height: {} };
                            parameters.ordering.all.forEach(function (area) {
                                if (!basis.width[area.row]) {
                                    basis.width[area.row] = size.width - getFixed(parameters, settings.directions.ROW, area.row);
                                }
                                if (!basis.height[area.column]) {
                                    basis.height[area.column] = size.height - getFixed(parameters, settings.directions.COLUMN, area.column);
                                }
                            });
                            return basis;
                        };
                        var basis = setupBasis(parameters);
                        for (var id in parameters.areas) {
                            setup(parameters, id, 'w', basis.width[parameters.areas[id].row]);
                            setup(parameters, id, 'h', basis.height[parameters.areas[id].column]);
                        }
                    },
                    update          : function (parameters) {
                        function getMetricBy(parameters, direction, value, control) {
                            var key         = direction + '_' + value + '_' + control,
                                _direction  = direction === settings.directions.COLUMN ? settings.directions.ROW : settings.directions.COLUMN;
                            if (!cache[key]) {
                                cache[key] = 0;
                                for (var id in parameters.areas) {
                                    if (parameters.areas[id][direction] < value && (parameters.areas[id][_direction] <= control && (parameters.areas[id][_direction] + parameters.areas[id][_direction + 's']) > control)) {
                                        cache[key] += parameters.areas[id].size.def[direction === settings.directions.COLUMN ? 'w' : 'h'].px;
                                    }
                                }
                            }
                            return cache[key];
                        };
                        var left        = null,
                            top         = null,
                            cache       = {};
                        for (var id in parameters.areas) {
                            parameters.areas[id].size.def.l             = { px: getMetricBy(parameters, settings.directions.COLUMN,   parameters.areas[id].column,    parameters.areas[id].row    ) };
                            parameters.areas[id].size.def.t             = { px: getMetricBy(parameters, settings.directions.ROW,      parameters.areas[id].row,       parameters.areas[id].column ) };
                            parameters.areas[id].content.style.left     = parameters.areas[id].size.def.l.px + 'px';
                            parameters.areas[id].content.style.width    = parameters.areas[id].size.def.w.px + 'px';
                            parameters.areas[id].content.style.top      = parameters.areas[id].size.def.t.px + 'px';
                            parameters.areas[id].content.style.height   = parameters.areas[id].size.def.h.px + 'px';
                        }
                    },
                    save            : function (parameters, collection) {
                        function correction(parameters, recalc) {
                            function proceed(parameters, recalc, direction, size) {
                                var excluded    = 0,
                                    property    = direction === settings.directions.ROW ? 'w' : 'h';
                                recalc[direction + 's'].forEach(function (item) {
                                    for (var id in parameters.areas) {
                                        if (parameters.areas[id][direction] === item) {
                                            if (parameters.areas[id].size.def[property].unit !== '%') {
                                                excluded += parameters.areas[id].size.def[property].px;
                                            }
                                        }
                                    }
                                    for (var id in parameters.areas) {
                                        if (parameters.areas[id][direction] === item) {
                                            if (parameters.areas[id].size.def[property].unit === '%') {
                                                parameters.areas[id].size.def[property].value = (parameters.areas[id].size.def[property].px / (size - excluded)) * 100;
                                            }
                                        }
                                    }
                                });
                            };
                            var size = null;
                            if (recalc.columns.length > 0 || recalc.rows.length > 0) {
                                size = html.size().node(parameters.container),
                                proceed(parameters, recalc, settings.directions.ROW, size.width);
                                proceed(parameters, recalc, settings.directions.COLUMN, size.height);
                            }
                        };
                        var recalc = { columns: [], rows: [] };
                        for (var id in parameters.movement.sizes) {
                            if (parameters.areas[id].size.def.w.unit !== '%') {
                                parameters.areas[id].size.def.w.value   = parameters.movement.sizes[id].width;
                            } else {
                                if (parameters.areas[id].size.def.w.value !== 100) {
                                    parameters.areas[id].size.def.w.value = parameters.areas[id].size.def.w.value * (parameters.movement.sizes[id].width / parameters.movement.sizes[id]._width);
                                    if (recalc.rows.indexOf(parameters.areas[id].row) === -1) {
                                        recalc.rows.push(parameters.areas[id].row);
                                    }
                                }
                            }
                            if (parameters.areas[id].size.def.h.unit !== '%') {
                                parameters.areas[id].size.def.h.value   = parameters.movement.sizes[id].height;
                            } else {
                                if (parameters.areas[id].size.def.h.value !== 100) {
                                    parameters.areas[id].size.def.h.value = parameters.areas[id].size.def.h.value * (parameters.movement.sizes[id].height / parameters.movement.sizes[id]._height);
                                    if (recalc.columns.indexOf(parameters.areas[id].column) === -1) {
                                        recalc.columns.push(parameters.areas[id].column);
                                    }
                                }
                            }
                            parameters.areas[id].size.def.w.px = parameters.movement.sizes[id].width;
                            parameters.areas[id].size.def.h.px = parameters.movement.sizes[id].height;
                        }
                        //correction(parameters, recalc);
                        return true;
                    },
                    add             : function (parameters, params) {
                        function getSizeFor(parameters, area_id, direction, value) {
                            for (var id in parameters.areas) {
                                if (id !== area_id) {
                                    if (value >= parameters.areas[id][direction] && value < parameters.areas[id][direction]) {

                                    }
                                }
                            }
                        };
                        var properies   = { size: 'def', minSize: 'min', maxSize: 'max' },
                            size        = { def: { w: 0, h: 0 }, min: { w: 0, h: 0 }, max: { w: 0, h: 0 } };
                        //Parsing sizes
                        ['size', 'minSize', 'maxSize'].forEach(function (property) {
                            if (params[property] !== false) {
                                ['width', 'height'].forEach(function (metric) {
                                    params[property][metric]  += typeof params[property][metric] === 'number' ? 'px' : '';
                                    size[properies[property]][metric[0]] = render.sizes.parser.unit(params[property][metric]);
                                });
                            }
                        });
                        size.def.w = size.def.w === false ? render.sizes.defaultPercent(parameters, 'w', params.position.columns, params.position.rows) : size.def.w;
                        size.def.h = size.def.h === false ? render.sizes.defaultPercent(parameters, 'h', params.position.columns, params.position.rows) : size.def.h;
                        if (params.position.column <= parameters.ordering.columns - 1 && params.position.row <= parameters.ordering.rows - 1) {
                            //Area are inserted

                        } else {
                            //Area are added
                        }
                        //Set sizes
                        parameters.areas[params.area_id].size = size;
                    }
                },
            };
            borders = {
                init        : function (parameters){
                    borders.render.create(parameters);
                    borders.events.attach(parameters);
                },
                map         : {
                    create  : function (parameters) {
                        function getBasicBorders(parameters, direction) {
                            var group   = null,
                                borders = [];
                            for (var index = 1, max_index = parameters.ordering[direction + 's']; index < max_index; index += 1) {
                                group = [];
                                for (var id in parameters.areas) {
                                    if (index === parameters.areas[id][direction] || index === parameters.areas[id][direction] + parameters.areas[id][direction + 's']) {
                                        group.push(id);
                                    }
                                }
                                borders.push(group);
                            }
                            return borders;
                        };
                        function unfix(parameters, direction, collection) {
                            function findMax(parameters, IDs, direction) {
                                var _id = null,
                                    max = 0;
                                IDs.forEach(function (id) {
                                    _id = _id === null ? id : _id;
                                    _id = max < parameters.areas[id][direction + 's'] ? id : _id;
                                    max = max < parameters.areas[id][direction + 's'] ? parameters.areas[id][direction + 's'] : max;
                                });
                                return _id;
                            };
                            var borders     = [],
                                group       = null,
                                max         = null,
                                _direction  = direction === settings.directions.COLUMN ? settings.directions.ROW : settings.directions.COLUMN;
                            collection.forEach(function (IDs, index) {
                                do {
                                    max     = findMax(parameters, collection[index], direction);
                                    group   = [];
                                    collection[index].forEach(function (id) {
                                        if (parameters.areas[id][_direction] >= parameters.areas[max][_direction] &&
                                            parameters.areas[id][_direction] < parameters.areas[max][_direction] + parameters.areas[max][_direction + 's']) {
                                            group.push(id);
                                        }
                                    });
                                    collection[index] = collection[index].filter(function (id) {
                                        return (group.indexOf(id) === -1 ? true : false);
                                    });
                                    borders.push(group);
                                } while (collection[index].length > 0);
                            });
                            return borders;

                        };
                        function getBasis(parameters, direction, borders) {
                            borders[direction + 's'].forEach(function (collection, index) {
                                var value       = parameters.areas[collection[0]][direction],
                                    basis       = [],
                                    decrease    = [],
                                    increase    = [];
                                collection.forEach(function (id) {
                                    if (value >= parameters.areas[id][direction] && value <= parameters.areas[id][direction] + parameters.areas[id][direction + 's']) {
                                        basis.      push(id);
                                        decrease.   push(id);
                                    } else {
                                        increase.   push(id);
                                    }
                                });
                                borders[direction + 's'][index] = {
                                    all     : borders[direction + 's'][index],
                                    basis   : basis,
                                    decrease: decrease,
                                    increase: increase,
                                };
                            });
                            return borders[direction + 's'];
                        };
                        function setType(parameters, direction, borders) {
                            borders[direction + 's'].forEach(function (collection, index) {
                                borders[direction + 's'][index].type = direction;
                            });
                            return borders[direction + 's'];
                        };
                        var borders = {
                                rows    : getBasicBorders(parameters, settings.directions.ROW),
                                columns : getBasicBorders(parameters, settings.directions.COLUMN)
                            };
                        if (parameters.unfix !== false) {
                            borders[parameters.unfix] = unfix(parameters, parameters.unfix === 'columns' ? settings.directions.COLUMN : settings.directions.ROW, borders[parameters.unfix]);
                        }
                        borders.rows    = getBasis  (parameters, settings.directions.ROW,     borders);
                        borders.columns = getBasis  (parameters, settings.directions.COLUMN,  borders);
                        borders.rows    = setType   (parameters, settings.directions.ROW,     borders);
                        borders.columns = setType   (parameters, settings.directions.COLUMN,  borders);
                        return borders;
                    }
                },
                render      : {
                    create  : function (parameters) {
                        function add(parameters, direction) {
                            var builder = html.builder();
                            parameters.map[direction + 's'].forEach(function (collection, index) {
                                parameters.map[direction + 's'][index].border = (direction === settings.directions.ROW ? builder.build(settings.layouts.borders.HORIZONTAL) : builder.build(settings.layouts.borders.VERTICAL));
                                parameters.container.appendChild(parameters.map[direction + 's'][index].border);
                            });
                        };
                        var map = borders.map.create(parameters);
                        //Remove old border (if it is)
                        borders.render.clear(parameters);
                        //Add new borders
                        parameters.map = map;
                        add(parameters, settings.directions.ROW   );
                        add(parameters, settings.directions.COLUMN);
                        //Set size
                        borders.render.size.update(parameters);
                        return true;
                    },
                    clear   : function (parameters) {
                        function remove(parameters, direction) {
                            parameters.map[direction + 's'].forEach(function (collection, index) {
                                if (parameters.map[direction + 's'][index].border) {
                                    parameters.map[direction + 's'][index].border.parentNode.removeChild(parameters.map[direction + 's'][index].border);
                                }
                            });
                        };
                        if (parameters.map) {
                            remove(parameters, settings.directions.ROW    );
                            remove(parameters, settings.directions.COLUMN );
                        }
                    },
                    size    : {
                        update: function (parameters) {
                            function setSize(parameters, direction) {
                                parameters.map[direction + 's'].forEach(function (collection, index) {
                                    var size    = 0,
                                        id      = collection.basis[0];
                                    collection.basis.forEach(function (id) {
                                        size += parameters.areas[id].size.def[direction === settings.directions.ROW ? 'w' : 'h'].px;
                                    });
                                    collection.border.style[direction === settings.directions.ROW ? 'width' : 'height'] = size + 'px';
                                    if (direction === settings.directions.ROW) {
                                        collection.border.style.left    = parameters.areas[id].size.def.l.px + 'px';
                                        collection.border.style.top     = (parameters.areas[id].size.def.t.px + parameters.areas[id].size.def.h.px) + 'px';
                                    } else {
                                        collection.border.style.left    = (parameters.areas[id].size.def.l.px + parameters.areas[id].size.def.w.px) + 'px';
                                        collection.border.style.top     = parameters.areas[id].size.def.t.px + 'px';
                                    }
                                });
                            };
                            setSize(parameters, settings.directions.ROW   );
                            setSize(parameters, settings.directions.COLUMN);
                        }
                    }
                },
                events      : {
                    attach      : function (parameters) {
                        function attachEvents(parameters, direction) {
                            parameters.map[direction + 's'].forEach(function (collection, index) {
                                DOMEvents.add(
                                    collection.border,
                                    'mousedown',
                                    function (event) {
                                        borders.events.onMouseDown(event, parameters, collection);
                                    }
                                );

                            });
                        };
                        var DOMEvents = events.DOMEvents();
                        attachEvents(parameters, settings.directions.ROW      );
                        attachEvents(parameters, settings.directions.COLUMN   );
                    },
                    onMouseDown : function (event, parameters, collection) {
                        function wrapper(size) {
                            return {
                                width   : size.width,
                                height  : size.height,
                                _width  : size.width,
                                _height : size.height
                            }
                        };
                        var size        = html.size(),
                            sizes       = {},
                            DOMEvents   = null;
                        if (parameters) {
                            if (!parameters.movement) {
                                collection.all.forEach(function (id) {
                                    sizes[id] = wrapper(size.node(parameters.areas[id].content));
                                });
                                if (collection.type === settings.directions.COLUMN) {
                                    //vertical
                                    parameters.movement = {
                                        _x      : event.flex.clientX,
                                        x       : event.flex.clientX,
                                        border  : parseInt(collection.border.style.left, 10),
                                        sizes   : sizes,
                                    };
                                } else {
                                    //horizontal
                                    parameters.movement = {
                                        _y      : event.flex.clientY,
                                        y       : event.flex.clientY,
                                        border  : parseInt(collection.border.style.top, 10),
                                        sizes   : sizes,
                                    };
                                }
                                DOMEvents = events.DOMEvents();
                                DOMEvents.add(window, 'mousemove',  function (event) { borders.events.onMouseMove   (event, parameters, collection); }, parameters.id);
                                DOMEvents.add(window, 'mouseup',    function (event) { borders.events.onMouseUp     (event, parameters, collection); }, parameters.id);
                            }
                        }
                    },
                    onMouseMove : function (event, parameters, collection) {
                        function fireEvent(container, id, area_id) {
                            //Run external events in background
                            setTimeout(
                                function () {
                                    flex.events.core.fire(
                                        flex.registry.events.ui.arearesizer.GROUP,
                                        flex.registry.events.ui.arearesizer.REFRESH,
                                        { container: container, id: id, area_id: area_id }
                                    );
                                },
                                100
                            );
                        };
                        var offset = null;
                        if (parameters.movement.x) {
                            //vertical
                            if (event.flex.clientX !== parameters.movement.x) {
                                offset                                                  = event.flex.clientX - parameters.movement.x;
                                collection.increase.forEach(function (id) {
                                    parameters.areas[id].size.def.l.px          = parameters.areas[id].content.offsetLeft + offset;
                                    parameters.areas[id].size.def.w.px          = parameters.movement.sizes[id].width - offset;
                                    parameters.areas[id].content.style.width    = (parameters.movement.sizes[id].width - offset) + 'px';
                                    parameters.areas[id].content.style.left     = (parameters.areas[id].content.offsetLeft + offset) + 'px';
                                    parameters.movement.sizes[id].width         = parameters.movement.sizes[id].width - offset;
                                });
                                collection.decrease.forEach(function (id) {
                                    parameters.areas[id].size.def.w.px          = parameters.movement.sizes[id].width + offset;
                                    parameters.areas[id].content.style.width    = (parameters.movement.sizes[id].width + offset) + 'px';
                                    parameters.movement.sizes[id].width         = parameters.movement.sizes[id].width + offset;
                                });
                                parameters.movement.x           = event.flex.clientX;
                            }

                        } else {
                            //horizontal
                            if (event.flex.clientY !== parameters.movement.y) {
                                offset                                                  = event.flex.clientY - parameters.movement.y;
                                collection.increase.forEach(function (id) {
                                    parameters.areas[id].size.def.t.px          = parameters.areas[id].content.offsetTop + offset;
                                    parameters.areas[id].size.def.h.px          = parameters.movement.sizes[id].height - offset;
                                    parameters.areas[id].content.style.height   = (parameters.movement.sizes[id].height - offset) + 'px';
                                    parameters.areas[id].content.style.top      = (parameters.areas[id].content.offsetTop + offset) + 'px';
                                    parameters.movement.sizes[id].height        = parameters.movement.sizes[id].height - offset;
                                });
                                collection.decrease.forEach(function (id) {
                                    parameters.areas[id].size.def.h.px          = parameters.movement.sizes[id].height + offset;
                                    parameters.areas[id].content.style.height   = (parameters.movement.sizes[id].height + offset) + 'px';
                                    parameters.movement.sizes[id].height        = parameters.movement.sizes[id].height + offset;
                                });
                                parameters.movement.y       = event.flex.clientY;
                            }
                        }
                        collection.increase.forEach(function (id) {
                            fireEvent(parameters.areas[id].content, parameters.id, id);
                        });
                        collection.decrease.forEach(function (id) {
                            fireEvent(parameters.areas[id].content, parameters.id, id);
                        });
                        borders.render.size.update(parameters);
                        return event.flex.stop();
                    },
                    onMouseUp   : function (event, parameters, collection) {
                        var DOMEvents = events.DOMEvents();
                        DOMEvents.remove(window, 'mousemove',   null, parameters.id);
                        DOMEvents.remove(window, 'mouseup',     null, parameters.id);
                        //Save changes
                        render.sizes.save(parameters, collection);
                        //Remove temporary property
                        parameters.movement = null;
                        delete parameters.movement;
                    },
                }
            };
            coreEvents  = {
                attach              : function (parameters) {
                    flex.events.core.listen(
                        flex.registry.events.ui.window.resize.GROUP,
                        flex.registry.events.ui.window.resize.REFRESH,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, parameters);
                        },
                        parameters.id,
                        false
                    );
                    flex.events.core.listen(
                        flex.registry.events.ui.window.maximize.GROUP,
                        flex.registry.events.ui.window.maximize.CHANGE,
                        function (params) {
                            return coreEvents.onRefreshByParent(params.container, parameters);
                        },
                        parameters.id,
                        false
                    );
                },
                onRefreshByParent   : function (parent, parameters) {
                    var fromParent  = html.select.fromParent(),
                        node        = fromParent.first(parent, '*[' + settings.attrs.GROUP_ID + '="' + parameters.id + '"]');
                    if (node !== null) {
                        //Update areas sizes
                        render.sizes.calc(parameters);
                        render.sizes.update(parameters);
                        //Update sizes and positions of borer
                        borders.render.size.update(parameters);
                        return true;
                    }
                    return false;
                }
            };
            (function () {
                flex.registry.events.ui             === void 0 && (flex.registry.events.ui = {});
                flex.registry.events.ui.arearesizer === void 0 && (flex.registry.events.ui.arearesizer = {
                    GROUP   : 'flex.ui.arearesizer',
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
            name            : 'ui.arearesizer',
            protofunction   : protofunction,
            reference       : ['flex.events', 'flex.html'],
            resources       : [
                { url: 'KERNEL::css/flex.ui.arearesizer.css' }
            ],
        });
    }
}());
/*TODO: 
* Check IDs during init Should be unique
* Add checking of sizes for correction: one in row should be in % (flexible); and one in column should be in % too
*/