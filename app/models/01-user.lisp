
(defun user-uri (user)
  (uri-for `(/user ,(user.id user))))

(defun check-password (password hash)
  (string= (password-hash password hash) hash))

(defsetf user.password (user) (password)
  `(setf (user.password-hash ,user) (password-hash ,password)))

(defun authenticate-user (id password)
  (facts:with ((?user :is-a 'user
		      'user.password-hash ?hash))
    (when (and (or (facts:bound-p ((?user 'user.email id)))
		   (facts:bound-p ((?user 'user.login id)))
		   (facts:bound-p ((?user 'user.name id))))
	       (check-password password ?hash))
      (return ?user))))

(defun session.user (session)
  (with-session-db
    (facts:first-bound ((session 'session.user ?)))))

(defsetf session.user (session) (user)
  (let ((g!session (gensym "SESSION-")))
    `(when-let ((,g!session ,session))
       (with-session-db
         (facts:with-transaction
           (cond
             ((null ,user) (facts:rm ((,g!session 'session.user ?))))
             (t (when (facts:bound-p ((,g!session 'session.user ?)))
                  (error "Session user cannot be set twice."))
                (facts:add (,g!session 'session.user ,user))))
           ,user)))))

(defun session-user ()
  (session.user (session)))

(defsetf session-user () (user)
  `(setf (session.user (session)) ,user))

(defun check-can (action &optional
			   (object :all)
			   (user (or (session-user) :anonymous)))
  (unless (can:can action object user)
    (http-error (case user
		  ((:anonymous) "401 Unauthorized")
		  (t "403 Forbidden"))
		"~S cannot ~S ~S." user action object)))

(defun can (action &optional
		     (object :all)
		     (user (or (session-user) :anonymous)))
  (can:can action object user))

#+nil
(defun list-resource (type &key order-by start (limit 20))
  (let* ((resources (cons nil nil))
	 (resources-tail resources)
	 (values (cons nil nil))
	 (values-tail values))
    (flet ((push (obj)
	     (facts:with ((obj order-by ?val))
	       (loop
		  :for r = resources :then (cdr r)
		  :for v = values :then (cdr v)
		  :unless (lessp:lessp (car v) ?val)
		  :do (return (setf (cdr r) (cons (car r) (cdr r))
				    (car r) ?val))
		))))
      (facts:with ((?resource :is-a type
			      order-by ?ord))
	(unless (lessp:lessp start ?resource)
	  (push ?resource))))
    (cdr head)))
