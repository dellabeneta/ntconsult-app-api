const express = require('express');
const os = require('os');
const { Comment, Article } = require('./database/models');

const routes = express();

routes.use(express.json());

// Rota para inserir um novo artigo
routes.post('/api/artigos', async (req, res) => {
  try {
    const {
      title, content, author, date,
    } = req.body;
    const newArticle = new Article({
      title, content, author, date,
    });
    await newArticle.save();
    res.status(201).json({ message: 'Artigo adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar artigo.' });
  }
});

// Rota para inserir um novo comentário
routes.post('/api/comentarios', async (req, res) => {
  try {
    const { text, articleId } = req.body;
    const newComment = new Comment({ text, articleId });
    await newComment.save();
    res.status(201).json({ message: 'Comentário adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar comentário.' });
  }
});

// Rota para listar todos os comentários de uma matéria
routes.get('/api/comentarios/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
});

// Rota para listar todos os artigos
routes.get('/api/artigos', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar os artigos.' });
  }
});

// Rota para buscar um único artigo por ID
routes.get('/api/artigos/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Artigo não encontrado.' });
    }
    return res.json(article);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar o artigo.' });
  }
});

// Rota para testar qual o pod processou a requisição

routes.get('/', (req, res) => {
  // Obtém o hostname do pod
  const podId = os.hostname();

  // Adiciona o cabeçalho personalizado com o ID do pod
  res.setHeader('X-Pod-ID', podId);

  // Retorna o hostname do pod no corpo da resposta
  res.json({ message: `Hostname do Pod: ${podId}`});
});

module.exports = routes;
