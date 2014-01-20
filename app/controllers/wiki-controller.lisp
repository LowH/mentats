
(defun /wiki#show (article)
  (template-let (article)
    (render-view :wiki :show '.html)))

(defun /wiki#create ()
  (with-form-data (article)
    (let ((a (read-article (the string article))))
      (wiki-write-article a)
      (redirect-to (wiki-uri a)))))

(defun /wiki#update (a)
  (with-form-data (article)
    (let ((new (read-article (the string article))))
      (wiki-delete-article a)
      (wiki-write-article new)
      (redirect-to (wiki-uri new)))))

(defun /wiki#delete (a)
  (wiki-delete-article a)
  (redirect-to `(/wiki "index")))

(defun /wiki (&optional (slug (when (eq *method* :GET) "index")))
  (print `(session-data ,(session-data (session))))
  (let ((article (when slug
		   (or (wiki-read-article slug)
		       (http-error "404 Not found"
				   "Blog article not found.")))))
    (ecase *method*
      ((:GET)    (/wiki#show article))
      ((:POST)   (/wiki#create))
      ((:PUT)    (/wiki#update article))
      ((:DELETE) (/wiki#delete article)))))
