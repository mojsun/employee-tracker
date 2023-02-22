    INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Finance"),
    ("engineering"),
    ("Human Resources"),
    ("Legal");
   

    INSERT INTO role (title, department_id, salary)
VALUES
    ("Salesperson", 1,70000),
    ("accountant", 2, 90000),
    ("software engineer", 3, 110000),
    ("HR lead", 4, 105000),
    ("lawyer", 5, 140000);


     INSERT INTO employee (manager_id, role_id, First_name , Last_name)
VALUES
    (1,6, "Mozhdeh", "Khorashahi"),
    (1,4, "Mario", "Repas"),
    (1,3, "Amin", "Foroutan" ),
    (1,5, "John", "Lia"),
    (1,2, "Rebecca", "Lawrence");