with users_tasks as (
select task_id
from pictures
where user_id = 1
)

select picture_URL
from pictures
where task_id in (select task_id from users_tasks)