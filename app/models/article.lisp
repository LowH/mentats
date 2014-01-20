
;;  Article

(define-accessors article
  :author :body :date :name :tags :title)

;;    read

(defgeneric read-article (input))

(defmethod read-article ((stream stream))
  (let ((obj (json:make-object nil nil)))
    (labels ((eat ()
	       (let ((line (string-right-trim #(#\Return #\Newline)
					      (read-line stream nil ""))))
		 (cond ((emptyp line) (setf (slot-value obj :body)
					    (read-into-string stream)))
		       (t (cl-ppcre:register-groups-bind (name val)
			      ("^([A-Za-z0-9]+):\\s+(.*\\S)\\s*$" line)
			    (when-let ((name (find-symbol (string-upcase name)
							  :keyword)))
			      (when (eq :date name)
				(setf (slot-value obj :date-string) val)
				(setq val (rw-ut:read-time-string val)))
			      (setf (slot-value obj name) val)))
			  (eat))))))
      (eat))
    obj))

(defmethod read-article ((path pathname))
  (with-input-from-file/utf-8 (stream path)
    (apply #'set-attributes (read-article stream)
	   (article-filename-attributes (pathname-name path)))))

(defmethod read-article ((string string))
  (with-input-from-string (stream string)
    (read-article stream)))

;;    write

(defgeneric write-article (output article))

(defmethod write-article ((output stream) (article json:fluid-object))
  (dolist (slot (bound-slots article))
    (when-let ((value (case slot
			((:body :date-string))
			((:date) (rw-ut:write-time-string
				  (slot-value article slot)
				  "YYYY-MM-DD? hh:mm?:ss"))
			(otherwise (slot-value article slot)))))
      (format output "~A: ~A~%"
	      (string-capitalize slot)
	      value)))
  (format output "~%~A" (slot-value article :body))
  (force-output output))

(defmethod write-article ((output pathname) article)
  (with-output-to-file/utf-8 (stream output)
    (write-article stream article)))

(defmethod write-article ((output null) article)
  (with-output-to-string (stream)
    (write-article (the stream stream) article)))

#+test
(write-article *standard-output* (read-article #P"data/blog/intro.txt"))
