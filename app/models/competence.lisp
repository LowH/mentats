
(defun sym (&rest parts)
  (intern (apply #'concatenate 'string (mapcar #'string parts))))

;;  Resource definition macros

(defparameter *resource-macros*
  nil
  "Alist of macros available during DEFINE-RESOURCE.")

(defun resource-macro (name)
  (cdr (assoc name *resource-macros*)))

(defsetf resource-macro (name) (value)
  `(let ((cell (assoc ,name *resource-macros*)))
     (if cell
	 (setf (cdr cell) ,value)
	 (progn (push (cons ,name ,value) *resource-macros*)
		,value))))

(defmacro define-resource-macro (name args &body body)
  (let ((macro-name (sym 'define-resource/ name)))
    `(eval-when (:compile-toplevel :load-toplevel :execute)
       (defmacro ,macro-name ,args
	 ,@body)
       (setf (resource-macro ',name) ',macro-name))))

(defmacro with-resource-macros (resource-name &body body)
  (labels ((walk (x)
	     (if (consp x)
		 (let ((macro-name (resource-macro (car x)))
		       (rest (mapcar #'walk (rest x))))
		   (if macro-name
		       (list* macro-name resource-name rest)
		       (cons (car x) rest)))
		 x)))
    `(progn ,@(mapcar #'walk body))))

;;  Relations

(defmacro resource-relation (slot-name)
  `(sym resource-name "." ,slot-name))

;;  Relation with multiple objects

(define-resource-macro many (resource-name collection-name)
  (let ((accessor (resource-relation collection-name)))
    `(progn (defun ,accessor (,resource-name)
	      (facts:collect ((,resource-name ',accessor ?x))
		?x))
	    (defmacro ,(sym 'do- accessor) ((var ,resource-name) &body body)
	      `(facts:with ((,,resource-name ',',accessor ?x))
		 (let ((,var ?x))
		   ,@body))))))

;;  Relation to one object

(define-resource-macro one (resource-name slot-name &key read-only many)
  (let ((accessor (resource-relation slot-name)))
    `(progn (defun ,accessor (,resource-name)
	      (facts:first-bound ((,resource-name ',accessor ?))))
	    ,@(unless read-only
		`((defsetf ,accessor (,resource-name) (,slot-name)
		    `(facts:with-transaction
		       (facts:rm ((,,resource-name ',',accessor ?)))
		       (facts:add (,,resource-name ',',accessor ,,slot-name))
		       ,,slot-name))))
	    ,@(when many
		(let ((many-accessor (resource-relation many)))
		  `((defun ,many-accessor (,resource-name)
		      (facts:collect ((?x ',accessor ,resource-name))
			?x))
		    (defmacro ,(sym 'do- many-accessor)
			((var ,resource-name) &body body)
		      `(facts:with ((?x ',',accessor ,,resource-name))
			 (let ((,var ?x))
			   ,@body)))))))))

;;  The actual macro

(defun make-resource-id ()
  (base64:integer-to-base64-string
   (random most-positive-fixnum) :uri t))

(defmacro define-resource (resource-name &body body)
  (let ((find-resource (sym 'find- resource-name))
	(resource.id (sym resource-name '.id)))
    `(with-resource-macros ,resource-name
       (one id :read-only t)
       (defun ,find-resource (id)
	 (facts:first-bound ((?c :is-a ',resource-name)
			     (?c ',resource.id id))))
       (defmacro ,(sym 'add- resource-name) (&body properties)
	 `(facts:with-transaction
	    (let ((id (loop for i = (make-resource-id)
			 while (,',find-resource i)
			 finally (return i))))
	      (facts:with-anon (,',resource-name)
		(facts:add (,',resource-name :is-a ',',resource-name
					     ',',resource.id id
					     ,@properties)))
	      id)))
       ,@body)))

;;  Competence

(define-resource competence
  (one name)
  (one parent :many children)
  (one cells)
  (many requires))

(defun find-competence-by-name (name)
  (facts:first-bound ((?c :is-a 'competence
			  'competence.name name))))

(defun competence-as-cons (c)
  (cons (competence.id c) (competence.name c)))

(defun competence.json (c)
  (json:make-object `((:id . ,(competence.id c))
		      (:name . ,(competence.name c))
		      (:parent . ,(competence.parent c))
		      (:cells . ,(or (competence.cells c) #())))
		    nil))
