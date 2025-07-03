# Configuration Cloudinary pour XTOP Digital

## Problème résolu temporairement

Actuellement, l'upload d'images fonctionne avec une **solution temporaire** qui encode les images en **base64**. Cette solution fonctionne mais n'est pas optimale pour la production car :

- Les images base64 sont plus volumineuses
- Elles sont stockées dans la base de données
- Pas d'optimisation automatique des images

## Solution recommandée : Cloudinary

### 1. Créer un compte Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit (jusqu'à 25 GB de stockage)
3. Notez vos informations de connexion dans le Dashboard

### 2. Configuration des variables d'environnement

Ajoutez cette variable à vos **variables d'environnement Vercel** :

```bash
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

**Exemple :**
```bash
CLOUDINARY_URL=cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz123456@votre-cloud-name
```

### 3. Comment trouver vos informations Cloudinary

Dans votre Dashboard Cloudinary :
- **Cloud name** : affiché en haut à droite
- **API Key** : dans la section "API Keys"
- **API Secret** : dans la section "API Keys" (cliquez sur "Reveal")

### 4. Ajouter la variable sur Vercel

1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez :
   - **Name** : `CLOUDINARY_URL`
   - **Value** : `cloudinary://api_key:api_secret@cloud_name`
   - **Environments** : Production, Preview, Development

### 5. Redéployer

Après avoir ajouté la variable d'environnement :

```bash
vercel --prod
```

## Avantages de Cloudinary

✅ **Stockage externe** : Images stockées sur CDN rapide
✅ **Optimisation automatique** : Compression et formats optimaux
✅ **Transformations** : Redimensionnement automatique
✅ **Sécurité** : URLs sécurisées
✅ **Performance** : Livraison via CDN global

## État actuel

- ✅ **Upload fonctionnel** avec solution base64
- ✅ **Interface utilisateur** complètement fonctionnelle
- ✅ **Éditeur de contenu** avec texte visible
- ✅ **Affichage du contenu détaillé** sur les pages publiques
- ⚠️ **Optimisation recommandée** : Configurer Cloudinary

## Alternative : Vercel Blob

Si vous préférez rester dans l'écosystème Vercel :

1. Activez **Vercel Blob** dans votre projet
2. Installez le package : `npm install @vercel/blob`
3. Modifiez l'API d'upload pour utiliser Vercel Blob

## Support

L'upload d'images fonctionne actuellement. La configuration Cloudinary est optionnelle mais recommandée pour une meilleure performance en production. 