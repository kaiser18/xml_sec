insert into USERS (id, username, email, password, first_name, last_name, enabled) values (123,'helena', 'h@h.com', '$2y$12$tYPyKmKOaZj5OeUDla.eeOV7dAe0u90zc/nHtQgl8AiSsMFlf4zmC', 'helena', 'anisic', true);
insert into USERS (id, username, email, password, first_name, last_name, enabled) values (321,'helena2', 'h2@h.com', '$2y$12$tYPyKmKOaZj5OeUDla.eeOV7dAe0u90zc/nHtQgl8AiSsMFlf4zmC', 'helena', 'anisic', true);

INSERT INTO AUTHORITY (name) VALUES ('ROLE_USER');
INSERT INTO AUTHORITY (name) VALUES ('ROLE_ADMIN');
INSERT INTO USER_AUTHORITY (user_id, authority_id) VALUES (123, 2);
INSERT INTO USER_AUTHORITY (user_id, authority_id) VALUES (321, 1);
