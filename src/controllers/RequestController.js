const pool = require('../querys')
module.exports = {
  async index(req, res) { 
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT p.id, 
                p.quantidade,
                pr.id id_produto,
                pr.name,
                pr.preco
              FROM requests p
        INNER JOIN products pr 
          ON pr.id = p.id_product`
        )

      console.log('resultado list', result)

      const response = {
        quantidadePedido: result.rows.length,
        pedidos: result.rows.map(pedido => {
          return {
            idPedido: pedido.id,
            quantidade: pedido.quantidade,
            produto: {
              idProduto: pedido.id_produto,
              nome: pedido.name,
              preco: pedido.preco
            },
            request: {
              tipo: 'GET',
              descricao: 'Retorna um pedido',
              url: 'http://localhost:3001/api/pedidos/' + pedido.id
            }
          }
        })
      }
      return res.status(200).send(response)
      
    } catch (error) {
      return res.status(500).send({error})
    } finally {
      client.release();
    }
    

  },
  async store(req, res) {
    const {id_produto, quantidade} = req.body;
    const client = await pool.connect();
    try {
      const hasProduto = await client.query('SELECT * FROM products where id = $1', [id_produto])
      if(hasProduto.rows.length === 0) return res.status(404).send({message: 'Produto solicitado nao existe'})

      const result = await client.query('INSERT INTO requests (id_product, quantidade) values ($1, $2)', [id_produto, quantidade])
      const response = {
        message: 'Pedido criado com sucesso',
        pedidoCriado: {
          id: result.id,
          id_produto,
          quantidade
        },
        request: {
          tipo: 'GET',
          descricao: 'Retorna todos os pedidos',
          url: 'http://localhost:3001/api/pedidos/'
        } 
      }
      return res.status(201).send(response)
      
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

      const result = await client.query('SELECT * FROM requests where id = $1', [id])

      if(result.rows.length === 0) {
        return res.status(404).send({
          messsage: 'Não foi encontrado pedido com este ID'
        })
      }
      const pedido = result.rows[0]
      const response = {
        ...pedido,
        request: {
          tipo: 'GET',
          descricao: 'Retorna todos os pedidos',
          url: 'http://localhost:3001/api/pedidos/'
        } 
      }
      res.status(200).send(response)
    } catch (error) {
      console.log(error.stack)
    } finally {
      await client.release()
    }
  },
  async destroy(req,res) {
    const { id } = req.params
    const client = await pool.connect()
    try {
      if(id.match(/\d+/g) !== null) {
      const hasPedido = await client.query('SELECT * FROM requests where id = $1', [id])
      if(hasPedido.rows.length === 0) return res.status(404).send({message: 'Pedido não existe'})

      await client.query('DELETE FROM requests where id = $1', [id])
      const response = {
        message: 'Pedido removido com sucesso',
        request: {
          tipo: 'POST',
          descricao: 'Insere um pedido',
          url: 'http://localhost:3001/pedidos',
          body: {
            id_produto: 'Number',
            quantidade: 'Number'
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
