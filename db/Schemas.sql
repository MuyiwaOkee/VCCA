CREATE TABLE "analytics_periods" (
  "id" uuid PRIMARY KEY,
  "name" varchar(10) UNIQUE NOT NULL
);

CREATE TABLE "analytics_palette" (
  "id" uuid PRIMARY KEY,
  "strokeHex" varchar(7) UNIQUE NOT NULL,
  "fillHex" varchar(7) UNIQUE NOT NULL
);

CREATE TABLE "analytics_categories" (
  "id" uuid PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "displayOrder" integer UNIQUE NOT NULL
);

CREATE TABLE "analytics_sector" (
  "id" uuid PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "displayOrder" integer NOT NULL
);

CREATE TABLE "analytics_source" (
  "id" uuid PRIMARY KEY,
  "category" uuid NOT NULL,
  "sector" uuid,
  "country_iso_code" char(3) NOT NULL,
  "value_is_percent" boolean NOT NULL DEFAULT false,
  "currency_iso_code" char(3) DEFAULT 'GBP',
  "palette_Id" uuid NOT NULL,
  "creation_date_utc" date NOT NULL,
  "last_updated_utc" date NOT NULL,
  "description" varchar(100),
  "period" uuid NOT NULL,
  "unit" varchar(10) NOT NULL
);

CREATE TABLE "analytics_datapoint" (
  "id" uuid PRIMARY KEY,
  "source_id" uuid NOT NULL,
  "value" decimal(19,4) NOT NULL,
  "creation_date_utc" date NOT NULL,
  "is_forecast" boolean NOT NULL
);

CREATE INDEX "idx_source_country_period" ON "analytics_source" ("country_iso_code", "period");

CREATE INDEX "idx_datapoint_source_date" ON "analytics_datapoint" ("source_id", "creation_date_utc");

ALTER TABLE "analytics_source" ADD FOREIGN KEY ("category") REFERENCES "analytics_categories" ("id");

ALTER TABLE "analytics_source" ADD FOREIGN KEY ("sector") REFERENCES "analytics_sector" ("id");

ALTER TABLE "analytics_source" ADD FOREIGN KEY ("palette_Id") REFERENCES "analytics_palette" ("id");

ALTER TABLE "analytics_source" ADD FOREIGN KEY ("period") REFERENCES "analytics_periods" ("id");

ALTER TABLE "analytics_datapoint" ADD FOREIGN KEY ("source_id") REFERENCES "analytics_source" ("id");
