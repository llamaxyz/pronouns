import dbClient from 'utils/dbClient'
import type { NextApiRequest, NextApiResponse } from 'next'

const stats = async (req: NextApiRequest, res: NextApiResponse) => {
  const { background, body, accessory, head, glasses } = req.query
  if (req.method === 'GET') {
    try {
      const stats = { background: {}, body: {}, accessory: {}, head: {}, glasses: {} }
      let { data: backgroundData } = await dbClient.from('background').select().eq('trait_id', background).single()
      let { data: bodyData } = await dbClient.from('body').select().eq('trait_id', body).single()
      let { data: accessoryData } = await dbClient.from('accessory').select().eq('trait_id', accessory).single()
      let { data: headData } = await dbClient.from('head').select().eq('trait_id', head).single()
      let { data: glassesData } = await dbClient.from('glasses').select().eq('trait_id', glasses).single()
      stats.background = backgroundData
      stats.body = bodyData
      stats.accessory = accessoryData
      stats.head = headData
      stats.glasses = glassesData
      return res.status(200).json({ body: stats })
    } catch (err) {
      return res.status(500).json({ body: err })
    }
  }
  res.status(404).end()
}

export default stats
