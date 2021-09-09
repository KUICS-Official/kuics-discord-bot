import datetime
import json
import os
from datetime import datetime, timedelta, timezone
from typing import Union
from discord_slash.model import SlashCommandOptionType
from discord_slash.utils.manage_commands import create_option

from dotenv import load_dotenv
from selenium import webdriver

import discord
from discord import Client, Intents, Embed
from discord_slash import SlashCommand, SlashContext

load_dotenv()
BOT_TOKEN = os.getenv('BOT_TOKEN')
CLIENT_ID = os.getenv('BOT_ID')
ARCH = os.getenv('ARCH')

webdriver_options = webdriver.ChromeOptions()
if ARCH.upper().startswith('LIN'):
    webdriver_options.add_argument('--no-sandbox')
webdriver_options.add_argument('headless')
executable_path = './chromedriver.exe' if ARCH.upper(
).startswith('WIN') else './chromedriver'

client = Client(intents=Intents.all())
slash = SlashCommand(client, sync_commands=True)
driver = webdriver.Chrome(executable_path, options=webdriver_options)


async def upcoming_ctf_list(count):
    if int(count) < 1:
        raise Exception

    driver.get(f'https://ctftime.org/api/v1/events/?limit={count}')
    response = driver.find_element_by_css_selector('body').text
    response_dict = json.loads(response)

    data = []
    for row in response_dict:
        row_parsed = {'title': row['title'], 'description': row['description'],
                      'start': datetime.fromisoformat(row['start']).astimezone(timezone(timedelta(hours=9))), 'finish': datetime.fromisoformat(row['finish']).astimezone(timezone(timedelta(hours=9))), 'logo': row['logo'], 'url': row['url'], 'weight': row['weight']}
        data.append(row_parsed)
    return data


async def search_upcoming_ctf(count, keyword):
    if count > 100:
        count = 100
    data = await upcoming_ctf_list(count)

    result = []
    for datum in data:
        if keyword.upper() in datum['title'].upper():
            result.append(datum)

    return result


@slash.slash(name="upcoming", description="다가오는 CTF 일정을 최대 {max_count}개 보여줍니다.", options=[
    create_option(
        name="max_count",
        description="최대 개수",
        option_type=SlashCommandOptionType.INTEGER,
        required=False,
    )
])
async def upcoming(ctx: SlashContext, **kwargs):
    count = kwargs.get('max_count', 1)
    data = await upcoming_ctf_list(count)

    for datum in data:
        if datum:
            description = datum['description']
            if len(description) > 200:
                description = description[:200]
                description += '...'
            embed = Embed(
                title=datum['title'],
                description=description,
                url=datum['url'],
                color=0x790030
            )
            embed.set_thumbnail(url=datum['logo'])
            embed.add_field(name='Start', value=datum['start'])
            embed.add_field(name='Finish', value=datum['finish'])
            embed.add_field(name='Weight', value=datum['weight'])
            await ctx.send(embed=embed)
        else:
            await ctx.send('검색결과가 없습니다.')


@slash.slash(name="search", description="다가오는 CTF 일정 {count}개 중 {keyword}를 포함하는 일정을 보여줍니다.", options=[
    create_option(
        name="keyword",
        description="검색어",
        option_type=SlashCommandOptionType.STRING,
        required=True,
    ),
    create_option(
        name="count",
        description="검색 개수",
        option_type=SlashCommandOptionType.INTEGER,
        required=False
    )
])
async def search(ctx: SlashContext, **kwargs):
    keyword = kwargs.get('keyword', '')
    count = kwargs.get('count', 10)

    data = await search_upcoming_ctf(count, keyword)

    if data:
        for datum in data:
            description = datum['description']
            if len(description) > 200:
                description = description[:200]
                description += '...'
            embed = Embed(
                title=datum['title'],
                description=description,
                url=datum['url'],
                color=0x790030
            )
            embed.set_thumbnail(url=datum['logo'])
            embed.add_field(name='Start', value=datum['start'])
            embed.add_field(name='Finish', value=datum['finish'])
            await ctx.send(embed=embed)
    else:
        await ctx.send('검색결과가 없습니다.')


@ client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)
    print('==================================================')
    await client.change_presence(activity=discord.Game("CTF"))

client.run(BOT_TOKEN)
