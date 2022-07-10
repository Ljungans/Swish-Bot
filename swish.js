const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require('canvas');

module.exports = {
    name: "swish",
    description: "Add Text On GIF",
    options: [
        {
            name: 'name',
            description: 'Name Of The Contact',
            type: 'STRING',
            required: true
        },
        {
            name: 'number',
            description: 'Number Of The Contact',
            type: 'STRING',
            required: true
        },
        {
            name: 'kr',
            description: 'KR',
            type: 'STRING',
            required: true
        },
        {
            name: 'text',
            description: 'Text',
            type: 'STRING',
            required: true
        }
    ],
    run: async (client, interaction, args) => {
        interaction.editReply({ embeds: [ new MessageEmbed().setAuthor({ name: 'Generating...', iconURL: 'https://cdn.discordapp.com/emojis/821266152785313793.gif?size=96&quality=lossless' })]});
        const name = interaction.options.getString('name');
        const number = interaction.options.getString('number');
        const kr = interaction.options.getString('kr');
        const text = interaction.options.getString('text');
        
        function getDate() {
            const months = ['jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.', 'jul.', 'aug.', 'sep.', 'nov.', 'dec.'];
            const date = new Date(Date.now());
            const days = date.getDate();
            const month = months[date.getMonth()];
            const date2 = new Date(date.toLocaleString('en-US', { timeZone: 'CET' }));
            return `${days} ${month} ${date.getFullYear()}, kl ${date2.getHours()}:${date2.getMinutes()}`;
        }

        async function write() {
            // WRITING TEXT ON FRAMES.
            const GifEncoder = require('gif-encoder-2');
            const gif = new GifEncoder(592, 1280);

            gif.setDelay(100);
            gif.start();

            for (let i = 0; i < 36; i++) {
                const image = await Canvas.loadImage(`${process.cwd()}/frames_test/frame_${i}.png`);
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext('2d');

                Canvas.registerFont(`${process.cwd()}/museo.otf`, { family: 'Museo' });
                //Canvas.registerFont('museo500.otf', { family: 'Museo500' });

                ctx.drawImage((await Canvas.loadImage(`${process.cwd()}/frames_test/frame_${i}.png`)), 0, 0, 592, 1280);

                ctx.font = '24px "Museo"';
                ctx.fillStyle = '#858688';
                ctx.textAlign = 'center';
                ctx.fillText(getDate(), 300, 747);

                ctx.font = '33px "Museo"';
                ctx.fillStyle = '#FDFDFE';
                ctx.textAlign = 'center';
                ctx.fillText(name, 300, 815);

                ctx.font = '24px "Museo"';
                ctx.fillStyle = '#858688';
                ctx.textAlign = 'center';
                ctx.fillText(number, 300, 856);

                ctx.font = '45px "Museo"';
                ctx.fillStyle = '#FDFDFE';
                ctx.textAlign = 'center';
                ctx.fillText(kr, 300, 940);

                ctx.font = '26px "Museo"';
                ctx.fillStyle = '#FDFDFE';
                ctx.textAlign = 'center';
                ctx.fillText(text, 300, 1010);

                ctx.drawImage((await Canvas.loadImage(`${process.cwd()}/swish.png`)), 198, 1133, 202, 70);

                gif.addFrame(ctx);
                if (i === 35) gif.finish();
            }
            const attachment = new MessageAttachment(gif.out.getData(), 'swish.gif');

            interaction.channel.send({ files: [attachment] });

        }
        write()
    }
}