-- 1. Insert a new Tony Stark record (account_id and account_type use their defaults):
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2. Modify Tony Stark’s account_type to “Admin”:
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- 3. Delete the Tony Stark record:
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';
-- 4. Change “small interiors” → “a huge interior” in the GM Hummer description:
UPDATE public.inventory
SET inv_description = replace(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- 5. Join inventory → classification to pull make, model, and classification_name
--    for items in the “Sport” category:
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory AS i
    INNER JOIN public.classification AS c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6. Insert “/vehicles” into every image path in both inv_image and inv_thumbnail:
UPDATE public.inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');