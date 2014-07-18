
(define-resource student
  (has-one deleted)
  (has-one name))

(defun student-uri (&optional student)
  (uri-for `(/student ,@(when student `(,(student.id student))))))

(defun student-json (student)
  (set-json-attributes {} :name (student.name student)))
