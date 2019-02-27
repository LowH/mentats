;;  Routes for mentats
;;
;;  Each route binds a uri template to a controller form.

(clear-routes)

(define-route "/>" `(/>))
(define-route "/>/{command}" `(/> ,command))
(define-assets-route "/assets{/name}{.digest,ext}" "public/assets{/name}{.digest,ext}")

(define-route "/account/register" '(/account/register))
(define-route "/account/register/ok" '(/account/register/ok))
(define-route "/account/login" '(/account/login))
(define-route "/account/logout" '(/account/logout))
(define-route "/account/reset-password" '(/account/reset-password))
(define-route "/account/reset-password/{token}" `(/account/reset-password ,token))

(define-route "/user/{login}" `(/user ,login))
(define-route "/j/user/{login}" `(/user ,login "json"))
(define-route "/user/update-email/{token}" `(/user/update-email ,token))

(define-route "/module" `(/module))
(define-route "/module/{module}" `(/module ,module))
(define-route "/module/{module}/{action}" `(/module ,module ,action))
(define-route "/module/{module}/{action}/{arg}" `(/module ,module ,action ,arg))
(define-route "/j/module" `(/module))
(define-route "/j/module/{module}" `(/module ,module "json"))
(define-route "/j/module/{module}/{action}" `(/module ,module ,action))

(define-route "/domaine/{domain}" `(/domain ,domain))
(define-route "/domaine/{domain}/{action}" `(/domain ,domain ,action))
(define-route "/j/domaine" `(/domain))
(define-route "/j/domaine/{domain}" `(/domain ,domain "json"))
(define-route "/j/domaine/{domain}/{action}" `(/domain ,domain ,action))

(define-route "/competence" `(/competence))
(define-route "/competence/{competence}" `(/competence ,competence))
(define-route "/j/competence" `(/competence))
(define-route "/j/competence/{competence}" `(/competence ,competence "json"))

(define-route "/resource" `(/resource))
(define-route "/resource/{resource}" `(/resource ,resource))
(define-route "/j/resource" `(/resource))
(define-route "/j/resource/{resource}" `(/resource ,resource "json"))

(define-route "/classroom" `(/classroom))
(define-route "/classroom/{classroom}" `(/classroom ,classroom))
(define-route "/classroom/{classroom}/edit" `(/classroom ,classroom :edit))
(define-route "/classroom/{classroom}/student" `(/classroom/student ,classroom))
(define-route "/classroom/{classroom}/{module}" `(/classroom ,classroom))
(define-route "/classroom/{classroom}/{module}/{domain}" `(/classroom ,classroom))
(define-route "/classroom/{classroom}/{module}/{domain}/{student}" `(/classroom ,classroom))

(define-route "/j/classroom" `(/classroom))
(define-route "/j/classroom/{classroom}" `(/classroom ,classroom "json"))

(define-route "/student" `(/student))
(define-route "/student/{id}" `(/student ,id))
(define-route "/student/{id}/{action}" `(/student ,id ,action))
(define-route "/j/student/{id}" `(/student ,id :json))

(define-route "/favicon.ico" (find-route "/assets/favicon.ico"))

(define-route "/pemf"        `(/file "public/pemf/"))
(define-route "/pemf{/dir*}" `(/file "public/pemf/" ,dir))

(define-route "/" `(/wiki "index"))
(define-route "{/slug}" `(/wiki ,slug))
