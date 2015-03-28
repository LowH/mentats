(setf *port* 4207)
(setf *layout* :main)
(setf *session-timeout* (* 3600 24 7))
(setf facts:*db-path* #P"data/mentats")

(define-template-var title
    "Mentats")

(define-template-var nav
    '("<li><a href=\"/competence\">Compétences</a></li>"
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

(defun setup-environment (env)
  (case env
    ((:development)
     #+swank (setf (debug-p :conditions) t)
     (setf (debug-p :app) t)
     (setf (debug-p :assets) t)))
  (msg "DEBUG tags:~{ ~A~}" cl-debug::*debug*))
