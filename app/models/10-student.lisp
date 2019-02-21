
(defun student-uri (&optional student action)
  (uri-for `(/student ,@(when student `(,(student.id student)))
                      ,@(when action `(,action)))))
