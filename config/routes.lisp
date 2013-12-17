;;  Routes for mentats
;;
;;  Each route binds a uri template to a controller form.

(define-route "/" '(index/))

(define-assets-route "/assets{/name}{.ext}" "public/assets{/name}{.ext}")
