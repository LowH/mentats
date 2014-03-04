
(defpackage #:can)

(defun can-p (user action object)
  (facts:bound-p ((user action object))))

(defmacro can (action something &optional (user '(or (session-user) :anonymous)))
  `(can-p ,user (intern (symbol-name ,action) ,(find-package :can)) ,something))

(defmacro cannot (action something &optional (user '(or (session-user) :anonymous)))
  `(not (can ,action ,something ,user)))
