-- Task 1 Assignment | CSE340 Week 02 Activity

-- SQL Query 1
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES  ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- SQL Query 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- SQL Query 3
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- SQL Query 4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- SQL Query 5
SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

-- SQL Query 6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
