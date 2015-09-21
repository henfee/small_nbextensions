
/*

*/

var cbx_id = 0;   //These variables are initialized in init_config()

// *****************************************************************************

var init_config = require(['base/js/namespace'], function(Jupyter){
	var default_config = {
			cbx_id : 1
						}	
	if (Jupyter.notebook.metadata.interactive_sols === undefined){
		Jupyter.notebook.metadata.interactive_sols = default_config;
	}	
	cfg= Jupyter.notebook.metadata.interactive_sols;
	cbx_id=cfg.cbx_id; //global
})

function hide_itself() {
	var cell = IPython.notebook.get_selected_cell();
	cell.element.find("div.input").hide();
}

var hide_input = function (nb_max) {
        var n;
        var TextCell=require("notebook/js/textcell").TextCell;
        // Find the selected cell
        var index = IPython.notebook.get_selected_index();
        //console.log("Hiding input, cell ", index)
        var cell = IPython.notebook.get_selected_cell();
		cell.metadata.cbox_ck = false;
        for (n = 1; n <= nb_max; n++) 
        { 
        var i = IPython.notebook.get_selected_index(); 
        var cell = IPython.notebook.get_cell(i+n);
        cell.metadata.hidden = true;
        // Toggle visibility of the input div
        if (cell instanceof IPython.CodeCell) {
             cell.element.find("div.input").hide()
             cell.element.find("div.output").hide()
                                             }
        if (cell instanceof TextCell) {
             cell.element.find("div.text_cell_render").hide()
                                              }
                        };    
                };

var show_input = function (nb_max) {
        var n;
        var TextCell=require("notebook/js/textcell").TextCell;
        // Find the selected cell
        var index = IPython.notebook.get_selected_index();	
        //console.log("Showing input, cell ", index)
        var cell = IPython.notebook.get_selected_cell();
		cell.metadata.cbox_ck = true;
        for (n = 1; n <= nb_max; n++) 
        { 
        var i = IPython.notebook.get_selected_index(); 
        var cell = IPython.notebook.get_cell(i+n);
        cell.metadata.hidden = false;
        // Toggle visibility of the input div
        if (cell instanceof IPython.CodeCell) {
             cell.element.find("div.input").show()
             cell.element.find("div.output").show()
                                             }
        if (cell instanceof TextCell) {
             cell.element.find("div.text_cell_render").show()
                                      }
                        };    
                };

function init_cell_sols(id)
{
	 var index = IPython.notebook.get_selected_index();
     console.log("Process solution, cell ", index)
     var cell = IPython.notebook.get_selected_cell();
     //cell.metadata.manualexec = true; 
     cell.metadata.widget = true;
	 cell.metadata.cbox_id = id;
	 cell.metadata.cbox_ck = true;
}

//####
var get_cbx_id = require(['base/js/namespace'], function(Jupyter){
    //# This is to get the current checkbox id. The ids are incremented each time a checkbox is created. 
    //# The current max id is store in the notebook's metadata

    var kernel = Jupyter.notebook.kernel;
    if (kernel!=undefined){
        var command = "global cbx_id;  cbx_id = '" +  Jupyter.notebook.metadata.interactive_sols.cbx_id + "'";
        kernel.execute(command);
        console.log('cfg.cbx_id defined:',Jupyter.notebook.metadata.interactive_sols.cbx_id);}
}



//## This is to initialize all process_solution "widgets" cells
var interactive_init_cells = function () {   
     var TextCell=require("notebook/js/textcell").TextCell;
          var start = 0 //IPython.notebook.get_selected_index();
          var end = IPython.notebook.ncells()
          console.log("reloading cells from... ",start);
          for (var i=start; i<end; i++) { 
              IPython.notebook.select(i);
              var cell = IPython.notebook.get_selected_cell();
              if ((cell instanceof IPython.CodeCell)) { 
                  if (cell.metadata.widget == true){
					document.getElementById(cell.metadata.cbox_id).checked = cell.metadata.cbox_ck;
					cell.element.find("div.input").hide();                                 
                                                   }
              }
              if (cell.metadata.hidden == true) {
                    //console.log("Hidden cell... ",i);
                    // Toggle visibility of the input div
                    if (cell instanceof IPython.CodeCell) {
                         //console.log("Hiding Code cell... ",i);
                         cell.element.find("div.input").hide()
                         cell.element.find("div.output").hide()
                                                         }
                    if (cell instanceof TextCell) {
                         //console.log("hiding text cell... ",i);
                         cell.element.find("div.text_cell_render").hide()
                                                          }
                                               }
          }
      };

//******************************* MAIN FUNCTION **************************
    
define(["require", 
	'base/js/namespace'], function (require,Jupyter) {    


	init_config(); //reads default values
	cfg= Jupyter.notebook.metadata.interactive_sols;

	var MarkdownCell = require('notebook/js/textcell').MarkdownCell;
 	var TextCell = require('notebook/js/textcell').TextCell;
	var security=require("base/js/security")

    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);

    };
  
	var load_ipython_extension = require(['base/js/namespace'], function(Jupyter){
		
		"use strict";
		if (Jupyter.version[0] < 3) {
            console.log("This extension requires Jupyter or IPython >= 3.x")
            return
        	}
	
        var _on_reload = true; /* make sure cells render on reload */
	
	get_cbx_id();
        interactive_init_cells(); /* initialize cells */

        
		/* on reload */
        $([Jupyter.events]).on('status_started.Kernel', function() {

            get_cbx_id();
	    interactive_init_cells();
            console.log("reload...");
            _on_reload = false;
        })



   // });
    
}); //end of load_ipython_extension function

    console.log("Loading interactive_sols.css");
    load_css('./interactive_sols.css')
  

    
    //load_ipython_extension();
    return {
        load_ipython_extension: load_ipython_extension,
    };
}); //End of run_this

//run_this();
console.log("Loading ./interactive_sols.js");
