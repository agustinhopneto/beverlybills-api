import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: Bun.env.NOTION_API_SECRET
})