import { Chat } from "../data/mongo/model/chat";

export const verifyChatDate = async () => {
  const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);
  const userHistory = await Chat.find({
    expires: { $lt: eightHoursAgo}
  })

  if (userHistory.length === 0) {
    return
  }

  for (let chat of userHistory) {
    const now = new Date().getTime()
    const expires = chat.expires.getTime()
    const diffInMilliseconds = now - expires
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    if (diffInHours >= 8) {
      await Chat.updateOne({ userId: chat.userId }, { $set: { body: [], expires: '' }})
      console.log(`Historial de usuario ${chat.userId} reseteado.`);
    }
  }
}


