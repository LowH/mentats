
(defun /wiki#show (article)
  (check-can :view article)
  (template-let (article
		 (id (str "wiki_" (to-url (article.name article)))))
    (render-view :wiki (if (session-user) :show-editable :show) '.html)))

(defun /wiki#create ()
  (check-can :create :wiki-pages)
  (with-form-data (article)
    (let ((a (read-article (the string article))))
      (wiki-write-article a)
      (redirect-to (wiki-uri a)))))

(defun /wiki#update (a)
  (check-can :modify a)
  (with-form-data (article)
    (let ((new (read-article (the string article))))
      (wiki-delete-article a)
      (wiki-write-article new)
      (redirect-to (wiki-uri new)))))

(defun /wiki#delete (a)
  (check-can :delete a)
  (wiki-delete-article a)
  (redirect-to `(/wiki "index")))

(defun /wiki (&optional (slug (when (eq *method* :GET) "index")))
  (let ((article (when slug
		   (or (wiki-read-article slug)
		       (unless (session-user)
			 (http-error "404 Not found" "Wiki page not found."))
		       (set-json-attributes
			{}
			:name slug
			:title (cl-ppcre:scan-to-strings
				"[^/]+$" slug)
			:author (user.name (session-user))
			:date (get-universal-time)
			:body "")))))
    (ecase *method*
      ((:GET)    (/wiki#show article))
      ((:POST)   (/wiki#create))
      ((:PUT)    (/wiki#update article))
      ((:DELETE) (/wiki#delete article)))))
