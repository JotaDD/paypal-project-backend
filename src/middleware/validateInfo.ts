import { Request, Response, NextFunction } from 'express'

const validateInfo = (req: Request, res: Response, next: NextFunction) => {
  const { info } = req.body
  const infoFields = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'address1',
    'city',
    'state',
    'zipCode',
    'country',
  ]

  for (const field of infoFields) {
    if (!info[field]) {
      return res.status(200).json({ error: `Field '${field}' not found!` })
    }
  }
  next()
}

export default validateInfo
