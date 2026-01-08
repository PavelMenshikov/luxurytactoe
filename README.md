# 💎 GlamTacToe (Cyberpunk Vibe Edition)

![Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge&logo=rocket)

Стильное веб-приложение **«Крестики-нолики»**, разработанное с использованием современных AI-инструментов. Адаптировано под **Telegram Mini Apps**.

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Replit](https://img.shields.io/badge/Replit-F26202?style=for-the-badge&logo=replit&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram_API-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)

</div>

## ✨ Особенности (Vibe Coding)
Это не просто игра, это **Product MVP**, созданный для проверки гипотезы вовлечения через геймификацию.

- **🎨 Heavy Luxury UI:** Глассморфизм, сложные градиенты, анимации `Framer Motion`.
- **📱 Mobile First:** Идеально работает внутри Telegram (Web App).
- **🏆 Reward System:** Игрок гарантированно выигрывает -> получает промокод.
- **🛡️ Secure Backend:** Python (Flask) обрабатывает логику на сервере, скрывая алгоритмы выдачи призов.
- **📢 Real-time Logs:** Уведомления о победителях мгновенно приходят в админский Telegram-канал.

## 🛠 Как это работает

1. **Фронтенд (React):** Отрисовывает интерфейс, обрабатывает клики, создает анимации и конфетти. При победе отправляет `POST` запрос на сервер.
2. **Бэкенд (Flask):** 
   - Принимает сигнал победы.
   - Генерирует уникальный промокод (напр. `LUX-9944`).
   - Используя скрытые токены (`TG_BOT_TOKEN`), отправляет красивый отчет в канал владельца бизнеса.
   - Возвращает промокод клиенту для отображения.

---

### 🚀 Запуск (Deploy)

Проект полностью настроен для деплоя на **Replit**.

1. Клонировать репозиторий.
2. Установить зависимости: `pip install -r requirements.txt` и `npm install`.
3. Добавить **Secrets**: `TG_BOT_TOKEN` и `TG_CHAT_ID`.
4. Нажать **RUN**.

---
*Created by [Pavel Menshikov] for Technical Assessment.*