const express = require('express');
const authenticate = require('./authMiddleWare')
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');



const app = express();
app.use(express.json());
app.use(authenticate);



/**
 * @swagger
 * /artigos:
 *   post:
 *     tags: ['Rotas de Artigos']
 *     summary: Cria um novo artigo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               conteudo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artigo criado com sucesso
 */
app.post('/artigos', authenticate, [
    body('titulo').notEmpty().withMessage('O título é obrigatório'),
    body('conteudo').notEmpty().withMessage('O conteúdo é obrigatório'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const artigo = new Artigo(req.body);
    await artigo.save();
    res.status(201).send('Artigo postado com sucesso!');
});

/**
 * @swagger
 * /comentarios:
 *   post:
 *     tags: ['Rotas de Comentários'] 
 *     summary: Cria um novo comentário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idArtigo:
 *                 type: string
 *               conteudo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 */
app.post('/comentarios', authenticate, [
    body('idArtigo').notEmpty().withMessage('O id do artigo é obrigatório'),
    body('conteudo').notEmpty().withMessage('O conteúdo é obrigatório'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const artigo = await Artigo.findById(req.body.idArtigo);
        if (!artigo) {
            return res.status(400).send('O id do artigo fornecido não existe no banco de dados.');
        }

        const comentario = new Comentario(req.body);
        await comentario.save();
        res.status(201).send('Comentário postado com sucesso!');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('O id do artigo fornecido não possui o formato esperado.');
    }
});

/**
 * @swagger
 * /artigos:
 *   get:
 *     tags: ['Rotas de Artigos']
 *     summary: Retorna todos os artigos
 *     responses:
 *       200:
 *         description: Lista de artigos
 */
app.get('/artigos', authenticate, async (req, res) => {
    try {
        const artigos = await Artigo.find();
        res.send(artigos);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Houve um erro ao tentar buscar os artigos: ' + erro);
    }
});

/**
 * @swagger
 * /comentarios:
 *   get:
 *     tags: ['Rotas de Comentários']
 *     summary: Retorna todos os comentários
 *     responses:
 *       200:
 *         description: Lista de comentários
 */
app.get('/comentarios', authenticate, async (req, res) => {
    try {
        const comentarios = await Comentario.find();
        res.send(comentarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Houve um erro ao tentar buscar os comentários: ' + erro);
    }
});

/**
 * @swagger
 * /artigos:
 *   delete:
 *     tags: ['Rotas de Artigos']
 *     summary: Deleta todos os artigos
 *     responses:
 *       200:
 *         description: Todos os artigos foram deletados
 */
app.delete('/artigos', authenticate, async (req, res) => {
    try {
        await Artigo.deleteMany({});
        res.send('Todos os artigos foram deletados.');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Houve um erro ao tentar deletar todos os artigos: ' + erro);
    }
});

/**
 * @swagger
 * /comentarios:
 *   delete:
 *     tags: ['Rotas de Comentários']
 *     summary: Deleta todos os comentários
 *     responses:
 *       200:
 *         description: Todos os comentários foram deletados
 */
app.delete('/comentarios', authenticate, async (req, res) => {
    try {
        await Comentario.deleteMany({});
        res.send('Todos os comentários foram deletados.');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Houve um erro ao tentar deletar todos os comentários: ' + erro);
    }
});



// DEFINIÇÕES DO BANCO DE DADOS
mongoose.connect("");

const ArtigoSchema = new mongoose.Schema({
    titulo: String,
    conteudo: String,
});

const ComentarioSchema = new mongoose.Schema({
    idArtigo: mongoose.Schema.Types.ObjectId,
    conteudo: String,
});

const Artigo = mongoose.model('Artigo', ArtigoSchema);
const Comentario = mongoose.model('Comentario', ComentarioSchema);



// DEFINIÇÕES DO SWAGGER
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Artigos e Comentários',
      version: '1.0.0',
      description: 'Uma API simples para gerenciar artigos e comentários',
    },
  },
  apis: ['./app.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



// DEFINIÇÕES DO SERVIDOR
const port = 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));