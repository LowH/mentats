
(defvar *user* nil)

(defun session-login-hmac (&key (nonce (make-random-string 16))
			     (date (rw-ut:write-time-string
				    (get-universal-time))))
  (values (session-hmac *uri* date nonce) date nonce))

(defun /session/login#get ()
  (multiple-value-bind (hmac date nonce) (session-login-hmac)
    (template-let ((login-hmac hmac)
		   (login-date date)
		   (login-nonce nonce))
      (render-view :session :login '.html))))

(defun check-password (login pass)
  (string= login pass))

(defun /session/login#post ()
  (with-form-data (l p nonce date hmac redirect-to)
    (unless (string= hmac (session-login-hmac :nonce nonce :date date))
      (http-error "402 Invalid request" "Invalid hmac"))
    (unless (check-password l p)
      (http-error "403 Forbidden" "Login/pass not found"))
    (session-reset)
    (redirect-to (if (char= #\/ (char redirect-to 0))
		     redirect-to
		     "/"))))

(defun /session/login ()
  (ecase *method*
    ((:GET) (/session/login#get))
    ((:POST) (/session/login#post))))

(defun /session/logout ()
  (when-let ((s (session-attach)))
    (session-delete s)
    ))
