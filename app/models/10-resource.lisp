
(defun resource-uri (&optional resource)
  (uri-for (if resource
	       `(/resource ,(resource.id resource))
	       `(/resource))))

(defun resource-json (r)
  (json:make-object `((date . ,(resource.date r))
		      (owner . ,(resource.owner r))
		      (text . ,(resource.text r)))
		    nil))
