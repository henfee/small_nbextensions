
/*

*/

var cbx_id = 0;   //These variables are initialized in init_config()

// *****************************************************************************

/* Override original execute-range function */
console.log("Overriding run-range javascript function");
require("notebook/js/notebook").Notebook.prototype.execute_cell_range = function(start, end) {
    this.command_mode();
    for (var i = start; i < end; i++) {
        this.select(i);
        var c = this.get_selected_cell();
        if (c.metadata.widget == true) {
            //console.log("Cell not executed: ", i);
            //console.log(c.metadata.widget);
        } else {
            //console.log("execute",i);
            this.execute_cell();
        }
    }
};

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
             //cell.element.find("div.text_cell_render").hide()
             cell.element.find("div.inner_cell").hide()
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
             //cell.element.find("div.text_cell_render").show()
             cell.element.find("div.inner_cell").show()
                                      }
                        };    
                };

function init_cell_sols(id) {
    if (Jupyter.notebook.metadata.interactive_sols == undefined) {
        console.log("cfg undefined");
        return
    }
    if (IPython.notebook.get_selected_cell() == null) {
        console.log("no cell selected");
        return
    }

    cfgi = Jupyter.notebook.metadata.interactive_sols;
    if (parseInt(cfgi.cbx_id) == id) {
        var cell = IPython.notebook.get_selected_cell();
        cell.metadata.widget = true;
        cell.metadata.cbox_id = "myCheck" + id;
        cell.metadata.cbox_ck = true;
        cfgi.cbx_id += 1;
        //console.log("in the cell", cfgi.cbx_id);
        cell.element.find("div.input").hide(); //hide itself...
    } else console.log("not reexcuting an old cell");
    return
}


function pr_cell_sols(nb_cells) {
    var id = Jupyter.notebook.metadata.interactive_sols.cbx_id;
    var idName = '"myCheck' + id + '"'
    var idName2 = "\'+\"'myCheck" + id + "'\"+\'" 
        var idName3 = "\'myCheck" + id +"\'"
    //IPython.notebook.insert_cell_below();
    //IPython.notebook.select(IPython.notebook.get_selected_index()+1)
    var cell=IPython.notebook.get_selected_cell();

    var toto='<div class="onoffswitch">\\n\
<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox"\\n\
onclick="document.getElementById(' + idName2 + ').checked ? \\n\
show_input(' + nb_cells + ') : hide_input(' + nb_cells + ')" \\n\
id=' + idName + '  checked>\\n\
<label class="onoffswitch-label" for=' + idName + '> \\n\
<span class="onoffswitch-inner"></span> \\n\
<span class="onoffswitch-switch"></span>\\n\
</label>\\n\
</div>'
    var tata="from IPython.display import HTML, display, Javascript\ndisplay(HTML("+"'"+toto+"'"+"))"
    cell.set_text(tata)
    cell.execute();
    cfgi = Jupyter.notebook.metadata.interactive_sols;
    cell.metadata.widget = true;
        cell.metadata.cbox_id = "myCheck" + id;
        cell.metadata.cbox_ck = true;
        cfgi.cbx_id += 1;
        cell.element.find("div.input").hide(); //hide itself...
}


//####

//var get_cbx_id = require(['base/js/namespace'], function(Jupyter){
var get_cbx_id =  function(){    
    //# This is to get the current checkbox id. The ids are incremented each time a checkbox is created. 
    //# The current max id is store in the notebook's metadata

    var kernel = Jupyter.notebook.kernel;
    //if (kernel!=undefined)
    {
        var command = "global cbx_id;  cbx_id = '" +  Jupyter.notebook.metadata.interactive_sols.cbx_id + "'";
        kernel.execute(command);
        //console.log('cfg.cbx_id defined:',Jupyter.notebook.metadata.interactive_sols.cbx_id);
    }
};

//cell execute with callback
function cellexec(cell,callb){
    console.log("--> exec")
    cell.execute();
    return callb(cell);
}

// This is from: http://www.devign.me/asynchronous-waiting-for-javascript-procedures
// waitUntil
///      waits until a certain function returns true and then executes a code. checks the function periodically
/// parameters
///      check - a function that should return false or true
///      onComplete - a function to execute when the check function returns true
///      delay - time in milliseconds, specifies the time period between each check. default value is 100
///      timeout - time in milliseconds, specifies how long to wait and check the check function before giving up
function waitUntil(check,onComplete,delay,timeout) {
  // if the check returns true, execute onComplete immediately
  if (check()) {
      onComplete();
      return;
  }
  if (!delay) delay=100;

  var timeoutPointer;
  var intervalPointer=setInterval(function () {
      if (!check()) return; // if check didn't return true, means we need another check in the next interval

      // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
      clearInterval(intervalPointer);
      if (timeoutPointer) clearTimeout(timeoutPointer);
      onComplete();
  },delay);
  // if after timeout milliseconds function doesn't return true, abort
  if (timeout) timeoutPointer=setTimeout(function () {
      clearInterval(intervalPointer);
  },timeout);
}

// *********************************************************************
//## This is to initialize all process_solution "widgets" cells
var interactive_init_cells = function() {
    var TextCell = require("notebook/js/textcell").TextCell;
    var start = 0 //IPython.notebook.get_selected_index();
    var end = IPython.notebook.ncells()
    //console.log("reloading cells from... ", start);
    console.log("interactive_init_cells: reloading cells")
    for (var i = start; i < end; i++) {
        IPython.notebook.select(i);
        var cell = IPython.notebook.get_selected_cell();
        if ((cell instanceof IPython.CodeCell)) {
            if (cell.metadata.widget == true) {
                if (document.getElementById(cell.metadata.cbox_id)) {
                    document.getElementById(cell.metadata.cbox_id).checked = cell.metadata.cbox_ck;
                    cell.element.find("div.input").hide();
                } else {
                    var testedId = cell.metadata.cbox_id;
                    var ckstate = cell.metadata.cbox_ck;
                    // in the case outputs (buttons) have been cleared, we shall restore the previous state
                    //console.log("restoring lost cell")
                    cell.execute(); //then restore it
                    cell.element.find("div.input").hide();
                    // and restore its previous state - cell.execute seems async. Need to wait for actual creation
                    function check(testedId) {
                        var testId = testedId;
                        return function() {
                            return document.getElementById(testId) != null;
                        }
                    }

                    function onComplete(testedId, ckstate) {
                        var testId = testedId;
                        return function() {
                            document.getElementById(testId).checked = ckstate;
                        }
                    }

                    waitUntil(check(testedId), onComplete(testedId, ckstate), 1000, 6000)

                }
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
                //cell.element.find("div.text_cell_render").hide()
                cell.element.find("div.inner_cell").hide()
                
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
	
	    //get_cbx_id();
        //console.log('init load')
        interactive_init_cells(); /* initialize cells */

        
		/* on reload */
        //$([IPython.events]).on('status_restarting.Kernel',function () {console.log("restarting")})
        $([IPython.events]).on('kernel_restarting.Kernel',function () {console.log("restarting")})
        $([IPython.events]).on('kernel_ready.Kernel', function() {        
	        interactive_init_cells();
            get_cbx_id();
            console.log("interactive_sols: kernel is ready... executing init_cells and get_cbx...");
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
