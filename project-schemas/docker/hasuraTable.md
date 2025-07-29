```

CREATE EXTENSION IF NOT EXISTS pgcrypto;
DROP SCHEMA IF EXISTS public7 CASCADE;
CREATE SCHEMA public7;
SET search_path = public7, public;

-- 1. Redmine‑integration tables
CREATE TABLE rm_projects (
id     uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
ext_id integer NOT NULL UNIQUE,
name   text    NOT NULL
);

CREATE TABLE rm_tasks (
id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
ext_id     integer NOT NULL UNIQUE,
name       text    NOT NULL,
status     text    NOT NULL,
project_id uuid    NOT NULL REFERENCES rm_projects(id)
);

-- 2. Инфраструктура
CREATE TABLE providers (
id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name text NOT NULL UNIQUE
);

CREATE TABLE branches (
id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name        text NOT NULL,
provider_id uuid NOT NULL REFERENCES providers(id),
UNIQUE(name,provider_id)
);

CREATE TABLE cities (
id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name      text NOT NULL,
time_zone text NOT NULL,
branch_id uuid NOT NULL REFERENCES branches(id),
UNIQUE(name,branch_id)
);

CREATE TABLE nodes (
id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name    text NOT NULL,
address text,
city_id uuid NOT NULL REFERENCES cities(id),
UNIQUE(name,city_id)
);

-- 3. Вендоры и устройства
CREATE TABLE vendors (
id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name text NOT NULL UNIQUE
);

CREATE TABLE device_models (
id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name      text NOT NULL,
version   text    NOT NULL,
vendor_id uuid    NOT NULL REFERENCES vendors(id),
UNIQUE(name, version, vendor_id)
);

CREATE TABLE device_roles (
id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
role      text NOT NULL,
vendor_id uuid NOT NULL REFERENCES vendors(id),
UNIQUE(role,vendor_id)
);

CREATE TABLE devices (
id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
hostname  text NOT NULL UNIQUE,
node_id   uuid NOT NULL REFERENCES nodes(id),
role_id   uuid NOT NULL REFERENCES device_roles(id),
model_id  uuid NOT NULL REFERENCES device_models(id)
);

-- 4. Пользователи и группы
CREATE TABLE user_groups (
id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
name text NOT NULL UNIQUE
);

CREATE TABLE roles (
id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
role text NOT NULL UNIQUE
);

CREATE TABLE users (
id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
email       text    NOT NULL UNIQUE,
name        text    NOT NULL,
first_name  text    NOT NULL,
middle_name text    NOT NULL,
last_name   text    NOT NULL,
time_zone   text    NOT NULL,
is_active   boolean NOT NULL DEFAULT true,
role_id     uuid    NOT NULL REFERENCES roles(id),
group_id    uuid    NOT NULL REFERENCES user_groups(id)
);

-- 5. Задачи, интервалы и связи
CREATE TABLE time_works (
id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
start_at  timestamptz NOT NULL,
end_at    timestamptz NOT NULL
);

CREATE TABLE planned_tasks (
id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
name         text    NOT NULL UNIQUE,
description  text,
rm_task_id   uuid    NOT NULL REFERENCES rm_tasks(id),
yaml_url     text,
time_work_id uuid    NOT NULL REFERENCES time_works(id),
author_id    uuid    NOT NULL REFERENCES users(id)
);

CREATE TABLE user_planned_tasks (
user_id uuid NOT NULL REFERENCES users(id),
task_id uuid NOT NULL REFERENCES planned_tasks(id),
PRIMARY KEY(user_id,task_id)
);

CREATE TABLE planned_tasks_devices (
task_id      uuid NOT NULL REFERENCES planned_tasks(id),
equipment_id uuid NOT NULL REFERENCES devices(id),
PRIMARY KEY(task_id,equipment_id)
);


-- 6. SEED‑ДАННЫЕ

-- 6.1 Redmine
INSERT INTO rm_projects(ext_id,name) VALUES
(101,'Core Network Upgrade')
ON CONFLICT(ext_id) DO NOTHING;

INSERT INTO rm_tasks(ext_id,name,status,project_id)
SELECT 1001,'Migrate DWDM','Open',id
FROM rm_projects WHERE ext_id=101
ON CONFLICT(ext_id) DO NOTHING;

-- 6.2 Инфраструктура
INSERT INTO providers(name) VALUES ('ООО Ростелеком') ON CONFLICT DO NOTHING;

INSERT INTO branches(name,provider_id)
SELECT 'Московский ф-ал',id FROM providers WHERE name='ООО Ростелеком'
ON CONFLICT DO NOTHING;

INSERT INTO cities(name,time_zone,branch_id)
SELECT 'Moscow','Europe/Moscow',id FROM branches WHERE name='Московский ф-ал'
ON CONFLICT DO NOTHING;

INSERT INTO nodes(name,address,city_id)
SELECT 'МСС-11.4 Москва','ул.Бутлерова, 7',id FROM cities WHERE name='Moscow'
ON CONFLICT DO NOTHING;

-- 6.3 Вендоры и устройства
INSERT INTO vendors(name) VALUES('Cisco'),('Juniper') ON CONFLICT DO NOTHING;

INSERT INTO device_models(name,version,vendor_id)
SELECT 'ASR-903','v1.0',id FROM vendors WHERE name='Cisco'
UNION ALL
SELECT 'MX480','v2.1',id FROM vendors WHERE name='Juniper'
ON CONFLICT(name,version,vendor_id) DO NOTHING;

INSERT INTO device_roles(role,vendor_id)
SELECT 'Edge Router',id FROM vendors WHERE name='Cisco'
UNION ALL
SELECT 'Core Router',id FROM vendors WHERE name='Juniper'
ON CONFLICT DO NOTHING;

INSERT INTO devices(hostname,node_id,role_id,model_id)
SELECT 'edge-01',n.id,dr.id,dm.id
FROM nodes n
JOIN device_roles dr ON dr.role='Edge Router'
JOIN device_models dm ON dm.name='ASR-903' AND dm.version='v1.0'
WHERE n.name='МСС-11.4 Москва'
ON CONFLICT DO NOTHING;

-- 6.4 Пользователи и группы
INSERT INTO user_groups(name) VALUES('Network Engineers'),('Smr Engineers')
ON CONFLICT DO NOTHING;

INSERT INTO roles(role) VALUES('NetworkEngineer'),('SmrEngineer')
ON CONFLICT DO NOTHING;

INSERT INTO users(email,name,first_name,middle_name,last_name,time_zone,is_active,role_id,group_id)
SELECT
'a.ivanov@rtk.service.ru',
'Alex Ivanov',
'Alex','Sergeevich','Ivanov',
'Europe/Moscow',true,
(SELECT id FROM roles WHERE role='SmrEngineer'),
(SELECT id FROM user_groups WHERE name='Network Engineers')
ON CONFLICT(email) DO NOTHING;

-- 6.5 Интервалы
INSERT INTO time_works(start_at,end_at) VALUES
('2025-07-30 02:00+03','2025-07-30 04:00+03')
ON CONFLICT DO NOTHING;

-- 6.6 Плановые задачи
INSERT INTO planned_tasks(name,description,rm_task_id,yaml_url,time_work_id,author_id)
SELECT
'Migrate DWDM Links',
'Switch traffic to backup fibre',
(SELECT id FROM rm_tasks WHERE ext_id=1001),
'https://storage.example.com/tasks/1001.yaml',
(SELECT id FROM time_works LIMIT 1),
(SELECT id FROM users WHERE email='a.ivanov@rtk.service.ru')
ON CONFLICT(name) DO NOTHING;

-- 6.7 Назначения и привязка устройств
INSERT INTO user_planned_tasks(user_id,task_id)
SELECT
(SELECT id FROM users WHERE email='a.ivanov@rtk.service.ru'),
(SELECT id FROM planned_tasks WHERE name='Migrate DWDM Links')
ON CONFLICT DO NOTHING;

INSERT INTO planned_tasks_devices(task_id,equipment_id)
SELECT p.id,d.id
FROM planned_tasks p
JOIN devices d ON d.hostname='edge-01'
WHERE p.name='Migrate DWDM Links'
ON CONFLICT DO NOTHING;
```
