var Controller = function () { };
Controller.prototype = {
    onReady : function (results) {
        this.model      = results.model;
        this.listener   = results.listener;
        this.instance   = results.instance;
    },
    onChange: function(hook, current, previous){
        window.console.log(hook);
    },
    content: {
        login: {
            onblur: function (event, index) {
                window.console.log(event);
            }
        },
        password: {
            onblur: function (event, index) {
                window.console.log(event);
            }
        },
        controls: {
            onclick: [
                function onLogin(event, index) {
                    var login = this.model._content_[0]._login_[0],
                        password = this.model._content_[0]._password_[0];
                    if (login.value === null || (typeof login.value === 'string' && login.value.length < 2)) {
                        login.not_valid = true;
                        setTimeout(function () { login.not_valid = false; }, 1000);
                    }
                    if (password.value === null || (typeof password.value === 'string' && password.value.length < 4)) {
                        password.not_valid = true;
                        setTimeout(function () { password.not_valid = false; }, 1000);
                    }
                    window.console.log('onLogin');
                },
                function onCancel(event, index) {
                    window.console.log('onCancel');
                }
            ]
        }
    }
};
_controller(Controller);