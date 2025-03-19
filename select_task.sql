SELECT 
    t1.tag_name AS tag_name_1, 
    t2.tag_name AS tag_name_2, 
    t3.tag_name AS tag_name_3
FROM tasks
LEFT JOIN tags t1 ON tasks.tag_id_1 = t1.tag_id
LEFT JOIN tags t2 ON tasks.tag_id_2 = t2.tag_id
LEFT JOIN tags t3 ON tasks.tag_id_3 = t3.tag_id