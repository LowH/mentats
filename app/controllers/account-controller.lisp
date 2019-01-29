
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
            (let ((user (authenticate-user l p)))
              (template-let ((alerts nil)
                             redirect-to)
                (unless user
                  (alert :danger "Login et/ou mot de passe incorrect.")
                  (http-error "401 Not authorized" "Account not found"))
                (when session
                  (session-reset))
                (setf (session-user) user)
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

(defun /account/reset-password#form (&optional email)
  (template-let (email)
    (render-view :account :reset-password '.html)))

(defun /account/reset-password#submit ()
  (with-form-data (email)
    (let ((user (facts:first-bound ((?user 'user.email email)))))
      (cond (user
             (let* ((date (get-universal-time))
                    (token (hmac-string (str date) email)))
               (facts:add (token 'token.date date
                                 'token.email email))
               (template-let (token)
                 (send-email :account :reset-password-email email
                             "Réinitialisation du mot de passe")))
             (template-let (email)
               (render-view :account :reset-password-submit '.html)))
            (t
             (template-let (email)
               (render-view :account :register '.html)))))))

(defun remove-reset-password-token (token)
  (facts:rm ((token 'token-date ?date
                    'token.email ?email))))

(defun check-reset-password-token (token)
  (let ((date (facts:first-bound ((token 'token.date ?date)))))
    (when (or (null date)
              (< date (- (get-universal-time) (* 3600 24))))
      (remove-reset-password-token token)
      (http-error "404 Not found" "Token not found"))))

(defun /account/reset-password#token (token)
  (check-reset-password-token token)
  (template-let (token)
    (render-view :account :reset-password-token '.html)))

(defun /account/reset-password#token-submit (token)
  (check-reset-password-token token)
  (facts:with ((token 'token.email ?email)
               (?user 'user.email ?email))
    (with-form-data (password)
      (setf (user.password ?user) password))
    (remove-reset-password-token token)
    (redirect-to '(/account/login))))

(defun /account/reset-password (&optional token)
  (template-let ((alerts nil))
    (ecase *method*
      ((:GET)  (if token
                   (/account/reset-password#token token)
                   (/account/reset-password#form)))
      ((:POST) (if token
                   (/account/reset-password#token-submit token)
                   (/account/reset-password#submit))))))

;;  Register

(defun /account/register#form ()
  (render-view :account :register '.html))

(defun /account/register#submit ()
  (with-form-data (name email password)
    (declare (type string password))
    (let (error-fields)
      (when (facts:bound-p ((?u 'user.email email)))
	(alert :danger "Un compte existe déjà avec cette adresse e-mail.")
	(push :email error-fields))
      (if error-fields
	  (template-let (error-fields name email)
	    (render-view :account :register '.html))
	  (progn (add-user 'user.name name
			   'user.email email
			   'user.password-hash (password-hash password))
		 ;; FIXME: e-mail confirmation
		 (redirect-to `(/account/register/ok)))))))

(defun /account/register ()
  (template-let ((alerts nil))
    (ecase *method*
      ((:GET)  (/account/register#form))
      ((:POST) (/account/register#submit)))))

(defun /account/register/ok ()
  (template-let ((alerts nil))
    (alert :success "Votre inscription a bien été validée. Vous pouvez maintenant vous connecter avec votre adresse e-mail et votre mot de passe.")
    (render-view :account :login '.html)))
