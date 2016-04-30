// Adapted from https://gist.github.com/magican/5574556
// by minrk https://github.com/minrk/ipython_extensions
// See the history of contributions in README.md


//define(["require", "jquery", "base/js/namespace",  'services/config',
//    'base/js/utils', "nbextensions/usability/toc2/toc2"], function(require, $, IPython, configmod, utils, toc2) {

define(["require", "jquery", "base/js/namespace",  'services/config',
    'base/js/utils', "nbextensions/usability/toc2/toc2"], function(require, $, IPython, configmod, utils, toc2 ) {

  "use strict";


// ...........Parameters configuration......................
 // define default values for config parameters if they were not present in general settings (notebook.json)
    var cfg={'threshold':6, 
             'number_sections':true, 
             'toc_cell':false,
             'toc_window_display':false,
             "toc_section_display": "block",
             'sideBar':true}
    ///var threshold = cfg['threshold']
    ///var toc_cell=cfg['toc_cell'];
    ///var number_sections = cfg['number_sections'];
    ///var sideBar = cfg['sideBar']

//.....................global variables....

    var liveNotebook = !(typeof IPython == "undefined")

    var st={}
    st.rendering_toc_cell = false; 
    st.config_loaded = false;
    st.extension_initialized=false;

    st.nbcontainer_marginleft = $('#notebook-container').css('margin-left')
    st.nbcontainer_marginright = $('#notebook-container').css('margin-right')
    st.nbcontainer_width = $('#notebook-container').css('width')
    st.oldTocHeight = undefined 

    st.cell_toc = undefined;
    st.toc_index=0;



  function read_config(cfg) {  // read after nb is loaded
    // create config object to load parameters
    var base_url = utils.get_body_data("baseUrl");
    var config = new configmod.ConfigSection('notebook', {base_url: base_url});

    // update params with any specified in the server's config file
    var update_params = function(cfg) {
        for (var key in cfg) {
            if (config.data.hasOwnProperty(key)){
                cfg[key] = config.data[key];
}
        }        
        ///threshold = cfg['threshold'];
        ///toc_cell=cfg['toc_cell'];
        ///number_sections = cfg['number_sections'];
        //$('#toc-wrapper').css('display',cfg['toc-wrapper_display']) //ensure display is done as noted in config
        if (typeof cfg.sideBar == "undefined") {
          console.log("Updating sidebar")
          cfg.sideBar=true;
        }
      IPython.notebook.metadata.toc = cfg; //save in present nb metadata (then can be modified per document)        
        $('#toc-wrapper').css('display',cfg['toc_window_display'] ? 'block' : 'none') //ensure display is done as noted in config
    };

    // config may be specified at system level or at document level.
    if (IPython.notebook.metadata.toc !== undefined){ //configuration saved in nb
        console.log("config stored in nb")
        for (var key in cfg) {
            if (typeof IPython.notebook.metadata.toc[key] !=  "undefined"){
                cfg[key] = IPython.notebook.metadata.toc[key]
            }
        }
        //cfg = IPython.notebook.metadata.toc;
        if (typeof cfg.sideBar == "undefined") {
          console.log("Updating sidebar")
          cfg.sideBar=true;
          IPython.notebook.metadata.toc.sideBar=true;
        }
        ///threshold = cfg['threshold'];
        ///toc_cell=cfg['toc_cell'];
        ///number_sections = cfg['number_sections'];
    } else {
        console.log("config stored in system")
        config.load();
        config.loaded.then(function() {update_params(cfg) })
    }
    st.config_loaded = true;
    return cfg
}



// **********************************************************************

//***********************************************************************
// ----------------------------------------------------------------------

  function toggleToc() {
    toggle_toc(cfg,st)
  }

  var toc_button = function () {
    if (!IPython.toolbar) {
      $([IPython.events]).on("app_initialized.NotebookApp", toc_button);
      return;
    }
    if ($("#toc_button").length === 0) {
      IPython.toolbar.add_buttons_group([
        {
          'label'   : 'Table of Contents',
          'icon'    : 'fa-list',
          'callback':  toggleToc,
          'id'      : 'toc_button'
        }
      ]);
    }
  };
  
  var load_css = function () {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = require.toUrl("./main.css");
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  
  var load_ipython_extension = function () {
    load_css(); //console.log("Loading css")
    toc_button(); //console.log("Adding toc_button")
    
    cfg = read_config(cfg); 
    table_of_contents(cfg,st); 
    // render toc for each markdown cell modification
    $([IPython.events]).on("rendered.MarkdownCell", 
      function(){
        table_of_contents(cfg,st);
      });
        console.log("toc2 initialized")

    // render toc on load
    $([IPython.events]).on("notebook_loaded.Notebook", function(){ // curiously, the event is not always fired or detected
                                                       // thus I rely on kernel_ready.Kernel to read the initial config 
                                                       // and render the first  table of contents
        table_of_contents(cfg,st); 
        console.log("toc2 initialized (via notebook_loaded)")
})

    $([IPython.events]).on("kernel_ready.Kernel", function(){
      console.log("kernel_ready.Kernel")
      table_of_contents(cfg,st); 
      console.log("toc2 initialized (via kernel_ready)")
    });

  };

  return {
    load_ipython_extension : load_ipython_extension,
    toggle_toc : toggle_toc,
    table_of_contents : table_of_contents
  };

});
