DO $$ BEGIN
 CREATE TYPE english_levels_type AS ENUM('No English', 'Begginner/Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced/Fluent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE language_type AS ENUM('ua', 'en');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE telegram_message_type AS ENUM('phone', 'salary', 'name', 'position', 'company', 'details', 'skills');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE user_role_type AS ENUM('worker', 'employer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE work_experience_in_months_type AS ENUM('0', '6', '12', '18', '24', '30', '36', '48', '60', '72', '84', '96', '108', '120', '-1');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS category (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"translate" JSONB NOT NULL
);

INSERT INTO category
	(name, translate)
VALUES 
	('Розробка', '{"en": "Development"}'),
	('Ще технічне', '{"en": "Still technical"}'),
	('Не технічне', '{"en": "Not technical"}');

CREATE TABLE IF NOT EXISTS category_item (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"translate" JSONB NOT NULL,
	"category_id" INT NOT NULL
);

INSERT INTO category_item
	(name, translate, category_id)
VALUES 
	('C# / .NET', '{"en": "C# / .NET"}', 1),
	('Android', '{"en": "Android"}', 1),
	('C / C++ / Embedded', '{"en": "C / C++ / Embedded"}', 1),
	('Flutter', '{"en": "Flutter"}', 1),
	('Golang', '{"en": "Golang"}', 1),
	('iOS', '{"en": "iOS"}', 1),
	('Java', '{"en": "Java"}', 1),
	('JavaScript / Front-End', '{"en": "JavaScript / Front-End"}', 1),
	('Node.js', '{"en": "Node.js"}', 1),
	('PHP', '{"en": "PHP"}', 1),
	('Python', '{"en": "Python"}', 1),
	('Ruby', '{"en": "Ruby"}', 1),
	('Scala', '{"en": "Scala"}', 1),
	('Business Analyst', '{"en": "Business Analyst"}', 2),
	('Data Science', '{"en": "Data Science"}', 2),
	('Data Analyst', '{"en": "Data Analyst"}', 2),
	('Data Engineer', '{"en": "Data Engineer"}', 2),
	('DevOps', '{"en": "DevOps"}', 2),
	('Дизайнери / UI/UX', '{"en": "Designers / UI/UX"}', 2),
	('2D/3D Artist / Illustrator', '{"en": "2D/3D Artist / Illustrator"}', 2),
	('Gamedev / Unity', '{"en": "Gamedev / Unity"}', 2),
	('Product Manager', '{"en": "Product Manager"}', 2),
	('Project Manager', '{"en": "Project Manager"}', 2),
	('Scrum Master/Agile Coach', '{"en": "Scrum Master/Agile Coach"}', 2),
	('QA Automation', '{"en": "QA Automation"}', 2),
	('QA Manual', '{"en": "QA Manual"}', 2),
	('SQL / DBA', '{"en": "SQL / DBA"}', 2),
	('Security', '{"en": "Security"}', 2),
	('Sysadmin', '{"en": "Sysadmin"}', 2),
	('Lead / Architect / CTO', '{"en": "Lead / Architect / CTO"}', 2),
	('SEO', '{"en": "SEO"}', 2),
	('Маркетинг', '{"en": "Marketing"}', 3),
	('Рекрутери та HR', '{"en": "Recruiters and HR"}', 3),
	('Продажі', '{"en": "Sales"}', 3),
	('Підтримка', '{"en": "Support"}', 3),
	('Технічне письмо', '{"en": "Technical Writing"}', 3),
	('Lead Generation', '{"en": "Lead Generation"}', 3),
	('(Інші)', '{"en": "(Other)"}', 3);

CREATE TABLE IF NOT EXISTS employers (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"position" character varying NOT NULL,
	"company" character varying NOT NULL,
	"phone" character varying NOT NULL,
	"telegram_user_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS employment_options_to_workers (
	"employer_id" INT NOT NULL,
	"employment_options_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS employment_options (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"translate" JSONB NOT NULL
);

INSERT INTO employment_options
	(name, translate)
VALUES 
	('Віддалена робота', '{"en": "Remote work"}'),
	('Офіс', '{"en": "Office"}'),
	('Part-time', '{"en": "Part-time"}'),
	('Фріланс (разові проекти)', '{"en": "Freelance (one-off projects)"}'),
	('Переїзд в інше місто', '{"en": "Moving to another city"}'),
	('Relocate до США чи Європи', '{"en": "Relocate to the US or Europe"}');

CREATE TABLE IF NOT EXISTS telegram_messages (
	"message_id" character varying NOT NULL,
	"chat_id" character varying NOT NULL,
	"user_id" character varying NOT NULL,
	"temporary_user_id" INT NOT NULL,
	"telegram_message_type" telegram_message_type NOT NULL
);

CREATE TABLE IF NOT EXISTS telegram (
	"id" SERIAL PRIMARY KEY,
	"username" character varying NOT NULL,
	"user_id" character varying NOT NULL,
	"language_type" language_type NOT NULL
);

CREATE TABLE IF NOT EXISTS temporary_user (
	"id" SERIAL PRIMARY KEY,
	"user" JSONB NOT NULL,
	"created_at" timestamp without time zone NOT NULL,
	"telegram_user_id" INT NOT NULL,
	"user_role" user_role_type NOT NULL,
	"is_edit" boolean NOT NULL,
	"is_final" SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS workers (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"category_item_id" INT NOT NULL,
	"work_experience" work_experience_in_months_type,
	"expected_salary" INT NOT NULL,
	"position" character varying NOT NULL,
	"english_levels" english_levels_type NOT NULL,
	"skills" JSONB,
	"work_experience_details" character varying,
	"telegram_user_id" INT NOT NULL
);

DO $$ BEGIN
ALTER TABLE category_item ADD CONSTRAINT category_item_category_id_fkey FOREIGN KEY ("category_id") REFERENCES category(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE employers ADD CONSTRAINT employers_telegram_user_id_fkey FOREIGN KEY ("telegram_user_id") REFERENCES telegram(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE employment_options_to_workers ADD CONSTRAINT employment_options_to_workers_employer_id_fkey FOREIGN KEY ("employer_id") REFERENCES workers(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE employment_options_to_workers ADD CONSTRAINT employment_options_to_workers_employment_options_id_fkey FOREIGN KEY ("employment_options_id") REFERENCES employment_options(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE telegram_messages ADD CONSTRAINT telegram_messages_temporary_user_id_fkey FOREIGN KEY ("temporary_user_id") REFERENCES temporary_user(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE temporary_user ADD CONSTRAINT temporary_user_telegram_user_id_fkey FOREIGN KEY ("telegram_user_id") REFERENCES telegram(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE workers ADD CONSTRAINT workers_category_item_id_fkey FOREIGN KEY ("category_item_id") REFERENCES category_item(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE workers ADD CONSTRAINT workers_telegram_user_id_fkey FOREIGN KEY ("telegram_user_id") REFERENCES telegram(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS employment_options_to_workers_employer_id_employment_options_id_index ON employment_options_to_workers (employer_id, employment_options_id);