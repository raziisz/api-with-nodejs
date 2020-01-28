const pool = require('../querys')

module.exports = {
  async index(req, res) { 
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM products ORDER BY id ASC')

      const response = {
        quantidade: result.rows.length,
        produtos: result.rows.map(prod => {
          return {
            id: prod.id,
            nome: prod.name,
            preco: prod.preco,
            request: {
              tipo: 'GET',
              descricao: 'Retorna um produto',
              url: 'http://localhost:3001/api/produtos/' + prod.id
            }
          }
        })
      }
      res.status(200).send(response)
      
    } catch (error) {
      return res.status(500).send({error})
    } finally {
      client.release();
    }
    

  },
  async store(req, res) {
    const {nome, preco} = req.body;
    const client = await pool.connect();
    try {
      const result = await client.query('INSERT INTO products (name, preco) values ($1, $2)', [nome, preco])
      const response = {
        message: 'Produto criado com sucesso',
        produtoCriado: {
          id: result.id,
          nome,
          preco
        },
        request: {
          tipo: 'POST',
          descricao: 'Insere um produto',
          url: 'http://localhost:3001/api/produtos/'
        } 
      }
      res.status(201).send(response)
      
    } catch (error) {
      return res.status(500).send({error})
    } finally {
      await client.release();
    }
   
  },
  async show(req, res) {
    const { id } = req.params;
    try {
      const client = await pool.connect()

      const result = await client.query('SELECT * FROM products where id = $1', [id])

      if(result.rows.length === 0) {
        return res.status(404).send({
          messsage: 'Não foi encontrado produto com este ID'
        })
      }
      const produto = result.rows[0]
      const response = {
        ...produto,
        request: {
          tipo: 'GET',
          descricao: 'Retorna todos os produtos',
          url: 'http://localhost:3001/api/produtos/'
        } 
      }
      res.status(200).send(response)
    } catch (error) {
      console.log(error.stack)
    } finally {
      await client.release()
    }
  },
  async update(req, res) {
    const { id } = req.params
    const produto = req.body
    const client = await pool.connect()
    try {
      if(id.match(/\d+/g) !== null) {

        const hasProduto = await client.query('SELECT * FROM products where id = $1', [id])
        if(hasProduto.rows.length === 0) return res.status(404).send({message: 'Produto não encotrado ou não existe'})
        
        await client.query('UPDATE products set name = $1, preco = $2 where id = $3', [produto.nome, produto.preco, id])

        const response = {
          message: 'Produto atualizado com sucesso',
          produtoAtualizado: {
            id,
            ...produto
          },
          request: {
            tipo: 'GET',
            descricao: 'Retorna os detalhes do produto',
            url: 'http://localhost:3001/api/produtos/' + id
          } 
        }
        res.status(202).send(response)
      } else {
        res.status(400).send({
          message: 'Id inválido'
        })
      }

    } catch (error) {
      res.status(500).send({error})
    } finally {
      await client.release()
    }
  },
  async destroy(req, res) {
    const { id } = req.params
    const client = await pool.connect()
    try {
      if(id.match(/\d+/g) !== null) {
      const hasProduto = await client.query('SELECT * FROM products where id = $1', [id])
      if(hasProduto.rows.length === 0) return res.status(404).send({message: 'Produto não existe'})

      await client.query('DELETE FROM products where id = $1', [id])
      const response = {
        message: 'Produto removido com sucesso',
        request: {
          tipo: 'POST',
          descricao: 'Insere um produto',
          url: 'http://localhost:3001/produtos',
          body: {
            nome: 'String',
            preco: 'Number'
          }
        }
      }
      return res.status(201).send(response);
    } else {
      return res.status(400).send({
        message: 'Id inválido'
      })
    }
    } catch (error) {
      return res.status(400).send({error})
    } finally {
      await client.release();
    }

  }
};
