const express = require('express');
const usuarios = require('./controladores/usuarios');
const filtro = require('./autorizacao');
const produtos = require('./controladores/produtos');

const rotas = express();

// usuarios
rotas.post('/usuario', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.login);

rotas.use(filtro);

rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);

// produtos
rotas.get('/produtos', produtos.listarProdutosUsuario);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.post('/produtos', produtos.cadastrarProdutos);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);



module.exports = rotas