
(defun /wiki#show (article)
  (template-let (article
		 (id (str "wiki_" (to-url (article.name article)))))
    (render-view :wiki (if (session-user) :show-editable :show) '.html)))

(defun /wiki#create ()
  (unless (session-user)
    (http-error "403 Forbidden" "Access forbidden"))
  (with-form-data (article)
    (let ((a (read-article (the string article))))
      (wiki-write-article a)
      (redirect-to (wiki-uri a)))))

(defun /wiki#update (a)
  (unless (session-user)
    (http-error "403 Forbidden" "Access forbidden"))
  (with-form-data (article)
    (let ((new (read-article (the string article))))
      (wiki-delete-article a)
      (wiki-write-article new)
      (redirect-to (wiki-uri new)))))

(defun /wiki#delete (a)
  (unless (session-user)
    (http-error "403 Forbidden" "Access forbidden"))
  (wiki-delete-article a)
  (redirect-to `(/wiki "index")))

(defun /wiki (&optional (slug (when (eq *method* :GET) "index")))
  (print `(session-data ,(session-data (session))))
  (let ((article (when slug
		   (or (wiki-read-article slug)
		       (if (session-user)
			   (set-attributes {}
					   :name slug
					   :title (cl-ppcre:scan-to-strings
						   "[^/]+$" slug)
					   :author (user.name (session-user))
					   :date (get-universal-time)
					   :body "")
			 (http-error "404 Not found" "Wiki page not found."))))))
    (ecase *method*
      ((:GET)    (/wiki#show article))
      ((:POST)   (/wiki#create))
      ((:PUT)    (/wiki#update article))
      ((:DELETE) (/wiki#delete article)))))
