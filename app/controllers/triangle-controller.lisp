(defun /> (&optional command &rest args)
  (let ((available-commands '(load-facts reload)))
    (when command
      (unless (setq command (find command available-commands
				  :test #'string-equal))
	#1=(http-error "404 Not Found" "Command not found")))
    (case *method*
      (:GET (if command
		(template-let (command)
		  (render-view :> :show '.html))
		(template-let (available-commands)
		  (render-view :> :index '.html))))
      (:POST (unless (session-user)
	       (http-error "403 Forbidden" "Not authorized"))
	     (if command
		 (render-text
		  (with-output-to-string (*standard-output*)
		    (apply command args)))
		 #1#))
      (otherwise #1#))))
