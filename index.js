const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField
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

// 🧩 CHANGE THESE
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const CAMPAIGN_INFO_CHANNEL_ID = "1515782662412046416";
const CAMPAIGN_RULES_CHANNEL_ID = "1520485646311882945";

// ✅ Bot online
client.once('ready', async () => {
  console.log(`Bot is online as ${client.user.tag}`);

  // 🎟️ Support message
  const supportChannel = await client.channels.fetch(SUPPORT_CHANNEL_ID);
  const supportMessages = await supportChannel.messages.fetch({ limit: 20 });
  const supportExisting = supportMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!supportExisting) {
    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('Need help?')
      .setDescription('Click the button below to open a support ticket.')
      .setFooter({ text: 'Underclips Support System' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎟️ Open Support Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await supportChannel.send({ embeds: [embed], components: [row] });
  }

  // 📜 RULES MESSAGE
  const rulesChannel = await client.channels.fetch(RULES_CHANNEL_ID);
  const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 });
  const rulesExisting = rulesMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!rulesExisting) {
    const rulesEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📜 Rules')
      .setDescription(
        "**1. Respect Everyone** Be kind and mature. No hate, drama, or toxic behavior.\n" +
        "**2. No Spam** Don’t flood chats with messages, caps, or pings.\n" +
        "**3. Stay On Topic** Use channels for their purpose.\n" +
        "**4. No NSFW** No sexual, violent, or disturbing content.\n" +
        "**5. No Self‑Promo** Don’t advertise socials or servers unless staff approves.\n" +
        "**6. Follow Staff** Admins and mods make final decisions. Respect their instructions.\n" +
        "**7. Keep It Safe** No threats, harassment, or sharing private info.\n" +
        "**8. No Illegal Content** No hacks, cheats, scams, or leaked files.\n" +
        "**9. No Doxing** Never share personal information.\n" +
        "**10. Discord Guidelines** Follow Discord’s Terms of Service and Community Guidelines."
      )
      .setFooter({ text: 'Underclips Server Rules' });

    await rulesChannel.send({ embeds: [rulesEmbed] });
  }

  // 💰 PAYOUT INFO EMBED
  const campaignInfoChannel = await client.channels.fetch(CAMPAIGN_INFO_CHANNEL_ID);
  const campaignMessages = await campaignInfoChannel.messages.fetch({ limit: 20 });
  const campaignExisting = campaignMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!campaignExisting) {
    const payoutEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('💰 Payout Calculation')
      .setDescription(
        "**Campaigns use two systems to calculate paymement.**\n\n" +

        "**Payrate Based System**\n" +
        "pays a fixed amount for your views. You earn the same amount every time you reach the required number of views. Example: if the rate is one dollar per one thousand views, you receive one dollar for every one thousand views you generate.\n\n" +

        "**The Pot Style System**\n" +
        "pays you based on your share of all views in the campaign. If you produce 20% percent of the total views, you receive 20% percent of the total budget. We take 30% of your earnings, so I get 30% of your 20% share.\n\n" +

        "**Minimum Views: Individual Posts**\n" +
        "A post must reach at least one 1000 views before those views count toward your total.\n\n" +

        "**Payout Timelines







