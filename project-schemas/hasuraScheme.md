# Схема данных

```mermaid
erDiagram
RM_PROJECTS {
uuid   id       "Первичный ключ"
int    ext_id   "Внешний ID из Redmine"
string name     "Название проекта"
}

    RM_TASKS {
        uuid   id        "Первичный ключ"
        int    ext_id    "Внешний ID из Redmine"
        string name      "название задачи"
        string status    "Статус задачи в Redmine"
        uuid   project_id "RM_PROJECTS.id — проект"
    }

    PROVIDERS {
        uuid   id      "Первичный ключ"
        string name    "Имя провайдера"
    }

    BRANCHES {
        uuid   id          "Первичный ключ"
        string name        "Название филиала"
        uuid   provider_id "PROVIDERS.id — провайдер"
    }

    CITIES {
        uuid   id          "Первичный ключ"
        string name        "Название города"
        string time_zone   "Часовой пояс"
        uuid   branch_id   "BRANCHES.id — филиал"
    }

    NODES {
        uuid   id        "Первичный ключ"
        string name      "Название узла"
        string address   "Адрес"
        uuid   city_id   "CITIES.id — город"
    }

    EQUIPMENTS {
        uuid   id        "Первичный ключ"
        string hostname  "Наименование оборудования"
        uuid   node_id   "NODES.id — узел"
    }

    ROLES {
        uuid   id    "Первичный ключ"
        string role  "Системное имя роли"
    }

    USERS {
        uuid   id           "Первичный ключ"
        string email        "Адрес электронной почты"
        string name         "Отображаемое имя"
        string time_zone    "Часовой пояс"
        bool   is_active    "Активен?"
        uuid   role_id      "ROLES.id — роль"
    }

    PLANNED_TASKS {
        uuid   id            "Первичный ключ"
        string name          "Название"
        string description   "Описание"
        uuid   rm_task_id    "RM_TASKS.id"
        string yaml_url      "URL YAML‑файла"
        uuid   time_work_id " TIME_WORKS.id — интервал"
        uuid   author_id     "USERS.id — автор"
    }

    TIME_WORKS {
        uuid        id        "Первичный ключ"
        timestamptz start_at  "Время начала"
        timestamptz end_at    "Время окончания"
    }

    USER_PLANNED_TASKS {
        uuid user_id "USERS.id — инженер"
        uuid task_id "PLANNED_TASKS.id — задача"
    }

    PLANNED_TASKS_EQUIPMENTS {
        uuid task_id      "PLANNED_TASKS.id — задача"
        uuid equipment_id "EQUIPMENTS.id — оборудование"
    }

    PROVIDERS     ||--o{ BRANCHES      : has
    BRANCHES      ||--o{ CITIES        : has
    CITIES        ||--o{ NODES         : has
    NODES         ||--o{ EQUIPMENTS    : hosts

    ROLES         ||--o{ USERS         : has
    USERS         ||--o{ PLANNED_TASKS : author

    TIME_WORKS ||--o{ PLANNED_TASKS    : interval

    USERS         ||--o{ USER_PLANNED_TASKS       : assigned
    PLANNED_TASKS ||--o{ USER_PLANNED_TASKS       : includes

    PLANNED_TASKS ||--o{ PLANNED_TASKS_EQUIPMENTS : needs
    EQUIPMENTS    ||--o{ PLANNED_TASKS_EQUIPMENTS : partOf

    RM_PROJECTS   ||--o{ RM_TASKS      : has
    RM_PROJECTS   ||--o{ PLANNED_TASKS : project
    RM_TASKS      ||--o{ PLANNED_TASKS : ticket

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
