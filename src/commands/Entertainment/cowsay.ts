import cowsay from 'cowsay';
import { Command } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { ApplyOptions } from '@sapphire/decorators';

//
@ApplyOptions<Command.Options>({
	description: 'The cow says moo..'
})
export class CowsayCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		// Registering chat input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((input) =>
					input
						//
						.setName('text')
						.setDescription('What does the cow say?')
						.setRequired(true)
						.setMaxLength(69)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const inputText = interaction.options.getString('text', true);
		const outputText = cowsay.say({ text: inputText });

		await interaction.reply({ content: codeBlock('', outputText) });
	}
}
