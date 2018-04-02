# Morpion #

## Démarrer le projet ##

Installer les dépendances avec ```yarn``` ou ```npm install```

Lancer le serveur node :  
```npm run start``` ou ```yarn start```

1. Importer la table tictactoe.sql dans une base de donnée
2. Remplir le fichier config.js pour la base de donnée

Jouer: <http://localhost:1234>

### Fonctionnalités ###
- Chat
- Morpion
- Classement
- Création de compte / Invité
- Room


### Info ###
- Données utilisateurs & des messages ont été injectés en dur

### Étape 1 - Choix du type de compte ###  
Soit un compte invité qui est un compte provisoire.  
Soit un compte qui peut être réutiliser avec des données sauvegardées en base de donnée.  
(un joueur qui a déjà crée un compte est automatiquement connecté lors de ses prochaines visites)

### Étape 2 - Choix room ###  
L'utilisateur a la possibilité de :  
- rejoindre une room aléatoire  
- rejoindre une room (d'un ami) en entrant son ID

### Règles room ###
Une partie commence automatiquement lorsqu'il y a 2 joueurs dans une room.  

Lorsqu'un joueur quitte une partie en cours, il a alors perdu d'office.

### Informations complémentaires ###

#### Structure ####
[Components](./src/components) - Dossier contenant tous les composants réacts  
[Fonts](./src/fonts) - Dossier contenant toutes les fonts  
[Styles](./src/styles) - Dossier contenant tous les styles

#### Technologies utilisées: ####
- React
- Node
- Express
- Socket.io
- Bcrypt

### TODO ###
- [ ] Refacto code
- [ ] Ajouter toutes les vérifications des autorisations côté serveur
- [ ] Ajouter Redux
- [ ] Ajouter routeur redux
- [ ] Ajout token
- [X] Encrypt password with bcrypt
