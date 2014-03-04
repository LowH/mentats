
(defun /session/login#get ()
  (render-view :session :login '.html))

(defun check-password (login pass)
  (facts:with ((?user 'user.login login
		      'user.password-hash ?hash))
    (when (string= ?hash (bcrypt pass :salt ?hash))
      (return t))))

(defun /session/login#post ()
  (with-form-data (l p redirect-to)
    (unless (check-password l p)
      (http-error "403 Forbidden" "Login/pass not found"))
    (session-reset)
    (setf (current-user) l)
    (session)
    (redirect-to (or (and redirect-to
			  (char= #\/ (char redirect-to 0))
			  redirect-to)
		     "/"))))

(defun /session/login ()
  (ecase *method*
    ((:GET) (/session/login#get))
    ((:POST) (/session/login#post))))

(defun /session/logout (&optional redirect-to)
  (setf (current-user) nil)
  (session-end)
  (redirect-to (or (and redirect-to
			(char= #\/ (char redirect-to 0))
			redirect-to)
		   "/")))
