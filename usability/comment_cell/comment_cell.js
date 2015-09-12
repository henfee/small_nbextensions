// This small extension adds two buttons.
// The first one is to allow students to mark a cell as a comment (and then highlight in green)
// The second one is to allow students to mark a cell as a important (and then highlight in a kind of red)
// jeffbea, august 5, 2015 


define(["require", 
	'base/js/namespace'], function (require,Jupyter) {   


function load_ipython_extension() {

var version = IPython.version.substring(0, 1);

function comment_cell()
{
cell = IPython.notebook.get_selected_cell() ;

if (cell.metadata.comment == true)
{
	cell.element.css({"background-color": "#00FFCC"});
	cell.metadata.comment = false;
}
else
{
	cell.element.css({"background-color": "#ffffff"});
	cell.metadata.comment = true;
	cell.metadata.important = false;
}
}

function important_cell()
{
cell = IPython.notebook.get_selected_cell() ;

if (cell.metadata.important == true)
{
	cell.element.css({"background-color": "#FF6633"});
	cell.metadata.important = false;
}
else
{
	cell.element.css({"background-color": "#ffffff"});
	cell.metadata.important = true;
	cell.metadata.comment = false;
}
}

//........................................................

//## This is to initialize all process_solution "widgets" cells
var comment_init_cells = function () {   
     var TextCell=require("notebook/js/textcell").TextCell;
          var start = 0 //IPython.notebook.get_selected_index();
          var end = IPython.notebook.ncells()
          console.log("reloading cells from... ",start);
          for (var i=start; i<end; i++) { 
              IPython.notebook.select(i);
              var cell = IPython.notebook.get_selected_cell();
			  if (cell.metadata.important) cell.element.css({"background-color": "#FF6633"});
			  if (cell.metadata.comment) cell.element.css({"background-color": "#00FFCC"});
                                         }
      };


//........................................................
IPython.toolbar.add_buttons_group([
            {
                id : 'comment cell',
                label : 'Mark this cell as a comment',
                icon : (version === "2") ? 'icon-comment' : 'fa-comment',
                callback : function () {
                    comment_cell();
                    }
            },

            {
                id : 'important cell',
                label : 'Mark cell as important',
                icon : (version === "2") ? 'icon-exclamation-sign' : 'fa-exclamation-circle',
                callback : function () {
                    important_cell();
                    }
            },

         ]);


        comment_init_cells(); /* initialize cells */

        
		/* on reload */
        $([Jupyter.events]).on('status_started.Kernel', function() {

            comment_init_cells();
            console.log("reload...");
        })


}
    return {load_ipython_extension: load_ipython_extension };
})
