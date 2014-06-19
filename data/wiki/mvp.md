Name: mvp
Date: 2014-01-21 11:10:28
Title: MVP

Objectif
========
**Recommander des ressources à l'enseignant selon les évaluations des élèves de sa classe**.

Définition formelle
===================
* **Ressource** Un *article* au format [Markdown](http://daringfireball.net/projects/markdown/basics).
* **User** Un visiteur du site identifié par un *login* et un *mot de passe*.
* **Enseignant** Un *user*.
* **Évaluation** Donné par un *enseignant* concernant un *élève* et une *compétence*.
* **Élève** Un *nom*.
* **Classe** Une classe est constituée d'élèves. Elle est gérée par un ou plusieurs enseignants.
* **Module** Identifié par un *auteur*, un *niveau*, une *discipline* et une *version*.
* **Version** Une *date* ou un *numéro*.
* **Niveau** Un *nom*.
* **Discipline** Un *nom*.
* **Auteur** Un *user*.
* **Domaine** A un *nom*. Appartient à un *module* parent. Peut avoir des *domaines* prérequis appartenant au même *module* parent.
* **Compétence** A un *nom*. Appartient à un *domaine* parent. Peut avoir des *compétences* prérequises appartenant au même *module* parent. 

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

On veut pouvoir :

+   **DONE** Créer et suivre un tutoriel → [Wiki](https://www.pivotaltracker.com/story/show/64193150) 3h
+   **DONE** S'inscrire : création d'un *user* avec *login*, *mot de passe* et adresse e-mail → [Inscription](https://www.pivotaltracker.com/story/show/64260572) 2h → [Validation par e-mail] 3h
+   **DONE** S'identifier avec *login* et *mot de passe* → [Login](https://www.pivotaltracker.com/story/show/64044186) 2h → [page Dashboard](https://www.pivotaltracker.com/story/show/64241178) 4h
    +   **DONE** Visualiser des *modules* → [Vignette module]() 1h
    +   Visualiser le nombre d'élèves pour chaque *module* → 1h
    +   **DONE** Choisir un *module* → [Page Dashboard # module]() 3h
        +   Visualiser les statistiques de la *classe* pour chaque *module* → 4h
        +   **DONE** Passer en *mode édition* → 2h
            +   **DONE** Ajouter/enlever un *domaine* à un *module* → 6h
            +   **DONE** Ajouter un *domaine* aux prérequis d'un autre *domaine* → 6h
            +   **DONE** Sortir du *mode édition*
        +   **DONE** Choisir un *domaine*
            +   **DONE** Passer en *mode édition*
                +   **DONE** Ajouter une *compétence* à un *domaine*.
                +   **DONE** Enlever une *compétence* à un *domaine*.
                +   **DONE** Ajouter une *compétence* aux prérequis d'une autre *compétence*.
                +   Sortir du *mode édition*.
            +   Choisir une *compétence*.
                +   Passer en *mode édition*.
                    +   Ajouter une *ressource* à une *compétence*.
                    +   Enlever une *ressource* à une *compétence*.
                    +   Sortir du *mode édition*.
                +   Passer en *mode évaluation*.
                    +   Sélectionner les *élèves* pour qui la *compétence* est *validée*.
                    +   Sortir du *mode évaluation*.
                +   Retourner au *domaine* parent d'une *compétence*.
            +   Retourner au *module* parent d'un *domaine*.
    +   Sélectionner un *élève*.
        +   Valider une *compétence* pour un *élève*.
        +   Visualise les résultats d'un *élève*.
        +   Retourner à la *classe* d'un *élève*.
    +   Administrer une *classe*.
    +   Administrer des *modules* → [Admin modules](https://www.pivotaltracker.com/story/show/65252638) 2h


ROOK BUMPed on 27012014
B was here 2014-02-06
