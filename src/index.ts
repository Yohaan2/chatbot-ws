import { Client, Events, Message, RemoteAuth } from 'whatsapp-web.js';
import qrCode from 'qrcode';
import express from 'express';
import mongoose from 'mongoose';
import { PORT } from './config/envs';
import { handleMessageGemini } from './handlers/handleMessageGemini';
import { initGemini } from './provider/gemini';
import { isWithinActiveHours } from './utils/hoursActive';
import { Client as ClientModel, IClient } from './data/mongo/model/client.model';
import { connection } from './data/mongo/mongo-database';
import { MongoStore } from 'wwebjs-mongo';
import cron from "node-cron"
import { verifyChatDate } from './utils/verifyChatDate';

const app = express()
app.use(express.json())
let qrCodeUrl: string

const createNewSession = async (clientData: IClient) => {
  return new Promise((resolve, reject) => {
    const store = new MongoStore({
      mongoose: mongoose
    })

    const client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000,
        clientId: clientData.phoneNumber
      }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
    })

    client.on('qr', (qr: string) => {
      qrCode.toDataURL(qr, (err, url) => {
        if (err) return reject(err)
        qrCodeUrl = url
        resolve(qrCodeUrl)
      })
    })

    client.on(Events.LOADING_SCREEN, (percent: string) => {
      console.log('Loading screen', percent)
    })

    client.on(Events.AUTHENTICATED, () => {
      initGemini()
      console.log('Authenticated!')
    })

    client.on(Events.READY, () => {
      console.log(`Client ${clientData.bussinessName} is ready!`)
    })

    client.on(Events.MESSAGE_RECEIVED, async (message: Message) => {
      if (isWithinActiveHours()){
        if(message.from.endsWith('@g.us')){
          console.log('Mensaje ignorado proveniente de un grupo')
          return
        }
        if (message.from === 'status@broadcast') return
        
        await handleMessageGemini(message, clientData.prompt)

      } else {
        message.reply('Lo sentimos, el servicio está inactivo. Nuestro horario es de 8:00 AM a 10:00 PM.')
      }
    })

    client.on(Events.DISCONNECTED, async (reason) => {
      console.log('Disconnected!')
      try {
        await client.destroy()
        console.log('Client session successfully destroyed', clientData.phoneNumber);
      } catch (error) {
        console.error('Error al intentar destruir la sesión del cliente:', error);
      }
    })

    client.initialize()

  })

}

connection()

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

app.post('/create-session', async (req, res) => {
  const { phoneNumber, bussinessName, prompt } = req.body
  const client = new ClientModel({
    phoneNumber,
    bussinessName,
    prompt
  })

  await client.save()

  let qrCode
  try {
    qrCode = await createNewSession(client)
    
  } catch (error) {
    console.log(error)
  }
  

  if (qrCode){
    return res.send(`
      <html>
        <body>
          <h1>Escanea este código QR con WhatsApp</h1>
          <img src="${qrCode}" alt="QR Code" />
        </body>
      </html>
      `
    )
  } else {
    return res.send('<h1>No QR code found</h1>')
  }
  
})

cron.schedule('0 8,20 * * *', async () => {
  try {
    await verifyChatDate()
  } catch (error) {
    console.error('Error al verificar los chats expirados:', error);
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})