;;  Routes for mentats
;;
;;  Each route binds a uri template to a controller form.

(clear-routes)

(define-route "/" '(/index))
(define-route "/competence" `(/competence))
(define-route "/competence/name:{name}" `(/competence :name ,(uri-var 'name)))
(define-route "/competence/id:{id}" `(/competence :id ,(uri-var 'id)))

(define-assets-route "/assets{/name}{.ext}" "public/assets{/name}{.ext}")
