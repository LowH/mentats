
;;  Article

(defun article-year (article)
  (multiple-value-bind (s m h day month year)
      (decode-universal-time (article.date article))
    (declare (ignore s m h day month))
    year))

(defun article-month (article)
  (multiple-value-bind (s m h day month year)
      (decode-universal-time (article.date article))
    (declare (ignore s m h day year))
    month))

(defun blog-article-slug (article)
  (to-url (article.title article)))

(defun blog-article-uri (article)
  (multiple-value-bind (s m h day month year)
      (decode-universal-time (article.date article))
    (declare (ignorable s m h day month year))
    (uri-for `(/blog :year ,year
		     :month ,(str (when (< month 10) #\0) month)
		     :slug ,(blog-article-slug article)))))

;;  Blog

(defvar *blog-path* #P"data/blog/")

(defun blog.articles (&key tags year month day slug
			read (start 0) (end most-positive-fixnum))
  (let ((wild (str (or year "*")
		   (when (or year month day) "-")
		   (when (and month (< month 10)) "0")
		   (or month (when (or year day) "*"))
		   (when day "-")
		   (when (and day (< day 10)) "0")
		   (or day (when (or year month) "*"))
		   (when (or year month day) " ")
		   (when tags "[*] ")
		   (or slug "*")
		   ".md")))
    (format t "~&WILD ~S~%" wild)
    (loop
       :for path :in (sort (directory (merge-pathnames wild *blog-path*))
			   #'string> :key #'namestring)
       :for pathname = (pathname path)
       :for name = (pathname-name pathname)
       :with i = -1
       :unless (or (char= #\. (char name 0))
		   (when tags (cl-ppcre:scan
			       `(:sequence
				 #\[ ,@(if (cdr tags)
					   `((:alternation ,@tags))
					   tags)
				 #\])
			       name))
		   (< (incf i) start)
		   (when end (<= end i)))
       :collect (if read (read-article pathname) pathname))))

(defun blog.article.pathname (article)
  (merge-pathnames (make-pathname :name (article-filename article)
				  :type "md")
		   *blog-path*))

(defun write-blog.article (article)
  (write-article (blog.article.pathname article) article)
  article)

(defun delete-blog.article (article)
  (delete-file (blog.article.pathname article))
  article)
