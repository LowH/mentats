
(defun /classroom#show (classroom)
  (check-can :view classroom)
  (template-let (classroom)
    (render-view :classroom :show '.html)))

(defun /classroom#json (classroom)
  (check-can :view classroom)
  (render-json (classroom-json classroom)))

(defun /classroom#create ()
  (check-can :create 'classrooms)
  (with-form-data (name level)
    (redirect-to (classroom-uri
                  (add-classroom 'classroom.name name
                                 'classroom.level level
                                 'classroom.teachers (session-user))
                  :action :edit))))

(defun /classroom#edit (classroom)
  (check-can :edit classroom)
  (template-let (classroom)
    (render-view :classroom :edit '.html)))

(defun /classroom#update (classroom)
  (check-can :edit classroom)
  (with-form-data (name level modules)
    (setf (classroom.name classroom) name
          (classroom.level classroom) level)
    (cond ((accept-p :application/json)
           (facts:with ((classroom 'classroom.modules ?m))
             (unless (find (module.id ?m) modules :test #'string=)
               (facts:rm ((classroom 'classroom.modules ?m)))))
           (map nil (lambda (id)
                      (let ((m (find-module id)))
                        (when m
                          (facts:add (classroom 'classroom.modules m)))))
                modules)
           (render-json (classroom-json classroom)))
          (:otherwise (redirect-to
                       (classroom-uri classroom :action :edit))))))

(defun /classroom#delete (classroom)
  (check-can :delete classroom)
  (facts:with-transaction
    (setf (classroom.deleted classroom) t))
  (redirect-to (user-uri (session-user))))

(defun /classroom (&optional classroom.id action)
  (let ((classroom (when classroom.id
                     (or (find-classroom classroom.id)
                         (http-error "404 Not found" "Classroom not found."))))
        (action (when action
                  (or (find (string-upcase action) '(:edit :json) :test #'string=)
                      (http-error "404 Not found" "Action not found.")))))
    (case *method*
      (:GET (if classroom
                (ecase action
                  ((nil) (/classroom#show classroom))
                  ((:edit) (/classroom#edit classroom))
                  ((:json) (/classroom#json classroom)))
                (http-error "404 Not found" "Classroom index not available.")))
      (:POST   (/classroom#create))
      (:PUT    (/classroom#update classroom))
      (:DELETE (if classroom
                   (/classroom#delete classroom)
                   (http-error "404 Not found" "Classroom not found."))))))

(defun /classroom/student#create (classroom)
  (with-form-data (name)
    (let ((student (or (facts:with ((classroom 'classroom.students ?s)
                                    (?s 'student.name name))
                         (return ?s))
                       (add-student 'student.name name))))
      (facts:add (classroom 'classroom.students student))))
  (cond ((accept-p :application/json)
         (render-json (classroom-json classroom)))
        (:otherwise (redirect-to
                     (classroom-uri classroom :action :edit)))))

(defun /classroom/student (classroom.id)
  (let ((classroom (or (find-classroom classroom.id)
                       (http-error "404 Not found" "Classroom not found."))))
    (case *method*
      (:POST (/classroom/student#create classroom)))))
