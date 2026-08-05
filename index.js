// part1.js
const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// ---------------- CONFIG (replace with your real IDs) ----------------
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const CAMPAIGN_INFO_CHANNEL_ID = "1515782662412046416";
const CAMPAIGN_RULES_CHANNEL_ID = "1520485646311882945";
const HOW_TO_CLIP_CHANNEL_ID = "1534171904137625631";

const WORK_WITH_US_CHANNEL_ID = "1532762065758978190";
const APPLICATION_CHANNEL_ID = "1534208165443404020";
// ---------------------------------------------------------------------

client.once('ready', async () => {
  console.log(`🔑 Bot is online as ${client.user.tag}`);

  // Helper to safely fetch a channel and ensure it's text-capable
  async function fetchTextChannel(id) {
    try {
      const ch = await client.channels.fetch(id);
      if (!ch || !ch.isTextBased()) return null;
      return ch;
    } catch {
      return null;
    }
  }

  // Support embed (sends once)
  try {
    const supportChannel = await fetchTextChannel(SUPPORT_CHANNEL_ID);
    if (supportChannel) {
      const supportMessages = await supportChannel.messages.fetch({ limit: 20 }).catch(() => []);
      const supportExisting = supportMessages.find && supportMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

      if (!supportExisting) {
        const embed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('❓ Need help?')
          .setDescription('Click the button below to open a support ticket.')
          .setFooter({ text: 'Underclips Support System' });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('create_ticket').setLabel('🎟️ Open Support Ticket').setStyle(ButtonStyle.Primary)
        );

        await supportChannel.send({ embeds: [embed], components: [row] }).catch(console.error);
      }
    } else {
      console.warn('Support channel not found or not text-based.');
    }
  } catch (err) {
    console.error('Error sending support message:', err);
  }

  // Rules embed (sends once)
  try {
    const rulesChannel = await fetchTextChannel(RULES_CHANNEL_ID);
    if (rulesChannel) {
      const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 }).catch(() => []);
      const rulesExisting = rulesMessages.find && rulesMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

      if (!rulesExisting) {
        const rulesEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('📜 Rules')
          .setDescription(
            "**1. Respect Everyone** Be kind and mature.\n" +
            "**2. No Spam** Don’t flood chats.\n" +
            "**3. Stay On Topic** Use channels correctly.\n" +
            "**4. No NSFW** No sexual or disturbing content.\n" +
            "**5. No Self‑Promo** Unless staff approves.\n" +
            "**6. Follow Staff** Their decisions are final.\n" +
            "**7. Keep It Safe** No threats or harassment.\n" +
            "**8. No Illegal Content** No hacks or scams.\n" +
            "**9. No Doxing** Never share personal info.\n" +
            "**10. Discord Guidelines** Follow ToS."
          )
          .setFooter({ text: 'Underclips Server Rules' });

        await rulesChannel.send({ embeds: [rulesEmbed] }).catch(console.error);
      }
    } else {
      console.warn('Rules channel not found or not text-based.');
    }
  } catch (err) {
    console.error('Error sending rules message:', err);
  }

  // Campaign info (sends once)
  try {
    const campaignInfoChannel = await fetchTextChannel(CAMPAIGN_INFO_CHANNEL_ID);
    if (campaignInfoChannel) {
      const campaignMessages = await campaignInfoChannel.messages.fetch({ limit: 20 }).catch(() => []);
      const campaignExisting = campaignMessages.find && campaignMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

      if (!campaignExisting) {
        const payoutEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('💰 Payout Information')
          .setDescription(
            "**Payrate System** Earn a fixed amount per views.\n\n" +
            "**Pot System** Earn based on your share of total views.\n\n" +
            "**Minimum Views** 1,000 views required.\n\n" +
            "**Payout Timeline** Paid after campaign ends.\n\n" +
            "**Payment Method** Depends on sponsor.\n\n" +
            "**Payment Details** Sent to your saved payout info."
          )
          .setFooter({ text: 'Underclips Campaign Info' });

        await campaignInfoChannel.send({ embeds: [payoutEmbed] }).catch(console.error);
      }
    } else {
      console.warn('Campaign info channel not found or not text-based.');
    }
  } catch (err) {
    console.error('Error sending campaign info:', err);
  }

  // Campaign rules (sends once)
  try {
    const campaignRulesChannel = await fetchTextChannel(CAMPAIGN_RULES_CHANNEL_ID);
    if (campaignRulesChannel) {
      const campaignRulesMessages = await campaignRulesChannel.messages.fetch({ limit: 20 }).catch(() => []);
      const campaignRulesExisting = campaignRulesMessages.find && campaignRulesMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

      if (!campaignRulesExisting) {
        const campaignRulesEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('📋 Campaign Rules')
          .setDescription(
            "**Real Engagement Only** No bots.\n\n" +
            "**Audience Must Match** English campaigns need 50%+ English audience.\n\n" +
            "**Follow Requirements** Breaking rules = rejected.\n\n" +
            "**Do Not Hide Metrics** Keep stats visible.\n\n" +
            "**No Low‑Effort Posts** Must be real content.\n\n" +
            "**No Duplicate Posts** No double uploads.\n\n" +
            "**Posts Stay Public** Until payout.\n\n" +
            "**Staff Decisions Final** Breaking rules = action."
          )
          .setFooter({ text: 'Underclips Campaign Rules' });

        await campaignRulesChannel.send({ embeds: [campaignRulesEmbed] }).catch(console.error);
      }
    } else {
      console.warn('Campaign rules channel not found or not text-based.');
    }
  } catch (err) {
    console.error('Error sending campaign rules:', err);
  }

  // Clipping tips (sends once)
  try {
    const clipChannel = await fetchTextChannel(HOW_TO_CLIP_CHANNEL_ID);
    if (clipChannel) {
      const clipMessages = await clipChannel.messages.fetch({ limit: 20 }).catch(() => []);
      const clipExisting = clipMessages.find && clipMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

      if (!clipExisting) {
        const clipEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('📘 Clipping-tips')
          .setDescription(
            "**The Hook**\nYour first 3 seconds decide if viewers stay. Strong openings increase watch time and push your video further. Create quick curiosity or emotion.\n\n" +
            "**Clip Selection & Length**\nChoose moments that feel viral or instantly grab attention. Short clips perform best. IG: ~40s • TikTok: ~30s • Shorts: 15–20s.\n\n" +
            "**Editing**\nYou can use CapCut or OpusClip to edit your clips. Add clear, bold captions to keep viewers focused, and choose trending audio to help the algorithm push your content further.\n\n" +
            "**Posting Strategy**\nPost consistently throughout the day. Use hashtags that match your niche."
          )
          .setFooter({ text: 'Underclips Clipping Guide' });

        await clipChannel.send({ embeds: [clipEmbed] }).catch(console.error);
      }
    } else {
      console.warn('Clipping tips channel not found or not text-based.');
    }
  } catch (err) {
    console.error('Error sending clipping tips:', err);
  }

  // Work with us / applications (sends once)
  try {
    const workChannel = await fetchTextChannel(WORK_WITH_US_CHANNEL_ID);
    if (workChannel) {
      const workMessages = await workChannel.messages.fetch({ limit: 20 }).catch(() => []);
      const workExisting = workMessages.find && workMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

      if (!workExisting) {
        const workEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('📋 Submit a Request')
          .setDescription(
            "📝 **Service Submission**\n" +
            "Interested in offering your services or creating your own campaign? Submit your details and we will review your request.\n\n" +
            "🛡️ **Moderator**\n" +
            "Apply to be a moderator and support the community. Submit your details to begin.\n\n" +
            "———————————————\nClick a button below to begin."
          )
          .setFooter({ text: 'Underclips — Applications' });

        const workRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('apply_service').setLabel('📝 Service Submission').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('apply_moderator').setLabel('🛡️ Moderator').setStyle(ButtonStyle.Danger)
        );

        await workChannel.send({ embeds: [workEmbed], components: [workRow] }).catch(console.error);
      }
    } else {
      console.warn('Work with us channel not found or not text-based.');
    }
  } catch (err) {
    console.error('Error sending work with us embed:', err);
  }
});
// Accept application -> create ticket for applicant (no emoji in reply)
if (interaction.customId.startsWith('accept_application_')) {
  const userId = interaction.customId.replace('accept_application_', '');
  try {
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: 'Guild not found.', ephemeral: true }).catch(() => {});

    const ticketChannel = await guild.channels.create({
      name: `application-${userId}`.slice(0, 90),
      type: ChannelType.GuildText,
      topic: `Application accepted for ${userId}`,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id || guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
        },
        {
          id: userId,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
        },
        {
          id: client.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.EmbedLinks]
        }
      ]
    });

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`staff_close_${ticketChannel.id}`).setLabel('🔒 Close Ticket').setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({
      content:
        `**Your submission has been accepted.**\n` +
        `We’ve opened this ticket so we can discuss the details with you and complete the process. We will assist you shortly.`,
      components: [closeRow]
    }).catch(console.error);

    // Reply to staff without emoji
    await interaction.reply({ content: `**Accepted** — Ticket created: <#${ticketChannel.id}>`, ephemeral: false }).catch(console.error);
  } catch (err) {
    console.error('Accept application error:', err);
    await interaction.reply({ content: 'Failed to create application ticket.', ephemeral: true }).catch(() => {});
  }
  return;
}
// part3.js
// Message handlers and final login

