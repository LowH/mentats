(setf *port* 4207)
(setf *layout* :main)
(setf *session-timeout* (* 3600 24 7))
(setf facts:*db-path* #P"data/mentats")

(define-template-var title
    "Mentats")

(define-template-var nav
    '("<li><a href=\"/competence\">Comp&eacute;tences</a></li>"
      "<li><a href=\"/blog\">Blog</a></li>"))

(define-template-var nav-right
    '())

(require :cl-bcrypt)
(use-package :cl-bcrypt)

(require :re)
(use-package :re)

(require :can)
(require :gravatar)
(require :rw-ut)

(cl-json:set-decoder-simple-clos-semantics)

(defun setup-environment (env)
  (log-msg :INFO "setup environment ~A" (string-downcase env))
  (case env
    ((:development)
     #+swank
     (setf (debug-p :conditions) t)
     (setf (debug-p :app) t)
     (setf (debug-p :assets) nil)))
  (log-msg :DEBUG "tags:~{ ~A~}" cl-debug::*debug*))
