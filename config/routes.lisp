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
(define-route "/module" `(/module))
(define-route "/module/{module}" `(/module ,(uri-var 'module)))

(define-route "/favicon.ico" (find-route "/assets/favicon.ico"))

(define-route "/" `(/wiki "index"))
(define-route "{/slug}" `(/wiki ,(uri-var 'slug)))
