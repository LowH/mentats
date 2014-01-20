(setf *port* 4207)
(setf *layout* :main)
(setf *debug* '(:app :assets))

(define-template-var nav
    '("<li><a href=\"/competence\">Compétences</a></li>"
      "<li><a href=\"/blog\">Blog</a></li>"))

(define-template-var nav-right
    '())
