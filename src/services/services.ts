import { InfoType, ProductType } from './../../../frontend/src/types/types'
import 'dotenv/config'

const { CLIENT_ID, SECRET_ID, BASE_URL_PAYPAL } = process.env

export const generateAccessToken = async () => {
  try {
    if (!CLIENT_ID || !SECRET_ID) {
      throw new Error('MISSING_API_CREDENTIALS')
    }
    const auth = Buffer.from(CLIENT_ID + ':' + SECRET_ID).toString('base64')
    const response = await fetch(`${BASE_URL_PAYPAL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Failed to generate Access Token:', error)
  }
}

export const createOrder = async ({
  products,
  info,
}: {
  products: ProductType[]
  info: InfoType
}) => {
  const accessToken = await generateAccessToken()

  const totalValue = products.reduce((sum, item) => sum + +item.amount.value, 0)
  const value = await totalValue

  const url = `${BASE_URL_PAYPAL}/v2/checkout/orders`
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'BRL',
          value,
        },
        shipping: {
          address: {
            address_line_1: info.address1,
            address_line_2: info.address2,
            admin_area_2: info.city,
            admin_area_1: info.state,
            postal_code: info.zipCode,
            country_code: info.country,
          },
        },
      },
    ],
    payment_source: {
      paypal: {
        email_address: info.email,
        name: {
          given_name: info.firstName,
          surname: info.lastName,
        },
        phone: {
          phone_type: 'MOBILE',
          phone_number: {
            national_number: info.phoneNumber,
          },
        },
        address: {
          address_line_1: info.address1,
          address_line_2: info.address2,
          admin_area_2: info.city,
          admin_area_1: info.state,
          postal_code: info.zipCode,
          country_code: info.country,
        },
      },
    },
    application_context: {
      brand_name: 'mycompany.com',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `http://localhost:8888/capture-order`,
      cancel_url: `http://localhost:8888/cancel-payment`,
    },
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const retornado = await response.json()
  return retornado
}

export const confirmOrder = async (id: number) => {
  const token = await generateAccessToken()
  const request = await fetch(
    `${BASE_URL_PAYPAL}/v2/checkout/orders/${id}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const response = await request.json()
  return response
}

export const handleResponse = async (response: any) => {
  if (response.status === 200 || response.status === 201) {
    return response.data
  }

  const errorMessage = await response.text()
  throw new Error(errorMessage)
}
