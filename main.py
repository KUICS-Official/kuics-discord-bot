import datetime
import json
import os
from datetime import datetime, timedelta, timezone

import discord
from discord import Embed
from discord.ext import commands
from dotenv import load_dotenv
from selenium import webdriver

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

intents = discord.Intents.default()
intents.members = True
client = commands.Bot(command_prefix='!', help_command=None, intents=intents)


@client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)
    print('==================================================')
    await client.change_presence(activity=discord.Game("CTF"))


def log_message(ctx):
    content = ctx.message.content
    author = ctx.message.author
    print(content, 'by', author)


def log_error(ctx):
    content = ctx.message.content
    author = ctx.message.author
    print('ERROR:', content, 'by', author)


def upcoming_ctf_list(count):
    if int(count) < 1:
        raise Exception

    driver = webdriver.Chrome(executable_path, options=webdriver_options)
    driver.get(f'https://ctftime.org/api/v1/events/?limit={count}')
    response = driver.find_element_by_css_selector('body').text
    response_dict = json.loads(response)

    data = []
    for row in response_dict:
        row_parsed = {'title': row['title'], 'description': row['description'],
                      'start': datetime.fromisoformat(row['start']).astimezone(timezone(timedelta(hours=9))), 'finish': datetime.fromisoformat(row['finish']).astimezone(timezone(timedelta(hours=9))), 'logo': row['logo'], 'url': row['url'], 'weight': row['weight']}
        data.append(row_parsed)

    driver.close()
    return data


def search_upcoming_ctf(count, keyword):
    if count > 100:
        count = 100
    data = upcoming_ctf_list(count)

    result = []
    for datum in data:
        if keyword.upper() in datum['title'].upper():
            result.append(datum)

    return result


@ client.command()
async def upcoming(ctx):
    log_message(ctx)
    content = ctx.message.content
    parsed_message = content.split()

    data = []
    if len(parsed_message) >= 2:
        data = upcoming_ctf_list(parsed_message[1])
    else:
        data = upcoming_ctf_list(1)

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


@ client.command()
async def search(ctx):
    log_message(ctx)
    content = ctx.message.content
    parsed_message = content.split()
    data = []
    try:
        data = search_upcoming_ctf(int(parsed_message[1]), parsed_message[2])
    except:
        data = search_upcoming_ctf(10, parsed_message[1])
    finally:
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


@ client.command()
async def help(ctx):
    log_message(ctx)
    embed = Embed(
        title='KUICS Bot 명령어',
        color=0x790030
    )
    embed.add_field(name='Upcoming',
                    value='```!upcoming <max_count(default: 1)>```', inline=False)
    embed.add_field(
        name='Search', value='```!search <count(max: 100, default: 10)> <keyword>```', inline=False)
    embed.set_thumbnail(
        url="https://github.com/BeLeap/kuics-discord-bot/blob/main/KUICS-logo.png?raw=true")
    author = ctx.message.author
    await author.send(embed=embed)


# @ client.event
# async def on_member_join(member):
#     print(f'{member} has joined server')
#     await member.send('KUICS CTF 원정대 디스코드에 오신 것을 환영합니다.\n닉네임을 실명으로 변경해주세요')


@ client.event
async def on_command_error(ctx, error):
    print(error)
    log_error(ctx)
    await ctx.send('사용할 수 없는 명령어입니다.')


client.run(BOT_TOKEN)
