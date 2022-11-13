import { join } from 'path';
import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageAttachment } from 'discord.js';
import { Canvas, loadImage } from 'canvas-constructor/cairo';

//
import { assetsFolder } from '../../lib/constants';

//
@ApplyOptions<Command.Options>({
	description: 'The search for intelligent life is going on...'
})
export class TheSearchCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		// Registering chat input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((input) => input.setName('text').setDescription('The not to intelligent thing').setRequired(true))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply();

		// Generating image
		const inputText = interaction.options.getString('text', true);
		const imageName = 'the-search-continues.png';

		const image = await this.generateImage(inputText);
		const imageAttachment = new MessageAttachment(image, imageName);

		return interaction.editReply({ files: [imageAttachment] });
	}

	private async generateImage(inputText: string) {
		const plateResolved = await loadImage(join(assetsFolder, 'images', 'meme', 'the_search.png'));

		const attachment = await new Canvas(700, 612)
			.printImage(plateResolved, 0, 0, 700, 612)
			.setTextAlign('center')
			.setTextSize(18)
			.createRectangleClip(61, 335, 156, 60)
			.printWrappedText(inputText, 143, 360, 156)
			.pngAsync();

		return attachment;
	}
}
