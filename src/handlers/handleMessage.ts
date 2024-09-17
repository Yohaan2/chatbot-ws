import { Message } from "whatsapp-web.js"

const productInfo = {
  arroz: '40bs',
  azucar: '1/2kg 28bs - 1kg 58bs',
  galleta_maria: 'peq 5bs - gr 6bs',
  jabon_alive: '400gr - 38bs',
  jabon_3b: '28bs',
  queso:'240',
  polaca: '195', 
  pasta: '52',
  caraota: '49', 
  lenteja: '59',
  mantequilla: '42',
  mantequilla_rey: 'sobre 28 - lata 37',
  yupi: '20',
  tiptop: '30',
  bombillo: '15',
  esponja: '25',
  crema_dental: '38',
  
}

export const handleMessage = (message: Message) => {
  let result: string = ''
  for (const [product, value] of Object.entries(productInfo)){
    if (product.toLocaleLowerCase().includes(message.body.toLocaleLowerCase())){
      let nameProduct = product.split('_').join(' ')
      result = `${nameProduct}: ${value}`
    }
  }
  if(result !== '') return result
}