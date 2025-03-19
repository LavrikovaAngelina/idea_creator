INSERT INTO tasks (sample_id, tag_id_1, tag_id_2, tag_id_3)
SELECT 
    s.sample_id, 
    (SELECT tag_id FROM tags WHERE categ_id = s.categ_id_1 ORDER BY RANDOM() LIMIT 1) AS tag_id_1,
    (SELECT tag_id FROM tags WHERE categ_id = s.categ_id_2 ORDER BY RANDOM() LIMIT 1) AS tag_id_2,
    (SELECT tag_id FROM tags WHERE categ_id = s.categ_id_3 ORDER BY RANDOM() LIMIT 1) AS tag_id_3
FROM samples s
WHERE s.sample_id = 1