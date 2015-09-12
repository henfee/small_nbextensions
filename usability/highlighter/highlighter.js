var burk = {
    'open': '<span class="burk">',
    'close': '</span>'
};
var mark = {
    'open': '<span class="mark">',
    'close': '</span>'
};

function highlightInCmdMode(event, highlight) {
    var cell = IPython.notebook.get_selected_cell()
    var cm = IPython.notebook.get_selected_cell().code_mirror
    var zozo = window.getSelection().toString();
    var cell_text = cell.get_text()
    cell_text = cell_text.replace(zozo, highlight.open + zozo + highlight.close)
    cell.set_text(cell_text)
    cell.render();
    return false;
}

function highlightInEditMode(event, highlight) {
    var cm = IPython.notebook.get_selected_cell().code_mirror
    var zozo = cm.getSelection()
    cm.replaceSelection(highlight.open + zozo + highlight.close)
    return false;
}

function removeHighlights() {
    var cell = IPython.notebook.get_selected_cell()
    var cell_text = cell.get_text()
    var ll = [mark.open, mark.close, burk.open, burk.close]
    cell_text = cell_text.replace(/<span class="mark">([\s\S]*?)<\/span>/g, function(w, g) {
        return g
    })
    cell_text = cell_text.replace(/<span class="burk">([\s\S]*?)<\/span>/g, function(w, g) {
        return g
    })
    cell.set_text(cell_text)
    cell.render();
}

// Keyboard shortcuts ******************************

var add_cmd_shortcuts = {
    'Alt-g': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            highlightInCmdMode("", mark);
            return false;
        }
    },
    'Alt-h': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            highlightInCmdMode("", burk);
            return false;
        }
    },
};


var add_edit_shortcuts = {
    'Alt-g': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            var highlight = mark;
            highlightInEditMode("", mark);
            return false;
        }
    },
    'Alt-h': {
        help: 'highlight selected text',
        help_index: 'ht',
        handler: function(event) {
            var highlight = burk;
            highlightInEditMode("", burk);
            return false;
        }
    },
};

IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);

//******Toolbar buttons *************************************************

function highlightText(highlight) {
    var cell = IPython.notebook.get_selected_cell();
    var rendered = cell.rendered;
    if (rendered) highlightInCmdMode("", highlight);
    else highlightInEditMode("", highlight);
}

var test = ' <div class="btn-group" role="toolbar"> <button type="button" class="btn btn-group btn-default" style="font-weight:bold;"  \
             href="#" id="highlight1">\
             <i class="fa fa-paint-brush"></i>  G</button>\
             <button type="button" class="btn btn-group btn-default" style="font-weight:bold;margin-left:0" \
             href="#" id="highlight2">\
             <i class="fa fa-flip-horizontal fa-paint-brush"></i>H </button>\
             <button type="button" class="btn btn-default" style="font-weight:bold;margin-left:0"\
             href="#" id="highlight3">\
            <i class="fa fa-flip-horizontal fa-paint-brush" style="color:#cccccc"></i>\
              <i class="fa fa-times" ></i>\
             </button></div>'


$("#maintoolbar-container").append(test);
$("#test").css({
    'padding': '5px'
});

//buttons initial css -- shall check if this is really necessary
$("#highlight1").css({
    'padding': '2px 8px',
    'display': 'inline-block',
    'border': '1px solid',
    'border-color': '#cccccc',
    'font-weight': 'bold',
    'text-align': 'center',
    'vertical-align': 'middle',
    'margin-left': '0px'
})
$("#highlight2").css({
    'padding': '2px 8px',
    'display': 'inline-block',
    'border': '1px solid',
    'border-color': '#cccccc',
    'font-weight': 'bold',
    'text-align': 'center',
    'vertical-align': 'middle',
    'margin-left': '0px'
})


$("#highlight1").on('mouseout', function() {
        $(this).addClass("btn btn-default")
            .removeClass("mark")
    })
    .on('mouseover', function() {
        $(this).removeClass("btn btn-default ")
            .addClass("mark")
            //    .css({ 'padding': '2px 8px', 'display': 'inline-block','border': '1px solid',
            //            'border-color':'#cccccc',  'font-weight': 'bold', 
            //  'text-align': 'center',   'vertical-align': 'middle'
            //  }) 
    })
    .on('click', function() {
        highlightText(mark)
    })
    .tooltip({
        title: 'Highlight selected text (shortcut: Alt-g)',
        trigger: "hover",
        delay: {
            show: 500,
            hide: 50
        }
    });

$("#highlight2").on('mouseout', function() {
        $(this).addClass("btn btn-default")
            .removeClass("burk")
    })
    .on('mouseover', function() {
        $(this).removeClass("btn btn-default ")
            .addClass("burk")
            //    .css({ 'padding': '2px 8px', 'display': 'inline-block','border': '1px solid',
            //            'border-color':'#cccccc',  'font-weight': 'bold',
            //  'text-align': 'center',   'vertical-align': 'middle'
            //  }) 
    })
    .on('click', function() {
        highlightText(burk)
    })
    .tooltip({
        title: 'Highlight selected text (shortcut: Alt-h)',
        trigger: "hover",
        delay: {
            show: 500,
            hide: 50
        }
    });

$("#highlight3")
    .on('click', function() {
        removeHighlights()
    })
    .tooltip({
        title: 'Remove highlightings in selected cell',
        trigger: "hover",
        delay: {
            show: 500,
            hide: 50
        }
    });


//******************************* MAIN FUNCTION **************************

define(["require",
    'base/js/namespace'
], function(require, Jupyter) {

    var security = require("base/js/security")

    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);

    };

    //Load_ipython_extension
    var load_ipython_extension = require(['base/js/namespace'], function(Jupyter) {

        "use strict";
        if (Jupyter.version[0] < 3) {
            console.log("This extension requires Jupyter or IPython >= 3.x")
            return
        }

        var _on_reload = true; /* make sure cells render on reload */

        //highlighter_init_cells(); /* initialize cells */


        /* on reload */
        $([Jupyter.events]).on('status_started.Kernel', function() {

            //highlighter_init_cells();
            console.log("reload...");
            _on_reload = false;
        })

    }); //end of load_ipython_extension function


    //.....

    console.log("Loading highlighter.css");
    load_css('./highlighter.css')



    //load_ipython_extension();
    return {
        load_ipython_extension: load_ipython_extension,
    };
}); //End of main function

console.log("Loading ./highlighter.js");
