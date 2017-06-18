
// Copyright (c) Jupyter-Contrib Team.
// Distributed under the terms of the Modified BSD License.
// Author: Jean-François Bercher 
// small extension demo for PyData 2017

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Jupyter = require('base/js/namespace');
    var utils = require('base/js/utils');
    var configmod = require('services/config');

    var add_edit_shortcuts = {};
    var log_prefix = '[' + module.id + '] ';

    // default config (updated on nbextension load)
    var conf = {
        hotkey: 'alt-shift-t',
        }


    function initialize(conf) {

            toggleHotkey(conf);
            showToolbar();
            main_function(conf);
    }



    function showToolbar() {
        if ($('#toggleCase').length != 0) {
            $('#toggleCase').remove()
        }
        console.log(log_prefix + "Inserting button")
        Jupyter.toolbar.add_buttons_group([{
            'label': 'Toggle Case',
            'icon': 'fa-text-height',
            'callback': main_function,
            'id': 'toggleCase'
        }]);
    }

    function toggleHotkey(conf) {
        add_edit_shortcuts[conf['hotkey']] = {
            help: 'toggleCase',
            help_index: 'ht',
            handler: main_function
        }
    Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
    }


    function main_function(conf) {
        alert(log_prefix+" main_function output")
     }

    function load_notebook_extension() {

    initialize(conf);

    }


    return {
        load_ipython_extension: load_notebook_extension
    };
});
