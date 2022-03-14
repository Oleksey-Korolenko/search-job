DO $$ BEGIN
 CREATE TYPE english_levels_type AS ENUM('No English', 'Begginner/Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced/Fluent');
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

CREATE TABLE IF NOT EXISTS category_item (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"translate" JSONB NOT NULL,
	"category_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS cities_to_users (
	"worker_id" INT NOT NULL,
	"city_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS city (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"translate" JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS employers (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"position" character varying NOT NULL,
	"company" character varying NOT NULL,
	"is_uses_root_telegram_acc" boolean,
	"extra_telegram_acc" character varying,
	"phone" character varying NOT NULL,
	"telegram_user_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS employment_options_to_workers (
	"employer_id" INT NOT NULL,
	"employment_options_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS empoyment_options (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"translate" JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS skills_to_workers (
	"worker_id" INT NOT NULL,
	"skill_id" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL,
	"translate" JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS telegram (
	"id" SERIAL PRIMARY KEY,
	"name" character varying NOT NULL
);

CREATE TABLE IF NOT EXISTS workers (
	"id" SERIAL PRIMARY KEY,
	"category_item_id" INT NOT NULL,
	"work_experience" work_experience_in_months_type,
	"expected_salary" INT NOT NULL,
	"position" character varying NOT NULL,
	"english_levels" english_levels_type,
	"work_experience_details" character varying,
	"telegram_user_id" INT NOT NULL
);

DO $$ BEGIN
ALTER TABLE category_item ADD CONSTRAINT category_item_category_id_fkey FOREIGN KEY ("category_id") REFERENCES category(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE cities_to_users ADD CONSTRAINT cities_to_users_worker_id_fkey FOREIGN KEY ("worker_id") REFERENCES workers(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE cities_to_users ADD CONSTRAINT cities_to_users_city_id_fkey FOREIGN KEY ("city_id") REFERENCES city(id);
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
ALTER TABLE employment_options_to_workers ADD CONSTRAINT employment_options_to_workers_employment_options_id_fkey FOREIGN KEY ("employment_options_id") REFERENCES empoyment_options(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE skills_to_workers ADD CONSTRAINT skills_to_workers_worker_id_fkey FOREIGN KEY ("worker_id") REFERENCES workers(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
ALTER TABLE skills_to_workers ADD CONSTRAINT skills_to_workers_skill_id_fkey FOREIGN KEY ("skill_id") REFERENCES skills(id);
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

CREATE UNIQUE INDEX IF NOT EXISTS cities_to_users_worker_id_city_id_index ON cities_to_users (worker_id, city_id);
CREATE UNIQUE INDEX IF NOT EXISTS employment_options_to_workers_employer_id_employment_options_id_index ON employment_options_to_workers (employer_id, employment_options_id);
CREATE UNIQUE INDEX IF NOT EXISTS skills_to_workers_worker_id_skill_id_index ON skills_to_workers (worker_id, skill_id);