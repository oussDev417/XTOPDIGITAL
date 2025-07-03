import mongoose from 'mongoose';

// Essayer d'obtenir la variable d'environnement
let MONGODB_URI = process.env.MONGODB_URI;

// Si la variable d'environnement n'est pas définie, utiliser une valeur par défaut
if (!MONGODB_URI) {
  console.warn('Variable MONGODB_URI non trouvée dans l\'environnement, utilisation d\'une valeur par défaut');
  MONGODB_URI = "mongodb+srv://atlas-sample-dataset-load-6800d76f1474120aa14a9a72:UDE7MNh78ArAuxb8@digiv-cms.wkawwsp.mongodb.net/?retryWrites=true&w=majority";
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase; 