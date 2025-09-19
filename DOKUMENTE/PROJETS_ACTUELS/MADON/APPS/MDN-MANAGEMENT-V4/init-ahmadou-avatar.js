// Script pour initialiser l'avatar d'Ahmadou Dipita
console.log('🎨 INITIALISATION AVATAR - Ahmadou Dipita');
console.log('='.repeat(50));

// Récupérer les données d'employés
const savedEmployees = localStorage.getItem('employees');
if (savedEmployees) {
  try {
    const employees = JSON.parse(savedEmployees);
    console.log('👥 Employés trouvés:', employees.length);
    
    // Trouver Ahmadou Dipita
    const ahmadou = employees.find(emp => 
      emp.email === 'a.dipita@themadon.com' || 
      emp.first_name === 'Ahmadou' || 
      emp.first_name === 'Achille'
    );
    
    if (ahmadou) {
      console.log('✅ Ahmadou Dipita trouvé:', ahmadou.first_name, ahmadou.last_name);
      console.log('📧 Email:', ahmadou.email);
      console.log('🆔 ID:', ahmadou.id);
      console.log('👑 Rôle:', ahmadou.role);
      
      // Vérifier s'il a déjà un avatar
      if (ahmadou.avatar_id || ahmadou.photo_url) {
        console.log('ℹ️ Ahmadou a déjà un avatar configuré:');
        console.log('  - Avatar ID:', ahmadou.avatar_id || 'Non défini');
        console.log('  - Photo URL:', ahmadou.photo_url ? 'Définie' : 'Non définie');
      } else {
        console.log('❌ Ahmadou n\'a pas d\'avatar configuré');
        
        // Lui donner un avatar par défaut selon son rôle
        const defaultAvatar = ahmadou.role === 'admin' ? 'crown' : 'user';
        ahmadou.avatar_id = defaultAvatar;
        ahmadou.updated_at = new Date().toISOString();
        
        console.log(`✅ Avatar "${defaultAvatar}" assigné à Ahmadou Dipita`);
      }
    } else {
      console.log('❌ Ahmadou Dipita non trouvé');
      console.log('📋 Emails disponibles:');
      employees.forEach(emp => {
        console.log(`  - ${emp.email} (${emp.first_name} ${emp.last_name})`);
      });
    }
    
    // Sauvegarder les modifications
    localStorage.setItem('employees', JSON.stringify(employees));
    console.log('💾 Données d\'employés sauvegardées');
    
    // Créer/mettre à jour les données de photos de profil
    const profilePhotos = JSON.parse(localStorage.getItem('profile-photos') || '[]');
    
    // Chercher ou créer l'entrée pour Ahmadou
    const existingPhotoIndex = profilePhotos.findIndex(photo => 
      photo.email === ahmadou.email || photo.userId === ahmadou.id.toString()
    );
    
    const photoData = {
      userId: ahmadou.id.toString(),
      email: ahmadou.email,
      photoUrl: ahmadou.photo_url || null,
      avatarId: ahmadou.avatar_id || null,
      updatedAt: new Date().toISOString()
    };
    
    if (existingPhotoIndex >= 0) {
      profilePhotos[existingPhotoIndex] = photoData;
      console.log('📸 Photo de profil mise à jour');
    } else {
      profilePhotos.push(photoData);
      console.log('📸 Photo de profil créée');
    }
    
    localStorage.setItem('profile-photos', JSON.stringify(profilePhotos));
    console.log('💾 Photos de profil sauvegardées');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
} else {
  console.log('❌ Aucune donnée d\'employés trouvée');
}

console.log('');
console.log('🔄 Rechargement de la page...');
setTimeout(() => {
  window.location.reload();
}, 2000);

console.log('');
console.log('📋 APRÈS RECHARGEMENT:');
console.log('✅ Ahmadou Dipita devrait voir son avatar au lieu de "AD"');
console.log('✅ L\'avatar devrait être visible dans la barre de navigation');
console.log('✅ L\'avatar devrait être visible sur la page de profil');
console.log('✅ L\'avatar devrait persister entre les sessions');
