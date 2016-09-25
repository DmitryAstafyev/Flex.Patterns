_controller(function (res) {
    function add(event, indexes) {
        var index = indexes !== void 0 ? indexes[1] : rows.length;
        rows.splice(index, 0, {
            column_0: (Math.random() * 1000).toFixed(4),
            column_1: (Math.random() * 1000).toFixed(4),
            column_2: (Math.random() * 1000).toFixed(4),
            column_3: (Math.random() * 1000).toFixed(4)
        });
        rows[index].$add.on('click', add);
        rows[index].$remove.on('click', remove);
    };
    function remove(event, indexes) {
        rows.splice(indexes[1], 1);
    };
    var rows = res.model._rows_;
    _node('a[id="add_row"]').events().add('click', add);
    res.model._rows_.$add.on('click', add);
    res.model._rows_.$remove.on('click', remove);
});