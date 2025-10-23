import { mailcowClient } from '@/lib/mailcow/client';
import { tenantEmailService } from '@/lib/mailcow/tenant-service';

async function testMailcow() {
  console.log('🧪 Test connexion Mailcow...');
  const connected = await mailcowClient.testConnection();
  if (!connected) {
    console.error('❌ Impossible de se connecter à Mailcow');
    process.exit(1);
  }

  console.log('🏢 Test création restaurant...');
  const testResult = await tenantEmailService.createRestaurantEmail({
    restaurantName: 'Restaurant Test',
    slug: 'restaurant-test',
    domain: 'test-resto.com',
    ownerFirstName: 'Jean',
    ownerLastName: 'Dupont',
    ownerEmail: 'votreemail@gmail.com',
  });

  console.log('✅ TEST RÉUSSI', testResult);
}

testMailcow().catch((e) => {
  console.error(e);
  process.exit(1);
});
