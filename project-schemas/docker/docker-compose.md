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

## 6. Hasura. Все таблицы и тестовые данные

```sql
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- для gen_random_uuid()

-- Сносим старые таблицы (если есть)
DROP TABLE IF EXISTS public.query CASCADE;
DROP TABLE IF EXISTS public.planned_tasks_devices CASCADE;
DROP TABLE IF EXISTS public.user_planned_tasks CASCADE;
DROP TABLE IF EXISTS public.planned_tasks CASCADE;
DROP TABLE IF EXISTS public.devices CASCADE;
DROP TABLE IF EXISTS public.nodes CASCADE;
DROP TABLE IF EXISTS public.device_roles CASCADE;
DROP TABLE IF EXISTS public.device_models CASCADE;
DROP TABLE IF EXISTS public.cities CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.user_groups CASCADE;
DROP TABLE IF EXISTS public.rm_tasks CASCADE;
DROP TABLE IF EXISTS public.rm_projects CASCADE;
DROP TABLE IF EXISTS public.time_works CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.providers CASCADE;

-- Таблицы
CREATE TABLE public.providers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL);
CREATE TABLE public.vendors   (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL);
CREATE TABLE public.user_groups (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL);
CREATE TABLE public.roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), role text NOT NULL);

CREATE TABLE public.rm_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ext_id integer,
  name text NOT NULL
);

CREATE TABLE public.rm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ext_id integer,
  name text NOT NULL,
  status text,
  project_id uuid REFERENCES public.rm_projects(id) ON DELETE SET NULL
);

CREATE TABLE public.time_works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_at timestamptz,
  end_at timestamptz
);

CREATE TABLE public.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE RESTRICT
);

CREATE TABLE public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  time_zone text NOT NULL,
  branch_id uuid NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT
);

CREATE TABLE public.nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT
);

CREATE TABLE public.device_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  version text NOT NULL,
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT
);

CREATE TABLE public.device_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT
);

CREATE TABLE public.devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hostname text NOT NULL,
  node_id uuid NOT NULL REFERENCES public.nodes(id) ON DELETE RESTRICT,
  role_id uuid NOT NULL REFERENCES public.device_roles(id) ON DELETE RESTRICT,
  model_id uuid NOT NULL REFERENCES public.device_models(id) ON DELETE RESTRICT
);

CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  name text,
  first_name text,
  last_name text,
  middle_name text,
  time_zone text,
  is_active boolean,
  role_id uuid REFERENCES public.roles(id) ON DELETE SET NULL,
  group_id uuid REFERENCES public.user_groups(id) ON DELETE SET NULL,
  team_lead_id uuid REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE public.planned_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  rm_task_id uuid REFERENCES public.rm_tasks(id) ON DELETE SET NULL,
  yaml_url text,
  time_work_id uuid REFERENCES public.time_works(id) ON DELETE SET NULL,
  author_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.rm_projects(id) ON DELETE SET NULL,
  status text
);

CREATE TABLE public.user_planned_tasks (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.planned_tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, task_id)
);

CREATE TABLE public.planned_tasks_devices (
  task_id uuid NOT NULL REFERENCES public.planned_tasks(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, equipment_id)
);

CREATE TABLE public.query (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  request_type text NOT NULL,
  status text NOT NULL,
  result jsonb,
  received_at timestamptz NOT NULL
);

-- Индексы
CREATE INDEX ON public.branches(provider_id);
CREATE INDEX ON public.cities(branch_id);
CREATE INDEX ON public.nodes(city_id);
CREATE INDEX ON public.device_models(vendor_id);
CREATE INDEX ON public.device_roles(vendor_id);
CREATE INDEX ON public.devices(node_id);
CREATE INDEX ON public.devices(role_id);
CREATE INDEX ON public.devices(model_id);
CREATE INDEX ON public.users(role_id);
CREATE INDEX ON public.users(group_id);
CREATE INDEX ON public.users(team_lead_id);
CREATE INDEX ON public.rm_tasks(project_id);
CREATE INDEX ON public.planned_tasks(rm_task_id);
CREATE INDEX ON public.planned_tasks(project_id);
CREATE INDEX ON public.planned_tasks(time_work_id);
CREATE INDEX ON public.planned_tasks(author_id);

COMMIT;
```

### Тестовые данные

