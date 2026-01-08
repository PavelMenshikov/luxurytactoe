from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random
import string
import requests

app = Flask(__name__)
CORS(app)

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

@app.route('/api/game-over', methods=['POST'])
def game_over():
    data = request.json
    status = data.get('result', 'loss')
    
    full_name = data.get('name', 'Аноним')
    username = data.get('username', '')
    user_id = data.get('user_id', 'Unknown')
    
    promo = None
    if status == 'win':
        chars = string.ascii_uppercase + string.digits
        promo = ''.join(random.choices(chars, k=5))
        
        
        msg = (
            f"<b>🏆 VICTORY REPORT!</b>\n\n"
            f"👤 <b>Имя:</b> {full_name}\n"
            f"🆔 <b>TG Username:</b> {username}\n"
            f"🔢 <b>ID:</b> <code>{user_id}</code>\n"
            f"🎟 <b>Промокод:</b> <code>{promo}</code>"
        )
        send_telegram(msg)
    
    return jsonify({"promo": promo})