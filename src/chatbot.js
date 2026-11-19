import { bot } from '../socketio.js';
import { getJSON, printQuestion } from './utils/data.js';

bot.onText(/\/question (.+)/, async function (msg, match) {
  const fromId = msg.from.id;

  try {
    let resp = '';
    let query = match[1].trim() || match[1].toLowerCase().trim();
    let response = await getJSON(`http://localhost:8080/question/${query}`);

    printQuestion(response.data, bot, fromId, resp);
  } catch (error) {
    console.log('Error', error.response?.data || error.message);

    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 404)
    ) {
      bot.sendMessage(fromId, '找不到關鍵字⚠️\n\r Keyword not found.⚠️');
    } else {
      bot.sendMessage(
        fromId,
        '尋找時發生錯誤⚠️\n\r An error occurred while searching.⚠️',
      );
    }
  }
});
