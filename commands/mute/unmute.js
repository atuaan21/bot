const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Gỡ mute cho một người dùng")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Người bạn muốn unmute")
                .setRequired(true)
        ),

    async execute(interaction) {
        const allowedRoleIDs = ["918016219376926751","1185596181355696131","1316039794391908444"]; // ID các vai trò được phép dùng lệnh

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) &&
            !interaction.member.roles.cache.some(role => allowedRoleIDs.includes(role.id))) {
            return interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này!", ephemeral: true });
        }

        const target = interaction.options.getMember("user");
        const muteRole = interaction.guild.roles.cache.find(role => role.name === "Muted");
        const logChannel = interaction.guild.channels.cache.get("987654321098765432"); // ID kênh log

        if (!muteRole) {
            return interaction.reply({ content: "⚠️ Không tìm thấy vai trò 'Muted'.", ephemeral: true });
        }

        if (!target.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: "⚠️ Người này không bị mute.", ephemeral: true });
        }

        await target.roles.remove(muteRole);
        interaction.reply({ content: `🔊 **${target.user.tag}** đã được unmute! ✅`, ephemeral: false });

        if (logChannel) {
            logChannel.send(`🔊 **${target.user.tag}** đã được unmute bởi **${interaction.user.tag}**.`);
        }
    }
};
