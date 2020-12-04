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

INSERT INTO product (name, is_consumable) values ('Crème solaire', true);
INSERT INTO product (name, is_consumable) values ('Crème solaire', false);
INSERT INTO product (name, is_consumable) values ('Parfum', true);
INSERT INTO product (name, is_consumable) values ('Parfum', false);
INSERT INTO product (name, is_consumable) values ('Déodorant', true);
INSERT INTO product (name, is_consumable) values ('Déodorant', false);
INSERT INTO product (name, is_consumable) values ('Crème hydratante', true);
INSERT INTO product (name, is_consumable) values ('Crème hydratante', false);
INSERT INTO product (name, is_consumable) values ('Maquillage', true);
INSERT INTO product (name, is_consumable) values ('Maquillage', false);
INSERT INTO product (name, is_consumable) values ('Essence', false);
INSERT INTO product (name, is_consumable) values ('Cigarette', true);
INSERT INTO product (name, is_consumable) values ('Cigarette', false);
INSERT INTO product (name, is_consumable) values ('Engrais', false);
INSERT INTO product (name, is_consumable) values ('Pesticides', false);
INSERT INTO product (name, is_consumable) values ('Peintures', false);

INSERT INTO activity (name) values ('Baignade');
INSERT INTO activity (name) values ('Activité nautiques');
INSERT INTO activity (name) values ('Bateau de pêche');
INSERT INTO activity (name) values ('Bateau de loisir');
INSERT INTO activity (name) values ('Bateau à voiles');

COMMIT;