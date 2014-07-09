
(define-resource classroom
  (has-one deleted)
  (has-one level)
  (has-one name)
  (has-many students)
  (has-many teachers :having user.classrooms))

(defun classroom-uri (classroom &key action)
  (uri-for `(/classroom ,(classroom.id classroom)
			,@(when action `(,action)))))