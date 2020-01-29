const pool = require('../querys')
const bcrypt = require('bcrypt')
module.exports = {
  async new(req, res) {
    const {email, senha} = req.body

    try {
      const client = await pool.connect();

      const hasEmail = await client.query(`SELECT email FROM users WHERE email = $1`, [email])

      if(hasEmail.rows[0]) return res.status(401).send({
        message: 'Já existe usuario com esse e-mail'
      })
      
      bcrypt.hash(senha.toString(), 10, async(errBcrypt, hash) => {
        
        if(errBcrypt) return res.status(500).send({
          message: 'Deu ruim no bcrypt',
          error: errBcrypt
        })
        
        const result = await client.query(`INSERT INTO users (email, senha) VALUES ($1, $2)`, [email, hash])

        return res.status(201).send({
          message: 'Usuário criado com sucesso',
          usuarioCriado: {
            email
          }
        })
      })
      
    } catch (error) {
      res.status(500).send({
        error: 'Deu ruim',
        message: error
      })
    }

  }
};
