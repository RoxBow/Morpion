# Morpion #

## Démarrer le projet ##

Installer les dépendances avec ```yarn``` ou ```npm install```

Lancer le serveur node :  
```npm run start``` ou ```yarn start```

Importer la table tictactoe.sql dans une base de donnée

### Utile ###
- Données utilisateurs ont été injectés en dur.
- Remplir le fichier config.js pour la base de donnée

### Étape 1 - Choix du type de compte ###  
Soit un compte invité qui est un compte provisoire.  
Soit un compte qui peut être réutiliser avec des données sauvegardées en base de donnée.

### Étape 2 - Choix room ###  
L'utilisateur a la possibilité de :  
- rejoindre une room aléatoire  
- rejoindre une room (d'un ami) en entrant son ID

### Règles room ###

Une partie commence automatiquement lorsqu'il y a 2 joueurs dans une room.  

Lorsqu'un joueur quitte une partie en cours, il a alors perdu d'office.

### Fonctionnalités ###

- Chat
- Morpion
- Classement
- Création de compte

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

### TODO ###
- [ ] Refacto code
- [ ] Ajouter toutes les vérifications des autorisations côté serveur
- [ ] Ajouter Redux
- [ ] Ajouter routeur redux
- [ ] Ajout token
- [ ] Encrypt password with bcrypt
