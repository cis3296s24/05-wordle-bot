const { Client, GatewayIntentBits } = require('discord.js');
const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
const client = new Client({ intents: [Guilds, GuildMessages, MessageContent] });
client.login(process.env.DISCORD_BOT_TOKEN);

client.once('ready', () => console.log(client.user.tag+' 준비 완료!'));

client.on('messageCreate', (msg) => {
if (msg.author.bot) return
    const cmd = msg.content

    if (cmd == 'ㅎㅇ')
    msg.reply('안녕하세요!')

    if (cmd == '오늘 어때?')
    msg.channel.send('저는 좋아요!')

    if (cmd == '이 메세지 삭제해줘') {
    msg.delete()
    msg.reply('삭제했어요!')
    }
});