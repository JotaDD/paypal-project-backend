import { HOST } from './services/services'
import app from './app'
const { PORT } = process.env

app.listen(
  {
    HOST,
    port: PORT ? Number(PORT) : 8888,
  },
  () => {
    console.log(`Listening port:${PORT}`)
  },
)
