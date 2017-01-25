
(defun student-uri (&optional student)
  (uri-for `(/student ,@(when student `(,(student.id student))))))
