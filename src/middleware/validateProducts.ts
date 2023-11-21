import { Request, Response, NextFunction } from 'express'

export function validateProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { products } = req.body

  for (const item of products) {
    const productFields = ['reference_id', 'description', 'amount']
    for (const field of productFields) {
      if (!item[field]) {
        return res.status(400).json({ error: `Field '${field}' not found!` })
      }
    }
  }

  next()
}
