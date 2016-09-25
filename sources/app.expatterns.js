/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Copyright © 2015-2016 Dmitry Astafyev. All rights reserved.                                                      *
* This file (core / module) is released under the Apache License (Version 2.0). See [LICENSE] file for details.    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
flex.init({
    resources               : {
        MODULES             : ['flex.ui.patterns', 'flex.ui.window.resize', 'flex.ui.window.focus', 'flex.ui.window.maximize', 'flex.ui.window.move'],
        USE_STORAGED        : true,
    },
    settings                : {
        CHECK_PATHS_IN_CSS  : true
    },
    logs                    : {
        SHOW                : ['CRITICAL']
    }
});