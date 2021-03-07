# FGF Site
Le site French Gaming Family est accessible via le lien http://161.97.66.77:8081


## Comment l'installer en locale
1. Clonner le repo.
2. Installer les outils pour pouvoir le faire fonctionner : <br> 
	Obligatoire : <br>
	   -Nodejs : https://nodejs.org/en/ <br>
	    -MySQL : https://dev.mysql.com/downloads/mysql/ <br>
	-Optionel : <br>
	   MySQL workbench : https://www.mysql.com/fr/downloads/ <br>

3. Dans le dossier backend : installer les dépendences : `npm install`.
4. Dans le dossier \_\_frontend : installer les dépencences : `npm install`.
5. Ci nécéssaire, modifier les fichiers de configuration, notament les fichiers de config pour la base de donnée.
6. Créer la base de donnée avec les fichiers modèles dans le dossier `database`.
7. Lancer le backend du site avec la commande `node server.js` dans le dossier backend.
8. Lancer le frontend du site avec la commande `node app.js` dans le dossier \_\_frontend.

Suite a ces opérations si le site fonctionne correctement il est accessible a l'adresse : 
http://127.0.0.1:8081 où http://localhost:8081

# Contribution 

Si vous souhaitez contribuer au projet, rapporter des bugs ou proposer des améliorations vous devez lire <a href="./CONTRIBUTING.md"> le fichier de contribution </a>

## Permissions
Ce projet n'a pas de licence, cela signifie que vous ne pouvez pas l'utiliser pour votre propre usage, ni en faire des copies (privées ou publiques). Cependant, vous êtes les bienvenus pour contribuer!
