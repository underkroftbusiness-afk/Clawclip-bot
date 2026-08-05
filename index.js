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
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
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

// CHANNEL IDs (replace with your real IDs)
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const WORK_WITH_US_CHANNEL_ID = "1532762065758978190";
const APPLICATION_CHANNEL_ID = "1534208165443404020";

client.once('ready', async () => {
  console.log(`Bot online as ${client.user.tag}`);

  // RULES EMBED (sends once)
  try {
    const rulesChannel = await client.channels.fetch(RULES_CHANNEL_ID);
    if (!rulesChannel || !rulesChannel.isTextBased()) {
      console.warn('Rules channel not found or not text-based.');
    } else {
      const rulesMessages = await rulesChannel.messages.fetch({ limit: 20 });
      const rulesExisting = rulesMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

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
    }
  } catch (err) {
    console.error('Failed to send rules embed:', err);
  }

  // WORK WITH US EMBED (sends once)
  try {
    const workChannel = await client.channels.fetch(WORK_WITH_US_CHANNEL_ID);
    if (!workChannel || !workChannel.isTextBased()) {
      console.warn('Work channel not found or not text-based.');
    } else {
      const workMessages = await workChannel.messages.fetch({ limit: 20 });
      const workExisting = workMessages.find(m => m.author?.id === client.user.id && m.embeds.length > 0);

      if (!workExisting) {
        const workEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('📋 Underclips — Submit a Request')
          .setDescription(
            "📝 **Service Submission**\nSubmit a service you can provide us or a campaign you want to start.\n\n" +
            "🛡️ **Moderator**\nApply to be a moderator and help support the community.\n\n" +
            "———————————————\nClick a button below to begin."
          )
          .setFooter({ text: 'Underclips — Applications' });

        const workRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('apply_service').setLabel('📝 Service Submission').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('apply_moderator').setLabel('🛡️ Moderator').setStyle(ButtonStyle.Danger)
        );

        await workChannel.send({ embeds: [workEmbed], components: [workRow] });
      }
    }
  } catch (err) {
    console.error('Failed to send work embed:', err);
  }
});
// part2.js
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      // SERVICE modal (show immediately) - max 5 inputs per modal
      if (interaction.customId === 'apply_service') {
        const modal = new ModalBuilder()
          .setCustomId('service_form')
          .setTitle('📝 Service Submission');

        const contactInput = new TextInputBuilder()
          .setCustomId('contact')
          .setLabel('Contact')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const serviceInput = new TextInputBuilder()
          .setCustomId('service_details')
          .setLabel('Service')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const pricingInput = new TextInputBuilder()
          .setCustomId('pricing')
          .setLabel('Pricing (Upfront / After / Fixed Amount)')
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        const portfolioInput = new TextInputBuilder()
          .setCustomId('portfolio')
          .setLabel('Portfolio')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        const extraInput = new TextInputBuilder()
          .setCustomId('extra_info')
          .setLabel('Extra Info')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(contactInput),
          new ActionRowBuilder().addComponents(serviceInput),
          new ActionRowBuilder().addComponents(pricingInput),
          new ActionRowBuilder().addComponents(portfolioInput),
          new ActionRowBuilder().addComponents(extraInput)
        );

        await interaction.showModal(modal);
        return;
      }

      // MODERATOR modal (show immediately) - max 5 inputs per modal
      if (interaction.customId === 'apply_moderator') {
        const modal = new ModalBuilder()
          .setCustomId('moderator_form')
          .setTitle('🛡️ Moderator Application');

        const basicInput = new TextInputBuilder()
          .setCustomId('basic_info')
          .setLabel('Basic Info')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const timezoneInput = new TextInputBuilder()
          .setCustomId('timezone')
          .setLabel('Timezone')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const activityInput = new TextInputBuilder()
          .setCustomId('activity')
          .setLabel('Activity (hours per day/week)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const reasonInput = new TextInputBuilder()
          .setCustomId('reason')
          .setLabel('Why do you want to be a moderator?')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const experienceInput = new TextInputBuilder()
          .setCustomId('experience')
          .setLabel('Experience (optional)')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(basicInput),
          new ActionRowBuilder().addComponents(timezoneInput),
          new ActionRowBuilder().addComponents(activityInput),
          new ActionRowBuilder().addComponents(reasonInput),
          new ActionRowBuilder().addComponents(experienceInput)
        );

        await interaction.showModal(modal);
        return;
      }

      // ACCEPT application button
      if (interaction.customId.startsWith('accept_application_')) {
        const userId = interaction.customId.replace('accept_application_', '');
        const guild = interaction.guild;
        if (!guild) {
          await interaction.reply({ content: 'Guild not found.', ephemeral: true });
          return;
        }

        const ticketChannel = await guild.channels.create({
          name: `application-${userId}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id || guild.id,
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

        await interaction.reply({ content: `Accepted — Ticket created: <#${ticketChannel.id}>`, ephemeral: false });
        return;
      }

      // DENY application button
      if (interaction.customId.startsWith('deny_application_')) {
        await interaction.reply({
          content:
            `🟥 Denied by <@${interaction.user.id}>\n` +
            `Your submission was not approved.\n` +
            `If you need clarification, contact staff in support.`,
          ephemeral: false
        });
        return;
      }

      // STAFF CLOSE ticket button (if used)
      if (interaction.customId.startsWith('staff_close_')) {
        const channelId = interaction.customId.replace('staff_close_', '');
        const channel = interaction.guild?.channels.cache.get(channelId);
        if (!channel) {
          await interaction.reply({ content: "Channel not found.", ephemeral: true });
          return;
        }
        await interaction.reply({ content: "Ticket closed. Deleting in 3 seconds...", ephemeral: true });
        setTimeout(() => channel.delete().catch(() => {}), 3000);
        return;
      }
    } // end isButton

    // MODAL SUBMISSIONS
    if (interaction.isModalSubmit()) {
      // SERVICE SUBMISSION
      if (interaction.customId === 'service_form') {
        const contact = interaction.fields.getTextInputValue('contact');
        const service = interaction.fields.getTextInputValue('service_details');
        const pricing = interaction.fields.getTextInputValue('pricing') || "None";
        const portfolio = interaction.fields.getTextInputValue('portfolio') || "None";
        const extra = interaction.fields.getTextInputValue('extra_info') || "None";

        const appChannel = await interaction.guild?.channels.fetch(APPLICATION_CHANNEL_ID);
        if (!appChannel || !appChannel.isTextBased()) {
          await interaction.reply({ content: 'Application channel not found. Contact staff.', ephemeral: true });
          return;
        }

        const embed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('📝 New Service Submission')
          .setDescription(
            `**User:** <@${interaction.user.id}>\n\n` +
            `**Contact:** ${contact}\n\n` +
            `**Service:** ${service}\n\n` +
            `**Pricing:** ${pricing}\n\n` +
            `**Portfolio:** ${portfolio}\n\n` +
            `**Extra Info:** ${extra}`
          )
          .setFooter({ text: 'Underclips — Service Submission' });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`accept_application_${interaction.user.id}`).setLabel('Accept').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`deny_application_${interaction.user.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
        );

        await appChannel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: "✅ Your submission has been sent.", ephemeral: true });
        return;
      }

      // MODERATOR SUBMISSION
      if (interaction.customId === 'moderator_form') {
        const basic = interaction.fields.getTextInputValue('basic_info');
        const timezone = interaction.fields.getTextInputValue('timezone');
        const activity = interaction.fields.getTextInputValue('activity');
        const reason = interaction.fields.getTextInputValue('reason');
        const experience = interaction.fields.getTextInputValue('experience') || "None";

        const appChannel = await interaction.guild?.channels.fetch(APPLICATION_CHANNEL_ID);
        if (!appChannel || !appChannel.isTextBased()) {
          await interaction.reply({ content: 'Application channel not found. Contact staff.', ephemeral: true });
          return;
        }

        const embed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('🛡️ New Moderator Application')
          .setDescription(
            `**User:** <@${interaction.user.id}>\n\n` +
            `**Basic Info:** ${basic}\n\n` +
            `**Timezone:** ${timezone}\n\n` +
            `**Activity:** ${activity}\n\n` +
            `**Reason:** ${reason}\n\n` +
            `**Experience:** ${experience}`
          )
          .setFooter({ text: 'Underclips — Moderator Application' });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`accept_application_${interaction.user.id}`).setLabel('Accept').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`deny_application_${interaction.user.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
        );

        await appChannel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: "✅ Your application has been submitted.", ephemeral: true });
        return;
      }
    } // end isModalSubmit
  } catch (err) {
    console.error('Interaction handler error:', err);
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'An error occurred while processing your interaction.', ephemeral: true });
      }
    } catch (replyErr) {
      console.error('Failed to send error reply:', replyErr);
    }
  }
});
// part3.js
// Start the bot
if (!process.env.TOKEN) {
  console.error('Missing TOKEN in environment variables.');
  process.exit(1);
}

client.login(process.env.TOKEN).catch(err => {
  console.error('Failed to login:', err);
});


