const mongoose = require('mongoose');

// Definir o modelo de comentário
const Comment = mongoose.model(
  'Comment',
  new mongoose.Schema({
    text: {
      type: String,
      require: true,
    },
    articleId: {
      type: String,
      require: true,
      unique: true,
    },
  }),
);

// Definir o modelo de artigo
const Article = mongoose.model(
  'Article',
  new mongoose.Schema({
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
  }),
);

module.exports = {
  Comment,
  Article,
};
