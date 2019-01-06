
;;  Login

(defun /account/login#get ()
  (render-view :account :login '.html))

(defun /account/login#post ()
  (with-form-data (l p redirect-to)
    (flet ((redirect ()
             (redirect-to (or (and redirect-to
                                   (char= #\/ (char redirect-to 0))
                                   redirect-to)
                              "/"))))
      (let ((session (session-attach)))
        (if (session.user session)
            (redirect)
            (let ((u (authenticate-user l p)))
              (template-let ((alerts nil)
                             redirect-to)
                (unless u
                  (alert :danger "Login et/ou mot de passe incorrect.")
                  (http-error "401 Not authorized" "Account not found"))
                (when session
                  (session-reset))
                (setf (session-user) u)
                (redirect))))))))

(defun /account/login ()
  (ecase *method*
    ((:GET) (/account/login#get))
    ((:POST) (/account/login#post))))

;;  Logout

(defun /account/logout (&optional redirect-to)
  (setf (session-user) nil)
  (session-end)
  (redirect-to (or (and redirect-to
			(char= #\/ (char redirect-to 0))
			redirect-to)
		   "/")))

;;  Reset password

(defun /account/reset-password (&optional hmac)
  (declare (ignore hmac)))

;;  Register

(defun /account/register#form ()
  (render-view :account :register '.html))

(defun /account/register#submit ()
  (with-form-data (name email password)
    (declare (type string password))
    (let (error-fields)
      (when (facts:bound-p ((?u 'user.email email)))
	(alert :danger "Un compte existe d&eacute;j&agrave; avec cette adresse e-mail.")
	(push :email error-fields))
      (if error-fields
	  (template-let (error-fields name email)
	    (render-view :account :register '.html))
	  (progn (add-user 'user.name name
			   'user.email email
			   'user.password-hash (hash-password password))
		 ;; FIXME: e-mail confirmation
		 (redirect-to `(/account/register/ok)))))))

(defun /account/register ()
  (template-let ((alerts nil))
    (ecase *method*
      ((:GET)  (/account/register#form))
      ((:POST) (/account/register#submit)))))

(defun /account/register/ok ()
  (template-let ((alerts nil))
    (alert :success "Votre inscription a bien &eacute;t&eacute; valid&eacute;e. Vous pouvez maintenant vous connecter avec votre adresse e-mail et votre mot de passe.")
    (render-view :account :login '.html)))
