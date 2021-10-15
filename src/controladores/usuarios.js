const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha, nome_loja} = req.body;

    if (!nome){
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório'});
    }

    if (!email){
        return res.status(400).json({ mensagem: 'O campo email é obrigatório'});
    }

    if (!senha){
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório'});
    }

    if (!nome_loja){
        return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório'});
    }

    try {

        const {rowCount: quantidadeUsuarios} = await conexao.query('select * from usuarios where email = $1', [email]);
        
        if (quantidadeUsuarios > 0 ){
            return res.status(400).json({mensagem: 'O email informado já foi cadastrado'});
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
        const usuarioCadastrado = await conexao.query(query, [nome, nome_loja, email, senhaCriptografada])

        if (usuarioCadastrado.rowCount === 0){
            return res.status(404).json({mensagem: 'Não foi possível cadastrar o usuário'});
        }

        return res.status(201).json()

    } catch (error) {
        return res.status(404).json({mensagem: error.message});
    }

}

const login = async (req, res) => {
    const {email, senha} = req.body;

    if (!email || !senha){
        return res.status(400).json({mensagem: "Email e senha são obrigatórios"});
    }

    try {

        const queryEmail = 'select * from usuarios where email = $1';
        const {rows, rowCount} = await conexao.query(queryEmail, [email]);

        if(rowCount === 0){
            return res.status(404).json({mensagem: "O usuário não foi encontrado"})
        }

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada){
            return res.status(403).json({mensagem: "Usuário e/ou senha inválido(s)."})
        }

        const token = jwt.sign({id: usuario.id}, segredo, {expiresIn: '1d'});

        return res.status(200).json({token: token})
        
    } catch (error) {
        return res.status(404).json({mensagem: error.message});
    }

}

const detalharUsuario = async (req, res) => {
    const {usuario} = req;

    return res.status(200).json(usuario);   
}

const atualizarUsuario = async (req, res) => {
    const {usuario} = req;
    const {nome, nome_loja, email, senha} = req.body;

    if (!nome){
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório'});
    }

    if (!email){
        return res.status(400).json({ mensagem: 'O campo email é obrigatório'});
    }

    if (!senha){
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório'});
    }

    if (!nome_loja){
        return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório'});
    }

    try {

        if (email !== usuario.email){

            const validarEmail = await conexao.query('select * from usuarios where email = $1', [email]);

            if (validarEmail.rowCount > 0) {
                return res.status(401).json({mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.'})
            }
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'update usuarios set (nome, nome_loja, email, senha) = ($1, $2, $3, $4) where id = $5';
        const usuarioAtualizado = await conexao.query(query, [nome, nome_loja, email, senhaCriptografada, usuario.id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(404).json({mensagem: 'Não foi possível atualizar o usuario'});
        }

        return res.status(204).json();
        
    } catch (error) {
        return res.status(404).json({mensagem: error.message})
    }

}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}