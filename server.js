let lastMessage;
let voiceChannel;
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

const { Client, Intents } = require('discord.js');
const axios = require("axios");

const client = new Client({
  intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

client.once('ready', () => {
  console.log('Yeeeea, wooo!');
});

client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', async (msg) => {  
  //SPIDER BOT
  if(msg.content.includes('spider')){
    let delay = Date.now() - msg.createdTimestamp;
    msg.reply(`BOT!! 🤖 The delay is ${delay} ms.`);
  }
  
  //TRAIN
  if (msg.content == lastMessage) {
    msg.channel.send(msg.content);
    lastMessage = '';
  } else {
    lastMessage = msg.content;
  }
  //REACTIONS
  if(msg.content.includes('lol')){
    msg.react('🤣');
  }
  if(msg.content.includes('pizza' || 'Pizza')){
    msg.react('🍍');
  }
  //EXTERNAL API
  
  if (msg.content.startsWith('!name')) {
    let name = msg.content.split(' ').at(-1);
    
    // let age = await axios.get('https://api.agify.io?name=' + name);
    // let gender = await axios.get('https://api.genderize.io?name=' + name);
    // let nationalize = await axios.get('https://api.nationalize.io?name=' + name);

    let [age, gender, nationality] = await axios.all([
      axios.get(`https://api.agify.io/?name=${name}`),
      axios.get(`https://api.genderize.io/?name=${name}`),
      axios.get(`https://api.nationalize.io/?name=${name}`),
    ]);
    
    console.log(age, gender, nationality);
    
    msg.reply(`${ name } is probably a ${ age.data.age } year old ${ gender.data.gender } from ${ nationality.data.country[0].country_id }.`);
  }
  //EXTERNAL WEB
  //VOICE
  if (msg.content == "spiderMe") {
    let channel = msg.member.voice.channel; // voice channel the user is in
    voiceChannel = await joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });
    
    const SONGS = [
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/fichtl.webm?v=1647616516712",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/love.webm?v=1647616516952",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/smash.webm?v=1647616517114",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/scat.webm?v=1647616517241",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/circus.webm?v=1647616517544",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/hassel.webm?v=1647616517587",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/scooter.webm?v=1647616517645",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/behappy.webm?v=1647616517774",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/trololo.webm?v=1647616521993",
      "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/sand.webm?v=1647616517135",
    ];
    
    let url = SONGS[Math.floor(Math.random() * SONGS.length)];
    
    // let url = "https://cdn.glitch.global/d7dd8884-35c5-434c-bb88-e28e7abbfbf9/fichtl.webm?v=1647616516712";
    
    // let song = createAudioResource(url);
    let song = createAudioResource(url, {
      inlineVolume: true
    });
    song.volume.volume = 0.2;
    
    let player = createAudioPlayer();
    voiceChannel.subscribe(player);
    player.play(song);
    
    // stop after 30sec
    setTimeout(() => player.stop(), 30000);
  }
  
  if (msg.content == "spiderMe no more") {
    voiceChannel.destroy();
  }
  
  
});


const { generateDependencyReport } = require('@discordjs/voice');
console.log(generateDependencyReport());

