import { geocodeAddress, updateDeliveryLocation } from './geocoding';
import { apiService } from '@/lib/api';

async function testGeocodingService() {
  console.log('🚀 Début des tests du service de géocodage...');

  // 1. Test de géocodage d'une adresse
  const testAddress = '1600 Amphitheatre Parkway, Mountain View, CA';
  console.log('\n1️⃣ Test de géocodage pour l\'adresse:', testAddress);
  
  const geocodingResult = await geocodeAddress(testAddress);
  if (geocodingResult) {
    console.log('✅ Géocodage réussi:');
    console.log('- Latitude:', geocodingResult.latitude);
    console.log('- Longitude:', geocodingResult.longitude);
    console.log('- Adresse formatée:', geocodingResult.address);
  } else {
    console.log('❌ Échec du géocodage');
  }

  // 2. Vérification de la mise en cache
  console.log('\n2️⃣ Vérification de la mise en cache...');
  const { data: cachedAddress } = // Mock await select call
// Mock eq call
    .single();

  if (cachedAddress) {
    console.log('✅ Adresse trouvée dans le cache:');
    console.log('- ID:', cachedAddress.id);
    console.log('- Date de création:', cachedAddress.created_at);
  } else {
    console.log('❌ Adresse non trouvée dans le cache');
  }

  // 3. Test de mise à jour d'une livraison
  console.log('\n3️⃣ Test de mise à jour d\'une livraison...');
  // Créer une livraison de test
  const { data: testDelivery } = await         // Mock insert operation[
      {
        client_name: 'Test Client',
        address: testAddress,
        status: 'pending',
        scheduled_date: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (testDelivery) {
    console.log('✅ Livraison de test créée avec l\'ID:', testDelivery.id);
    
    const updateSuccess = await updateDeliveryLocation(testDelivery.id, testAddress);
    if (updateSuccess) {
      console.log('✅ Position de la livraison mise à jour avec succès');
      
      // Vérifier la mise à jour
      const { data: updatedDelivery } = // Mock await select call
// Mock eq call
        .single();

      if (updatedDelivery) {
        console.log('✅ Données de la livraison mises à jour:');
        console.log('- Latitude:', updatedDelivery.latitude);
        console.log('- Longitude:', updatedDelivery.longitude);
        console.log('- Dernière mise à jour:', updatedDelivery.last_location_update);
      }
    } else {
      console.log('❌ Échec de la mise à jour de la position');
    }
  } else {
    console.log('❌ Échec de la création de la livraison de test');
  }

  // 4. Test de la carte
  console.log('\n4️⃣ Test de l\'affichage sur la carte...');
  if (geocodingResult) {
    console.log('✅ Coordonnées valides pour l\'affichage sur la carte:');
    console.log('- Position:', `[${geocodingResult.latitude}, ${geocodingResult.longitude}]`);
    console.log('\nPour vérifier visuellement, ouvrez la page des livraisons et passez à l\'onglet "Carte"');
  } else {
    console.log('❌ Pas de coordonnées disponibles pour l\'affichage sur la carte');
  }

  console.log('\n✨ Tests terminés!');
}

// Exécuter les tests
testGeocodingService().catch(console.error); 