
(define-resource module
  (has-one discipline)
  (has-one level)
  (has-one version)
  (has-one owner :having user.modules)
  (has-one deleted)
  (has-one description))

(defun module-uri (module &key action)
  (let ((uri (uri-for `(/module ,(module.id module)))))
    (ecase action
      ((:edit) (str uri "/edit"))
      ((nil) uri))))

(defun module-image (module)
  (declare (ignore module))
  "module/default-cover.png")
