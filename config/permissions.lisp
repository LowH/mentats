
(can:reset-rules)

(can:define-permission (:everyone :can :admin :all))
(can:define-permission (:anonymous :cannot :admin :all))
(can:define-permission (:anonymous :can :view :all))

(can:define-permission (?user :can :edit ?module)
  (?user :is-a 'user)
  (?module :is-a 'module
	   'module.owner ?user))

(can:define-permission (?user :can :admin :all)
  (?user :is-a 'user
	 'user.email "thomas@lowh.net"))

(can:compile-rules)
