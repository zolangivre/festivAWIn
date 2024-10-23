# fetivAWIn

## INTRODUCTION
Ce projet a pour objectif de créer une application web qui permettra aux gestionnaires de
festival de gérer facilement les dépôts et les ventes de jeux.
L'application nommé FestivAWIn facilitera le processus en permettant aux gestionnaires
d'enregistrer les jeux déposés, de suivre les transactions et de superviser l'ensemble des
opérations. Elle offrira une interface simple pour gérer les dépôts, les ventes et les factures,
garantissant ainsi une expérience fluide pour tous les utilisateurs.
En résumé, cette application vise à aider les gestionnaires de festival à gérer efficacement
les transactions, contribuant ainsi au succès de l'événement.

## CHOIX TECHNOLOGIES
Nous avons choisi Angular pour le frontend afin d'apprendre un nouveau Framework,
enrichissant ainsi nos compétences en développement web, surtout après avoir travaillé notre
projet web avec React l'année dernière. Angular présente plusieurs avantages par rapport à
d’autre Framework. Son « command line interface » nous permet de gagner du temps dans
la génération de composants, de services et la gestion des routes. Cela nous permet de
développer plus rapidement et avoir une architecture facilitant la maintenance. Angular est
aussi reconnu pour sa scalabilité, ce qui en fait un choix idéal pour une application de gestion
comme celle que nous développons, dans laquelle nous pourront ajouter des fonctionnalités
avec le temps.
Pour le backend, nous avons opté pour Node.js avec Express. Node.js est performant pour
des applications temps réel et à forte demande d'I/O, ce qui correspond bien à notre besoin
pour gérer des transactions fréquentes pendant le festival. Node.js peut aussi traiter plusieurs
requêtes simultanément sans impacter les performances, comparé à des technologies
comme PHP ou Ruby qui sont moins adaptées à ce type de charge. Express, quant à lui, est
un Framework qui permet de créer rapidement des API REST. Cela correspond bien à notre
besoin de créer une API évolutive et performante.
Pour la base de données, nous avons choisi “MongoDB” que nous allons manipuler grâce à
la bibliothèque “Mongoose” pour nous permettre de créer des schémas et des modèles de
données. Notre prise de décision quant au choix de ces technologies utilisées a été motivé
par la flexibilité, la scalabilité, et la rapidité de développement qu'elles offrent.

## ARCHITECTURE DES DONNEES
# DESCRIPTION DE LA STRUCTURE DES DONNEES

UTILISATEUR
La table Utilisateur contient des informations sur tous les utilisateurs (vendeur, acheteur,
administrateur et gestionnaire) enregistrés dans le système.
Elle contient les éléments suivants :
• idUtilisateur : Un identifiant unique pour chaque utilisateur.
• nom : Le nom de l’utilisateur.
• prénom : Le prénom de l’utilisateur.
• email : L'adresse email de l'utilisateur.
• téléphone : Le numéro de téléphone de l’utilisateur.
• adresse (faculatif) : L’adresse postale de l'utilisateur.
• role : Le role (vendeur, acheteur, administrateur ou gestionnaire) de l’utilisateur.

JEU_DEPOT
La table Jeu_Depot contient les informations sur tous les jeux déposés durant le festival.
Elle contient les éléments suivants :
• idJeuDepot : Un identifiant unique pour chaque jeu déposés.
• #idUtilisateur : L’identifiant de l’utilisateur (vendeur) qui a déposé le jeu.
• nomJeu : Le nom du jeu déposé.
• editeurJeu : L’éditeur du jeu déposé.
• prixJeu : Prix auquel le vendeur veut vendre le jeu déposé.
• quantitéJeu : Quantité du jeu déposé.
• statutJeu : Le statut du jeu déposé, soit il est vendu, soit disponible.
• dateDepot : La date du dépôt du jeu.
• fraisDepot : Les frais du jeu déposé.
• remiseDepot : La remise sur les frais du jeu déposé.

JEU
La table Jeu contient toutes les informations sur les jeux existants.
Elle contient les éléments suivants :
• nomJeu : Le nom du jeu.
• editeurJeu : L’éditeur du jeu.

VENTE
La table Vente contient les informations sur toutes les ventes effectuées durant le festival.
Elle contient les éléments suivants :
• idVente : Un identifiant unique pour chaque vente.
• #idUtilisateur : L’identifiant de l’utilisateur (acheteur) qui a acheté un ou plusieurs jeux.
• #idUtilisateur : L’identifiant de l’utilisateur (vendeur) qui a vendus un ou plusieurs de ses
jeux.
• commissionVente : La commission sur la vente.
• dateVente : La date de la vente.
• montantTotal : Montant total de la vente.

