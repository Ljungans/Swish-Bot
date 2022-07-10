const client = require("../index");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const { developerIDs, prefix, cooldownMessages } = require("../config.json");
client.on("messageCreate", async (message) => {

   if (
      message.author.bot ||
      !message.guild ||
      !message.content.toLowerCase().startsWith(client.config.prefix)
   )
      return;
   if (!message.member)
      message.member = await message.guild.fetchMember(message);
   const [cmd, ...args] = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(" ");
   let noargs_embed = new MessageEmbed()
      .setTitle(`:x: | Please Provide A Command To Be Executed!`)
      .setColor("RED")
      .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
   if (cmd.length === 0) return message.reply({ embeds: [noargs_embed] });

   const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
   let nocmd_embed = new MessageEmbed()
      .setTitle(`:x: | No Command Found! Try Using  \`${prefix}help\``)
      .setColor("RED")
      .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
   if (!command) return message.channel.send({ embeds: [nocmd_embed] });
   if (command.toggleOff) {
      let toggleoff_embed = new MessageEmbed()
         .setTitle(
            `:x: | That Command Has Been Disabled By The Developers! Please Try Later.`
         )
         .setColor("RED")
         .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
         .setTimestamp();
      return message.reply({ embeds: [toggleoff_embed] });
   } else if (!message.member.permissions.has(command.userpermissions || [])) {
      let userperms_embed = new MessageEmbed()
         .setTitle(`:x: | You Don't Have Permissions To Use The Command!`)
         .setColor("RED")
         .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
         .setTimestamp();
      return message.reply({ embeds: userperms_embed });
   } else if (!message.guild.me.permissions.has(command.botpermissions || [])) {
      let botperms_embed = new MessageEmbed()
         .setTitle(`:x: | I Don't Have Permissions To Use The Command!`)
         .setColor("RED")
         .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
         .setTimestamp();
      return message.reply({ embeds: [botperms_embed] });
   } else if (command.developersOnly) {
      if (!developerIDs.includes(message.author.id)) {
         let developersOnly_embed = new MessageEmbed()
            .setTitle(`:x: | Only Developers Can Use That Command!`)
            .setDescription(
               `Developers: ${developerIDs.map((v) => `<@${v}>`).join(",")}`
            )
            .setColor("RED")
            .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
         return message.reply({ embeds: [developersOnly_embed] });
      }
   } else if (command.cooldown) {
      if (client.cooldowns.has(`${command.name}${message.author.id}`)) {
         let cooldown_embed = new MessageEmbed()
            .setTitle(
               `${cooldownMessages[Math.floor(Math.random() * cooldownMessages.length)]}`
            )
            .setDescription(
               `You Need To Wait \`${ms(
                  client.cooldowns.get(`${command.name}${message.author.id}`) -
                     Date.now(),
                  { long: true }
               )}\` To Use \`${prefix}${command.name}\` again!`
            )
            .setColor("BLUE")
            .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

         return message.reply({ embeds: [cooldown_embed] });
      }

      client.cooldowns.set(
         `${command.name}${message.author.id}`,
         Date.now() + command.cooldown
      );

      setTimeout(() => {
         client.cooldowns.delete(`${command.name}${message.author.id}`);
      }, command.cooldown);
   }
   await command.run(client, message, args);
});