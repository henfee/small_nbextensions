# small_nbextensions

This repo contains some small javascript for IPython/Jupyter notebook. Usually, these extensions will 
also be uploaded to the main collection [https://github.com/ipython-contrib/IPython-notebook-extensions](https://github.com/ipython-contrib/IPython-notebook-extensions). 
Extensions include:

- [highlighter](https://github.com/jfbercher/small_nbextensions/tree/master/usability/highlighter): this extension enables to highlight selected 
portions of text in a markdown cell. This is useful (eg for students) to annotate important parts of a text/notebook.
- [interactive_sols](https://github.com/jfbercher/small_nbextensions/tree/master/usability/interactive_sols): this extension enables to mask/unmask solutions or tips cells. This is useful eg to let students work on an exercise before looking at a possible solution or hints.
- [exercise](https://github.com/jfbercher/small_nbextensions/tree/master/usability/exercise): this extension (updated from [IPYthon-contrib]((http://github.com/ipython-contrib/IPython-notebook-extensions/tree/master/nbextensions/usability/exercise) enables to define, then show/hide a solution by pressing on a cell widget. 
- [exercise2](https://github.com/jfbercher/small_nbextensions/tree/master/usability/exercise2): similar to exercise, this extension enables to define, then show/hide a solution by pressing on a checkbox. 
- [move_selected_cells](https://github.com/jfbercher/small_nbextensions/tree/master/usability/move_selected_cells): this extension enables to move up and down several selected cells.

 
exercise, exercise2 and move_selected_cells make use of the [`rubberband` extension](http://github.com/ipython-contrib/IPython-notebook-extensions/tree/master/nbextensions/usability/rubberband) which can be installed from this repo using `jupyter nbextension install https://rawgit.com/jfbercher/small_nbextensions/master/rubberband.zip`.
 

Of course, do not miss my big extension [latex_envs](https://github.com/jfbercher/latex_envs) which enables to use some LaTeX structures (eg theorems/itemize/etc) directly in the notebook. It also features automatic numerotation, labels and references, and some support for (bibTeX) bibliography. 

**Installation** 
In all cases, the extensions can be installed from a zip file available in the repo, using

```jupyter nbextension install https://rawgit.com/jfbercher/small_nbextensions/master/name_of_the_extension.zip```

and then activated via

```jupyter nbextension enable usability/name_of_the_extension//name_of_the_extension```

(or maybe `main` at the end rather than `name_of_the_extension` for `move_selected_cells` and `rubberband`.

