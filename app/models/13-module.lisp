
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
     `((nodes . ,(mapcar #'domain.id domains))
       (links . ,(mapcan (lambda (domain)
			   (let ((id (domain.id domain)))
			     (mapcar (lambda (req)
				       `((source . ,(domain.id req))
					 (target . ,id)))
				     (domain-required-domains domain))))
			 domains)))
     nil)))

(defun module-in-library-p (module &optional (user (session-user)))
  (facts:bound-p ((user 'user.library-modules module))))


;;  Related domain

(defun domain-owner (d)
  (module.owner (domain.module d)))


;;  Related competence

(defun competence-owner (c)
  (domain-owner (competence.domain c)))
