const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// Fungsi untuk mendapatkan secret dari Secret Manager
async function getFirebaseCredentials() {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: 'projects/skin-check-capstone/secrets/firebase-service-account/versions/latest',
  });
  const serviceAccount = JSON.parse(version.payload.data.toString());
  return serviceAccount;
}

module.exports = { getFirebaseCredentials };