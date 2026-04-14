# Accessly

Сервис для автоматической проверки доступности веб-страниц.

Позволяет анализировать HTML и поведение страницы, выявляя проблемы доступности (alt-атрибуты, контраст, ARIA и др.)

## Возможности

- Проверка alt-атрибутов изображений
- Анализ ARIA-атрибутов
- Проверка контраста
- Проверка доступности с клавиатуры
- Анализ структуры страницы
- Проверка масштабируемости
- Проверка медиа (audio/video)

## Технологии

### Backend
- Node.js
- Express
- Puppeteer
- Cheerio
- Axios
- PM2

### Frontend
- React
- TypeScript
- Vite

## Установка

```bash
git clone repo
cd my-app
npm install
```

## Запуск

### Frontend
```bash
npm run dev
```
### Backend (сервер)
```bash
pm2 start src/services/services.ts --name accessibility-api --interpreter tsx
```
```md
## Структура проекта

### Backend
- src/services — сервер
- src/browser — управление Puppeteer
- src/modules — проверки доступности
- src/utils — вспомогательные функции

### Frontend
- src/components — React компоненты
- src/pages — страницы приложения

## Примечания
- Возможны редкие ошибки соединения при высокой нагрузке, связанные с перезапуском браузера
- Проект развернут на сервере Timeweb Cloud и доступен по адресу: http://mikarus.ru/