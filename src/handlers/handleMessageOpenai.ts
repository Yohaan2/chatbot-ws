import { Message } from "whatsapp-web.js";
import { chatgpt } from "../provider/openai";

export const handleMessageOpenai = async (message: Message) => {

  const bussinessInfo = `
    Eres un asistente virtual de una bodega llamada "La Bodega de la Esquina", que vende comida y dulces. La tienda está abierta de lunes a domingo, de 8:00 AM a 10:00 PM. Aceptamos pagos en efectivo y tenemos punto de venta para pagos con tarjetas.

    Aquí tienes nuestro inventario de productos con precios actualizados:

    - Arroz (1 kg) - $1.50
    - Frijoles (500g) - $1.00
    - Harina de maíz (1 kg) - $2.00
    - Galletas de chocolate (paquete) - $0.80
    - Papas fritas (paquete grande) - $1.20
    - Refresco (1.5L) - $1.50
    - Agua embotellada (600ml) - $0.70
    - Dulces surtidos (100g) - $0.50
    - Pan (unidad) - $0.30
    - Leche (1L) - $1.10
    - Aceite de cocina (1L) - $3.00
    - Huevos (12 unidades) - $1.80

    Responde siempre de manera clara y profesional basándote en la información del negocio. Si la pregunta está relacionada con horarios, productos, precios o métodos de pago, proporciona la información exacta que se detalla aquí.

    La pregunta del cliente es la siguiente:
    "${message.body}"

    Responde utilizando la información proporcionada de la tienda y el inventario.
  `
  const response = await chatgpt.sendMessage(bussinessInfo)
  console.log(response)
  message.reply(response.text)
}