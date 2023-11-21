import app from './app'
const { PORT } = process.env

app.listen(
  {
    port: PORT ? Number(PORT) : 8888,
  },
  () => {
    console.log(`Listening port:${PORT}`)
  },
)
