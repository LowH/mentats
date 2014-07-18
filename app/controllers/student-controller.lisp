
(defun /student#show (student)
  (check-can :view student)
  (template-let (student)
    (render-view :student :show '.html)))

(defun /student#json (student)
  (check-can :view student)
  (render-json (student-json student)))

(defun /student#edit (student)
  (check-can :edit student)
  (template-let (student)
    (render-view :student :edit '.html)))

(defun /student#create ()
  (check-can :create 'students)
  (with-form-data (classroom name redirect)
    (let ((classroom (or (find-classroom classroom)
			 (http-error "404 Not found" "Classroom not found"))))
      (redirect-to (or redirect
		       (student-uri
			(add-student 'student.classrooms classroom
				     'student.name name)))))))

(defun /student#update (student)
  (check-can :edit student)
  (with-form-data (name)
    (setf (student.name student) name)
    (redirect-to (student-uri student))))

(defun /student#delete (student)
  (check-can :delete student)
  (facts:with-transaction
    (setf (student.deleted student) t))
  (redirect-to (user-uri (session-user))))

(defun /student (&optional student.id action)
  (let ((student (when student.id
		  (or (find-student student.id)
		      (http-error "404 Not found" "Student not found."))))
	(action (when action
		  (or (find (string-upcase action) '(:edit :domains :json) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (case *method*
      (:GET (if student
		(ecase action
		  ((nil) (/student#show student))
		  ((:edit) (/student#edit student))
		  ((:json) (/student#json student)))
		(http-error "404 Not found" "Action not found.")))
      (:POST   (/student#create))
      (:PUT    (/student#update student))
      (:DELETE (/student#delete student)))))
