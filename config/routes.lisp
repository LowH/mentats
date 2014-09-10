;;  Routes for mentats
;;
;;  Each route binds a uri template to a controller form.

(clear-routes)

(define-route "/>" `(/>))
(define-route "/>/{command}" `(/> ,(uri-var 'command)))
(define-assets-route "/assets{/name}{.ext}" "public/assets{/name}{.ext}")

(define-route "/account/register" '(/account/register))
(define-route "/account/register/ok" '(/account/register/ok))
(define-route "/account/login" '(/account/login))
(define-route "/account/logout" '(/account/logout))
(define-route "/account/reset-password" '(/account/reset-password))

(define-route "/user/{login}" `(/user ,(uri-var 'login)))
(define-route "/j/user/{login}" `(/user ,(uri-var 'login) "json"))

(define-route "/module" `(/module))
(define-route "/module/{module}" `(/module ,(uri-var 'module)))
(define-route "/module/{module}/{action}" `(/module ,(uri-var 'module)
						    ,(uri-var 'action)))
(define-route "/module/{module}/{action}/{arg}" `(/module ,(uri-var 'module)
							  ,(uri-var 'action)
							  ,(uri-var 'arg)))
(define-route "/j/module" `(/module))
(define-route "/j/module/{module}" `(/module ,(uri-var 'module) "json"))
(define-route "/j/module/{module}/{action}" `(/module ,(uri-var 'module)
						      ,(uri-var 'action)))

(define-route "/domaine/{domain}" `(/domain ,(uri-var 'domain)))
(define-route "/domaine/{domain}/{action}" `(/domain ,(uri-var 'domain)
						     ,(uri-var 'action)))
(define-route "/j/domaine/{domain}" `(/domain ,(uri-var 'domain) "json"))
(define-route "/j/domaine/{domain}/{action}" `(/domain ,(uri-var 'domain)
						       ,(uri-var 'action)))

(define-route "/competence" `(/competence))
(define-route "/competence/{competence}" `(/competence ,(uri-var 'competence)))
(define-route "/j/competence/{competence}" `(/competence ,(uri-var 'competence) "json"))

(define-route "/resource" `(/resource))
(define-route "/resource/{resource}" `(/resource ,(uri-var 'resource)))
(define-route "/j/resource/{resource}" `(/resource ,(uri-var 'resource) "json"))

(define-route "/classroom" `(/classroom))
(define-route "/classroom/{classroom}" `(/classroom ,(uri-var 'classroom)))
(define-route "/classroom/{classroom}/{action}" `(/classroom ,(uri-var 'classroom)
							     ,(uri-var 'action)))
(define-route "/j/classroom/{classroom}" `(/classroom ,(uri-var 'classroom) "json"))

(define-route "/student" `(/student))
(define-route "/student/{id}" `(/student ,(uri-var 'id)))

(define-route "/favicon.ico" (find-route "/assets/favicon.ico"))

(define-route "/pemf"        `(/file "public/pemf/"))
(define-route "/pemf{/dir*}" `(/file "public/pemf/" ,(uri-var 'dir)))

(define-route "/" `(/wiki "index"))
(define-route "{/slug}" `(/wiki ,(uri-var 'slug)))
