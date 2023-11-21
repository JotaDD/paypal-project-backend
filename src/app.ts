import express, { Application, Request, Response } from 'express'

import cors from 'cors'
import { confirmOrder, createOrder } from './services/services'
import validateRequest from './middleware/validateRequest'
import { validateProducts } from './middleware/validateProducts'
import validateInfo from './middleware/validateInfo'

const app: Application = express()

app.use(cors())

app.use(express.json())

app.post(
  '/paypal/create-order',
  validateRequest,
  validateProducts,
  validateInfo,
  async (req: Request, res: Response) => {
    const { products, info } = req.body
    try {
      const create = await createOrder({ products, info })
      return res.status(200).json(create)
    } catch (error) {
      return res.status(500).json(error)
    }
  },
)

app.post('/paypal/confirm-order', async (req: Request, res: Response) => {
  try {
    const order = await confirmOrder(req.body.orderID)
    return res.status(200).json(order)
  } catch (error) {
    return res.status(500).json(error)
  }
})

export default app
