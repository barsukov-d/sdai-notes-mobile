# Заметки команды — мобильное приложение

Тестовый проект для демо self-developer-ai: мобильное приложение (Expo / React Native, Android и iOS из одного кода) и API к нему в одном репозитории.
Веб-версия сервиса — [sdai-notes-web](https://github.com/barsukov-d/sdai-notes-web), другой API — [sdai-notes-api](https://github.com/barsukov-d/sdai-notes-api).

## Что внутри

| Папка | Что это |
|---|---|
| `apps/mobile` | приложение «Заметки»: список, отметка «сделано», подвал «Сделано N из M» |
| `apps/api` | сервер заметок (express), заметки хранятся в памяти |

## Запуск

```bash
pnpm install
pnpm --filter @notes/api start      # http://0.0.0.0:3000, порт меняется переменной PORT
pnpm --filter @notes/mobile start   # Expo; адрес API — EXPO_PUBLIC_API_URL (по умолчанию http://localhost:3000)
pnpm test
```

## Проверка базы

`GET /health/db`: без `DATABASE_URL` отвечает `{"db":"нет базы"}`; с ней читает `select marker from probe limit 1` и отвечает `{"db":"подключено","marker":…}` (или `{"db":"ошибка"}`). Секретов в репозитории нет.
