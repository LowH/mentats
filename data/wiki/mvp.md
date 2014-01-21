Name: mvp
Title: MVP
Date: 2014-01-21 11:10:28

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
* **Module** Identifié par un *auteur*, un *niveau* et une *discipline*.
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

+   Suivre un tutoriel.
+   S'inscrire : création d'un *user* avec *login*, *mot de passe* et adresse e-mail.
+   S'identifier avec *login* et *mot de passe*.
    +   Choisir un *module*.
        +   Passer en *mode édition*.
            +   Ajouter un *domaine* à un *module*.
            +   Enlever un *domaine* à un *module*.
            +   Ajouter un *domaine* aux prérequis d'un autre *domaine*.
            +   Sortir du *mode édition*.
        +   Choisir un *domaine*.
            +   Passer en *mode édition*
                +   Ajouter une *compétence* à un *domaine*.
                +   Enlever une *compétence* à un *domaine*.
                +   Ajouter une *compétence* aux prérequis d'une autre *compétence*.
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
        +   Valider une *compétence* pour un *élève* pour une *compétence*.
        +   Visualise les résultats d'un *élève*.
        +   Retourner à la *classe* d'un *élève*.
    +   Visualiser les résultats de toute la *classe*.
