# Схема данных

```mermaid
erDiagram
    PROVIDERS {
        uuid   id   "Первичный ключ"
        string name "Имя провайдера"
    }

    BRANCHES {
        uuid   id          "Первичный ключ"
        string name        "Филиал"
        uuid   provider_id "→ PROVIDERS.id"
    }

    CITIES {
        uuid   id        "Первичный ключ"
        string name      "Город"
        uuid   branch_id "→ BRANCHES.id"
    }

    NODES {
        uuid   id      "Первичный ключ"
        string name    "Название узла"
        string address "Адрес"
        uuid   city_id "→ CITIES.id"
    }

    EQUIPMENTS {
        uuid   id       "Первичный ключ"
        string hostname "Наименование оборудования"
        uuid   node_id  "→ NODES.id"
    }

    PLANNED_TASKS {
        uuid   id          "Первичный ключ"
        string name        "Название задачи"
        string description "Описание"
        string project     "Проект"
        string rm          "Redmine"
        string rd          "Rd"
        uuid   author_id   "→ USERS.id"
    }

    TIME_WORKS {
        uuid   id       "Первичный ключ"
        uuid   task_id  "→ PLANNED_TASKS.id"
        string time_work "Интервал"
    }

    USERS {
        uuid   id      "Первичный ключ"
        string email   "Адрес электронной почты"
        string name    "Отображаемое имя"
        uuid   role_id "→ ROLES.id"
    }

    ROLES {
        uuid   id   "Первичный ключ"
        string role "Роль"
    }

    USER_PLANNED_TASKS {
        uuid user_id "→ USERS.id"
        uuid task_id "→ PLANNED_TASKS.id"
    }

    PLANNED_TASKS_EQUIPMENTS {
        uuid task_id      "→ PLANNED_TASKS.id"
        uuid equipment_id "→ EQUIPMENTS.id"
    }

    PROVIDERS   ||--o{ BRANCHES                  : has
    BRANCHES    ||--o{ CITIES                    : has
    CITIES      ||--o{ NODES                     : has
    NODES       ||--o{ EQUIPMENTS                : hosts

    ROLES       ||--o{ USERS                     : has
    USERS       ||--o{ PLANNED_TASKS             : author

    PLANNED_TASKS ||--o{ TIME_WORKS              : has

    %% N:M «пользователи ↔ задачи»
    USERS          ||--o{ USER_PLANNED_TASKS     : assigned
    PLANNED_TASKS  ||--o{ USER_PLANNED_TASKS     : includes

    %% N:M «задачи ↔ оборудование»
    PLANNED_TASKS  ||--o{ PLANNED_TASKS_EQUIPMENTS : needs
    EQUIPMENTS     ||--o{ PLANNED_TASKS_EQUIPMENTS : partOf


```

---

- Одна задача (PLANNED_TASK.task_id) может иметь множество записей времени (TIME_WORK.time_work_id).\*

---

- Одна задача (PLANNED_TASK.task_id) может иметь множество оборудования (EQUIPMENT.equipment_id).

---

- Один провайдер (PROVIDER.provider_id) может иметь множество филиалов (BRANCH.branch_id).

---

- Один провайдер (PROVIDER.provider_id) может иметь множество оборудования (EQUIPMENT.equipment_id).

---

- Один филиал (BRANCH.branch_id) может иметь множество городов (CITY.city_id).

---

- Один филиал (BRANCH.branch_id) может иметь множество оборудования (EQUIPMENT.equipment_id).

---

- Один город (CITY.city_id) может иметь множество локаций (улиц) (LOCATION.street_id).

---

- Один город (CITY.city_id) может иметь множество оборудования (EQUIPMENT.equipment_id).

---

- Одна локация (улица) (LOCATION.street_id) может иметь множество оборудования (EQUIPMENT.equipment_id).

---

- Одна роль (ROLE.role) может быть у множества пользователей (USER.number).

---

- Одна роль (ROLE.role) может быть связана с множеством задач (PLANNED_TASK.task_id).

---

- Один пользователь (USER.number) может иметь множество задач (PLANNED_TASK.task_id).
