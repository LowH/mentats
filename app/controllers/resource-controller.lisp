
(defun /resource#create ()
  (check-can :create 'resources)
  (facts:with-transaction
    (with-form-data (competence text)
      (let ((c (or (find-competence competence)
		   (http-error "404 Not found" "Competence not found"))))
	(add-resource 'resource.competence c
		      'resource.date (get-universal-time)
		      'resource.owner (session-user)
		      'resource.text text)
	(redirect-to (competence-uri c))))))

(defun /resource#update (r)
  (check-can :update r)
  (facts:with-transaction
      (with-form-data (text)
	(setf (resource.text r) text))
    (redirect-to (competence-uri (resource.competence r)))))

(defun /resource#delete (r)
  (check-can :delete r)
  (facts:with-transaction
    (let ((c (resource.competence r)))
      (setf (resource.deleted r) t)
      (redirect-to (competence-uri c)))))

(defun /resource (&optional id)
  (let ((r (when id (or (find-resource id)
			(http-error "404 Not found" "Resource not found.")))))
    (ecase *method*
      ((:GET)    (when r (/resource#show r)))
      ((:POST)   (/resource#create))
      ((:PUT)    (/resource#update r))
      ((:DELETE) (/resource#delete r)))))
