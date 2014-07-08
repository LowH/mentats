Name: bugs
Date: 2014-06-22 21:50:05
Title: bugs
Author: Olivier THOMAS


pas de synchro entre nom du node sur le graphe et titre de la compétence quand on double clique dessus
> Pas compris, tu peux donner des URL et les opérations à faire pour reproduire le bug ?
>> en fait c'était lié au bug de double bouton d'enregistrement.

suite à batterycrash, perdu tout le graphe sur lequel je taffais, possible faire des autosaves ?
> Possible mais c'est une feature je te disais on peut save dans le browser comme les champs texte. On sauvegarde en local et quand on a une connexion au serveur on synchronise. Il faut compter une grosse demi journée à convertir l'éditeur de graphe.
>> gardons ça sous la main

double clic sur une compétence dans le graphe de compétence -> faire apparaitre le nom de la compétence et le terme de "ressources"
> C'est un bug ?
>> t'as corrigé ce que je voulais dire


d'une manière générale, j'avais l'habitude du double clic dans l'éditeur de graphe qui permettait de renommer, j'ai du mal à m'en défaire
> La drogue c'est mal. En même temps renommer ça se fait au clavier et comment tu fais pour éditer le domaine / la compétence ?
>> je m'y suis fait. du coup, quand on double quique sur un node de compétences dans l'éditeur, il faudrait basculer sur l'éditeur de ressource.

y faudrait pouvoir écrire les titres des nodes sur plusieurs lignes. (ctrl +entrée ? quand on édite le titre) cf http://mentats.lowh.net/domaine/-DaTcS/
> OK c'est vraiment du MVP ? C'est compliqué à gérer le multiligne...
>> C'est pas du MVP mais c'est une feature qui me manque.

quand tu cliques sur enregistrer au dessus du graphe au lieu d'à gauche du graphe ça te vire de la page sans enregistrer*
> OUI ça c'est un bug relou, je sais pas où mettre le bouton sauvegarder même si j'ai quelques idées.
>> Pq pas un seul bouton sauvegarde qui enregistre tant le graphe que les champs de discipline, description, niveau ?

les graphes de compétences apparaissent dans l'éditeur mais pas sous le livre ouvert hors mode édition
> Yep je règle ça aujourd'hui
>> j'aime

ajouter un bouton créer un module en bas de la page http://mentats.lowh.net/module/ quand un utilisateur est identifié

ajouter un espace vide sous la ligne de création de module dans la mise en page du user

sur la page d'une compétence (liste de ses ressources): ajouter une description de la compétence, le livre en 2 ou 3 pans, le contributeur d'une ressource pourrait être moins proéminent

sur http://mentats.lowh.net/domaine/4rfD6O, le mod de modération est turquoise. WTF

il faudrait un autocrop sur les svg de graphes quand on les insère dans du markdown

je pense que c'est bien de voir apparaitre dans les éditeur qu'on est en train de voir des graphes de domaines (resp. compétences), mais je suis pas sûr que ça soit une bonne chose dans la navigation de voir apparaitre "Domaines" (resp."Compétences) entre le livre et le graphe.

trop cool les arrondis pour distinguer compétences et domaines

si tu crées un node de compétences et que tu sauves pas avant de doublecliquer dessus, tu tombes sur un undefined

* bug important sur la publication qui rend innaccessible les pages de compétences après avoir publié n'importe quoi *
