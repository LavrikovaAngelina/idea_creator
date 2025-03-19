CREATE TABLE IF NOT EXISTS categories (
categ_id SERIAL PRIMARY KEY,
categ_name VARCHAR(50) NOT NULL UNIQUE
)

CREATE TABLE IF NOT EXISTS tags (
tag_id SERIAL PRIMARY KEY,
tag_name VARCHAR(50) NOT NULL UNIQUE,
categ_id INT NOT NULL,
FOREIGN KEY (categ_id) REFERENCES categories (categ_id) ON DELETE RESTRICT 

CREATE TABLE IF NOT EXISTS samples (
sample_id SERIAL PRIMARY KEY,
categ_id_1 INT NOT NULL,
categ_id_2 INT,
categ_id_3 INT,
FOREIGN KEY (categ_id_1) REFERENCES categories (categ_id) ON DELETE RESTRICT,
FOREIGN KEY (categ_id_2) REFERENCES categories (categ_id) ON DELETE RESTRICT,
FOREIGN KEY (categ_id_3) REFERENCES categories (categ_id) ON DELETE RESTRICT
)

CREATE TABLE IF NOT EXISTS tasks (
task_id SERIAL PRIMARY KEY,
sample_id INT NOT NULL,
tag_id_1 INT NOT NULL,
tag_id_2 INT,
tag_id_3 INT,
FOREIGN KEY (sample_id) REFERENCES samples (sample_id) ON DELETE RESTRICT,
FOREIGN KEY (tag_id_1) REFERENCES tags (tag_id) ON DELETE RESTRICT,
FOREIGN KEY (tag_id_2) REFERENCES tags (tag_id) ON DELETE RESTRICT,
FOREIGN KEY (tag_id_3) REFERENCES tags (tag_id) ON DELETE RESTRICT
)

CREATE TABLE IF NOT EXISTS users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE,
user_password VARCHAR(50) NOT NULL,
sample_id INT,
birth_date DATE NOT NULL,
FOREIGN KEY (sample_id) REFERENCES samples (sample_id) ON DELETE SET NULL,

CONSTRAINT check_age CHECK (birth_date <= CURRENT_DATE - INTERVAL '12 years' AND birth_date >= CURRENT_DATE - INTERVAL '100 years')
)

CREATE TABLE IF NOT EXISTS pictures (
picture_id SERIAL PRIMARY KEY,
user_id INT NOT NULL,
picture_URL VARCHAR(100) NOT NULL,
task_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
FOREIGN KEY (task_id) REFERENCES tasks (task_id) ON DELETE RESTRICT
)

