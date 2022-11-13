import { join } from 'path';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageAttachment, User } from 'discord.js';
import { Canvas, loadImage } from 'canvas-constructor/cairo';

//
import { assetsFolder } from '../../lib/constants';

//
@ApplyOptions<Command.Options>({
	description: 'We have a legend AmongUS!'
})
export class LegendCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		// Registering chat input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((input) => input.setName('user').setDescription('This is the user in our legends').setRequired(false))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply();

		// Generating image
		const user = interaction.options.getUser('user') ?? interaction.user;
		const imageName = `${user.username}-is-legend.png`;

		const image = await this.generateImage(user);
		const imageAttachment = new MessageAttachment(image, imageName);

		return interaction.editReply({ files: [imageAttachment] });
	}

	private async generateImage(user: User) {
		const avatarResolved = await loadImage(user.displayAvatarURL({ format: 'png', size: 256 }));
		const plateResolved = await loadImage(join(assetsFolder, 'images', 'meme', 'plate_legend.png'));

		const attachment = await new Canvas(398, 398)
			.setColor('White')
			.printRectangle(93, 67, 213, 220)
			.printImage(avatarResolved, 94, 67, 214, 214)
			.printImage(plateResolved, 0, 0)
			.pngAsync();

		return attachment;
	}
}
