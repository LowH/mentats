;;  Routes for mentats
;;
;;  Each route binds a uri template to a controller form.

(clear-routes)

(define-assets-route "/assets{/name}{.ext}" "public/assets{/name}{.ext}")

(define-route "/account/register" '(/account/register))
(define-route "/account/register/ok" '(/account/register/ok))
(define-route "/account/login" '(/account/login))
(define-route "/account/logout" '(/account/logout))
(define-route "/account/reset-password" '(/account/reset-password))

(define-route "/user/{login}" `(/user ,(uri-var 'login)))

(define-route "/" `(/wiki "index"))
(define-route "{/slug}" `(/wiki ,(uri-var 'slug)))
