
(define-resource user
  (has-one login)
  (has-one name)
  (has-one password-hash))

(defsetf user.password (user) (password)
  `(setf (user.password-hash ,user) (bcrypt ,password)))
