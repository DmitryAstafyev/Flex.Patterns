if (_conditions !== void 0) {
    var conditions = {
        value_sets: function (data) {
            if (data.column_3 <= 333                        ) { return '0';     }
            if (data.column_3 > 333 && data.column_3 <= 666 ) { return '0.5';   }
            if (data.column_3 > 666                         ) { return '1';     }
        },
        sub_value_sets: function (data) {
            if (data.column_3 <= 111                        ) { return '0';     }
            if (data.column_3 > 111 && data.column_3 <= 222 ) { return '0.5';   }
            if (data.column_3 > 222                         ) { return '1';     }
        },
    };
    conditions.value_sets.      tracking = ['column_3'];
    conditions.sub_value_sets.  tracking = ['column_0'];
    _conditions(conditions);
}
