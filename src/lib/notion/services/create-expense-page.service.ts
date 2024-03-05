import { notion } from '../client'

type CreateExpensePageDTO = {
  title: string;
  date: string;
  amount: number;
  location: string;
  installment?: {
    number: number;
    total: number;
  }
}

export async function createExpensePage({ title, date, amount, location, installment }: CreateExpensePageDTO) {
  await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: Bun.env.NOTION_EXPENSES_DB_ID as string,
    },
    properties: {
      Name: {
        type: 'title',
        title: [{ type: 'text', text: { content: title } }]
      },
      Location: {
        type: 'rich_text',
        rich_text: [{ text: { content: location.toUpperCase() } }]
      },
      Installment: {
        type: 'rich_text',
        rich_text: [
          { 
            text: { 
              content: installment 
                ? `${installment?.number}/${installment?.total}` 
                : '' 
            } 
          }
        ]
      },
      Date: {
        type: 'date',
        date: {
          start: date
        }
      },
      Amount: {
        type: 'number',
        number: amount
      },
      Origin: {
        type: 'select',
        select: {
            name: 'Credit Card'
        }
      }
    }
  })
}