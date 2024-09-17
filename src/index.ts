

import { Client, LocalAuth, Events, Message } from 'whatsapp-web.js';
import qrCode from 'qrcode';
import { initOpenai } from './provider/openai';
import { handleMessageOpenai } from './handlers/handleMessageOpenai';
import { initAnthropic } from './provider/antropic';
import { handleMessageAtropic } from './handlers/handleMessageAtropic';
import { handleMessage } from './handlers/handleMessage';


const start = async () => {

  const client = new Client({
    authStrategy : new LocalAuth({
      clientId: 'bodega'
    })
  }); 

  client.on(Events.QR_RECEIVED, (qr: string) => {
    qrCode.toString(qr, {
      type: 'terminal',
      small: true,
      margin: 1,
      scale: 1,
    }, (err, url) => {
      if (err) throw err;
      console.log(url);
    })
  })

  client.on(Events.LOADING_SCREEN, (percent: string) => {
    console.log('Loading screen', percent)
  })

  client.on(Events.AUTHENTICATED, () => {
    console.log('Authenticated!')
  })

  client.on(Events.READY, () => {
    // initOpenai()
    //initAnthropic()
    console.log('Client is ready!')
  })

  client.on(Events.MESSAGE_RECEIVED, async (message: Message) => {

    //await handleMessageAtropic(message)
    // await handleMessageOpenai(message)
    const result = await handleMessage(message)
    if(result) message.reply(result, message.from, { linkPreview: true })

  })

  client.initialize()
}
start()