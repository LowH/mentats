
(define-resource classroom
  (has-one deleted)
  (has-one level)
  (has-many modules :having module.classrooms)
  (has-one name)
  (has-many students :having student.classrooms)
  (has-many teachers :having user.classrooms))

(define-resource competence
  (has-one deleted)
  (has-one description)
  (has-one domain :having domain.competences)
  (has-one name)
  (has-one position)
  (has-many required-competences))

(define-resource domain
  (has-one deleted)
  (has-one description)
  (has-one module :having module.domains)
  (has-one name)
  (has-one position)
  (has-many required-domains))

(define-resource module
  (has-one discipline)
  (has-one level)
  (has-one version)
  (has-one owner :having user.modules)
  (has-one deleted)
  (has-one description))

(define-resource resource
  (has-one competence)
  (has-one date)
  (has-one deleted)
  (has-one owner)
  (has-one text))

(define-resource student
  (has-one deleted)
  (has-one name)
  (has-many competences))

(define-resource user
  (has-one login)
  (has-one password-hash)
  (has-one email)
  (has-one name)
  (has-one group)
  (has-many library-modules))
