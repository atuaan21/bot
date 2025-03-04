const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute một người dùng")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Người bạn muốn mute")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("duration")
                .setDescription("Thời gian mute (phút), để trống nếu muốn mute vĩnh viễn")
                .setRequired(false)
        ),

    async execute(interaction) {
        // Kiểm tra quyền
        const allowedRoleID = ["918016219376926751","1185596181355696131","1316039794391908444" ] ; // ID của vai trò đặc biệt
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) &&
            !interaction.member.roles.cache.has(allowedRoleID)) {
            return interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này!", ephemeral: true });
        }

        const target = interaction.options.getMember("user");
        const duration = interaction.options.getInteger("duration");
        const muteRole = interaction.guild.roles.cache.find(role => role.name === "Muted");
        const logChannel = interaction.guild.channels.cache.get("987654321098765432"); // ID kênh log

        if (!muteRole) {
            return interaction.reply({ content: "⚠️ Không tìm thấy vai trò 'Muted'. Hãy tạo nó trước!", ephemeral: true });
        }

        if (target.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: "⚠️ Người này đã bị mute rồi!", ephemeral: true });
        }

        await target.roles.add(muteRole);
        interaction.reply({ content: `🔇 Đã mute ${target.user.tag} ${duration ? `trong ${duration} phút!` : "vĩnh viễn!"}` });

        // Gửi log
        if (logChannel) {
            logChannel.send(`🔇 **${target.user.tag}** đã bị mute bởi **${interaction.user.tag}** ${duration ? `trong ${duration} phút` : "vĩnh viễn"}!`);
        }

        // Nếu có thời gian, tự động unmute
        if (duration) {
            setTimeout(async () => {
                if (target.roles.cache.has(muteRole.id)) {
                    await target.roles.remove(muteRole);
                    if (logChannel) {
                        logChannel.send(`✅ **${target.user.tag}** đã được tự động unmute sau ${duration} phút.`);
                    }
                }
            }, duration * 60 * 1000);
        }
    }
};
