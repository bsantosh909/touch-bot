import { join } from 'path';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageAttachment, User } from 'discord.js';
// import { ApplicationCommandType } from 'discord-api-types/v9';
import { Canvas, loadImage } from 'canvas-constructor/cairo';

//
import { assetsFolder } from '../../lib/constants';

//
@ApplyOptions<Command.Options>({
	description: 'Oh this! This is beautiful'
})
export class BeautifulCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		// Registering chat input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((input) => input.setName('user').setDescription('Select the beautiful user').setRequired(false))
		);
		// Register user context command
		// registry.registerContextMenuCommand((builder) =>
		// 	builder //
		// 		.setName(this.name)
		// 		.setType(ApplicationCommandType.User)
		// );
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply();

		// Generating image
		const user = interaction.options.getUser('user') ?? interaction.user;
		const imageName = `${user.username}-is-beautiful.png`;

		const image = await this.generateImage(user);
		const imageAttachment = new MessageAttachment(image, imageName);

		return interaction.editReply({ files: [imageAttachment] });
	}

	// public override async contextMenuRun(interaction: Command.ContextMenuInteraction) {
	// 	await interaction.deferReply();

	// 	if (interaction.isUserContextMenu() && interaction.targetMember) {
	// 		const imageName = `${interaction.targetUser.username}-is-beautiful.png`;

	// 		const image = await this.generateImage(interaction.targetUser);
	// 		const imageAttachment = new MessageAttachment(image, imageName);

	// 		return interaction.editReply({ files: [imageAttachment] });
	// 	}

	// 	// Fail-safe, but this should most likely not be encountered...
	// 	return interaction.editReply({ content: 'RIP!' });
	// }

	private async generateImage(user: User) {
		const avatarResolved = await loadImage(user.displayAvatarURL({ format: 'png', size: 256 }));
		const plateResolved = await loadImage(join(assetsFolder, 'images', 'meme', 'this_is_beautiful.png'));

		const attachment = await new Canvas(1364, 1534)
			.setColor('white')
			.printRectangle(903, 94, 369, 1230)
			.printImage(avatarResolved, 903, 94, 369, 369)
			.printImage(avatarResolved, 903, 861, 369, 369)
			.printImage(plateResolved, 0, 0)
			.pngAsync();

		return attachment;
	}
}