// Simple ping command
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('🏓 Pong!').catch(console.error);
  }
});

// Optional: add other runtime listeners here (reaction handlers, commands, etc.)

// Login (uses your existing environment variable)
client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('Login successful'))
  .catch(err => {
    console.error('Failed to login. Check DISCORD_TOKEN and bot intents. Error:', err);
  });
// part4.js (config.js)
// Put this file next to your main files and require it where needed.
// Replace the placeholder IDs with your real channel IDs.

module.exports = {
  SUPPORT_CHANNEL_ID: "1516092800469303437",
  RULES_CHANNEL_ID: "1516812179410780261",
  CAMPAIGN_INFO_CHANNEL_ID: "1515782662412046416",
  CAMPAIGN_RULES_CHANNEL_ID: "1520485646311882945",
  HOW_TO_CLIP_CHANNEL_ID: "1534171904137625631",
  WORK_WITH_US_CHANNEL_ID: "1532762065758978190",
  APPLICATION_CHANNEL_ID: "1534208165443404020"
};
// part5-helpers.js
const { ChannelType } = require('discord.js');

module.exports = {
  safeFetchTextChannel: async (client, id) => {
    try {
      const ch = await client.channels.fetch(id);
      if (!ch || !ch.isTextBased()) return null;
      return ch;
    } catch {
      return null;
    }
  },

  createTicketChannel: async (guild, name, overwrites = []) => {
    // name trimmed to 90 chars to avoid API errors
    return guild.channels.create({
      name: name.slice(0, 90),
      type: ChannelType.GuildText,
      permissionOverwrites: overwrites
    });
  }
};
// part6-commands.js
// Minimal command registration example (in-memory)
const commands = new Map();

commands.set('ping', {
  name: 'ping',
  description: 'Ping the bot',
  execute: async (message) => {
    await message.reply('🏓 Pong!');
  }
});

module.exports = {
  commands,
  handleMessageCreate: async (message) => {
    if (message.author.bot) return;
    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;
    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = commands.get(cmd);
    if (command) {
      try {
        await command.execute(message, args);
      } catch (err) {
        console.error('Command error:', err);
      }
    }
  }
};
// part6-start.js
// Example main entry that requires parts and starts the client
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./part5-config');
const { handleMessageCreate } = require('./part6-commands');

// If you already have client in part1, skip creating a new one and export/import instead
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

// require your part1 and part2 files here if they export functions that accept client
// e.g., require('./part1')(client); require('./part2')(client);

client.on('messageCreate', handleMessageCreate);

client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('Login successful'))
  .catch(err => console.error('Login failed', err));



  
