
(define-resource module
  (has-one discipline)
  (has-one level)
  (has-one version)
  (has-one owner :having user.modules)
  (has-one deleted))

(defun module-uri (module)
  (uri-for `(/module ,(module.id module))))

(defun module-image (module)
  (declare (ignore module))
  "module/default-cover.png")
