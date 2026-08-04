// 🎬 HOW TO CLIP — FIXED STRING ERROR
const clipChannel = await client.channels.fetch(HOW_TO_CLIP_CHANNEL_ID);
const clipMessages = await clipChannel.messages.fetch({ limit: 20 });
const clipExisting = clipMessages.find(
  m => m.author.id === client.user.id && m.embeds.length > 0
);

if (!clipExisting) {
  const clipEmbed = new EmbedBuilder()
    .setColor('#2b2d31')
    .setTitle('Clipping-tips')
    .setDescription(
      "**The Hook**\nYour first 3 seconds decide if viewers stay. Strong openings increase watch time and push your video further. Create quick curiosity or emotion.\n\n" +
      "**Clip Selection & Length**\nChoose moments that feel viral or instantly grab attention. Short clips perform best. IG: ~40s • TikTok: ~30s • Shorts: 15–20s.\n\n" +
      "**Editing**\nYou can use CapCut or OpusClip to edit your clips. Add clear, bold captions to keep viewers focused, and choose trending audio to help the algorithm push your content further.\n\n" +
      "**Posting Strategy**\nPost consistently throughout the day. Use hashtags that match your niche, and engage with creators in your category to increase visibility."
    )
    .setFooter({ text: 'Underclips Clipping Guide' });

  await clipChannel.send({ embeds: [clipEmbed] });
}







