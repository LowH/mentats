
(defun /blog#index ()
  (template-let ((articles (blog.articles :read t)))
    (render-view :blog :index '.html)))

(defun /blog#show (article)
  (template-let (article)
    (render-view :blog :show '.html)))

(defun /blog#create ()
  (with-form-data (article)
    (let ((a (read-article (the string article))))
      (write-blog.article a)
      (redirect-to (article-uri a)))))

(defun /blog#update (a)
  (with-form-data (article)
    (let ((new (read-article (the string article))))
      (delete-blog.article a)
      (write-blog.article new)
      (redirect-to (article-uri new)))))

(defun /blog#delete (a)
  (delete-blog.article a)
  (redirect-to `(/blog)))

(defun /blog (&key year month day tags slug)
  (let ((article (when (or year month day slug tags)
		   (or (first (blog.articles
			       :year (and year (parse-integer year))
			       :month (and month (parse-integer month))
			       :day (and day (parse-integer day))
			       :tags tags
			       :slug slug :read t :end 1))
		       (http-error "404 Not found"
				   "Blog article not found.")))))
    (ecase *method*
      ((:GET)    (if article (/blog#show article) (/blog#index)))
      ((:POST)   (/blog#create))
      ((:PUT)    (/blog#update article))
      ((:DELETE) (/blog#delete article)))))
