CREATE TABLE users
(
  token text PRIMARY KEY,
  username text NOT NULL,
  password text NOT NULL,
  type_account text NOT NULL,
  mail text NOT NULL,
  widgets text,
  comfirm bool
);