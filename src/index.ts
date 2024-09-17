

import { Client, LocalAuth, Events, Message } from 'whatsapp-web.js';
import qrCode from 'qrcode';
import { initOpenai } from './provider/openai';
import { handleMessageOpenai } from './handlers/handleMessageOpenai';
import { initAnthropic } from './provider/antropic';
import { handleMessageAtropic } from './handlers/handleMessageAtropic';
import { handleMessage } from './handlers/handleMessage';
import express from 'express';
import { PORT } from './config/envs';

const app = express()
let qrCodeUrl: string
const start = async () => {

  const client = new Client({
    authStrategy : new LocalAuth({
      clientId: 'bodega'
    }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  }); 

  client.on(Events.QR_RECEIVED, (qr: string) => {
    qrCode.toDataURL(qr, (err, url) => {
      if (err) throw err
      qrCodeUrl = url
    })
  })

  client.on(Events.LOADING_SCREEN, (percent: string) => {
    console.log('Loading screen', percent)
  })

  client.on(Events.AUTHENTICATED, () => {
    console.log('Authenticated!')
  })

  client.on(Events.READY, () => {
    console.log('Client is ready!')
  })

  client.on(Events.MESSAGE_RECEIVED, async (message: Message) => {
    const result = handleMessage(message)
    if(result) message.reply(result, message.from, { linkPreview: true })

  })

  client.initialize()
}
start()

app.get('/qr', (req, res) => {
  if (qrCodeUrl){
    return res.send(`
      <html>
        <body>
          <h1>Escanea este código QR con WhatsApp</h1>
          <img src="${qrCodeUrl}" alt="QR Code" />
        </body>
      </html>
      `
    )
  }else {
    return res.send('<h1>No QR code found</h1>')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})