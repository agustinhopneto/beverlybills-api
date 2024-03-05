import { createExpensePage } from '@lib/notion/services/create-expense-page.service';
import { invoiceMapper } from '@lib/sicoob/invoice.mapper';

const invoice = await invoiceMapper();

for (const register of invoice) {
  await createExpensePage(register)
}

console.log('Aqui acabou.')