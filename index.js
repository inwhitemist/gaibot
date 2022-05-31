const TeleBot = require('telebot');
const { token } = require('./config.json')
/*const BUTTONS = {
    repeat: {
        label: '🔁 Repeat',
        command: text
    }
};*/
const bot = new TeleBot({
	token: token,
	pluginFolder: '../plugins/',
    	usePlugins: ['floodProtection','namedButtons'],
    	pluginConfig: {
        floodProtection: {
            interval: 1,
            message: 'Too many messages, relax!'
        },/*
        namedButtons: {
            buttons: BUTTONS
        }*/
    }
});
const WomboDreamApi = require('wombo-dream-api');

// STYLES -----------------------------------------------------------------------------------------
bot.on('/styles', (msg) => {
    let id = msg.from.id;
    WomboDreamApi.buildDefaultInstance()
	.fetchStyles()
	.then((styles) => {
                let ids = styles.map(a => a.id)
                let names = styles.map(a => a.name)
                let arr = ''
                for (let i = 0; i< ids.length; i++  ) {
                    arr +=ids[i]+' - '+names[i]+'\n';
                    }
                //console.log(arr)
                bot.sendMessage(id, arr)
            })


	//.catch(console.error);
});

// TEXT --------------------------------------------------------------------------------------------

bot.on('text', msg => {
    let id = msg.from.id;
    let text = msg.text;
    let args = text.split(' ')
    let last = args.slice(-1)
  /*  const replyMarkup = bot.inlineKeyboard([
        [
            // First row with command callback button
            bot.inlineButton('Generate again', {callback: `/generate`})
        ],
    ]);

let replyMarkup = bot.keyboard([
    [BUTTONS.repeat.label]
], {resize: true});
*/
    //console.log(last[0])
    if(text == '/styles') return
    if(text == '/help') return
    if(text.startsWith('/generate')) return
    if(last[0] > 25) return bot.sendMessage(id, `Incorrecnt style. /styles to view all available styles.`)
    if(isNaN(last[0])) {
        bot.sendMessage(id, `Missing style number, /styles to view all available styles.`)
       return;
    }
    bot.sendMessage(id, 'Generating image, please wait...')

    WomboDreamApi.buildDefaultInstance()
	.generatePicture(text, last[0], (task) => {
		console.log(task.state, 'stage', task.photo_url_list.length);

	})
	.then((task) => bot.sendPhoto(id, task.result.final))
   // bot.sendMessage(id,'Retry last?', {replyMarkup})
	.catch(console.error);
});

/* GENERATE COMMAND ---------------------------------------------------------------------

bot.on('/generate', (msg) => {
    let id = msg.from.id;
    let text = msg.text;
    let fullmsg = text.split(' ')
    let last = fullmsg.slice(-1)
console.log(last)
console.log(fullmsg)
    let realcmd = fullmsg.slice(1)
    let real_text = realcmd.join(' ')
console.log(real_text)
    bot.sendMessage(id, 'Generating image, please wait...')

    WomboDreamApi.buildDefaultInstance()
	.generatePicture(real_text, last[0], (task) => {
		console.log(task.state, 'stage', task.photo_url_list.length);

	})
	.then((task) => bot.sendPhoto(id, task.result.final))
   // bot.sendMessage(id,'Retry last?', {replyMarkup})
	.catch(console.error);

	//.catch(console.error);
});

*/
// HELP ---------------------------------------------------------------------------------
bot.on ('/help', (msg) => {
    let id = msg.from.id;
    bot.sendMessage(id, `Generating images using GAN (generative adversarial networks)\nTo generate image write your idea and style number at and.\n\nExample: Yellow portal 25\n\nType /styles to view all available styles.`)
})

// INLINE QUERY -------------------------------------------------------------------------

bot.on('inlineQuery', msg => {
    let query = msg.query;
    // Create a new answer list object
  const answers =  bot.answerList(msg.id, {cacheTime: 60})

    WomboDreamApi.buildDefaultInstance()
	.generatePicture(query, 10, (task) => {
		console.log(task.state, 'stage', task.photo_url_list.length);

	})
	.then((task) => answers.addArticle({
        id: 'query',
        title: 'Image AI',
        description: `Image:`,
        message_text: task.result.final
    }))
    .then((task) => (bot.answerQuery(answers)))
	.catch(console.error);
// BUTTON CALLBACK ---------------------------------------------------------------------------------------
bot.on('callbackQuery', (msg) => {

    console.log('callbackQuery data:', msg.data);
    bot.answerCallbackQuery(msg.id);
});
//--------------------------------------------------------------------------------------------------------
    /* Article
    answers.addArticle({
        id: 'query',
        title: 'Image AI',
        description: `Image: ${ query }`,
        message_text: task?.result.final
    });
    answers.addPhoto({
        id: 'photo',
        caption: 'Telegram logo.',
        photo_url: 'https://telegram.org/img/t_logo.png',
        thumb_url: 'https://telegram.org/img/t_logo.png'
    });
    // Send answers
    return bot.answerQuery(answers); */

});


bot.connect();