import { ButtonStyle, CacheType, ChatInputCommandInteraction, APIButtonComponentWithCustomId, ComponentType, APIActionRowComponent, MessageFlags } from "discord.js";
import upcoming from "../../api/upcoming";
import { LoggingMeta } from "../../log/loggingMeta";

export default async (requestId: string, interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();

  try {
    const ctfInfos = await upcoming(requestId, interaction.options.getInteger("limit") ?? 10);
    await interaction.editReply("CTF 정보를 가져왔습니다.");
    for (const ctfInfo of ctfInfos) {
      const button: APIActionRowComponent<APIButtonComponentWithCustomId> = {
        components: [
          {
            label: "참가공지하기",
            style: ButtonStyle.Primary,
            custom_id: "notice",
            type: ComponentType.Button,
          },
        ],
        type: ComponentType.ActionRow,
      };

      await interaction.channel.send({
        embeds: [
          {
            title: ctfInfo.name,
            description: `${ctfInfo.start} ~ ${ctfInfo.finish}`,
            url: ctfInfo.ctftimeUrl,
            fields: [
              {
                name: "Weight",
                value: ctfInfo.weight.toFixed(2),
              }
            ],
          }
        ],
        components: [button],
      });
    }
  } catch (error) {
    await interaction.editReply({
      content: (new LoggingMeta(
        requestId,
        "error",
        error.message,
      )).toString(),
    });
  }
}
