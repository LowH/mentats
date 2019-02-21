
(defun classroom-uri (classroom &key action)
  (str "/classroom/" (classroom.id classroom)
       (when action `("/" ,(string-downcase action)))))

(defun classroom-students (c)
  (sort (remove-if #'student.deleted
		   (classroom.students c))
	#'string<
	:key (lambda (s) (string-upcase
			  (student.name s)))))

(defun classroom-json (c)
  (to-json `((level . ,(classroom.level c))
	     (modules . ,(mapcar #'module.id (classroom.modules c)))
	     (name . ,(classroom.name c))
	     (students . ,(mapcar #'student.id (classroom.students c)))
	     (teachers . ,(mapcar #'user.id (classroom.teachers c))))))
