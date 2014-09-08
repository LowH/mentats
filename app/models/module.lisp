
(define-resource module
  (has-one discipline)
  (has-one level)
  (has-one version)
  (has-one owner :having user.modules)
  (has-one deleted)
  (has-one description))

(defun module-uri (module &rest args)
  (uri-for `(/module ,(module.id module) ,@args)))

(defun module-image (module)
  (declare (ignore module))
  "module/default-cover.png")

(defun module-domains (module)
  (remove-if #'domain.deleted (module.domains module)))

(defun module-domains-json (module)
  (let ((domains (module-domains module)))
    (json:make-object
     `((nodes . ,(mapcar #'domain-json domains))
       (links . ,(mapcan (lambda (domain)
			   (mapcan (lambda (req)
				     `(((source . ,(domain.id req))
					(target . ,(domain.id domain)))))
				   (domain-required-domains domain)))
			 domains)))
     nil)))

(defun module-in-library-p (module &optional (user (session-user)))
  (facts:bound-p ((user 'user.library-modules module))))

(defun module-json (module)
  (facts:with-transaction
    (to-json
     `((id . ,(module.id module))
       (discipline . ,(module.discipline module))
       (level . ,(module.level module))
       (version . ,(module.version module))
       (owner . ,(user.id (module.owner module)))
       (description . ,(module.description module))
       (background-image . ,(asset-url (module-image module)))
       (in-library . ,(module-in-library-p module))
       (in-classrooms . ,(mapcar #'module.id (module.classrooms module)))
       (domains . ,(module-domains-json module))
       (can . ((use . ,(can :use module))
	       (edit . ,(can :edit module))))))))
