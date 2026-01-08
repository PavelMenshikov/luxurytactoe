import os
import random
import string
import requests
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

TG_TOKEN = os.environ.get('TG_BOT_TOKEN')
TG_CHAT_ID = os.environ.get('TG_CHAT_ID')

def send_telegram(text):
    if not TG_TOKEN or not TG_CHAT_ID:
        return
    try:
        url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
        payload = {"chat_id": TG_CHAT_ID, "text": text, "parse_mode": "HTML"}
        requests.post(url, json=payload)
    except Exception as e:
        print(f"Telegram Error: {e}")

@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('dist', path)


@app.route('/api/game-over', methods=['POST'])
def game_over():
    data = request.json
    status = data.get('result', 'loss')
    
   
    username = data.get('username', 'Неизвестный')
    user_id = data.get('user_id', '???')

    promo = None
    
    if status == 'win':
        chars = string.ascii_uppercase + string.digits
        promo = ''.join(random.choices(chars, k=5))
    
        msg = (
            f"<b>🏆 НОВАЯ ПОБЕДА!</b>\n\n"
            f"👤 <b>Игрок:</b> {username} (ID: {user_id})\n"
            f"🎟 <b>Выдан код:</b> {promo}\n"
            f"<i>Салют чемпиону!</i> 🎉"
        )
        send_telegram(msg)
        
    else:        
        pass
    
    return jsonify({"promo": promo})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)