VENTE_JEU
La table Vente_Jeu contient les associations des ventes avec les jeux déposés.
Elle contient les éléments suivants :
• #idVente : L’identifiant de la vente du jeu déposé.
• #idJeuDepot : L’identifiant du jeu déposé associés à la vente.
• quantitéVendus : Quantité du jeu acheté.

FACTURE
La table Facture contient les informations sur toutes les factures correspondant aux ventes.
Elle contient les éléments suivants :
• idFacture : Un identifiant unique pour chaque facture.
• #idUtilisateur : L’identifiant de l’utilisateur (acheteur) qui a effectué la vente.
• #idVente : L’identifiant de la vente correspondant à la facture.
• dateFacture : Date de la facture.
• montantTotal : Montant total de la facture.

STOCK
La table Stock sert à générer les stock (jeux disponibles et/ou vendus) des vendeurs.
Elle contient les éléments suivants :
• #idUtilisateur : L’identifiant de l’utilisateur (vendeur).
• #idJeuDepot : L’identifiant du jeu déposés par l’utilisateur.
• quantitéStock : Quantité restante ou vendu du jeu déposé.

## ENDPOINTS API
Les endpoints API définissent les différentes opérations que l'application peut effectuer pour
interagir avec les données du système, permettant la gestion des utilisateurs, des jeux
déposés, des ventes, des stocks, et des factures de manière efficace et structurée.

UTILISATEUR
GET/utilisateurs
Récupère la liste de tous les utilisateurs (vendeurs, acheteurs, gestionnaires, administrateurs).
GET/vendeurs
Récupère la liste de tous les vendeurs.
GET/acheteurs
Récupère la liste de tous les acheteurs.
GET/utilisateur/:idUtilisateur
Récupère les informations d’un utilisateur spécifique par son idUtilisateur.
POST/utilisateur
Crée un nouvel utilisateur (vendeur, acheteur, gestionnaire ou administrateur).
PUT/utilisateur/:idUtilisateur
Met à jour les informations d’un utilisateur existant par son idUtilisateur.
DELETE/utilisateur/:idUtilisateur
Supprime un utilisateur spécifique par son idUtilisateur.

JEU_DEPOT
GET/jeuDepot
Récupère la liste de tous les jeux déposés.
GET/jeuDepot/:idJeuDepot
Récupère les détails d'un jeu déposé par son idJeuDepot.
POST/jeuDepot
Crée un nouveau jeu déposé avec toutes les informations correspondantes.
PUT/jeuDepot/:idJeuDepot
Met à jour les informations d’un jeu déposé par son idJeuDepot.
DELETE/jeuDepot/:idJeuDepot
Supprime un jeu déposé spécifique par son idJeuDepot.

VENTE
GET/ventes
Récupère la liste de toutes les ventes effectuées.
GET/vente/:idVente
Récupère les détails d'une vente spécifique par son idVente.
POST/vente
Enregistre une nouvelle vente.
PUT/vente/:idVente
Met à jour les informations d'une vente par son idVente.
DELETE/vente/:idVente
Supprime une vente spécifique par son idVente.

VENTE_JEU
GET/venteJeu
Récupère toutes les associations entre les ventes et les jeux déposés.
GET/venteJeu/:idVente
Récupère la liste des jeux associés à une vente spécifique par son idVente.
POST/venteJeu
Crée une nouvelle association entre une vente et un jeu déposé.
DELETE/venteJeu/:idVente
Supprime toutes les association des jeux déposés pour une vente donnée par son idVente.

STOCK
GET/stocks
Récupère la liste complète des stocks, qui associent les vendeurs et les jeux déposés.
GET/stock/:idUtilisateur
Récupère les jeux déposés dans le stock d'un vendeur spécifique par son idUtilisateur.
POST/stock
Ajoute une nouvelle entrée dans le stock, associant un vendeur et un jeu déposé.

FACTURE
GET/factures
Récupère la liste de toutes les factures de la base de données.
GET/facture/:idFacture
Récupère les détails d'une facture spécifique par son idFacture.
POST/facture
Crée une nouvelle facture associée à une vente.
PUT/facture/:idFacture
Met à jour les informations d'une facture par son idFacture.
DELETE/facture/:idFacture
Supprime une facture spécifique par son idFacture.