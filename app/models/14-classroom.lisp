
(define-resource classroom
  (has-one deleted)
  (has-one level)
  (has-many modules :having module.classrooms)
  (has-one name)
  (has-many students :having student.classrooms)
  (has-many teachers :having user.classrooms))

(defun classroom-uri (classroom &key action)
  (uri-for `(/classroom ,(classroom.id classroom)
			,@(when action `(,action)))))

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