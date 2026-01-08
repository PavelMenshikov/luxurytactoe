# 💎 GlamTacToe (Premium Edition)

![Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge&logo=vercel&logoColor=white)

Стильное веб-приложение **«Крестики-нолики»**, разработанное с использованием современных AI-инструментов. Адаптировано под **Telegram Mini Apps**.

<div align="center">

[![Play Game](https://img.shields.io/badge/Play_in_Telegram-Click_Here-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/toe_tick_tack_bot/httpsluxurytactoevercelapp)
[![Admin Logs](https://img.shields.io/badge/Live_Logs-Admin_Channel-232F3E?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/tictactoehard)

<br>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## ✨ Особенности (Vibe Coding)
Это не просто игра, это **Product MVP**, созданный для проверки гипотезы вовлечения через геймификацию.

- **🎨 Heavy Luxury UI:** Глассморфизм, сложные градиенты, анимации `Framer Motion`.
- **📱 Mobile First:** Идеально работает внутри Telegram (Web App) с поддержкой нативных вибраций (Haptic Feedback).
- **🏆 Reward System:** Игрок гарантированно выигрывает -> получает промокод.
- **🛡️ Secure Backend:** Python (Flask @ Vercel Serverless) обрабатывает логику на сервере, скрывая алгоритмы выдачи призов.
- **📢 Analytics:** Уведомления о каждом победителе мгновенно приходят в [админский канал](https://t.me/tictactoehard).

## 🛠 Архитектура

1. **Фронтенд (Vercel Static):** React отрисовывает интерфейс, обрабатывает клики, создает анимации и конфетти. При победе отправляет `POST` запрос.
2. **Бэкенд (Vercel Function):** 
   - Serverless-функция на Python.
   - Генерирует уникальный промокод.
   - Отправляет красивый отчет (с ID игрока и кодом) владельцу в Telegram.
   - Возвращает код на фронтенд.

---

### 🚀 Установка и запуск (Local)

Проект использует гибридную структуру для деплоя на Vercel.

1. **Клонировать репозиторий:**
   ```bash
   git clone https://github.com/PavelMenshikov/luxurytactoe.git
---

### 🚀 Запуск (Deploy)

Проект полностью настроен для деплоя на **Replit**.

1. Клонировать репозиторий.
2. Установить зависимости: `pip install -r requirements.txt` и `npm install`.
3. Добавить **Secrets**: `TG_BOT_TOKEN` и `TG_CHAT_ID`.
4. Нажать **RUN**.

---
*Created by [Pavel Menshikov] for Technical Assessment.*