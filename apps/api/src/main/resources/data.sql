-- --> Population Script <--
-- It will populate the following tables WITH sample data:
-- * roles -> Add the three roles needed by the security service: Admin, User, Developer.
-- * users -> Add a testing admin user containing a fake email.
-- * designs -> Add sample designs.
-- * transaction_items -> Add sample items.
-- * discounts -> Add some sample discounts.
-- * newsletter -> Add sample newsletters.
-- --> Roles TABLE <--
INSERT INTO `roles`
SELECT  roles.*
FROM
( (
	SELECT  '358417e5-813b-41b1-baa3-208603253b4c' AS role_id
	       ,null                                   AS created_at
	       ,'ROLE_ADMIN'                           AS name
	       ,null                                   AS updated_at )
	UNION ALL(
	SELECT  'c9bc7e4d-e1d3-42de-8ac8-2f83eae57dde'
	       ,null
	       ,'ROLE_USER'
	       ,null )
	UNION ALL(
	SELECT  'd3dfa3d5-8000-4096-8985-6b762627ddc1'
	       ,null
	       ,'ROLE_DEVELOPER'
	       ,null )
) roles
WHERE NOT EXISTS (
SELECT  *
FROM `roles` );
-- --> End Roles TABLE <--
-- --> Users TABLE <--
INSERT INTO `users`
SELECT  users.*
FROM
( (
	SELECT  'f12d7bcc-ac5f-48f8-8b74-055622e128f0'                         AS user_id
	       ,null                                                           AS city
	       ,null                                                           AS country
	       ,null                                                           AS created_at
	       ,'admin@example.com'                                            AS email
	       ,1                                                              AS is_verified
	       ,'Populated'                                                    AS name
	       ,'$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62' AS password
	       ,null                                                           AS phone_number
	       ,null                                                           AS postcode
	       ,null                                                           AS street_address
	       ,null                                                           AS street_address_2
	       ,'2cd5372d-b945-48d3-83a2-82696fbb8bcd'                         AS token
	       ,null                                                           AS updated_at
	       ,'admin@example.com'                                            AS username)
	UNION ALL(
	SELECT  'ac86995f-60ae-4520-a434-c8abc98980b9'                         AS user_id
	       ,null                                                           AS city
	       ,null                                                           AS country
	       ,null                                                           AS created_at
	       ,'user@example.com'                                             AS email
	       ,1                                                              AS is_verified
	       ,'Populatedtwo'                                                 AS name
	       ,'$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62' AS password
	       ,null                                                           AS phone_number
	       ,null                                                           AS postcode
	       ,null                                                           AS street_address
	       ,null                                                           AS street_address_2
	       ,'3ceb8eda-1b03-4bf7-a85c-9d16a8ffa7ac'                         AS token
	       ,null                                                           AS updated_at
	       ,'user@example.com'                                             AS username)
) users
WHERE NOT EXISTS (
SELECT  *
FROM `users` );
-- --> End Users TABLE <-- --
-- --> User_roles TABLE <-- --
INSERT INTO `user_roles`
SELECT  user_roles.*
FROM
( (
	SELECT  'f12d7bcc-ac5f-48f8-8b74-055622e128f0' AS user_id
	       ,'358417e5-813b-41b1-baa3-208603253b4c' AS role_id )
	UNION ALL(
	SELECT  'f12d7bcc-ac5f-48f8-8b74-055622e128f0'
	       ,'c9bc7e4d-e1d3-42de-8ac8-2f83eae57dde' )
	UNION ALL(
	SELECT  'ac86995f-60ae-4520-a434-c8abc98980b9'
	       ,'c9bc7e4d-e1d3-42de-8ac8-2f83eae57dde' )
) user_roles
WHERE NOT EXISTS (
SELECT  *
FROM `user_roles` );
-- --> End User_roles TABLE <-- --
-- --> Designs TABLE <-- --
INSERT INTO `designs`
SELECT  designs.*
FROM
( (
	SELECT  'fd2532d8-52b8-4812-8bf0-baf52e6d45a6' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"largeFont":false,"boxes":[{"x":1002.1162382574585,"y":1343.55321564984,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1994.7145659130792,"y":1333.3333333333333,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":1528.192422834727,"y":1762.1554660885722,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,1                                      AS mutable
	       ,null                                   AS updated_at
	       ,'f12d7bcc-ac5f-48f8-8b74-055622e128f0' AS user_user_id)
	UNION ALL(
	SELECT  '2e81e681-30b1-41ee-b1b1-f58ad846e115' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"largeFont":false,"boxes":[{"x":1002.1162382574585,"y":1343.55321564984,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1994.7145659130792,"y":1333.3333333333333,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":1528.192422834727,"y":1762.1554660885722,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,0                                      AS mutable
	       ,null                                   AS updated_at
	       ,'f12d7bcc-ac5f-48f8-8b74-055622e128f0' AS user_user_id)
	UNION ALL(
	SELECT  '5d45c862-bfce-4596-91e3-dd0562043697' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"largeFont":true,"boxes":[{"x":1951.0271497883764,"y":1223.0411892226696,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":362.578713740064,"y":1206.131929389904,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":1142.8512439351707,"y":1213.3581088056153,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,1                                      AS mutable
	       ,null                                   AS updated_at
	       ,'f12d7bcc-ac5f-48f8-8b74-055622e128f0' AS user_user_id)
	UNION ALL(
	SELECT  '0e5260a6-bb90-4c7b-a19e-ccefe1016a2b' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"largeFont":true,"boxes":[{"x":1951.0271497883764,"y":1223.0411892226696,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":362.578713740064,"y":1206.131929389904,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":1142.8512439351707,"y":1213.3581088056153,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,0                                      AS mutable
	       ,null                                   AS updated_at
	       ,'f12d7bcc-ac5f-48f8-8b74-055622e128f0' AS user_user_id)
	UNION ALL(
	SELECT  'dc9a36db-c26e-4914-befa-8145675e4703' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Design Trii","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree2.svg","boxSize":17,"banner":{"text":"Empty Boxes","style":"first"},"largeFont":false,"boxes":[{"x":2000,"y":1333.3333333333333,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":473.572829565397,"y":1338.2677815629193,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":""},{"x":1216.3518117064107,"y":1328.7498709610818,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":2728.481470011355,"y":1324.3522246309485,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box6","text":""}]}' AS design_properties
	       ,0                                      AS design_type
	       ,1                                      AS mutable
	       ,null                                   AS updated_at
	       ,'f12d7bcc-ac5f-48f8-8b74-055622e128f0' AS user_user_id)
	UNION ALL(
	SELECT  '047a6eac-ab8c-4a7f-b0c6-c6199ad8560e' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"largeFont":false,"boxes":[{"x":1002.1162382574585,"y":1343.55321564984,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1994.7145659130792,"y":1333.3333333333333,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":1528.192422834727,"y":1762.1554660885722,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,1                                      AS mutable
	       ,null                                   AS updated_at
	       ,'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_user_id)
	UNION ALL(
	SELECT  'c1b2a42f-d47e-424d-a7c5-ddac696e21c7' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"largeFont":false,"boxes":[{"x":1002.1162382574585,"y":1343.55321564984,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1994.7145659130792,"y":1333.3333333333333,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":1528.192422834727,"y":1762.1554660885722,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,0                                      AS mutable
	       ,null                                   AS updated_at
	       ,'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_user_id)
	UNION ALL(
	SELECT  '7bab2e03-756c-4fbb-a496-012059e0436e' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"largeFont":true,"boxes":[{"x":1951.0271497883764,"y":1223.0411892226696,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":362.578713740064,"y":1206.131929389904,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":1142.8512439351707,"y":1213.3581088056153,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,1                                      AS mutable
	       ,null                                   AS updated_at
	       ,'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_user_id)
	UNION ALL(
	SELECT  '8e8e340e-f9ca-4765-a338-8f9ea727e839' AS design_id
	       ,null                                   AS created_at
	       ,'{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"largeFont":true,"boxes":[{"x":1951.0271497883764,"y":1223.0411892226696,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":362.578713740064,"y":1206.131929389904,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":1142.8512439351707,"y":1213.3581088056153,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
	       ,0                                      AS design_type
	       ,0                                      AS mutable
	       ,null                                   AS updated_at
	       ,'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_user_id)
	UNION ALL(
	SELECT  '1ce37a779-36b8-4675-93e2-a74bcd7025c4' AS design_id
	       ,null                                    AS created_at
	       ,'{"title":"Example Design Trii","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree2.svg","boxSize":17,"banner":{"text":"Empty Boxes","style":"first"},"largeFont":false,"boxes":[{"x":2000,"y":1333.3333333333333,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":473.572829565397,"y":1338.2677815629193,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":""},{"x":1216.3518117064107,"y":1328.7498709610818,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":2728.481470011355,"y":1324.3522246309485,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box6","text":""}]}' AS design_properties
	       ,0                                       AS design_type
	       ,1                                       AS mutable
	       ,null                                    AS updated_at
	       ,'ac86995f-60ae-4520-a434-c8abc98980b9'  AS user_user_id)
) designs
WHERE NOT EXISTS (
SELECT  *
FROM `designs` );
-- --> End Designs TABLE <-- --
-- --> Transaction_items TABLE <-- --
INSERT INTO `transaction_items`
SELECT  transaction_items.*
FROM
( (
	SELECT  '42066fdf-507f-41e2-b8ea-dfffd75f70dc' AS transaction_item_id
	       ,null                                   AS created_at
	       ,0                                      AS dimension
	       ,null                                   AS order_id
	       ,1                                      AS quantity
	       ,null                                   AS updated_at
	       ,'2e81e681-30b1-41ee-b1b1-f58ad846e115' AS design_design_id
	       ,null                                   AS order_order_id )
	UNION ALL(
	SELECT  'b224219b-9c2b-4bec-84a6-bd285fb092f7' AS transaction_item_id
	       ,null                                   AS created_at
	       ,1                                      AS dimension
	       ,null                                   AS order_id
	       ,2                                      AS quantity
	       ,null                                   AS updated_at
	       ,'0e5260a6-bb90-4c7b-a19e-ccefe1016a2b' AS design_design_id
	       ,null                                   AS order_order_id )
	UNION ALL(
	SELECT  'd17b9f81-bc30-41ec-8324-7f8ed72021cb' AS transaction_item_id
	       ,null                                   AS created_at
	       ,0                                      AS dimension
	       ,null                                   AS order_id
	       ,1                                      AS quantity
	       ,null                                   AS updated_at
	       ,'c1b2a42f-d47e-424d-a7c5-ddac696e21c7' AS design_design_id
	       ,null                                   AS order_order_id )
	UNION ALL(
	SELECT  '3849e7aa-4a27-43bc-8a11-0fd836516b40' AS transaction_item_id
	       ,null                                   AS created_at
	       ,1                                      AS dimension
	       ,null                                   AS order_id
	       ,2                                      AS quantity
	       ,null                                   AS updated_at
	       ,'8e8e340e-f9ca-4765-a338-8f9ea727e839' AS design_design_id
	       ,null                                   AS order_order_id )
) transaction_items
WHERE NOT EXISTS (
SELECT  *
FROM `transaction_items` );
-- --> End Transaction_items TABLE <-- --
-- --> Discounts TABLE <-- --
INSERT INTO `discounts`
SELECT  discounts.*
FROM
( (
	SELECT  '2f61a7a1-499d-45bb-8229-53f70a4475c4' AS discount_id
	       ,100                                    AS amount
	       ,null                                   AS created_at
	       ,'populated_discount'                   AS discount_code
	       ,'2026-06-06 06:06:06'                  AS expires_at
	       ,100                                    AS remaining_uses
	       ,0                                      AS total_uses
	       ,0                                      AS type
	       ,null                                   AS updated_at )
	UNION ALL(
	SELECT  '35c90960-1da4-4ff0-93df-622fb5718e55' AS discount_id
	       ,10                                     AS amount
	       ,null                                   AS created_at
	       ,'populated_discount2'                  AS discount_code
	       ,'2026-06-06 06:06:06'                  AS expires_at
	       ,100                                    AS remaining_uses
	       ,0                                      AS total_uses
	       ,1                                      AS type
	       ,null                                   AS updated_at )
	UNION ALL(
	SELECT  '4de4d970-b863-47af-9733-ea5cd3a131ba' AS discount_id
	       ,50                                     AS amount
	       ,null                                   AS created_at
	       ,'populated_discount_expired'           AS discount_code
	       ,'2006-06-06 06:06:06'                  AS expires_at
	       ,100                                    AS remaining_uses
	       ,0                                      AS total_uses
	       ,0                                      AS type
	       ,null                                   AS updated_at )
	UNION ALL(
	SELECT  '6ac1230f-0f21-438c-9453-ec1edc95f6c6' AS discount_id
	       ,50                                     AS amount
	       ,null                                   AS created_at
	       ,'populated_discount_no_uses'           AS discount_code
	       ,'2026-06-06 06:06:06'                  AS expires_at
	       ,0                                      AS remaining_uses
	       ,1                                      AS total_uses
	       ,1                                      AS type
	       ,null                                   AS updated_at )
) discounts
WHERE NOT EXISTS (
SELECT  *
FROM `discounts` );
-- --> End Discounts TABLE <-- --
-- --> Newsletter TABLE <-- --
INSERT INTO `newsletter`
SELECT  newsletter.*
FROM
( (
	SELECT  '099eb1f4-f62b-4583-9b4f-dfd97b5cf01f' AS newsletter_id
	       ,null                                   AS created_at
	       ,'user@example.com'                     AS email
	       ,null                                   AS updated_at )
	UNION ALL(
	SELECT  '689bac72-21bf-4269-b283-6517e7a40289' AS newsletter_id
	       ,null                                   AS created_at
	       ,'customer@example.com'                    AS email
	       ,null                                   AS updated_at )
	UNION ALL(
	SELECT  'd5dfe873-3e58-4a01-ac6e-7dfcded60354' AS newsletter_id
	       ,null                                   AS created_at
	       ,'random@example.com'                        AS email
	       ,null                                   AS updated_at )
) newsletter
WHERE NOT EXISTS (
SELECT  *
FROM `newsletter` );
-- --> End Newsletter TABLE <-- --