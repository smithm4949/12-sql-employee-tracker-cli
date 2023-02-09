INSERT INTO department (id, name)
VALUES (1, "Engineering"),
       (2, "Management"),
       (3, "Marketing");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Myles", "Smith", 1, 1),
       (2, "Gabe", "Perry", 2, 1),
       (3, "Seb", "TA", 3, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "developer", 50000, 1),
       (2, "lead", 80000, 1),
       (3, "designer", 60000, 3);