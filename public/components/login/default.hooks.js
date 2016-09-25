_hooks({
    title   : 'Test dialog window',
    content : {
        login       : {
            type                : 'text',
            not_valid_message   : 'Sorry, but your login should not be shorter than 2 symbols. Please, try again.',
            not_valid           : false
        },
        password    : {
            type                : 'password',
            not_valid_message   : 'Sorry, but your password should not be shorter than 6 symbols. Please, try again.',
            not_valid           : false
        },
        controls    : [
            { title: 'login',   id: 'login_button'  },
            { title: 'cancel',  id: 'cancel_button' }
        ],
    }
});