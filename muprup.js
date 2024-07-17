// Made by wmnd
const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const axios = require('axios');

const token = "";
const clientId = "1256497884766011534";
const botstatus = "Kurumi Bypass V2";
const madeby = "Hoàng Long Calisthenic";
const endpoint = "http://45.90.13.151:6041";
const robloxApiUrl = "https://users.roblox.com/v1/usernames/users";

const client = new Client({ intents: 3276799 });
const rest = new REST({ version: '9' }).setToken(token);

const commands = [
    {
        name: 'delta',
        description: 'Bypass Links or Roblox Username',
        options: [
            {
                name: 'input',
                type: 3,
                description: 'The link or Roblox username',
                required: true,
            },
        ],
    },
];

client.once('ready', async () => {
    console.log(`\x1b[36mSuccessfully Logged In As ${client.user.username}\x1b[0m`);

    try {
        console.log('Started refreshing global application (/) commands.');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log('Successfully reloaded global application (/) commands.');
    } catch (error) {
        console.error(error);
    }

    client.user.setPresence({
        activities: [{ name: botstatus }],
        status: 'dnd',
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'delta') {
        await delta(interaction);
    } else if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
    }
});

async function getRobloxUserId(username) {
    const url = robloxApiUrl;
    const payload = { usernames: [username] };
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const data = response.data;

        if (data.data && data.data.length > 0) {
            return data.data[0].id;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`HTTP Request failed: ${error}`);
        return null;
    }
}

async function handlePlatoBoost(link, interaction) {
    if (!link.startsWith("https://gateway.platoboost.com/a/")) {
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle("Kurumi Bypass")
                .setColor('#FF0000')  // Màu đỏ
                .setDescription('```ml\n Không Hỗ Trợ Loại Bypass Này.\n```')
                .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
                .setTimestamp()
            ],
        });
        return;
    }

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setTitle("Bypassing...")
            .setColor('#1E90FF')  // Màu xanh dương
            .setDescription('```<:Loading:1200845550141067324> Đang Bypass Quá Trình Này Có Thể Mất Vài Giây...```')
            .setImage('')  // Thay thế bằng URL của hình ảnh nhỏ bạn muốn gửi
            .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
            .setTimestamp()
        ],
    });

    const urlparam = new URLSearchParams(new URL(link).search);
    const hwid = urlparam.get('id');
    const apiUrl = `${endpoint}/?url=${link}`;

    try {
        const response = await axios.get(apiUrl);
        const json = response.data;

        if (json.status === "success") {
            const supportButton = new ButtonBuilder()
                .setLabel('Support')
                .setURL('https://discord.gg/5DVqHPwAaX')
                .setStyle(ButtonStyle.Link);

            const inviteButton = new ButtonBuilder()
                .setLabel('Invite Me')
                .setURL('https://discord.com/oauth2/authorize?client_id=1256497884766011534&permissions=8&integration_type=0&scope=bot')
                .setStyle(ButtonStyle.Link);

            const actionRow = new ActionRowBuilder()
                .addComponents(supportButton, inviteButton);

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("Kurumi Bypass")
                    .setColor('#00FF00')  // Màu xanh lá cây
                    .setThumbnail('https://gateway.platoboost.com/icon.svg')  // Hình thu nhỏ
                    .addFields(
                        { name: 'Key:', value: `\`\`\`${json.key}\`\`\`` },
                        { name: 'Time Taken:', value: `\`\`\`${json.time}\`\`\`` }
                    )
                    .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
                    .setTimestamp()
                ],
                components: [actionRow]
            });
        } else if (json.status === "fail" && json.message === "Liên Kết Không Tồn Tại.") {
            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("Kurumi Bypass")
                    .setColor('#FF0000')  // Màu đỏ
                    .setThumbnail('https://gateway.platoboost.com/icon.svg')  // Hình thu nhỏ
                    .setDescription('```ml\n Liên Kết Không Tồn Tại.\n```')
                    .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
                    .setTimestamp()
                ],
            });
        } else {
            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("Kurumi Bypass")
                    .setColor('#FF0000')  // Màu đỏ
                    .setThumbnail('https://gateway.platoboost.com/icon.svg')  // Hình thu nhỏ
                    .setDescription('```ml\n ERROR.\n```')
                    .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
                    .setTimestamp()
                ],
            });
        }
    } catch (error) {
        console.error(error);
        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle("Kurumi Bypass")
                .setColor('#FF0000')  // Màu đỏ
                .setThumbnail('https://media.discordapp.net/attachments/1160520088181542925/1199162006993895484/deltax.png?ex=663ad3a5&is=66398225&hm=0102ff78b7b4eb6b765b214a1685d53f6a4daf049fc9fd1ec8bfffa574238334&=&format=webp&quality=lossless')  // Hình thu nhỏ
                .setDescription('```ml\nERROR.\n```')
                .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
                .setTimestamp()
            ],
        });
    }
}

async function delta(interaction) {
    const input = interaction.options.getString('input');

    if (input.startsWith("https://gateway.platoboost.com/a/")) {
        // Handle PlatoBoost link
        await handlePlatoBoost(input, interaction);
    } else {
        // Check if input is a Roblox username
        try {
            const robloxUserId = await getRobloxUserId(input);

            if (robloxUserId) {
                const bypassLink = `https://gateway.platoboost.com/a/8?id=${robloxUserId}`;
                await handlePlatoBoost(bypassLink, interaction);
            } else {
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle("Kurumi Bypass")
                        .setColor('#FF0000')  // Màu đỏ
                        .setDescription('```ml\n Không Tìm Thấy Tên Người Dùng Roblox.\n```')
                        .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
                        .setTimestamp()
                    ],
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Roblox User Search Error")
                    .setColor('#FF0000')  // Màu đỏ
                    .setDescription('```ml\nVui Lòng Thử Lại Sau 10s\n```')
                    .setFooter({ text: `Requested By ${interaction.user.username} | Made by ${madeby} | Powered By ${madeby}` })
                    .setTimestamp()
                ],
            });
        }
    }
}

client.login(token);
