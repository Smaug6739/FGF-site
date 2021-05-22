module.exports = {
  name: 'mute',
  execute(message, prefix) {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    if (message.content.startsWith(`${prefix}mute`)) {
      let mention = message.mentions.members.first()
      if (!message.member.hasPermission("MANAGE_ROLES"))
        message.channel.send("Vous n'avez pas la permission !").then(message.delete({ timeout: 50 }, message.author)).then(message => message.delete({ timeout: 5000 }))

      else if (mention === undefined) {
        message.channel.send("Veuillez mentionner un utilisateur !").then(message.delete({ timeout: 50 }, message.author)).then(message => message.delete({ timeout: 5000 }))
      }
      else if (mention.hasPermission("VIEW_AUDIT_LOG"))
        message.channel.send("Vous ne pouvez pas mute cet utilisateur !").then(message.delete({ timeout: 50 }, message.author)).then(message => message.delete({ timeout: 5000 }))
      else {
        mention.roles.add("787786199673995284");
        message.channel.send(`<@${mention.user.id}> a été mute avec succès`).then(message.delete({ timeout: 50 }, message.author)).then(message => message.delete({ timeout: 5000 }));
      }
    }
  }
}