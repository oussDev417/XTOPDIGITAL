// Fonction pour formater une date au format français
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Vérifier que la date est valide
  if (isNaN(date.getTime())) return '';
  
  // Options pour formater la date en français
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  // Utiliser le format français
  return date.toLocaleDateString('fr-FR', options);
} 