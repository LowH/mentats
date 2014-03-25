
(defpackage #:can)

(defvar *can-rules*)

(defun reset-rules ()
  (setq *can-rules* nil))

#+nil
(reset-rules)

(defmacro define-permission ((subject permission action object) &body specs)
  `(push '((,subject ,permission ,action ,object) . ,specs)
	 *can-rules*))

#+nil
(define-permission (?user :can :edit ?module)
  (?user :is-a 'user
	 'user.status :active)
  (?module :is-a 'module
	   'module.owner ?user))
#+nil
(define-permission (:everyone :can :view :all))
#+nil
(rule-bindings '?s '?a '?o (first *can-rules*))

(defun can/rule (subject action object rule)
  (destructuring-bind ((s p a o) &body specs) rule
    (let (bindings constants)
      (flet ((unify (r x wild)
	       (if (facts:binding-p r)
		   (push (cons r x) bindings)
		   (push `(or (lessp:lessp-equal ',r ,x)
			      (eq ',r ,wild)
			      (eq ,x ,wild))
			 constants))))
	(unify o object :all)
	(unify a action :admin)
	(unify s subject :everyone))
      `(when (and ,@constants
		  ,@(when specs
		      `((facts:bound-p ,(sublis bindings specs)))))
	 ,p))))

#+nil
(can/rule 'user ':edit 'object (second *can-rules*))

(defun can (action &optional (object :all)
		     (user (or (session-user) :anonymous)))
  (declare (ignore action object user))
  (error "Please COMPILE-CAN-RULES."))

(defun compile-can-rules ()
  (setf (symbol-function 'can)
	(compile nil `(lambda (action &optional (object :all)
					(user (or (session-user) :anonymous)))
			(eq (or ,@(mapcar (lambda (rule)
					    (can/rule 'user 'action 'object rule))
					  *can-rules*))
			    :can)))))

(defun check-can (action &optional
			   (object :all)
			   (user (or (session-user) :anonymous)))
  (unless (can action object user)
    (http-error (case user
		  ((:anonymous) "401 Unauthorized")
		  (t "403 Forbidden"))
		"~S cannot ~S ~S." user action object)))
