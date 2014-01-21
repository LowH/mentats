Name: mvp
Title: MVP
Date: 2014-01-21 11:10:28

Objectif
========
**Recommander des ressources à l'enseignant selon les évaluations des élèves de sa classe**.

Définition formelle
===================
* **Ressource** Un *article* au format [Markdown](http://daringfireball.net/projects/markdown/basics).
* **Enseignant** Un *user*.
* **User** Un visiteur du site identifié par un *login* et un *mot de passe*.
* **Évaluation** Un booléen donné par un *enseignant* concernant un *élève* et une *compétence*.
* **Élève** Un *nom*.
* **Classe** Une classe est constituée d'élèves. Elle est gérée par un ou plusieurs enseignants.
* **Module** Identifié par un *auteur*, un *niveau* et une *discipline*.
* **Niveau** Un *nom*.
* **Discipline** Un *nom*.
* **Auteur** Un *user*.
* **Domaine** A un *nom*. Appartient à un *module* parent. Peut avoir des *domaines* requis appartenant au même *module* parent.
* **Compétence** A un *nom*. Appartient à un *domaine* parent. Peut avoir des *compétences* requises appartenant au même *module* parent.

Pages
=====

Accueil
-------

* Login
* S'inscrire
* Tutorial -> tutorial -> S'inscrire

Dashboard
---------

* date
* liste d'élèves de sa classe
* collection de *modules* représentés chacun par un graphe de domaines

Dashboard # module
------------------
Affiche un graphe des *domaines* du *module*.

Dashboard # domaine
-------------------
Affiche un graphe des compétences du *domaine*.
Chaque *compétence* affiche un nom.
Les *compétences* sont reliées par des flèches à leurs prérequis.

Dashboard # compétence
----------------------
Affiche une collection de *ressources* associées à la *compétence*.

Actions
=======
* Un *user* s'identifie avec son *login* et son *mot de passe*.
* Un *enseignant* choisit un *module*.
* Un *enseignant* choisit un *domaine*.
* Un *enseignant* choisit une *compétence*.
* Un *enseignant* choisit une *ressource*.
* Un *enseignant* choisit un ou zéro *élève*.
