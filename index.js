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
        "**1. Respect Everyone** Treat people normally. No toxicity, hate, bullying, or trying to start drama.\n" +
        "**2. No Spam** Don’t flood chats with messages, caps, pings, or repeated content. Keep conversations readable.\n" +
        "**3. Stay On Topic** Use each channel for what it’s meant for. It keeps the server clean and easy to navigate.\n" +
        "**4. No NSFW** No sexual content, gore, shock content, or anything unsafe for younger users.\n" +
        "**5. No Self‑Promo** Don’t advertise your socials, Discord servers, or services unless staff approves it.\n" +
        "**6. Follow Staff** Admins and moderators make final decisions. Listen to instructions and cooperate.\n" +
        "**7. Keep It Safe** No threats, harassment, or sharing private info. Keep the community safe for everyone.\n" +
        "**8. No Illegal Content** No hacks, cheats, scams, leaked files, or anything that breaks laws or Discord rules.\n" +
        "**9. No Doxing** Never share someone’s private info — names, addresses, numbers, school, workplace, IPs, anything.\n" +
        "**10. Discord Guidelines** This server follows Discord’s Terms of Service and Community Guidelines."
      )
      .setFooter({ text: 'Underclips Server Rules' });

    await rulesChannel.send({ embeds: [rulesEmbed] });
  }

  // 📢 CAMPAIGN INFO MESSAGE
  const campaignInfoChannel = await client.channels.fetch(CAMPAIGN_INFO_CHANNEL_ID);
  const campaignMessages = await campaignInfoChannel.messages.fetch({ limit: 20 });
  const campaignExisting = campaignMessages.find(
    m => m.author.id === client.user.id && m.embeds.length > 0
  );

  if (!campaignExisting) {
    const campaignEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('💰 Payout Calculation')
      .setDescription(
        "**Campaigns use two systems to calculate payment.**\n\n" +

        "**Payrate Based System**\n" +
        "Pays a fixed amount for your views. Example: if the rate is $1 per 1,000 views, you earn $1 every time you reach 1,000 views.\n\n" +

        "**The Pot Style System**\n" +
        "Pays you based on your share of all views in the campaign. If you produce 20% of the total views, you receive 20% of the total budget. We take 30% of your earnings (30% of your 20% share).\n\n" +

        "**Minimum Views (Individual Posts)**\n" +
        "A post must reach at least 1,000 views before those views count toward your total.\n\n" +

        "**Payout Timelines**\n" +
        "Payments are not sent immediately. The campaign must end first, then posts are reviewed, and the sponsor must approve the results.\n\n" +

        "**Payment Method**\n" +
        "You are paid only through the method chosen by the campaign (e.g., PayPal).\n\n" +

        "**Payment Details**\n" +
        "Your payout is sent to the payment information saved at the end of the campaign. If the payment is delivered but you cannot withdraw it, you must fix that issue yourself."
      )
      .setFooter({ text: 'Underclips Campaign Info' });

    await campaignInfoChannel.send({ embeds: [campaignEmbed] });
  }
});

// 💬 Auto‑DM when someone joins
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(
      `👋 Welcome to Underclips —









