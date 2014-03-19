;;  Routes for mentats
;;
;;  Each route binds a uri template to a controller form.

(clear-routes)

(define-assets-route "/assets{/name}{.ext}" "public/assets{/name}{.ext}")

(define-route "/competence" `(/competence))
(define-route "/competence/name:{name}" `(/competence :name ,(uri-var 'name)))
(define-route "/competence/id:{id}" `(/competence :id ,(uri-var 'id)))

(define-route "/blog" `(/blog))
(define-route "/blog/{tags}" `(/blog :tags ,(uri-var 'tags)))
(define-route "/blog/{year}/{month}" `(/blog :year ,(uri-var 'year)
					     :month ,(uri-var 'month)))
(define-route "/blog/{year}/{month}/{slug}" `(/blog :year ,(uri-var 'year)
						    :month ,(uri-var 'month)
						    :slug ,(uri-var 'slug)))

(define-route "/session/login" '(/session/login))
(define-route "/session/logout" '(/session/logout))

(define-route "/" `(/wiki "index"))
(define-route "{/slug}" `(/wiki ,(uri-var 'slug)))
