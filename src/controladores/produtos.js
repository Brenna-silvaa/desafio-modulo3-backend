const conexao = require('../conexao');

const listarProdutosUsuario = async (req, res) => {

    const {usuario} = req;

    try {
        
        const listaDeProdutos = await conexao.query('select * from produtos where usuario_id = $1', [usuario.id]);

        return res.status(200).json(listaDeProdutos.rows);

    } catch (error) {
        return res.status(404).json({mensagem: error.message})
    }

}

const obterProduto = async (req, res) => {
    const {id} = req.params;
    const {usuario} = req;

    try {

        const {rows: produto, rowCount} = await conexao.query('select * from produtos where id = $1 and usuario_id = $2', [id, usuario.id]);

        if (rowCount === 0) {
            return res.status(404).json({mensagem: 'produto não encontrado'});
        }

        return res.status(200).json(produto[0])        
        
    } catch (error) {
        return res.status(404).json({mensagem: error.message})
    }
}

const cadastrarProdutos = async (req, res) => {
    const {usuario} = req;
    const { nome, quantidade, categoria, preco, descricao, imagem} = req.body;

    if (!nome) {
        return res.status(401).json({mensagem: 'O campo nome deve ser informado'});
    }
    if (!descricao) {
        return res.status(401).json({mensagem: 'O campo descricao deve ser informado'});
    }
    if (!quantidade) {
        return res.status(401).json({mensagem: 'O campo quantidade deve ser informado'});
    }
    if (!preco) {
        return res.status(401).json({mensagem: 'O campo preco deve ser informado'});
    }

    if (quantidade <= 0) {
        return res.status(400).json({mensagem: 'A quantidade deve ser maior que zero'});
    }

    try {

        const query = 'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';

        const produtoCadastrado = await conexao.query(query, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem]);

        if (produtoCadastrado.rowCount === 0 ) {
            return res.status(400).json({mensagem: 'Não foi possivel cadastrar o produto'});
        }

        return res.status(204).json()
        
    } catch (error) {
        return res.status(404).json({messagem: error.message})
    }
}

const atualizarProduto = async (req, res) => {

    const {usuario} = req;
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;
    const {id} = req.params

    
    if (!nome) {
        return res.status(401).json({mensagem: 'O campo nome deve ser informado'});
    }
    if (!descricao) {
        return res.status(401).json({mensagem: 'O campo descricao deve ser informado'});
    }
    if (!quantidade) {
        return res.status(401).json({mensagem: 'O campo quantidade deve ser informado'});
    }
    if (!preco) {
        return res.status(401).json({mensagem: 'O campo preco deve ser informado'});
    }
  
    if (!imagem) {
        return res.status(401).json({mensagem: 'O campo imagem deve ser informado'});
    }

    try {
        const {rows: produto, rowCount} = await conexao.query('select * from produtos where id = $1 and usuario_id = $2', [id, usuario.id]);

        if (rowCount === 0) {
            return res.status(404).json({mensagem: 'produto não encontrado'});
        }

        const query = 'update produtos set (nome, quantidade, categoria, preco, descricao, imagem) = ($1, $2, $3, $4, $5, $6) where id = $7';
        
        const produtoAtualizado = await conexao.query(query, [nome, quantidade, categoria, preco, descricao, imagem, id]);

        if (produtoAtualizado.rowCount === 0) {
            return res.status(404).json({mensagem: 'Não foi possível atualizar o usuario'});
        }

        return res.status(204).json();
        
    } catch (error) {
        return res.status(404).json({mensagem: error.message})
    }
}

const excluirProduto = async (req, res) => {
    const {usuario} = req;
    const {id} = req.params;

    try {

        const {rows: produto, rowCount} = await conexao.query('select * from produtos where id = $1 and usuario_id = $2', [id, usuario.id]);

        if (rowCount === 0) {
            return res.status(404).json({mensagem: 'produto não encontrado'});
        }

        const query = 'delete from produtos where id = $1';
        const produtoExcluido = await conexao.query(query, [id]);

        
        if (produtoExcluido.rowCount === 0) {
            return res.status(404).json({mensagem: 'Não foi possível excluir o produto'});
        }

        return res.status(204).json();
        
    } catch (error) {
        return res.status(404).json({mensagem: error.message})
    }
}

module.exports = {
    listarProdutosUsuario,
    obterProduto,
    cadastrarProdutos,
    atualizarProduto,
    excluirProduto
}