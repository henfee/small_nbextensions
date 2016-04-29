
   // TOC CELL -- if toc_cell=true, add and update a toc cell in the notebook. 
   //             This cell, initially at the very beginning, can be moved.
   //             Its contents are automatically updated.
   //             Optionnaly, the sections in the toc can be numbered.
   var toc_cell;            
   var cell_toc = undefined;
   function look_for_cell_toc(callb){ // look for a possible toc cell
       var cells = IPython.notebook.get_cells();
       var lcells=cells.length;
       for (var i = 0; i < lcells; i++) {
          if (cells[i].metadata.toc=="true") {
                cell_toc=cells[i]; 
                toc_index=i; 
                //console.log("Found a cell_toc",i); 
                break;} 
                }
    callb && callb(i);
    }
    // then process the toc cell:
    function proces_cell_toc(i){ 
        //if toc_cell=true, we want a cell_toc. 
        //  If it does not exist, create it at the beginning of the notebook
        //if toc_cell=false, we do not want a cell-toc. 
        //  If one exists, delete it
        if(toc_cell) {
               if (cell_toc == undefined) {
                    rendering_toc_cell = true;
                    //console.log("*********  Toc undefined - Inserting toc_cell");
                    cell_toc = IPython.notebook.select(0).insert_cell_above("markdown"); 
                    cell_toc.metadata.toc="true";
               }
        }
        else{
           if (cell_toc !== undefined) IPython.notebook.delete_cell(toc_index);
           rendering_toc_cell=false; 
         }
    } //end function process_cell_toc --------------------------
