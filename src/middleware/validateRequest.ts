import { Request, Response, NextFunction } from 'express'

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || !req.body.products || !req.body.info) {
    return res.status(400).json({
      error: 'Bad Request. Please make sure all fields are present.',
    })
  }
  next()
}

export default validateRequest
