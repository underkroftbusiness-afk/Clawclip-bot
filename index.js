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

// CHANNEL IDs
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const WORK_WITH_US_CHANNEL_ID = "1532762065758978190";
const APPLICATION_CHANNEL_ID = "1534208165443404020";

// BOT READY
client.once('ready', async () => {
  console.log(`Bot online as ${client.user.tag}`);

  // 📜 RULES MESSAGE
  const rulesChannel = await client.channels.fetch(RULES_CHANNEL_ID);
  const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 });
  const rulesExisting = rulesMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

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

    await rulesChannel.send({ embeds: [rulesEmbed] });
  }

  // 📋 UNDERCLIPS — SUBMIT A REQUEST
  const workChannel = await client.channels.fetch(WORK_WITH_US_CHANNEL_ID);
  const workMessages = await workChannel.messages.fetch({ limit: 20 });
  const workExisting = workMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

  if (!workExisting) {
    const workEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📋 Underclips — Submit a Request')
      .setDescription(
        "📝 **Service Submission**\nSubmit a service you can provide us or a campaign you want to start.\n\n" +
        "🛡️ **Moderator**\nApply to be a moderator.\n\n" +
        "———————————————\nClick a button below to begin."
      )
      .setFooter({ text: 'Underclips — Applications' });

    const workRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('apply_service')
        .setLabel('📝 Service Submission')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('apply_moderator')
        .setLabel('🛡️ Moderator')
        .setStyle(ButtonStyle.Danger)
    );

    await workChannel.send({ embeds: [workEmbed], components: [workRow] });
  }
});
// 🎯 INTERACTION HANDLER
client.on('interactionCreate', async (interaction) => {

  if (interaction.isButton()) {

    // 📝 SERVICE SUBMISSION FORM
    if (interaction.customId === 'apply_service') {
      await interaction.showModal({
        custom_id: 'service_form',
        title: '📝 Service Submission',
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'contact',
                label: 'Contact (Telegram / Email / Discord)',
                style: 1,
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'service_details',
                label: 'What service are you offering?',
                style: 2,
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'questions',
                label: 'Any questions?',
                style: 2,
                required: false
              }
            ]
          }
        ]
      });
    }
    // 🛡️ MODERATOR APPLICATION FORM
    if (interaction.customId === 'apply_moderator') {
      await interaction.showModal({
        custom_id: 'moderator_form',
        title: '🛡️ Moderator Application',
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'basic_info',
                label: 'Basic Info (Discord @ / Age)',
                style: 1,
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'reason',
                label: 'Why do you want to be a moderator?',
                style: 2,
                required: true
              }
            ]
          },
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'questions',
                label: 'Any questions?',
                style: 2,
                required: false
              }
            ]
          }
        ]
      });
    }
    // 🟩 ACCEPT APPLICATION
    if (interaction.customId.startsWith('accept_application_')) {
      const userId = interaction.customId.replace('accept_application_', '');

      const ticketChannel = await interaction.guild.channels.create({
        name: `application-${userId}`,
        type: 0,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: userId,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          }
        ]
      });

      await ticketChannel.send({
        content:
          "Your submission has been accepted.\n" +
          "A ticket has been opened so we can discuss the details.\n" +
          "We will assist you shortly."
      });

      await interaction.reply({
        content: `Accepted — Ticket created: ${ticketChannel}`,
        ephemeral: false
      });
    }

    // 🟥 DENY APPLICATION
    if (interaction.customId.startsWith('deny_application_')) {
      await interaction.reply({
        content:
          `🟥 Denied by <@${interaction.user.id}>\n` +
          `Your submission was not approved.\n` +
          `If you need clarification, contact staff in support.`,
        ephemeral: false
      });
    }
    // 🔒 STAFF CLOSE APPLICATION TICKET
    if (interaction.customId.startsWith('staff_close_')) {
      const channelId = interaction.customId.replace('staff_close_', '');
      const channel = interaction.guild.channels.cache.get(channelId);

      if (!channel) {
        return interaction.reply({
          content: "Channel not found.",
          ephemeral: true
        });
      }

      await interaction.reply({
        content: "Ticket closed. Deleting in 3 seconds...",
        ephemeral: true
      });

      setTimeout(() => channel.delete().catch(() => {}), 3000);
    }
  }
});

// 🔑 BOT LOGIN
client.login(process.env.TOKEN);







