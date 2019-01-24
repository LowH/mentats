(setf *layout* :main)
(setf *port* 4207)
(setf *session-timeout* (* 3600 24 7))
(setf *smtp-server* "smtp.kmx.io")
(setf *smtp-user* "noreply@kmx.io")
(setf *smtp-password* "V7IwjWwLHOjRqemc")
(setf facts:*db-path* #P"data/mentats")

(define-template-var title
    "Mentats")

(define-template-var nav
    '("<li><a href=\"/competence\">Compétences</a></li>"
      "<li><a href=\"/blog\">Blog</a></li>"))

(define-template-var nav-right
    '())

(define-template-var token nil)

(require :re)
(use-package :re)

(require :can)
(require :gravatar)
(require :rw-ut)

(cl-json:set-decoder-simple-clos-semantics)

(trace send-email find-template print-template
       trivial-email-utf-8:send-email*)

(defun setup-environment (env)
  (log-msg :INFO "setup environment ~A" (string-downcase env))
  (can:compile-rules)
  (case env
    ((:development)
     #+swank
     (setf (debug-p :conditions) t)
     (setf (debug-p :app) t)
     (setf (debug-p :assets) t)))
  (log-msg :DEBUG "tags:~{ ~A~}" cl-debug::*debug*))
