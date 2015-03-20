
(case cfg:*environment*
  ((:development)
   (setf (debug-p :app) t)
   (setf (debug-p :assets) t)))

(msg "DEBUG tags:~{ ~A~}" cl-debug::*debug*)
