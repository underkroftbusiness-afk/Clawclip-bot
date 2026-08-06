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
  TextInputStyle
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

// === CONFIGURE THESE ===
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const CAMPAIGN_INFO_CHANNEL_ID = "1515782662412046416";
const CAMPAIGN_RULES_CHANNEL_ID = "1520485646311882945";
const PARTNER_WITH_US_CHANNEL_ID = "1532762065758978190";
const APPLICATIONS_CHANNEL_ID = "1534207951995408515";
const TICKET_CATEGORY_ID = null;
// =======================

client.once('ready', async () => {
  console.log(`Bot is online as ${client.user.tag}`);

  try {
    const partnerChannel = await client.channels.fetch(PARTNER_WITH_US_CHANNEL_ID);
    const partnerMessages = await partnerChannel.messages.fetch({ limit: 20 });
    const partnerExisting = partnerMessages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

    if (!partnerExisting) {
      const partnerEmbed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('📋 Underclips — Submit a Request')
        .setDescription(
          "**📝 Service Submission**\n" +
          "Submit a service you can provide or a project you want to collaborate on.\n\n" +
          "**🛡️ Moderator Application**\n" +
          "Apply to be a moderator and help support the community.\n\n" +
          "———————————————\nClick a button below to begin."
        )
        .setFooter({ text: 'Underclips — Applications' });

      const partnerRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('apply_service')
          .setLabel('📝 Service Submission')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('apply_moderator')
          .setLabel('🛡️ Moderator')
          .setStyle(ButtonStyle.Danger)
      );

      await partnerChannel.send({ embeds: [partnerEmbed], components: [partnerRow] });
    }
  } catch (err) {
    console.error('Partner embed error:', err);
  }
});

// Welcome DM
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send("👋 Welcome to Underclips — The Clipping Server That Helps You!");
  } catch (err) {
    console.log('Could not send DM to new member:', err);
  }
});

