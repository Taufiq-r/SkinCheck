const admin = require('firebase-admin');

async function fetchArticles() {
  try {
    const db = admin.firestore(); // Mengakses Firestore dari admin SDK
    const articlesSnapshot = await db.collection('articles').get();

    if (articlesSnapshot.empty) {
      return []; // Jika tidak ada artikel
    }

    const articles = [];
    articlesSnapshot.forEach(doc => {
      articles.push({ id: doc.id, ...doc.data() });
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles from Firestore');
  }
}

module.exports = fetchArticles;
