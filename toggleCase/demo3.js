
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



    String.prototype.toggleStringCase = function() { // from https://gruximillian.github.io/06_toggle_case/index.html
        
        var stringArray = this.toString().valueOf().split(''); // Turn string into array

        stringArray = stringArray.map(function(current, index, stringArray) {
            if (current.toLowerCase() === current) {
                return current.toUpperCase(); // If a character is lowercase, switch to uppercase
            } else {
                return current.toLowerCase(); // Else, switch to lowercase
            }
        });
        return stringArray.join(''); // Join array into string again
        
    }


    function toggleCase() {
        var cell = Jupyter.notebook.get_selected_cell()
        var cm = cell.code_mirror
        var selectedText = cm.getSelection()
        if (selectedText.length == 0) {
            var cell_text = cell.get_text();
            cell_text = cell_text.toggleStringCase();
            cell.set_text(cell_text);
        } else {
            cm.replaceSelection(selectedText.toggleStringCase())
        }
    }


    function showToolbar() {

        if ($('#toggleCase').length != 0) {
            $('#toggleCase').remove()
        }
        console.log(log_prefix + "Inserting button")
        Jupyter.toolbar.add_buttons_group([{
            'label': 'Toggle Case',
            'icon': 'fa-text-height',
            'callback': toggleCase,
            'id': 'toggleCase'
        }]);
    }


    function toggleHotkey(conf) {
        add_edit_shortcuts[conf['hotkey']] = {
            help: 'toggleCase',
            help_index: 'ht',
            handler: toggleCase
        }
    Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
    }


    function main_function(conf) {
        //alert(log_prefix+" main_function output")
     }

    function load_notebook_extension() {

    initialize(conf);

    }


    return {
        load_ipython_extension: load_notebook_extension
    };
});
