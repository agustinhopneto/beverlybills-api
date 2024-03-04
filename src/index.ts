import { createExpensePage } from '@lib/notion/services/create-expense-page.service';
import { creditCardInvoiceMapper } from '@lib/sicoob/credit-card-invoice.mapper';

const invoice = await creditCardInvoiceMapper();

for (const register of invoice) {
  await createExpensePage(register)
}

console.log('Aqui acabou.')