(setf *port* 4207)
(setf *layout* :main)
(setf *session-timeout* (* 3600 24 7))
(setf (debug-p :app) t)
(setf (debug-p :assets) t)

(define-template-var title
    "Mentats")

(define-template-var nav
    '("<li><a href=\"/competence\">Compétences</a></li>"
      "<li><a href=\"/blog\">Blog</a></li>"))

(define-template-var nav-right
    '())

(require :cl-bcrypt)
(use-package :cl-bcrypt)

(require :gravatar)

(require :can)
(import '(can:can))
(export '(can))
