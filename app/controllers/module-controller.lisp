
(defun /module#index ()
  (check-can :list 'modules)
  (let ((modules))
    (facts:with ((?m :is-a 'module))
      (unless (module.deleted ?m)
	(push ?m modules)))
    (cond ((accept-p :application/json)
	   (render-json (mapcar #'module-json modules)))
	  (:otherwise
	   (template-let (modules)
	     (render-view :module :index '.html))))))

(defun /module#show (module)
  (check-can :view module)
  (template-let (module)
    (render-view :module :show '.html)))

(defun /module#json (module)
  (check-can :view module)
  (render-json (module-json module)))

(defun /module#edit (module)
  (check-can :edit module)
  (template-let (module)
    (render-view :module :edit '.html)))

(defun /module#create ()
  (check-can :create 'modules)
  (with-form-data (discipline level)
    (redirect-to (module-uri
		  (add-module 'module.discipline discipline
			      'module.level level
			      'module.owner (session-user))
		  :edit))))

(defun /module#update (module)
  (check-can :edit module)
  (facts:with-transaction
    (with-form-data (description discipline level in-library in-classrooms)
      (when description
	(setf (module.description module) description))
      (when discipline
	(setf (module.discipline module) discipline))
      (when level
	(setf (module.level module) level))
      (if in-library
	  (facts:add ((session-user) 'user.library-modules module))
	  (facts:rm (((session-user) 'user.library-modules module))))
      (cond ((accept-p :application/json)
	     (render-json (module-json module)))
	    (t
	     (redirect-to (module-uri module)))))))

(defun /module#delete (module)
  (check-can :delete module)
  (facts:with-transaction
    (setf (module.deleted module) t))
  (redirect-to (user-uri (session-user))))

(defun /module#add-to-library (module)
  (check-can :use module)
  (facts:with-transaction
    (facts:add ((session-user) 'user.library-modules module)))
  (redirect-to (user-uri (session-user))))

#+nil
(defun parse-domain-json (node module)
  (with-json-accessors (id name position) node
    (cond (id
	   (let ((domain (find-domain id)))
	     (unless (and domain (eq module (domain.module domain)))
	       (http-error "404 Not found" "Domain not found"))
	     (check-can :edit domain)
	     (setf (domain.name domain) name
		   (domain.position domain) position)
	     domain))
	  (t
	   (let ((domain (add-domain
			   'domain.module module
			   'domain.name name
			   'domain.position position)))
	     (setf id (domain.id domain))
	     domain)))))

(defun /module#update-domains (module)
  (check-can :edit module)
  (facts:with-transaction
    (with-form-data (nodes links)
      (let ((domains (map 'vector #'find-domain nodes))
            (requires (map 'vector
                           (lambda (link)
                             (cons (find-domain (json-slot link 'source))
                                   (find-domain (json-slot link 'target))))
                           links)))
        (format t "DEBUG domains ~S~%" domains)
        (format t "DEBUG requires ~S~%" requires)
	(facts:with ((?d 'domain.module module))
	  (if (find ?d domains)
	      (facts:with ((?d 'domain.required-domains ?r))
		(unless (find-if (lambda (req)
				   (and (eq (car req) ?r)
					(eq (cdr req) ?d)))
				 requires)
		  (facts:rm ((?d 'domain.required-domains ?r)))))
	      (setf (domain.deleted ?d) t)))
	(map nil (lambda (req)
		   (destructuring-bind (source . target) req
		     (check-can :edit target)
		     (unless (facts:bound-p ((target 'domain.required-domains source)))
		       (facts:add (target 'domain.required-domains source)))))
	     requires)))
    (render-json (module-domains-json module))))

(defun /module#update-classrooms (module)
  (check-can :use module)
  (facts:with-transaction
    (let ((classrooms (map 'list #'find-classroom (form-data))))
      (facts:with ((?c 'classroom.modules module))
	(unless (find ?c classrooms)
	  (facts:rm ((?c 'classroom.modules module)))))
      (dolist (c classrooms)
	(unless (facts:bound-p ((c 'classroom.modules module)))
	  (facts:add (c 'classroom.modules module))))
      (render-json (facts:collect ((?c 'classroom.modules module))
		     (classroom.id ?c))))))

(defun /module (&optional module.id action arg)
  (declare (ignore arg))
  (let ((module (when module.id
		  (or (find-module module.id)
		      (http-error "404 Not found" "Module not found."))))
	(action (when action
		  (or (find (string-upcase action) '(:edit :domains :json
						     :classrooms)
			    :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (case *method*
      (:GET (if module
		(case action
		  ((nil) (/module#show module))
		  ((:edit) (/module#edit module))
		  ((:json) (/module#json module))
		  (t (http-error "404 Not found" "Action not found")))
		(/module#index)))
      (:POST   (if module
		   (case action
		     ((:domains) (/module#update-domains module))
		     (t (http-error "404 Not found" "Action not found")))
		   (/module#create)))
      (:PUT    (unless module
		 (http-error "404 Not found" "Module not found"))
	       (case action
		 ((:classrooms) (/module#update-classrooms module))
		 (t (/module#update module))))
      (:DELETE (/module#delete module)))))
