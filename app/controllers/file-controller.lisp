
(defun sanitize (path)
  (cl-ppcre:regex-replace "//+" path "/"))

(defun /file#index (base path truepath)
  (let* ((path-dirs (cl-ppcre:split "/" path))
	 dirs
	 files)
    (dolist (p (directory (make-pathname :name :wild
					 :type :wild
					 :defaults truepath)))
      (unless (cl-ppcre:scan "/[.]" (namestring p))
	(print (file-namestring p))
	(if (pathname-name p)
	    (push (file-namestring p) files)
	    (push (car (last (pathname-directory p))) dirs))))
    (setq dirs (nreverse dirs))
    (setq files (nreverse files))
    (template-let (base path path-dirs dirs files)
      (render-view :file :index '.html))))

(defun /file#show (path)
  (send-file path))

(defun /file (base &rest path)
  (let* ((base (sanitize (str base "/")))
	 (path (sanitize (str path)))
	 (base/path (str base path))
	 (base/path/ (str base path "/"))
	 truepath)
    (when (cl-ppcre:scan "/[.]" base/path)
      (http-error "404 Not found" "File not found."))
    (cond ((probe-file base/path/)
	   (setq truepath (truename base/path/))
	   (/file#index base (str path "/") truepath))
	  ((probe-file base/path)
	   (setq truepath (truename base/path/))
	   (/file#show base/path))
	  (t
	   (http-error "404 Not found" "File not found.")))))
