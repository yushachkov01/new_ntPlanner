1. **Клонировать nt-6827**

2. **Установить зависимости:**
   ```bash
   npm install
   ```
3. **Запустить dev‑сервер:**
   ```bash
   npm run start
   # или npm run dev
   ```
   **Открыть в браузере:**
   ```
   http://localhost:5173
   ```
4. **Запустить docker:**
   ```
   docker compose up -d
   ```
5. **Скачать и запустить контейнер на портах 9000 (API), 9001 (консоль)**
   ```
   docker run -d --name minio \
   -p 9000:9000 -p 9001:9001 \
   -e "MINIO_ROOT_USER=admin" \
   -e "MINIO_ROOT_PASSWORD=secretpassword" \
   -v /mnt/data/minio/data:/data \
   -v /mnt/data/minio/config:/root/.minio \
   minio/minio server /data --console-address ":9001"
   ```
6. **запуск**
   ```
   docker start minio
   ```
   **Если нужно его перезапустить, можно выполнить команду:**
   ```
   docker restart minio
   ```
   **После этого minio поднимется на порту (9000, 9001).**
   ```
   http://localhost:9001
   Username: admin
   Password: secretpassword
   ```
7. **Хасура**

7.1 **Таблица «планируемые работы»**
   ```
   CREATE TABLE public.planned_tasks (
   id          serial PRIMARY KEY,
   name        text  NOT NULL,              
   time_work   text,                       
   rm          text,                      
   rd          text,                        
   project     text,
   description text,
   equipment   text,
   );
   ```

**Cоздаем тестовые 3 записи**
   ```
   INSERT INTO public.planned_tasks
   (name,time_work,rm,rd,project,description,equipment,role,author) VALUES
   ('Переключение связей с переиспользованием ВО',
   '02:00-04:00',
   'https://redmine.local/123',
   'https://rd.local/123',
   'Миграция КРС-45',
   'Отключаем старую схему и включаем резерв',
   'ASR-903, DWDM'),
   
   ('Обновление ПО ядра сети',
   '04:10-05:30',
   'https://redmine.local/124',
   'https://rd.local/124',
   'Core-Upgrade',
   'Загрузка образа, резерв, откатная проверка',
   'NCS-540'),

   ('Тест канала DWDM после переключения',
   '05:30-06:00',
   'https://redmine.local/125',
   'https://rd.local/125',
   'DWDM-QA',
   'проверка ошибок ',
   'OTDR-34');
   ```
7.2 **Таблица с площадкой**
   ```
   CREATE TABLE IF NOT EXISTS public.locations (
   id       serial PRIMARY KEY,
   provider text    NOT NULL,
   branch   text    NOT NULL,
   city     text    NOT NULL,
   street   text    NOT NULL
   );
   ```
**Создаем тестовую запись**
   ```
   INSERT INTO public.locations (provider, branch, city, street)
   VALUES ('ПАО "Ростелеком"', 'Курганский ф‑ал', 'г.Курган', 'ул.Советская,45');
   ```
7.3 **user**
   ```
   CREATE TABLE public.users (
   id     SERIAL PRIMARY KEY,
   role   text NOT NULL,
   author text NOT NULL
   );
   ```
**Создаем тестовую запись**
   ```
   INSERT INTO public.users (role, author)
   VALUES ('сетевой инженер', 'Сидоров С.С.');
   ```
7.4 **Cписок всех исполнителей кого можно добавить ( Executors )**
   ```
   CREATE TABLE public.executor (
   id     SERIAL PRIMARY KEY,
   role   TEXT NOT NULL,  
   author TEXT NOT NULL  
   );
   ```
**Тестовые данные**
   ```
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
**Подключение к hasura:**
   ```
   shared/minio/MinioClient.ts
   ```
**Подключение к Hasura:**
   ```
   shared/lib/graphql/client.ts
   ```
