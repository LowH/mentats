
(defun /competence#index ()
  (template-let ((title "Compétences")
		 (competences nil))
    (facts:with ((?c :is-a 'competence))
      (print ?c)
      (unless (facts:bound-p ((?c 'competence.parent ?)))
	(push (competence-as-cons ?c) competences)))
    (render-view :competence :index '.html)))

(defun /competence#show (c)
  (let ((id (competence.id c))
	(name (competence.name c)))
    (template-let ((id id)
		   (name name)
		   (title name)
		   (competence (competence.json c))
		   (parent (competence.parent c)))
      (render-view :competence :show '.html))))

(defun /competence#create ()
  (with-form-data (competence.name)
    (when (emptyp competence.name)
      (http-error "400 Invalid request" "Bad input"))
    (add-competence 'competence.name competence.name)
    (redirect-to `(/competence :name ,competence.name))))

(defmacro with-assoc (bindings alist &body body)
  (let ((g!alist (gensym "ALIST-")))
    `(let ((,g!alist ,alist))
       (symbol-macrolet
	   ,(mapcar (lambda (b)
		      (let ((var (if (consp b) (car b) b))
			    (key (if (consp b) (cdr b) (intern (symbol-name b)
							       :keyword))))
			`(,var (cdr (assoc ,key ,g!alist)))))
		    bindings)
	 ,@body))))

(defun /competence#update (c)
  (with-form-data (name cells)
    (declare (type string name))
    (when (emptyp name)
      (http-error "400 Invalid request" "Bad input"))
    (facts:with-transaction
      (setf (competence.name c) name)
      (setf (competence.cells c) cells))
    (if (accept-p :application/json)
	(render-json (competence.json c))
	(redirect-to `(/competence :name ,name)))))

(defun /competence#delete (c)
  (facts:rm ((c ?p ?o)))
  (facts:rm ((?s c ?o)))
  (facts:rm ((?s ?p c)))
  (redirect-to `(/competence)))

(defun /competence (&key name id)
  (let ((c (cond (id (or (find-competence id)
			 (http-error "404 Not found" "No competence with ID ~S" id)))
		 (name (or (find-competence-by-name name) ; FIXME
			   (http-error "404 Not found" "No competence named ~S" name))))))
    (format t "COMPETENCE ~S" c)
    (template-let ((title "Mentats"))
      (ecase *method*
	((:GET)    (if c (/competence#show c) (/competence#index)))
	((:POST)   (/competence#create))
	((:PUT)    (/competence#update c))
	((:DELETE) (/competence#delete c))))))