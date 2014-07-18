
;;  Article

(define-json-accessors article
  author body date date-string name tags title)

;;  filename

(defun article-slug (article)
  (to-url (article.title article)))

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
      (write-string (article-slug article) out))))

(defun article-filename-attributes (filename)
  (flet ((parse-tags (tags)
	   (cl-ppcre:split "\\] *\\[" tags)))
    (cl-ppcre:register-groups-bind (date
				    (#'parse-tags tags)
				    )
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

;;    read

(defgeneric read-article (input))

(defmethod read-article ((stream stream))
  (let ((obj (json:make-object nil nil)))
    (labels ((eat ()
	       (let ((line (string-right-trim #(#\Return #\Newline)
					      (read-line stream nil ""))))
		 (cond ((emptyp line) (setf (article.body obj)
					    (read-into-string stream)))
		       (t (cl-ppcre:register-groups-bind (name val)
			      ("^([A-Za-z0-9]+):\\s+(.*\\S)\\s*$" line)
			    (let ((name (json:json-intern (string-upcase name))))
			      (when (eq 'json.symbols::date name)
				(setf (article.date-string obj) val)
				(setq val (rw-ut:read-time-string val)))
			      (setf (slot-value obj name) val)))
			  (eat))))))
      (eat))
    obj))

(defmethod read-article ((path pathname))
  (with-input-from-file/utf-8 (stream path)
    (apply #'set-json-attributes (read-article stream)
	   (article-filename-attributes (pathname-name path)))))

(defmethod read-article ((string string))
  (with-input-from-string (stream string)
    (read-article stream)))

;;    write

(defgeneric write-article (output article))

(defmethod write-article ((output stream) (article json:fluid-object))
  (dolist (slot (bound-slots article))
    (print (cons slot (slot-value article slot)))
    (when-let ((value (case slot
			((json.symbols::body
			  json.symbols::date-string)
			 nil)
			((json.symbols::date)
			 (rw-ut:write-time-string
			  (slot-value article slot)
			  "YYYY-MM-DD? hh:mm?:ss"))
			(otherwise (slot-value article slot)))))
      (format output "~A: ~A~%"
	      (string-capitalize slot)
	      value)))
  (format output "~%~A" (article.body article))
  (force-output output))

(defmethod write-article ((output pathname) article)
  (ensure-directories-exist output)
  (with-output-to-file/utf-8 (stream output)
    (write-article stream article)))

(defmethod write-article ((output null) article)
  (with-output-to-string (stream)
    (write-article (the stream stream) article)))

#+test
(write-article *standard-output* (read-article #P"data/blog/intro.txt"))
