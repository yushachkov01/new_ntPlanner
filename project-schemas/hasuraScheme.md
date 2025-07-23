# Схема данных

```mermaid
erDiagram
    PLANNED_TASK {
        uuid task_id      "ID задачи"
        string name         "Название"
        string description  "Описание"
        string project      "Проект"
        string rm           "Redmine"
        string rd           "Rd"
    }

    TIME_WORK {
        uuid time_work_id "ID записи"
        uuid task_id      "→ PLANNED_TASK.task_id"
        string time_work    "Интервал "
    }

    EQUIPMENT {
        uuid equipment_id "ID оборудования"
        uuid task_id      "→ PLANNED_TASK.task_id"
        string name         "Наименование оборудования"
    }

    %% связи «1 ко многим»
    PLANNED_TASK ||--o{ TIME_WORK : has
    PLANNED_TASK ||--o{ EQUIPMENT : uses
    EQUIPMENT ||--o{ PLANNED_TASK : has


    PROVIDER {
        string provider_id    "Имя провайдера (PK)"
    }

    BRANCH {
        string branch_id      "Филиал (PK)"
        uuid provider_id    "→ PROVIDER.provider_id"
    }

    CITY {
        string city_id        "Город (PK)"
        uuid branch_id      "→ BRANCH.branch_id"
    }

    LOCATION {
        string street_id      "Улица (PK)"
        uuid city_id        "→ CITY.city_id"
    }
    EQUIPMENT {
    uuid equipment_id
    string name              "Наименование оборудования"
    }

    %% связи «1 ко многим»
    PROVIDER ||--o{ BRANCH : has
    PROVIDER ||--o{ EQUIPMENT : has
    BRANCH   ||--o{ CITY   : has
    BRANCH   ||--o{ EQUIPMENT   : has
    CITY     ||--o{ LOCATION : has
    CITY     ||--o{ EQUIPMENT : has
    LOCATION   ||--o{ EQUIPMENT : has



    USER {
        uuid number "Первичный ключ"
        email string "Адрес электронной почты"
        name string "Отображаемое имя"
        role_name string "→ ROLE.role"
    }

    ROLE {
        role string "Роль"
    }

    %% связь «1 ROLE ко многим USER»
    ROLE ||--o{ USER : has
    ROLE ||--o{ PLANNED_TASK : has
    USER ||--o{ PLANNED_TASK : has
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
