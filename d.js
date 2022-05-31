const { Client, Message, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { RandomPHUB } = require('discord-phub');
/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports.run = (client, message, args) => {
    const nsfw = new RandomPHUB(unique = false);
  //const rnd = nsfw.getRandom("gif");
  //const search = nsfw.getRandomInCategory(args.join(' '), "gif");

  //console.log(Math.ceil(nsfw.categories.length / 2))
  if(!args || args.length < 1) {

  const full = nsfw.categories.length
  //const half = Math.ceil(nsfw.categories.length / 6)
  //const left = nsfw.categories.splice(0, half)
  //console.log(left)

  const embed1 = new MessageEmbed()
  .setColor(0x00AE86)
  .setTitle(`Avialable categories: \`\`\`${full}\`\`\``)
  .setDescription(`**List**: \n \`\`\`${nsfw.categories.join(' ')}\`\`\` \n **Types:** \`\`\`${nsfw.type.join(' ')}\`\`\` `)
  //.setImage(search.url) 
  message.channel.send({embeds : [embed1]})
}
else {
  try {
const search = nsfw.getRandomInCategory(args.join(' '));
if (search.type == 'mp4') {message.channel.send(`This is a video, so im sending as message. ${search.url}`)}
else {
//console.log(search.url)
const embed = new MessageEmbed()
  .setColor(0x00AE86)
  .setDescription(`\`\`\`diff\n- Category: ${search.category}\n- Type: ${search.type} \`\`\``)
  .setImage(search.url)
  .setTimestamp(new Date)
  message.channel.send({embeds : [embed]})}
  } catch (err) {
    message.reply(`Something went wrong during your \`${message.content}\` command! Try running \`-porn\` to see categories.`)
    console.log(err)
  }
}

}
module.exports.conf = {
    "name": "porn",
    "description": [{
        "lang": "tr",
        "description": "Bot pingini ölçer."
    }, {
        "lang": "en",
        "description": "Display bot's ping."
    }],
    "aliases": ["pingolc", "pingölç"],
    "usage": [{
        "lang": "tr",
        "usage": "ping"
    }, {
        "lang": "en",
        "usage": "ping"
    }]
}