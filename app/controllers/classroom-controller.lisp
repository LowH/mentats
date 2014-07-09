
(defun /classroom#show (classroom)
  (check-can :view classroom)
  (template-let (classroom)
    (render-view :classroom :show '.html)))

(defun /classroom#json (classroom)
  (check-can :view classroom)
  (render-json (classroom-json classroom)))

(defun /classroom#create ()
  (check-can :create 'classrooms)
  (with-form-data (name level)
    (redirect-to (classroom-uri
		  (add-classroom 'classroom.name name
				 'classroom.level level
				 'classroom.teachers (session-user))
		  :action :edit))))

(defun /classroom#edit (classroom)
  (check-can :edit classroom)
  (template-let (classroom)
    (render-view :classroom :edit '.html)))

(defun /classroom#update (classroom)
  (check-can :edit classroom)
  (with-form-data (name level)
    (setf (classroom.name classroom) name
	  (classroom.level classroom) level)
    (redirect-to (classroom-uri classroom))))

(defun /classroom#delete (classroom)
  (check-can :delete classroom)
  (facts:with-transaction
    (setf (classroom.deleted classroom) t))
  (redirect-to (user-uri (session-user))))

(defun /classroom (&optional classroom.id action)
  (let ((classroom (when classroom.id
		     (or (find-classroom classroom.id)
			 (http-error "404 Not found" "Classroom not found."))))
	(action (when action
		  (or (find (string-upcase action) '(:edit :json) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (case *method*
      (:GET (if classroom
		(ecase action
		  ((nil) (/classroom#show classroom))
		  ((:edit) (/classroom#edit classroom))
		  ((:json) (/classroom#json classroom)))
		(/classroom#index)))
      (:POST   (cond ((and classroom (eq action :domains))
		      (/classroom#update-domains classroom))
		     (t
		      (/classroom#create))))
      (:PUT    (/classroom#update classroom))
      (:DELETE (/classroom#delete classroom)))))
