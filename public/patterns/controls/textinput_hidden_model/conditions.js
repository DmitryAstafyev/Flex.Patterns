var conditions = {
    type        : function (data) {
        return data.type;
    },
    showinfo    : function (data) {
        return data.not_valid === true ? 'show' : 'null';
    }
};
//conditions.showinfo.tracking = ['not_valid'];
_conditions(conditions);