```sql
BEGIN;

-- Провайдеры
INSERT INTO public.providers (name) VALUES
('ООО Ростелеком');

--  Вендоры
INSERT INTO public.vendors (name) VALUES
('Cisco'),
('Juniper');

--  Роли
INSERT INTO public.roles (role) VALUES
('Сетевой инженер'),
('Инженер СМР'),
('Представитель Заказчика'),
('Тимлид');

--  Группы пользователей
INSERT INTO public.user_groups (name) VALUES
('Network Engineers'),
('Smr Engineers'),
('Admins');

-- Проекты RM
INSERT INTO public.rm_projects (ext_id, name) VALUES
(101,'Core Network Upgrade');

-- RM задачи
INSERT INTO public.rm_tasks (ext_id, name, status, project_id) VALUES
(1001,'Migrate DWDM Links','Open',(SELECT id FROM public.rm_projects WHERE name='Core Network Upgrade'));

--  Рабочие окна
INSERT INTO public.time_works (start_at, end_at) VALUES
('2025-07-29T01:00:00+00','2025-07-30T03:00:00+00');

-- Филиалы
INSERT INTO public.branches (name, provider_id) VALUES
('Московский ф-л',(SELECT id FROM public.providers WHERE name='ООО Ростелеком'));

--  Города
INSERT INTO public.cities (name, time_zone, branch_id) VALUES
('Москва','Europe/Moscow',(SELECT id FROM public.branches WHERE name='Московский ф-л'));

-- Узлы
INSERT INTO public.nodes (name, address, city_id) VALUES
('МСС-11.4 Москва','ул.Бутлерова, 7',(SELECT id FROM public.cities WHERE name='Москва'));

--  Модели устройств
INSERT INTO public.device_models (name, version, vendor_id) VALUES
('ASR-903','v1.0',(SELECT id FROM public.vendors WHERE name='Cisco')),
('MX480','v2.1',(SELECT id FROM public.vendors WHERE name='Juniper'));

-- Роли устройств
INSERT INTO public.device_roles (role, vendor_id) VALUES
('Edge Router',(SELECT id FROM public.vendors WHERE name='Cisco')),
('Core Router',(SELECT id FROM public.vendors WHERE name='Juniper'));

-- Устройства
INSERT INTO public.devices (hostname, node_id, role_id, model_id) VALUES
('edge-02',
 (SELECT id FROM public.nodes WHERE name='МСС-11.4 Москва'),
 (SELECT id FROM public.device_roles WHERE role='Edge Router'),
 (SELECT id FROM public.device_models WHERE name='ASR-903')
),
('edge-01',
 (SELECT id FROM public.nodes WHERE name='МСС-11.4 Москва'),
 (SELECT id FROM public.device_roles WHERE role='Edge Router'),
 (SELECT id FROM public.device_models WHERE name='ASR-903')
),
('core-02',
 (SELECT id FROM public.nodes WHERE name='МСС-11.4 Москва'),
 (SELECT id FROM public.device_roles WHERE role='Core Router'),
 (SELECT id FROM public.device_models WHERE name='MX480')
);

--  Пользователи
INSERT INTO public.users (email,name,first_name,middle_name,last_name,time_zone,is_active,role_id,group_id,team_lead_id) VALUES
('teamlead@customer.ru','Иванов И.И','Иван','Иванович','Иванов','Europe/Moscow',true,
 (SELECT id FROM public.roles WHERE role='Тимлид'),
 (SELECT id FROM public.user_groups WHERE name='Admins'),
 NULL
),
('z.ivanov@customer.ru','Володин А.К.','Андрей','Константинович','Володин','Europe/Moscow',true,
 (SELECT id FROM public.roles WHERE role='Представитель Заказчика'),
 (SELECT id FROM public.user_groups WHERE name='Admins'),
 NULL
),
('a.ovechkin@rtk.service.ru','Овечкин А.И','Александр','Иванович','Овечкин','Europe/Moscow',true,
 (SELECT id FROM public.roles WHERE role='Сетевой инженер'),
 (SELECT id FROM public.user_groups WHERE name='Network Engineers'),
 (SELECT id FROM public.users WHERE email='teamlead@customer.ru')
);

--  Planned Tasks
INSERT INTO public.planned_tasks (name,description,rm_task_id,yaml_url,time_work_id,author_id,project_id,status) VALUES
('Migrate DWDM Links (2)','Переключение линков',
 (SELECT id FROM public.rm_tasks WHERE name='Migrate DWDM Links'),
 'template-2.yaml',
 (SELECT id FROM public.time_works LIMIT 1),
 (SELECT id FROM public.users WHERE email='a.ovechkin@rtk.service.ru'),
 (SELECT id FROM public.rm_projects WHERE name='Core Network Upgrade'),
 'on_review'
);

--  Привязка юзеров к задачам
INSERT INTO public.user_planned_tasks (user_id, task_id) VALUES
((SELECT id FROM public.users WHERE email='a.ovechkin@rtk.service.ru'),
 (SELECT id FROM public.planned_tasks WHERE name='Migrate DWDM Links (2)'));

--  Привязка устройств к задачам
INSERT INTO public.planned_tasks_devices (task_id, equipment_id) VALUES
((SELECT id FROM public.planned_tasks WHERE name='Migrate DWDM Links (2)'),
 (SELECT id FROM public.devices WHERE hostname='edge-01'));

--  Query результаты
INSERT INTO public.query (device, request_type, status, result, received_at) VALUES
((SELECT id FROM public.devices WHERE hostname='edge-01'),'interface','ok','{"interfaces":["ge-0/0/02","ge-0/0/80","xe-0/0/0"]}','2025-08-14T13:21:33.56218+00'),
((SELECT id FROM public.devices WHERE hostname='core-02'),'interface','ok','{"interfaces":["ge-0/0/0","ge-0/0/22"]}','2025-08-14T12:58:33.56218+00');

COMMIT;

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
VITE_WS_URL=ws://localhost:4000
VITE_MINIO_ENDPOINT=http://localhost:9000
VITE_MINIO_ACCESS=admin

VITE_MINIO_SECRET=secretpassword

---

Чтобы запустить ws сервер, необходимо написать
`docker compose up -d`,
либо же можно отдельно поднять ws-service
`docker compose up -d ws-service`
