
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

;;    filename

(defun article-filename-attributes (filename)
  (flet ((parse-tags (tags)
	   (cl-ppcre:split "\\] *\\[" tags)))
    (cl-ppcre:register-groups-bind (date
				    (#'parse-tags tags)
				    name)
	("^(?:(-?[1-9][-0-9]+[ T]?[0-9:]*[0-9]) +)?(?:\\[([^\\]]+(?:\\]\\[[^\\]]+)+)\\] +)?([^.]+)\\s*$"
	 filename)
      (let ((attributes))
	(when tags
	  (setq attributes `(:tags ,tags .,attributes)))
	(when date
	  (setq attributes `(:date ,(rw-ut:read-time-string date)
				   .,attributes)))
	attributes))))

#+test(list
(article-filename-attributes "abc")
(article-filename-attributes "[LOL][OK] abc")
(article-filename-attributes "2013-01-11 abc")
(article-filename-attributes "2013-01-11 [LOL][OK] abc")
)

(defun article-filename (article)
  (with-output-to-string (out)
    (let ((date (article.date article))
	  (tags (article.tags article)))
      (when date
	(write-string (rw-ut:write-time-string (article.date article)
					       "YYYY-MM-DD? hh?:mm?:ss")
		      out)
	(write-char #\Space out))
      (unless (emptyp tags)
	(map nil (lambda (tag)
		   (assert (every (lambda (c) (not (find c "[]"))) tag)
			   () "Invalid tag name ~S" tag)
		   (write-char #\[ out)
		   (write-string tag out)
		   (write-char #\] out))
	     tags)
	(write-char #\Space out))
      (write-string (blog-article-slug article) out))))

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
