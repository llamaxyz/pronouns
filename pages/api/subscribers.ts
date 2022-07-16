import axios, { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

const base64ApiKey = Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString('base64')

const mailchimpClient = axios.create({
  baseURL: `https://${process.env.MAILCHIMP_API_SERVER}.api.mailchimp.com`,
  headers: { 'Content-Type': 'application/json', Authorization: `Basic ${base64ApiKey}` },
})

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { email },
  } = req

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  res.setHeader('Content-Type', 'application/json')

  await mailchimpClient({
    url: `/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`,
    method: 'POST',
    data: {
      email_address: email,
      status: 'subscribed',
    },
  })
    .then(() => res.status(200).json({}))
    .catch((error: AxiosError) => {
      if (error?.response?.status && error?.response?.status > 400) {
        return res.status(error?.response?.status || 500).json({ errorMessage: error?.response?.statusText || 'Internal Server Error' })
      }
      return res.status(200).json({})
    })
}

export default subscribe
