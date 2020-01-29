const pool = require('../querys')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { authSecret } = require('./../../.env')
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

  },
  async login(req, res, next){
    const {email, senha} = req.body;
    const client = await pool.connect();

    try {
      const hasUser = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if(!hasUser.rows[0]) return res.status(401).send({
        message: 'E-mail ou senha invalida',
        statusCode: 401
      })

      const result = await bcrypt.compare(senha.toString(), hasUser.rows[0].senha)

      if(result) {
        const token = jwt.sign({
          id_usuario: hasUser.rows[0].id_usuario,
          email: hasUser.rows[0].email
        }, authSecret, 
        {
          expiresIn: '1h'
        });
        return res.status(200).send({
        message: 'Logado com sucesso',
        token
      })
    }

      return res.status(401).send({
        message: 'E-mail ou senha invalida',
        statusCode: 401
      })
    } catch (error) {
      console.log('Deu merda', error)
      res.status(500).send({
        message: 'Error interno',
        statusCode: 500
      })
    }
  }
};
