const axios = require('axios');
const cheerio = require('cheerio');


async function scrapeSkinCareArticle(url) {
  try {
    // Mengambil halaman web
    const { data } = await axios.get(url);
    
    // Menggunakan cheerio untuk memparsing HTML
    const $ = cheerio.load(data);
    
    // Menentukan selector CSS untuk mendapatkan data artikel
    const title = $('h1').text();  
    const content = $('div.article-content').text();  
    const author = $('span.author-name').text();  
    
    // Membuat objek untuk artikel
    const article = {
      title,
      content,
      author,
      url
    };
    
    return article;
  } catch (error) {
    console.error('Error scraping article:', error);
    throw error;
  }
}

module.exports = {
  scrapeSkinCareArticle
};
