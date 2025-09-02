# Запуск проекта nt-6827-3

## 1. Клонировать nt-6827-3

## 2. Установить зависимости

```bash
npm install
```

- Eсли появляется ошибка с сертификатами - отключить проверку (не желательно)

```
npm config set strict-ssl false
```

- И потом обязательно включить ее обратно!

```
npm config set strict-ssl true
```

## 2.1 Собрать проект

```bash
npm run build
```

## 3. Запустить dev‑сервер

```bash
npm run start
# или
npm run dev
```

Открыть в браузере:

```
http://localhost:5173
```

---

---

## 4. Поднимаем Hasura, minio и nginx и закидываем данные

```bash
docker compose up -d
```

Открыть Hasura:

```
http://localhost:8080
```

Admin Secret для Hasura:

```
myadminsecretkey
```

## 5. Поднимаем MINIO

Открыть консоль:

```
http://localhost:9001
```

```
Username: admin,
Password: secretpassword
```

Загрузить тестовые yaml файлы, которые находятся: `project-schemas/docker/yaml`

---

## 6. Hasura. Таблица с planned_tasks

```sql
CREATE TABLE public.planned_tasks (
  id serial PRIMARY KEY,
  name text NOT NULL,
  time_work text,
  rm text,
  rd text,
  project text,
  description text,
  equipment text,
  role text,
  author text
);
```

### Тестовые данные

```sql
INSERT INTO public.planned_tasks
(name,time_work,rm,rd,project,description,equipment,role,author) VALUES
('Переключение связей с переиспользованием ВО',
 '02:00-04:00',
 'https://redmine.local/123',
 'https://rd.local/123',
 'Миграция КРС-45',
 'Отключаем старую схему и включаем резерв',
 'ASR-903, DWDM',
 'Сетевой инженер',
 'Иванов А.А.'),

('Обновление ПО ядра сети',
 '04:10-05:30',
 'https://redmine.local/124',
 'https://rd.local/124',
 'Core-Upgrade',
 'Загрузка образа, резерв, откатная проверка',
 'NCS-540',
 'Сетевой инженер',
 'Петров В.Б.'),

('Тест канала DWDM после переключения',
 '05:30-06:00',
 'https://redmine.local/125',
 'https://rd.local/125',
 'DWDM-QA',
 'BER-test 10G; проверка ошибок в syslog',
 'OTDR AQ7280',
 'Сетевой инженер',
 'Сидоров С.А.');
```

---

## 7. Таблица с locations

```sql
CREATE TABLE public.locations (
  id serial PRIMARY KEY,
  provider text,
  branch text,
  city text,
  street text
);
```

### Тестовые данные

```sql
INSERT INTO public.locations (provider, branch, city, street)
VALUES
  ('ПАО "Ростелеком"', 'Курганский филиал', 'г. Курган', 'ул. Советская, 45');
```

---

## 8. Таблица с users

```sql
CREATE TABLE public.users (
  id serial PRIMARY KEY,
  role text,
  author text
);
```

### Тестовые данные

```sql
INSERT INTO public.users (role, author)
VALUES
  ('Сетевой инженер', 'Иванов А.А.');
```

---

## 9. Список всех исполнителей кого можно добавить (Executors)

```sql
CREATE TABLE public.executor (
id     SERIAL PRIMARY KEY,
role   TEXT NOT NULL,
author TEXT NOT NULL
);
```

### Тестовые данные

```sql
INSERT INTO public.executor (role, author) VALUES
-- сетевые
('Сетевой инженер','Сидоров С.А.'),
('Сетевой инженер','Иванова Л.М.'),
('Сетевой инженер','Кузнецов Д.Г.'),
('Сетевой инженер','Николенко В.В.'),
('Сетевой инженер','Ким А.Н.'),
-- смр
('Инженер СМР','Петрова И.С.'),
('Инженер СМР','Сергеев Р.А.'),
('Инженер СМР','Горбунов Б.П.'),
('Инженер СМР','Добрынин Е.В.'),
('Инженер СМР','Мельник Т.Г.');
```

---

## загрузить тестовые yaml файлы

Файлы находятся в директории:

```
project-schemas/docker/yaml
```

---

При сборке проекта важно указать .env

VITE_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
VITE_HASURA_ADMIN_SECRET=myadminsecretkey
VITE_IFACE_WS_URL=ws://localhost:4000

---

Чтобы запустить ws сервер, необходимо написать
`docker compose up -d`,
либо же можно отдельно поднять ws-service
`docker compose up -d ws-service`