// INTERACTIONS
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {

      // SERVICE SUBMISSION (UPDATED QUESTIONS)
      if (interaction.customId === 'apply_service') {
        const modal = new ModalBuilder()
          .setCustomId('service_modal')
          .setTitle('📝 Service Submission');

        const s1 = new TextInputBuilder()
          .setCustomId('service_contact')
          .setLabel('Contact (Telegram / Email / Discord)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const s2 = new TextInputBuilder()
          .setCustomId('service_offering')
          .setLabel('What service are you offering?')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const s3 = new TextInputBuilder()
          .setCustomId('service_pricing')
          .setLabel('Pricing / Payment terms (Upfront or After)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const s4 = new TextInputBuilder()
          .setCustomId('service_extra')
          .setLabel('Anything we should know?')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(s1),
          new ActionRowBuilder().addComponents(s2),
          new ActionRowBuilder().addComponents(s3),
          new ActionRowBuilder().addComponents(s4)
        );

        return interaction.showModal(modal);
      }

      // MODERATOR APPLICATION (UPDATED QUESTIONS)
      if (interaction.customId === 'apply_moderator') {
        const modal = new ModalBuilder()
          .setCustomId('moderator_modal')
          .setTitle('🛡️ Moderator Application'); // TITLE STAYS SAME

        const q1 = new TextInputBuilder()
          .setCustomId('mod_discord_age')
          .setLabel('Discord @ + Age')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const q2 = new TextInputBuilder()
          .setCustomId('mod_timezone')
          .setLabel('Timezone')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const q3 = new TextInputBuilder()
          .setCustomId('mod_activity')
          .setLabel('Activity (Weekly + Daily hours)')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const q4 = new TextInputBuilder()
          .setCustomId('mod_why')
          .setLabel('Why do you want to be moderator here?')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const q5 = new TextInputBuilder()
          .setCustomId('mod_experience')
          .setLabel('Experience')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const q6 = new TextInputBuilder()
          .setCustomId('mod_questions')
          .setLabel('Do you have any questions for us?')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(q1),
          new ActionRowBuilder().addComponents(q2),
          new ActionRowBuilder().addComponents(q3),
          new ActionRowBuilder().addComponents(q4),
          new ActionRowBuilder().addComponents(q5),
          new ActionRowBuilder().addComponents(q6)
        );

        return interaction.showModal(modal);
      }
      // Accept application (no role checks)
      if (interaction.customId && interaction.customId.startsWith('accept_app:')) {
        const applicantId = interaction.customId.split(':')[1];
        const staff = interaction.user;

        try {
          const origMsg = interaction.message;
          const acceptedEmbed = EmbedBuilder.from(origMsg.embeds[0])
            .setColor('#2ecc71')
            .setFooter({ text: `Accepted by ${staff.tag} • Applicant ID: ${applicantId}` });

          const disabledRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('accepted_disabled').setLabel('Accepted').setStyle(ButtonStyle.Success).setDisabled(true),
            new ButtonBuilder().setCustomId('deny_disabled').setLabel('Deny').setStyle(ButtonStyle.Secondary).setDisabled(true)
          );

          await origMsg.edit({ embeds: [acceptedEmbed], components: [disabledRow] });
        } catch (err) {
          console.error('Failed to update application message on accept:', err);
        }

        try {
          const user = await client.users.fetch(applicantId);
          await user.send(`✅ Your application has been accepted by ${staff.tag}. A private ticket has been opened for you.`);
        } catch (err) {
          console.warn('Could not DM applicant on accept:', err);
        }

        try {
          const guild = interaction.guild;
          const member = await guild.members.fetch(applicantId).catch(() => null);
          const channelName = `app-${applicantId}`.slice(0, 100);

          const permissionOverwrites = [
            { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels] }
          ];

          if (member) {
            permissionOverwrites.push({
              id: member.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
            });
          }

          const createOptions = {
            name: channelName,
            type: 0,
            topic: `Application ticket for ${applicantId}`,
            permissionOverwrites
          };

          if (TICKET_CATEGORY_ID) createOptions.parent = TICKET_CATEGORY_ID;

          const ticketChannel = await guild.channels.create(createOptions);

          const ticketEmbed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('🎫 Application Accepted')
            .setDescription(`This ticket was opened after your application was accepted by ${staff.tag}.`)
            .addFields(
              { name: 'Applicant', value: `<@${applicantId}>`, inline: true },
              { name: 'Handled by', value: `${staff.tag}`, inline: true }
            );

          await ticketChannel.send({ content: `<@${applicantId}>`, embeds: [ticketEmbed] });
        } catch (err) {
          console.error('Failed to create ticket on accept:', err);
        }

        return interaction.reply({ content: 'Application accepted and ticket opened.', ephemeral: true });
      }

      // Deny application
      if (interaction.customId && interaction.customId.startsWith('deny_app:')) {
        const applicantId = interaction.customId.split(':')[1];
        const staff = interaction.user;

        try {
          const origMsg = interaction.message;
          const deniedEmbed = EmbedBuilder.from(origMsg.embeds[0])
            .setColor('#e74c3c')
            .setFooter({ text: `Denied by ${staff.tag} • Applicant ID: ${applicantId}` });

          const disabledRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('accept_disabled').setLabel('Accept').setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder().setCustomId('denied_disabled').setLabel('Denied').setStyle(ButtonStyle.Danger).setDisabled(true)
          );

          await origMsg.edit({ embeds: [deniedEmbed], components: [disabledRow] });
        } catch (err) {
          console.error('Failed to update application message on deny:', err);
        }

        try {
          const user = await client.users.fetch(applicantId);
          await user.send(`❌ Your application has been denied by ${staff.tag}.`);
        } catch (err) {
          console.warn('Could not DM applicant on deny:', err);
        }

        return interaction.reply({ content: 'Application denied and applicant notified.', ephemeral: true });
      }

      // Close ticket
      if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel;
        const isOwner = channel.name.includes(interaction.user.username) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild);

        if (!isOwner) {
          return interaction.reply({ content: 'Only the ticket owner or staff can close this.', ephemeral: true });
        }

        await interaction.reply({ content: 'Ticket closed. Deleting in 3 seconds...', ephemeral: true });
        return setTimeout(() => channel.delete().catch(() => {}), 3000);
      }
    }

    // MODAL SUBMISSIONS
    if (interaction.isModalSubmit()) {

      // SERVICE SUBMISSION (UPDATED)
      if (interaction.customId === 'service_modal') {
        const contact = interaction.fields.getTextInputValue('service_contact');
        const offering = interaction.fields.getTextInputValue('service_offering');
        const pricing = interaction.fields.getTextInputValue('service_pricing');
        const extra = interaction.fields.getTextInputValue('service_extra') || 'None';
        const applicant = interaction.user;

        try {
          const appsChannel = await client.channels.fetch(APPLICATIONS_CHANNEL_ID);

          const appEmbed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('📝 New Service Submission')
            .addFields(
              { name: 'User', value: `<@${applicant.id}>`, inline: true },
              { name: 'Contact', value: contact, inline: true },
              { name: 'Service', value: offering, inline: false },
              { name: 'Pricing', value: pricing, inline: false },
              { name: 'Extra Info', value: extra, inline: false }
            )
            .setFooter({ text: `Applicant ID: ${applicant.id}` });

          const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`accept_app:${applicant.id}`).setLabel('Accept').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`deny_app:${applicant.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
          );

          await appsChannel.send({ embeds: [appEmbed], components: [actionRow] });
        } catch (err) {
          console.error('Failed to post service submission:', err);
          return interaction.reply({ content: 'Error submitting your service.', ephemeral: true });
        }

        return interaction.reply({ content: '✅ Service submission received.', ephemeral: true });
      }

      // MODERATOR SUBMISSION (UPDATED)
      if (interaction.customId === 'moderator_modal') {
        const discordAge = interaction.fields.getTextInputValue('mod_discord_age');
        const timezone = interaction.fields.getTextInputValue('mod_timezone');
        const activity = interaction.fields.getTextInputValue('mod_activity');
        const why = interaction.fields.getTextInputValue('mod_why');
        const experience = interaction.fields.getTextInputValue('mod_experience');
        const questions = interaction.fields.getTextInputValue('mod_questions') || 'None';
        const applicant = interaction.user;

        try {
          const appsChannel = await client.channels.fetch(APPLICATIONS_CHANNEL_ID);

          const appEmbed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('🛡️ New Moderator Application')
            .addFields(
              { name: 'User', value: `<@${applicant.id}>`, inline: true },
              { name: 'Discord @ + Age', value: discordAge, inline: true },
              { name: 'Timezone', value: timezone, inline: true },
              { name: 'Activity', value: activity, inline: false },
              { name: 'Why', value: why, inline: false },
              { name: 'Experience', value: experience, inline: false },
              { name: 'Questions', value: questions, inline: false }
            )
            .setFooter({ text: `Applicant ID: ${applicant.id}` });

          const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`accept_app:${applicant.id}`).setLabel('Accept').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`deny_app:${applicant.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
          );

          await appsChannel.send({ embeds: [appEmbed], components: [actionRow] });
        } catch (err) {
          console.error('Failed to post moderator application:', err);
          return interaction.reply({ content: 'Error submitting your application.', ephemeral: true });
        }

        return interaction.reply({ content: '✅ Moderator application received.', ephemeral: true });
      }
    }
  } catch (err) {
    console.error('Interaction handler error:', err);
    if (!interaction.replied && !interaction.deferred) {
      try { await interaction.reply({ content: 'An error occurred.', ephemeral: true }); } catch {}
    }
  }
});

// Ping command
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login(process.env.DISCORD_TOKEN);



