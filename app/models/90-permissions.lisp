
(can:reset-rules)

(can:define-permission (:everyone :can :admin :all))
(can:define-permission (:anonymous :cannot :admin :all))
;(can:define-permission (:anonymous :can :view :all))
(can:define-permission (:anonymous :can :list 'modules))

(can:define-permission (:everyone :can :view ?user)
  (facts:bound-p ((?user :is-a 'user))))

(can:define-permission (:anonymous :can :view ?article)
  (and (typep ?article 'json:fluid-object)
       (not (article-has-tag :private ?article))))

(can:define-permission (:anonymous :can :view ?competence)
  (and (facts:bound-p ((?competence :is-a 'competence)))
       (not (competence.deleted ?competence))))

(can:define-permission (:anonymous :can :view ?domain)
  (and (facts:bound-p ((?domain :is-a 'domain)))
       (not (domain.deleted ?domain))))

(can:define-permission (:anonymous :can :view ?module)
  (and (facts:bound-p ((?module :is-a 'module)))
       (not (module.deleted ?module))))

(can:define-permission (?user :can :edit ?user_)
  (eq ?user ?user_))

(can:define-permission (?user :can :edit ?module)
  (facts:bound-p ((?module :is-a 'module
                           'module.owner ?user))))

(can:define-permission (?user :can :edit ?domain)
  (facts:bound-p ((?domain 'domain.module ?module)
                  (?module 'module.owner ?user))))

(can:define-permission (?user :can :admin :all)
  (facts:bound-p ((?user :is-a 'user
                         'user.email "thoxdg@gmail.com"))))

(can:compile-rules)
