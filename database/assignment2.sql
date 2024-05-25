--Task One: SQL Statement

-- Query01: Add Tony Stark
    INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
    VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Query02: Is It Better To Be Feared Or Respected? I Say, Is It Too Much To Ask For Both? - Make Tony S. Admin 
    UPDATE account
    SET account_type = 'Admin'
    WHERE account_firstname = 'Tony';

--Query03: "And I Am Iron Man." -- Tony snaps their fingers. Delete Tony S.
    DELETE 
    FROM account
    WHERE account_firstname = 'Tony';


--Query04: Modify GM Hummer from small to huge interior
    UPDATE inventory
    SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
    WHERE inv_model = 'Hummer';

--Query05: INNER JOIN
    SELECT inv_make, inv_model, classification_name
    FROM inventory inv
    INNER JOIN classification clas
    ON inv.classification_id = clas.classification_id
    WHERE classification_name = 'Sport';
    --Result:
    --"inv_make"	"inv_model"	"classification_name"
    --"Chevy"	"Camaro"	"Sport"
    --"Lamborghini"	"Adventador"	"Sport"

--Query06: Update Records on Inventory Table
    UPDATE inventory
    SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	    inv_thumbnail = REPLACE(inv_thumbnail,'/images/', '/images/vehicles/');