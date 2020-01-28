const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./src/routes');

app.use('/uploads', express.static('uploads'))

app.use(express.json())
app.use(cors())

app.use('/api', routes);

app.use((req, res, next) => {
  const erro = new Error('Não encontrado')
  erro.status = 404;
  next(erro);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  return res.send({
    error:{
      message: error.message,
      code: error.status || 500
    }
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Sistema rodando na porta ${PORT}`)
})