import { ButtonStyle, CacheType, ChatInputCommandInteraction, APIButtonComponentWithCustomId, ComponentType, APIActionRowComponent } from "discord.js";
import upcoming from "../api/upcoming";

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();

  try {
    const ctfInfos = await upcoming(interaction.options.getInteger('limit'));
    await interaction.editReply("CTF 정보를 가져왔습니다.")
    for (const ctfInfo of ctfInfos) {
      const button: APIActionRowComponent<APIButtonComponentWithCustomId> = {
        components: [
          {
            label: "참가공지",
            style: ButtonStyle.Primary,
            custom_id: "notice",
            type: ComponentType.Button,
          },
        ],
        type: ComponentType.ActionRow,
      }

      await interaction.channel.send({
        embeds: [
          {
            title: ctfInfo.name,
            description: `${ctfInfo.start} ~ ${ctfInfo.end}`,
            url: ctfInfo.url,
            fields: [
              {
                name: "Weight",
                value: ctfInfo.weight.toString(),
              }
            ],
          }
        ],
        components: [button],
      })
    }
  } catch (error) {
    await interaction.editReply({
      content: error.message,
    });
  }
}
