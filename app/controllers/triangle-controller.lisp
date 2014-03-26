(defun /> (&optional command &rest args)
  (check-can :admin :>)
  (let ((available-commands '(load-app load-facts reload)))
    (when command
      (unless (setq command (find command available-commands
				  :test #'string-equal))
	#1=(http-error "404 Not Found" "Command not found")))
    (template-let (command available-commands)
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
		      (print (apply command args))))
		   #1#))
	(otherwise #1#)))))
