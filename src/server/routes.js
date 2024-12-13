const { postPredictHandler, postPredictHistoriesHandler } = require('../server/handler');
const fetchArticles = require('../services/articlesService');

const routes = [
  {
    method: 'POST',
    path: '/api/predict',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        maxBytes: 10485760, // Batasi ukuran file hingga 10MB
        parse: true, // Memproses file sebagai buffer
        output: 'data', // Mengambil data file sebagai buffer
      },
    },
  },
  {
    method: 'GET',
    path: '/api/predict/histories',
    handler: postPredictHistoriesHandler, // Menghubungkan handler postPredictHistoriesHandler
  },
  {
    method: 'GET',
    path: '/home',
    handler: (request, h) => {
      const homeData = {
        message: 'Welcome to SkinCheck!',
        description: 'This is your home screen in the SkinCheck app.',
        tips: [
          'Check your skin regularly.',
          'Consult a dermatologist for proper care.',
          'Keep your skin hydrated.',
        ],
        status: 'active',
      };
      return h.response(homeData).code(200);
    },
  },
  {
    method: 'GET',
    path: '/api/articles',
    handler: async (request, h) => {
      try {
        const articles = await fetchArticles();
        return h.response({ status: 'success', data: articles }).code(200);
      } catch (error) {
        console.error('Error fetching articles:', error);
        return h.response({ status: 'fail', message: 'Unable to fetch articles' }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/api/healthcheck',
    handler: (request, h) => {
      return h.response({ status: 'up' }).code(200);
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.response('Hello, SkinCheck!').code(200);
    },
  },
];

module.exports = routes;
