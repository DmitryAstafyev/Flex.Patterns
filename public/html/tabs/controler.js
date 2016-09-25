var Controller = function () { };
Controller.prototype = {
    onReady     : function (results) {
        this.model = results.model;
        this.hideTabs(0);
    },
    hideTabs    : function (exclude) {
        var tabs = this.model._tabs_;
        tabs.forEach(function (tab, index) {
            if (exclude === void 0 || (exclude !== void 0 && exclude !== index)) {
                tab.$tab.css({ display: 'none' });
            }
        });
    },
    buttons     : {
        onClick : function onClick(event, index) {
            var tabs    = this.model._tabs_,
                tab     = index[1];
            tabs[tab] !== void 0 && (this.hideTabs());
            tabs[tab] !== void 0 && (tabs[tab].$tab.css({display : 'block'}));
        } 
    },
};
_controller(Controller);