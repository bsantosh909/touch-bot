import { join } from 'path';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageAttachment, User } from 'discord.js';
import { Canvas, loadImage } from 'canvas-constructor/cairo';

//
import { assetsFolder } from '../../lib/constants';

//
@ApplyOptions<Command.Options>({
	description: 'I fear no man, but ...'
})
export class FearNoManCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		// Registering chat input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((input) => input.setName('user').setDescription('This person gives me chill..').setRequired(false))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply();

		// Generating image
		const user = interaction.options.getUser('user') ?? interaction.user;
		const imageName = `fear-no-man-but-${user.username}.png`;

		const image = await this.generateImage(user);
		const imageAttachment = new MessageAttachment(image, imageName);

		return interaction.editReply({ files: [imageAttachment] });
	}

	private async generateImage(user: User) {
		const avatarResolved = await loadImage(user.displayAvatarURL({ format: 'png', size: 256 }));
		const plateResolved = await loadImage(join(assetsFolder, 'images', 'meme', 'fear_no_man.png'));

		const attachment = await new Canvas(772, 771)
			//
			.printImage(plateResolved, 0, 0)
			.printImage(avatarResolved, 261, 516, 250, 250)
			.pngAsync();

		return attachment;
	}
}
