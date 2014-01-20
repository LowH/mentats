
(defun wiki-article-slug (article)
  (format nil "~{~A~^/~}"
	  (mapcar #'to-url (cl-ppcre:split "/" (article.name article)))))

(defun wiki-uri (article)
  (uri-for `(/wiki ,(wiki-article-slug article))))

(defun wiki-path (wiki)
  (let ((name (if (typep wiki 'json:fluid-object)
		  (wiki-article-slug wiki)
		  wiki)))
    (when (find #\. name)
      (http-error "404 Not found" "Wiki article not found"))
    (pathname (str "data/wiki/" name ".md"))))

(defun wiki-read-article (name)
  (let ((path (the pathname (wiki-path name))))
    (unless (probe-file path)
      (http-error "404 Not found" "Wiki article not found ~S" name))
    (set-attributes (read-article path) :name name)))

(defun wiki-write-article (article)
  (write-article (the pathname (wiki-path article)) article))

(defun wiki-delete-article (article)
  (delete-file (wiki-path article)))
