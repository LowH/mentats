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

(define-route "/account/register" '(/account/register))
(define-route "/account/register/ok" '(/account/register/ok))
(define-route "/account/login" '(/account/login))
(define-route "/account/logout" '(/account/logout))
(define-route "/account/reset-password" '(/account/reset-password))

(define-route "/user/{login}" `(/user ,(uri-var 'login)))

(define-route "/" `(/wiki "index"))
(define-route "{/slug}" `(/wiki ,(uri-var 'slug)))
