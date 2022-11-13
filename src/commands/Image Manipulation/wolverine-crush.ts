import { join } from 'path';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageAttachment, User } from 'discord.js';
import { Canvas, loadImage } from 'canvas-constructor/cairo';

//
import { assetsFolder } from '../../lib/constants';

//
@ApplyOptions<Command.Options>({
	description: "Wolverine's crush"
})
export class WolverineCrushCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		// Registering chat input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((input) => input.setName('user').setDescription('The crush').setRequired(false))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply();

		// Generating image
		const user = interaction.options.getUser('user') ?? interaction.user;
		const imageName = `wolverine-has-crush-on-${user.username}.png`;

		const image = await this.generateImage(user);
		const imageAttachment = new MessageAttachment(image, imageName);

		return interaction.editReply({ files: [imageAttachment] });
	}

	private async generateImage(user: User) {
		const avatarResolved = await loadImage(user.displayAvatarURL({ format: 'png', size: 512 }));
		const plateResolved = await loadImage(join(assetsFolder, 'images', 'meme', 'wolverine_crush.png'));

		const attachment = await new Canvas(600, 875)
			.rotate((-7 * Math.PI) / 180)
			.setColor('White')
			.printRectangle(98, 485, 390, 390)
			.printImage(avatarResolved, 48, 485, 390, 390)
			.rotate((7 * Math.PI) / 180)
			.printImage(plateResolved, 0, 0)
			.pngAsync();

		return attachment;
	}
}
