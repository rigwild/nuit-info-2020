BEGIN;

CREATE TABLE activity
(
  activity_id serial NOT NULL PRIMARY KEY,
  name varchar(64) NOT NULL
);

CREATE TABLE report
(
  report_id serial NOT NULL PRIMARY KEY,
  position point NOT NULL,
  created_at timestamp DEFAULT NOW(),
  activity_started_at timestamp NOT NULL,
  activity_ended_at timestamp NOT NULL,
  device_uuid varchar NOT NULL,
  activity_id bigint NOT NULL REFERENCES activity(activity_id)
);

CREATE TABLE product
(
  product_id serial NOT NULL PRIMARY KEY,
  name varchar(64) NOT NULL,
  is_consumable boolean NOT NULL
);

CREATE TABLE report_product
(
  report_id bigint NOT NULL REFERENCES report(report_id),
  product_id bigint NOT NULL REFERENCES product(product_id),
  PRIMARY KEY (report_id, product_id)
);

-- ----

INSERT INTO product (name, is_consumable) values ('Sun screen', true);
INSERT INTO product (name, is_consumable) values ('Sun screen', false);
INSERT INTO product (name, is_consumable) values ('Perfume', true);
INSERT INTO product (name, is_consumable) values ('Perfume', false);
INSERT INTO product (name, is_consumable) values ('Deodorant', true);
INSERT INTO product (name, is_consumable) values ('Deodorant', false);
INSERT INTO product (name, is_consumable) values ('Moisturizer', true);
INSERT INTO product (name, is_consumable) values ('Moisturizer', false);
INSERT INTO product (name, is_consumable) values ('Makeup', true);
INSERT INTO product (name, is_consumable) values ('Makeup', false);
INSERT INTO product (name, is_consumable) values ('Gasoline', false);
INSERT INTO product (name, is_consumable) values ('Cigarette', true);
INSERT INTO product (name, is_consumable) values ('Cigarette', false);
INSERT INTO product (name, is_consumable) values ('Fertilizer', false);
INSERT INTO product (name, is_consumable) values ('Pesticides', false);
INSERT INTO product (name, is_consumable) values ('Paintings', false);

INSERT INTO activity (name) values ('Bathing');
INSERT INTO activity (name) values ('Nautical activities');
INSERT INTO activity (name) values ('Fishing boat');
INSERT INTO activity (name) values ('Leisure boat');
INSERT INTO activity (name) values ('Sail boat');

COMMIT;