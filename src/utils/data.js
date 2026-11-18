import { promises as fs } from 'fs';
import axios from 'axios';

const readJSONfile = async (dataPath) => {
  return await fs.readFile(dataPath, 'utf8');
};

const writeJSONfile = async (dataPath, data) => {
  return await fs.writeFile(dataPath, data);
};

const getJSON = async (url) => {
  return await axios.get(url);
};

const printQuestion = (items, bot, fromId, resp) => {
  items.data.forEach((item) => {
    resp += `🟡 問: ${item.question_cn}\n\r`;
    resp += `🟢 答: ${item.answer_cn}\n`;
    resp += '_________________________________________\n\r';
    resp += `🟡 Q: ${item.question_en}\n\r`;
    resp += `🟢 A: ${item.answer_en}`;
    // console.log(resp);
    bot.sendMessage(fromId, resp);
    resp = '';
  });
};

export { readJSONfile, writeJSONfile, getJSON, printQuestion };
