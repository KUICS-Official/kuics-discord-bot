import os

os.system(
    'curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -')
os.system(
    'echo "deb [arch=amd64]  http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list')
os.system('apt update')
os.system('apt install google-chrome-stable unzip -y')
os.system(
    f'wget https://chromedriver.storage.googleapis.com/88.0.4324.96/chromedriver_linux64.zip')
os.system('unzip chromedriver_linux64.zip')
