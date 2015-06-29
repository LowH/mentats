
(define-resource student
  (has-one deleted)
  (has-one name)
  (has-many competences))

(defun student-uri (&optional student)
  (uri-for `(/student ,@(when student `(,(student.id student))))))
