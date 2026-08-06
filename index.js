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

// === CONFIGURE THESE ===
const SUPPORT_CHANNEL_ID = "1516092800469303437";
const RULES_CHANNEL_ID = "1516812179410780261";
const CAMPAIGN_INFO_CHANNEL_ID = "1515782662412046416";
const CAMPAIGN_RULES_CHANNEL_ID = "1520485646311882945";
const PARTNER_WITH_US_CHANNEL_ID = "1532762065758978190";
const APPLICATIONS_CHANNEL_ID = "1534207951995408515";
const TICKET_CATEGORY_ID = null; // optional: set a category ID for tickets or leave null
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

  // Optional: other ready-time embeds (support, rules, campaign) can be added here if needed
});
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

client.on('guildMemberAdd', async (member) => {
  try {
    await member.send("👋 Welcome to Underclips — The Clipping Server That Helps You!");
  } catch (err) {
    console.log('Could not send DM to new member:', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    // BUTTONS: open modals or handle accept/deny/close
    if (interaction.isButton()) {
      // Open Service Submission modal
      if (interaction.customId === 'apply_service') {
        const modal = new ModalBuilder()
          .setCustomId('service_modal')
          .setTitle('📝 Service Submission');

        const serviceTitle = new TextInputBuilder()
          .setCustomId('service_title')
          .setLabel('Service Title')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Short title for your service')
          .setRequired(true);

        const serviceDescription = new TextInputBuilder()
          .setCustomId('service_description')
          .setLabel('Describe your service or project')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Explain what you offer, pricing, examples, links...')
          .setRequired(true);

        const serviceExperience = new TextInputBuilder()
          .setCustomId('service_experience')
          .setLabel('Relevant experience / portfolio links')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Years of experience, links to work, socials')
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(serviceTitle),
          new ActionRowBuilder().addComponents(serviceDescription),
          new ActionRowBuilder().addComponents(serviceExperience)
        );

        return interaction.showModal(modal);
      }

      // Open Moderator Application modal
      if (interaction.customId === 'apply_moderator') {
        const modal = new ModalBuilder()
          .setCustomId('moderator_modal')
          .setTitle('Do you have any questions for us?');

        const modExperience = new TextInputBuilder()
          .setCustomId('moderator_experience')
          .setLabel('Moderation experience')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Describe previous mod experience, tools used, hours available')
          .setRequired(true);

        const modWhy = new TextInputBuilder()
          .setCustomId('moderator_why')
          .setLabel('Why do you want to moderate?')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Motivation, availability, strengths')
          .setRequired(true);

        const modTimezone = new TextInputBuilder()
          .setCustomId('moderator_timezone')
          .setLabel('Timezone / Typical active hours')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('e.g., CET evenings, PST mornings')
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(modExperience),
          new ActionRowBuilder().addComponents(modWhy),
          new ActionRowBuilder().addComponents(modTimezone)
        );

        return interaction.showModal(modal);
      }

      // Accept application (no role checks as requested)
      if (interaction.customId && interaction.customId.startsWith('accept_app:')) {
        const applicantId = interaction.customId.split(':')[1];
        const staff = interaction.user;

        // Edit original application message: change color, update footer, disable buttons
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

        // DM applicant
        try {
          const user = await client.users.fetch(applicantId);
          await user.send(`✅ Your application has been accepted by ${staff.tag}. A private ticket has been opened for you. Please check the server.`);
        } catch (err) {
          console.warn('Could not DM applicant on accept:', err);
        }

        // Create ticket channel in the guild where staff clicked
        try {
          const guild = interaction.guild;
          const member = await guild.members.fetch(applicantId).catch(() => null);
          const channelName = `app-${applicantId}`.slice(0, 100);

          const permissionOverwrites = [
            {
              id: guild.roles.everyone,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: client.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.EmbedLinks]
            }
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

      // Deny application (no role checks)
      if (interaction.customId && interaction.customId.startsWith('deny_app:')) {
        const applicantId = interaction.customId.split(':')[1];
        const staff = interaction.user;
        const denialReason = 'Your application was not accepted at this time.'; // default; can be extended to prompt staff

        // Update original application message to show denied and disable buttons
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

        // DM applicant
        try {
          const user = await client.users.fetch(applicantId);
          await user.send(`❌ Your application has been denied by ${staff.tag}.\n\nReason: ${denialReason}`);
        } catch (err) {
          console.warn('Could not DM applicant on deny:', err);
        }

        return interaction.reply({ content: 'Application denied and applicant notified.', ephemeral: true });
      }

      // Close ticket button
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
      // Service submission
      if (interaction.customId === 'service_modal') {
        const title = interaction.fields.getTextInputValue('service_title');
        const description = interaction.fields.getTextInputValue('service_description');
        const experience = interaction.fields.getTextInputValue('service_experience') || 'None provided';
        const applicant = interaction.user;

        try {
          const appsChannel = await client.channels.fetch(APPLICATIONS_CHANNEL_ID);
          const appEmbed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('📝 New Service Submission')
            .addFields(
              { name: 'User', value: `<@${applicant.id}>`, inline: true },
              { name: 'Title', value: title, inline: true },
              { name: 'Description', value: description, inline: false },
              { name: 'Experience / Links', value: experience, inline: false }
            )
            .setFooter({ text: `Applicant ID: ${applicant.id}` });

          const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`accept_app:${applicant.id}`).setLabel('Accept').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`deny_app:${applicant.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
          );

          await appsChannel.send({ embeds: [appEmbed], components: [actionRow] });
        } catch (err) {
          console.error('Failed to post service submission:', err);
          return interaction.reply({ content: 'There was an error submitting your application. Try again later.', ephemeral: true });
        }

        return interaction.reply({ content: '✅ Service submission received. Staff will review it shortly.', ephemeral: true });
      }

      // Moderator submission
      if (interaction.customId === 'moderator_modal') {
        const experience = interaction.fields.getTextInputValue('moderator_experience');
        const why = interaction.fields.getTextInputValue('moderator_why');
        const timezone = interaction.fields.getTextInputValue('moderator_timezone') || 'Not provided';
        const applicant = interaction.user;

        try {
          const appsChannel = await client.channels.fetch(APPLICATIONS_CHANNEL_ID);
          const appEmbed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('🛡️ New Moderator Application')
            .addFields(
              { name: 'User', value: `<@${applicant.id}>`, inline: true },
              { name: 'Timezone / Hours', value: timezone, inline: true },
              { name: 'Experience', value: experience, inline: false },
              { name: 'Why', value: why, inline: false }
            )
            .setFooter({ text: `Applicant ID: ${applicant.id}` });

          const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`accept_app:${applicant.id}`).setLabel('Accept').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`deny_app:${applicant.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
          );

          await appsChannel.send({ embeds: [appEmbed], components: [actionRow] });
        } catch (err) {
          console.error('Failed to post moderator application:', err);
          return interaction.reply({ content: 'There was an error submitting your application. Try again later.', ephemeral: true });
        }

        return interaction.reply({ content: '✅ Moderator application received. Staff will review it shortly.', ephemeral: true });
      }
    }
  } catch (err) {
    console.error('Interaction handler error:', err);
    if (interaction && !interaction.replied && !interaction.deferred) {
      try { await interaction.reply({ content: 'An error occurred while processing your interaction.', ephemeral: true }); } catch {}
    }
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login(process.env.DISCORD_TOKEN);





