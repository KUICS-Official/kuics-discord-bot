FROM python:3

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


COPY . .
RUN python3 ./setup.py

CMD [ "python", "./main.py" ]