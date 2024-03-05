import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

export async function invoiceMapper() {
  const fileText = await Bun.file('src/lib/sicoob/data/invoice.txt').text()

  const fileTextParsed = fileText
    .replaceAll('          ', '\t')
    .replaceAll('\t\r\n', ';')
    .split('\t')
    .join(';')
    .split('\r\n')

  const result = []

  for (const register of fileTextParsed) {
    const parsedRegister = register.split(';')

    const date = parseDate(parsedRegister.at(0) as string)

    const isInstallment = parsedRegister.length === 3

    if (isInstallment) {
      const installmentNumberRegex = /\d{2}\/\d{2}/

      const installmentNumber = parsedRegister.at(1)?.match(installmentNumberRegex)?.shift()!

      const [title, location] = parsedRegister.at(1)?.split(installmentNumber)!

      const installmentData = installmentNumber.split('/')

      const transaction = {
        date,
        title: title.trim(),
        location: location.trim(),
        amount: Number(parsedRegister.at(2)?.replaceAll('.', '').replace(',', '.')),
        installment: {
          number: Number(installmentData.at(0)),
          total: Number(installmentData.at(1))
        }
      }

      result.push(transaction)

      continue
    }

    const internationalPurchase = parsedRegister.length === 5

    if (internationalPurchase) {
      const [_, title, location, __, amount] = parsedRegister

      const transaction = {
        date,
        title: title.trim(),
        location: location.trim(),
        amount: Number(amount.replaceAll('.', '').replace(',', '.')),
      } 

      result.push(transaction)

      continue
    }

    const [_, title, location, amount] = parsedRegister

    const transaction = {
      date,
      title: title.trim(),
      location: location.trim(),
      amount: Number(amount.replaceAll('.', '').replace(',', '.')),
    }

    result.push(transaction)
  }

  return (result)
}

function parseDate(dateStr: string) {
  const now = dayjs()

  const dateStrArray = dateStr.split('/')

  const formattedDateStr = `${dateStrArray.at(1)}/${dateStrArray.at(0)}/${now.year()}`

  const date = dayjs(formattedDateStr, 'MM/DD')

  const parsedDate = date.isAfter(now) ? date.subtract(1, 'year') : date

  return parsedDate.format('YYYY-MM-DD')
}
