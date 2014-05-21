
(defun /domain#create ()
  (with-form-data (name module required-domains)
    (redirect-to
     (domain-uri
      (add-domain 'domain.name name
		  'domain.module module
		  'domain.required-domains required-domains)))))

(defun /domain (&optional id)
  (let ((domain (when id
		  (or (find-domain id)
		      (http-error "404 Not found" "Domain not found.")))))
    (ecase *method*
      ((:GET)    (if domain (/domain#show domain) (/domain#index)))
      ((:POST)   (/domain#create))
      ((:PUT)    (/domain#update domain))
      ((:DELETE) (/domain#delete domain)))))
