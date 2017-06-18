
// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Author: Jean-François Bercher 
// small extension demo for PyData 2017

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Jupyter = require('base/js/namespace');
    
    var add_edit_shortcuts = {};
    var log_prefix = '[' + module.id + '] ';

    // default config 
    var conf = {
        hotkey: 'alt-shift-t',
        }




    function main_function(conf) {
        alert(log_prefix+" main_function")
     }

    function load_notebook_extension() {

        if ($('#toggleCase').length != 0) {
            $('#toggleCase').remove()
        }            
            Jupyter.toolbar.add_buttons_group([{
                'label': 'Toggle Case',
                'icon': 'fa-text-height',
                'callback': main_function,
                'id': 'toggleCase'
            }]);

        
        add_edit_shortcuts[conf['hotkey']] = {
            help: 'toggleCase',
            help_index: 'ht',
            handler: main_function
        }
        Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);

        console.log(log_prefix + "is loaded")
    }



    return {
        load_ipython_extension: load_notebook_extension
    };
});
