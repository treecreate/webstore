-- --> Population Script <--
-- It will populate the following tables WITH sample data:
-- * roles -> Add the three roles needed by the security service: Admin, User, Developer.
-- * users -> Add a testing admin user containing a fake email.
-- * designs -> Add sample designs.
-- * transaction_items -> Add sample items.
-- * discounts -> Add some sample discounts.
-- * newsletter -> Add sample newsletters.
-- * orders -> add sample orders.
-- --> Roles TABLE <--
INSERT INTO `roles`
SELECT roles.*
FROM ((
        SELECT '358417e5-813b-41b1-baa3-208603253b4c' AS role_id
             , now()                                  AS created_at
             , 'ROLE_ADMIN'                           AS name
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT 'c9bc7e4d-e1d3-42de-8ac8-2f83eae57dde'
             , now()
             , 'ROLE_USER'
             , now())
      UNION ALL
      (
        SELECT 'd3dfa3d5-8000-4096-8985-6b762627ddc1'
             , now()
             , 'ROLE_DEVELOPER'
             , now())
     ) roles
WHERE NOT EXISTS(
  SELECT *
  FROM `roles`);
-- --> End Roles TABLE <--
-- --> Users TABLE <--
INSERT INTO `users`
SELECT users.*
FROM ((
        SELECT 'f12d7bcc-ac5f-48f8-8b74-055622e128f0'                         AS user_id
             , null                                                           AS city
             , null                                                           AS country
             , now()                                                          AS created_at
             , 'admin@example.com'                                            AS email
             , 1                                                              AS is_verified
             , 'Populated'                                                    AS name
             , '$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62' AS password
             , null                                                           AS phone_number
             , null                                                           AS postcode
             , null                                                           AS street_address
             , null                                                           AS street_address_2
             , '2cd5372d-b945-48d3-83a2-82696fbb8bcd'                         AS token
             , now()                                                          AS updated_at
             , 'admin@example.com'                                            AS username)
      UNION ALL
      (
        SELECT 'ac86995f-60ae-4520-a434-c8abc98980b9'                         AS user_id
             , null                                                           AS city
             , null                                                           AS country
             , now()                                                          AS created_at
             , 'user@example.com'                                             AS email
             , 1                                                              AS is_verified
             , 'Populatedtwo'                                                 AS name
             , '$2a$10$ZPr0bH6kt2EnjkkRk1TEH.Mnyo/GRlfjBj/60gFuLI/BnauOx2p62' AS password
             , null                                                           AS phone_number
             , null                                                           AS postcode
             , null                                                           AS street_address
             , null                                                           AS street_address_2
             , '3ceb8eda-1b03-4bf7-a85c-9d16a8ffa7ac'                         AS token
             , now()                                                          AS updated_at
             , 'user@example.com'                                             AS username)
     ) users
WHERE NOT EXISTS(
  SELECT *
  FROM `users`);
-- --> End Users TABLE <-- --
-- --> User_roles TABLE <-- --
INSERT INTO `user_roles`
SELECT user_roles.*
FROM ((
        SELECT 'f12d7bcc-ac5f-48f8-8b74-055622e128f0' AS user_id
             , '358417e5-813b-41b1-baa3-208603253b4c' AS role_id)
      UNION ALL
      (
        SELECT 'f12d7bcc-ac5f-48f8-8b74-055622e128f0'
             , 'c9bc7e4d-e1d3-42de-8ac8-2f83eae57dde')
      UNION ALL
      (
        SELECT 'ac86995f-60ae-4520-a434-c8abc98980b9'
             , 'c9bc7e4d-e1d3-42de-8ac8-2f83eae57dde')
     ) user_roles
WHERE NOT EXISTS(
  SELECT *
  FROM `user_roles`);
-- --> End User_roles TABLE <-- --
-- --> Designs TABLE <-- --
INSERT INTO `designs`
SELECT designs.*
FROM ((
        SELECT 'fd2532d8-52b8-4812-8bf0-baf52e6d45a6'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS created_at
             , '{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"boxes":[{"x":500,"y":671,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":764,"y":880,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS design_type
             , 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS updated_at
             , 'f12d7bcc-ac5f-48f8-8b74-055622e128f0'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS user_user_id)
      UNION ALL
      (
        SELECT '2e81e681-30b1-41ee-b1b1-f58ad846e115'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS created_at
             , '{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"boxes":[{"x":500,"y":671,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":764,"y":880,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS updated_at
             , 'f12d7bcc-ac5f-48f8-8b74-055622e128f0'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS user_user_id)
      UNION ALL
      (
        SELECT '5d45c862-bfce-4596-91e3-dd0562043697'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS created_at
             , '{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"boxes":[{"x":1000,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":181,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":600,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS design_type
             , 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS updated_at
             , 'f12d7bcc-ac5f-48f8-8b74-055622e128f0'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS user_user_id)
      UNION ALL
      (
        SELECT '0e5260a6-bb90-4c7b-a19e-ccefe1016a2b'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS created_at
             , '{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"boxes":[{"x":1000,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":181,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":600,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS updated_at
             , 'f12d7bcc-ac5f-48f8-8b74-055622e128f0'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS user_user_id)
      UNION ALL
      (
        SELECT 'dc9a36db-c26e-4914-befa-8145675e4703'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                AS created_at
             , '{"title":"Example Design Trii","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree2.svg","boxSize":17,"banner":{"text":"Empty Boxes","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":273,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":""},{"x":666,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":1364,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box6","text":""}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS design_type
             , 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                AS updated_at
             , 'f12d7bcc-ac5f-48f8-8b74-055622e128f0'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS user_user_id)
      UNION ALL
      (
        SELECT '047a6eac-ab8c-4a7f-b0c6-c6199ad8560e'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS created_at
             , '{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"boxes":[{"x":500,"y":671,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":764,"y":880,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS design_type
             , 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS user_user_id)
      UNION ALL
      (
        SELECT 'c1b2a42f-d47e-424d-a7c5-ddac696e21c7'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS created_at
             , '{"title":"Example Design Uno","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"boxes":[{"x":500,"y":671,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box1","text":"Lorem"},{"x":1000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box4","text":"Ipsum"},{"x":764,"y":880,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dolores"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS user_user_id)
      UNION ALL
      (
        SELECT '7bab2e03-756c-4fbb-a496-012059e0436e'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS created_at
             , '{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"boxes":[{"x":1000,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":181,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":600,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS design_type
             , 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS user_user_id)
      UNION ALL
      (
        SELECT '8e8e340e-f9ca-4765-a338-8f9ea727e839'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS created_at
             , '{"title":"Example Tree Duo","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree3.svg","boxSize":24,"banner":{"text":"Exceptional Students","style":"first"},"boxes":[{"x":1000,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Alex"},{"x":181,"y":600,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":"Calli"},{"x":600,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Cris"},{"x":2708.2481676473617,"y":1222.3392175080003,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Teo"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  AS user_user_id)
      UNION ALL
      (
        SELECT '0ae8abd4-fc3a-4e55-8129-4638aadf574c'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                AS created_at
             , '{"title":"Example Design Trii","font":"Georgia","backgroundTreeDesign":"assets/family-tree/tree-design/tree2.svg","boxSize":17,"banner":{"text":"Empty Boxes","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":273,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":""},{"x":666,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box5","text":""},{"x":1364,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box6","text":""}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS design_type
             , 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS user_user_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cb601f0000'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS created_at
             , '{"title":"My Family","font":"bairol-bold-italic","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"banner":{"text":"Example Family Tree","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dad"},{"x":666.6666666666666,"y":2000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Son"},{"x":500,"y":1000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Mom"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_type
             , 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS user_user_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cb864d0001'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS created_at
             , '{"title":"My Family","font":"bairol-bold-italic","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"banner":{"text":"Example Family Tree","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dad"},{"x":666.6666666666666,"y":2000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Son"},{"x":500,"y":1000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Mom"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS user_user_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cc4be10006'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS created_at
             , '{"title":"My Family","font":"bairol-bold-italic","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"banner":{"text":"Example Family Tree","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dad"},{"x":666.6666666666666,"y":2000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Son"},{"x":500,"y":1000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Mom"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS user_user_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cd7a47000b'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS created_at
             , '{"title":"My Family","font":"bairol-bold-italic","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"banner":{"text":"Example Family Tree","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dad"},{"x":666.6666666666666,"y":2000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Son"},{"x":500,"y":1000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Mom"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS user_user_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82ce64790010'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS created_at
             , '{"title":"My Family","font":"bairol-bold-italic","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"banner":{"text":"Example Family Tree","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dad"},{"x":666.6666666666666,"y":2000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Son"},{"x":500,"y":1000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Mom"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS user_user_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82d01e550015'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS created_at
             , '{"title":"My Family","font":"bairol-bold-italic","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"banner":{"text":"Example Family Tree","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dad"},{"x":666.6666666666666,"y":2000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Son"},{"x":500,"y":1000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Mom"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS user_user_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82dfb0ea001a'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS design_id
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS created_at
             , '{"title":"My Family","font":"bairol-bold-italic","backgroundTreeDesign":"assets/family-tree/tree-design/tree1.svg","boxSize":20,"banner":{"text":"Example Family Tree","style":"first"},"boxes":[{"x":2000,"y":666,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box2","text":"Dad"},{"x":666.6666666666666,"y":2000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Son"},{"x":500,"y":1000,"previousX":0,"previousY":0,"dragging":false,"boxDesign":"box8","text":"Mom"}]}' AS design_properties
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS design_type
             , 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   AS mutable
             , now()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              AS user_user_id)
     ) designs
WHERE NOT EXISTS(
  SELECT *
  FROM `designs`);
-- --> End Designs TABLE <-- --

-- --> Discounts TABLE <-- --
INSERT INTO `discounts`
SELECT discounts.*
FROM ((
        SELECT '2f61a7a1-499d-45bb-8229-53f70a4475c4' AS discount_id
             , 100                                    AS amount
             , now()                                  AS created_at
             , 'populated_discount'                   AS discount_code
             , '2026-06-06 06:06:06'                  AS expires_at
             , 1                                      As is_enabled
             , 100                                    AS remaining_uses
             , now()                                  AS starts_at
             , 0                                      AS total_uses
             , 0                                      AS type
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT '35c90960-1da4-4ff0-93df-622fb5718e55' AS discount_id
             , 10                                     AS amount
             , now()                                  AS created_at
             , 'populated_discount2'                  AS discount_code
             , '2026-06-06 06:06:06'                  AS expires_at
             , 1                                      As is_enabled
             , 100                                    AS remaining_uses
             , now()                                  AS starts_at
             , 0                                      AS total_uses
             , 1                                      AS type
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT '4de4d970-b863-47af-9733-ea5cd3a131ba' AS discount_id
             , 50                                     AS amount
             , now()                                  AS created_at
             , 'populated_discount_expired'           AS discount_code
             , '2006-06-06 06:06:06'                  AS expires_at
             , 1                                      As is_enabled
             , 100                                    AS remaining_uses
             , now()                                  AS starts_at
             , 0                                      AS total_uses
             , 0                                      AS type
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT '6ac1230f-0f21-438c-9453-ec1edc95f6c6' AS discount_id
             , 50                                     AS amount
             , now()                                  AS created_at
             , 'populated_discount_no_uses'           AS discount_code
             , '2026-06-06 06:06:06'                  AS expires_at
             , 1                                      As is_enabled
             , 0                                      AS remaining_uses
             , now()                                  AS starts_at
             , 1                                      AS total_uses
             , 1                                      AS type
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT 'dd274bf4-1189-44b9-88cf-51bcf00b62b0' AS discount_id
             , 50                                     AS amount
             , now()                                  AS created_at
             , 'populated_discount_disabled'          AS discount_code
             , '2026-06-06 06:06:06'                  AS expires_at
             , 0                                      As is_enabled
             , 100                                    AS remaining_uses
             , now()                                  AS starts_at
             , 100                                    AS total_uses
             , 1                                      AS type
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT 'bda8fad1-bc3a-4f84-a439-2fa69e4d1ae6' AS discount_id
             , 50                                     AS amount
             , now()                                  AS created_at
             , 'populated_discount_starts_2024'       AS discount_code
             , '2026-06-06 06:06:06'                  AS expires_at
             , 1                                      As is_enabled
             , 100                                    AS remaining_uses
             , '2024-06-06 06:06:06'                  AS starts_at
             , 100                                    AS total_uses
             , 1                                      AS type
             , now()                                  AS updated_at)
     ) discounts
WHERE NOT EXISTS(
  SELECT *
  FROM `discounts`);
-- --> End Discounts TABLE <-- --

-- --> Newsletter TABLE <-- --
INSERT INTO `newsletter`
SELECT newsletter.*
FROM ((
        SELECT '099eb1f4-f62b-4583-9b4f-dfd97b5cf01f' AS newsletter_id
             , now()                                  AS created_at
             , 'user@example.com'                     AS email
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT '689bac72-21bf-4269-b283-6517e7a40289' AS newsletter_id
             , now()                                  AS created_at
             , 'customer@example.com'                 AS email
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT 'd5dfe873-3e58-4a01-ac6e-7dfcded60354' AS newsletter_id
             , now()                                  AS created_at
             , 'random@example.com'                   AS email
             , now()                                  AS updated_at)
     ) newsletter
WHERE NOT EXISTS(
  SELECT *
  FROM `newsletter`);
-- --> End Newsletter TABLE <-- --

-- --> Contact Info TABLE <-- --
INSERT INTO `contact_info`
SELECT contact_info.*
FROM ((
        SELECT 'c0a80121-7e81-1c3e-817e-82cc11180004' AS contact_info_id
             , 'København'                            AS city
             , null                                   AS country
             , now()                                  AS created_at
             , 'example.495Base@treecreate.dk'        AS email
             , 'Example User'                         AS name
             , null                                   AS phone_number
             , '2200'                                 AS postcode
             , 'Guldbergsgade 29N'                    AS street_address
             , null                                   AS street_address_2
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cc11180005' AS contact_info_id
             , 'København'                            AS city
             , null                                   AS country
             , now()                                  AS created_at
             , 'example.495Base@treecreate.dk'        AS email
             , 'Example User'                         AS name
             , null                                   AS phone_number
             , '2200'                                 AS postcode
             , 'Guldbergsgade 29N'                    AS street_address
             , null                                   AS street_address_2
             , now()                                  AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cd4a340009'    AS contact_info_id
             , 'København'                               AS city
             , null                                      AS country
             , now()                                     AS created_at
             , 'example.524-home-delivery@treecreate.dk' AS email
             , 'Example User'                            AS name
             , null                                      AS phone_number
             , '2200'                                    AS postcode
             , 'Guldbergsgade 29N'                       AS street_address
             , null                                      AS street_address_2
             , now()                                     AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cd4a34000a'    AS contact_info_id
             , 'København'                               AS city
             , null                                      AS country
             , now()                                     AS created_at
             , 'example.524-home-delivery@treecreate.dk' AS email
             , 'Example User'                            AS name
             , null                                      AS phone_number
             , '2200'                                    AS postcode
             , 'Guldbergsgade 29N'                       AS street_address
             , null                                      AS street_address_2
             , now()                                     AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82ce4595000e'            AS contact_info_id
             , 'København'                                       AS city
             , null                                              AS country
             , now()                                             AS created_at
             , 'example.395-100kr-amount-discount@treecreate.dk' AS email
             , 'Example User'                                    AS name
             , null                                              AS phone_number
             , '2200'                                            AS postcode
             , 'Guldbergsgade 29N'                               AS street_address
             , null                                              AS street_address_2
             , now()                                             AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82ce4595000f'            AS contact_info_id
             , 'København'                                       AS city
             , null                                              AS country
             , now()                                             AS created_at
             , 'example.395-100kr-amount-discount@treecreate.dk' AS email
             , 'Example User'                                    AS name
             , null                                              AS phone_number
             , '2200'                                            AS postcode
             , 'Guldbergsgade 29N'                               AS street_address
             , null                                              AS street_address_2
             , now()                                             AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cff3ca0013'          AS contact_info_id
             , 'København'                                     AS city
             , null                                            AS country
             , now()                                           AS created_at
             , 'example.445-10-percent-discount@treecreate.dk' AS email
             , 'Example User'                                  AS name
             , null                                            AS phone_number
             , '2200'                                          AS postcode
             , 'Guldbergsgade 29N'                             AS street_address
             , null                                            AS street_address_2
             , now()                                           AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cff3ca0014'          AS contact_info_id
             , 'København'                                     AS city
             , null                                            AS country
             , now()                                           AS created_at
             , 'example.445-10-percent-discount@treecreate.dk' AS email
             , 'Example User'                                  AS name
             , null                                            AS phone_number
             , '2200'                                          AS postcode
             , 'Guldbergsgade 29N'                             AS street_address
             , null                                            AS street_address_2
             , now()                                           AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82d0c0d20018'            AS contact_info_id
             , 'København'                                       AS city
             , null                                              AS country
             , now()                                             AS created_at
             , 'example.1485-threeOrMore-discount@treecreate.dk' AS email
             , 'Example User'                                    AS name
             , null                                              AS phone_number
             , '2200'                                            AS postcode
             , 'Guldbergsgade 29N'                               AS street_address
             , null                                              AS street_address_2
             , now()                                             AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82d0c0d20019'            AS contact_info_id
             , 'København'                                       AS city
             , null                                              AS country
             , now()                                             AS created_at
             , 'example.1485-threeOrMore-discount@treecreate.dk' AS email
             , 'Example User'                                    AS name
             , null                                              AS phone_number
             , '2200'                                            AS postcode
             , 'Guldbergsgade 29N'                               AS street_address
             , null                                              AS street_address_2
             , now()                                             AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82e1aefc001d'                           AS contact_info_id
             , 'København'                                                      AS city
             , null                                                             AS country
             , now()                                                            AS created_at
             , 'example.2655-medium-size-20kr-planted-trees-home@treecreate.dk' AS email
             , 'Example User'                                                   AS name
             , null                                                             AS phone_number
             , '2200'                                                           AS postcode
             , 'Guldbergsgade 29N'                                              AS street_address
             , null                                                             AS street_address_2
             , now()                                                            AS updated_at)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82e1aefc001e'                           AS contact_info_id
             , 'København'                                                      AS city
             , null                                                             AS country
             , now()                                                            AS created_at
             , 'example.2655-medium-size-20kr-planted-trees-home@treecreate.dk' AS email
             , 'Example User'                                                   AS name
             , null                                                             AS phone_number
             , '2200'                                                           AS postcode
             , 'Guldbergsgade 29N'                                              AS street_address
             , null                                                             AS street_address_2
             , now()                                                            AS updated_at)
     ) contact_info
WHERE NOT EXISTS(
  SELECT *
  FROM `contact_info`);
-- --> End Contact Info TABLE <-- --

-- --> Orders TABLE <-- --
INSERT INTO `orders`
SELECT orders.*
FROM ((
        SELECT 'c0a80121-7e81-1c3e-817e-82cc11170003' AS order_id
             , now()                                  AS created_at
             , 0                                      AS currency
             , '291586595'                            AS payment_id
             , 1                                      AS planted_trees
             , 1                                      AS shipping_method
             , 0                                      AS status
             , 495.00                                 AS subtotal
             , 495.00                                 AS total
             , now()                                  AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_id
             , 'c0a80121-7e81-1c3e-817e-82cc11180004' AS billing_info_contact_info_id
             , 'c0a80121-7e81-1c3e-817e-82cc11180005' AS contact_info_contact_info_id
             , null                                   AS discount_discount_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cd4a340008' AS order_id
             , now()                                  AS created_at
             , 0                                      AS currency
             , '291586768'                            AS payment_id
             , 1                                      AS planted_trees
             , 0                                      AS shipping_method
             , 0                                      AS status
             , 495.00                                 AS subtotal
             , 524.00                                 AS total
             , now()                                  AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_id
             , 'c0a80121-7e81-1c3e-817e-82cd4a340009' AS billing_info_contact_info_id
             , 'c0a80121-7e81-1c3e-817e-82cd4a34000a' AS contact_info_contact_info_id
             , null                                   AS discount_discount_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82ce4594000d' AS order_id
             , now()                                  AS created_at
             , 0                                      AS currency
             , '291586909'                            AS payment_id
             , 1                                      AS planted_trees
             , 1                                      AS shipping_method
             , 0                                      AS status
             , 495.00                                 AS subtotal
             , 395.00                                 AS total
             , now()                                  AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_id
             , 'c0a80121-7e81-1c3e-817e-82ce4595000e' AS billing_info_contact_info_id
             , 'c0a80121-7e81-1c3e-817e-82ce4595000f' AS contact_info_contact_info_id
             , '2f61a7a1-499d-45bb-8229-53f70a4475c4' AS discount_discount_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cff3ca0012' AS order_id
             , now()                                  AS created_at
             , 0                                      AS currency
             , '291587163'                            AS payment_id
             , 1                                      AS planted_trees
             , 1                                      AS shipping_method
             , 0                                      AS status
             , 495.00                                 AS subtotal
             , 445.50                                 AS total
             , now()                                  AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_id
             , 'c0a80121-7e81-1c3e-817e-82cff3ca0013' AS billing_info_contact_info_id
             , 'c0a80121-7e81-1c3e-817e-82cff3ca0014' AS contact_info_contact_info_id
             , '35c90960-1da4-4ff0-93df-622fb5718e55' AS discount_discount_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82d0c0d20017' AS order_id
             , now()                                  AS created_at
             , 0                                      AS currency
             , '291587312'                            AS payment_id
             , 1                                      AS planted_trees
             , 1                                      AS shipping_method
             , 0                                      AS status
             , 1980.00                                AS subtotal
             , 1485.00                                AS total
             , now()                                  AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_id
             , 'c0a80121-7e81-1c3e-817e-82d0c0d20018' AS billing_info_contact_info_id
             , 'c0a80121-7e81-1c3e-817e-82d0c0d20019' AS contact_info_contact_info_id
             , null                                   AS discount_discount_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82e1aefc001c' AS order_id
             , now()                                  AS created_at
             , 0                                      AS currency
             , '291589918'                            AS payment_id
             , 3                                      AS planted_trees
             , 0                                      AS shipping_method
             , 0                                      AS status
             , 3475.00                                AS subtotal
             , 2655.25                                AS total
             , now()                                  AS updated_at
             , 'ac86995f-60ae-4520-a434-c8abc98980b9' AS user_id
             , 'c0a80121-7e81-1c3e-817e-82e1aefc001d' AS billing_info_contact_info_id
             , 'c0a80121-7e81-1c3e-817e-82e1aefc001e' AS contact_info_contact_info_id
             , null                                   AS discount_discount_id)
     ) orders
WHERE NOT EXISTS(
  SELECT *
  FROM `orders`);
-- --> End Orders TABLE <-- --


-- --> Transaction_items TABLE <-- --
INSERT INTO `transaction_items`
SELECT transaction_items.*
FROM ((
        SELECT 'c0a80121-7e81-1c3e-817e-82cb87330002' AS transaction_item_id
             , now()                                  AS created_at
             , 0                                      AS dimension
             , 'c0a80121-7e81-1c3e-817e-82cc11170003' AS order_id
             , 1                                      AS quantity
             , now()                                  AS updated_at
             , 'c0a80121-7e81-1c3e-817e-82cb864d0001' AS design_design_id
             , 'c0a80121-7e81-1c3e-817e-82cc11170003' AS order_order_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cc4cc70007' AS transaction_item_id
             , now()                                  AS created_at
             , 0                                      AS dimension
             , 'c0a80121-7e81-1c3e-817e-82cd4a340008' AS order_id
             , 1                                      AS quantity
             , now()                                  AS updated_at
             , 'c0a80121-7e81-1c3e-817e-82cc4be10006' AS design_design_id
             , 'c0a80121-7e81-1c3e-817e-82cd4a340008' AS order_order_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cd7b29000c' AS transaction_item_id
             , now()                                  AS created_at
             , 0                                      AS dimension
             , 'c0a80121-7e81-1c3e-817e-82ce4594000d' AS order_id
             , 1                                      AS quantity
             , now()                                  AS updated_at
             , 'c0a80121-7e81-1c3e-817e-82cd7a47000b' AS design_design_id
             , 'c0a80121-7e81-1c3e-817e-82ce4594000d' AS order_order_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82ce655f0011' AS transaction_item_id
             , now()                                  AS created_at
             , 0                                      AS dimension
             , 'c0a80121-7e81-1c3e-817e-82cff3ca0012' AS order_id
             , 1                                      AS quantity
             , now()                                  AS updated_at
             , 'c0a80121-7e81-1c3e-817e-82ce64790010' AS design_design_id
             , 'c0a80121-7e81-1c3e-817e-82cff3ca0012' AS order_order_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82d01f3e0016' AS transaction_item_id
             , now()                                  AS created_at
             , 0                                      AS dimension
             , 'c0a80121-7e81-1c3e-817e-82d0c0d20017' AS order_id
             , 4                                      AS quantity
             , now()                                  AS updated_at
             , 'c0a80121-7e81-1c3e-817e-82d01e550015' AS design_design_id
             , 'c0a80121-7e81-1c3e-817e-82d0c0d20017' AS order_order_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82dfb1cc001b' AS transaction_item_id
             , now()                                  AS created_at
             , 1                                      AS dimension
             , 'c0a80121-7e81-1c3e-817e-82e1aefc001c' AS order_id
             , 5                                      AS quantity
             , now()                                  AS updated_at
             , 'c0a80121-7e81-1c3e-817e-82dfb0ea001a' AS design_design_id
             , 'c0a80121-7e81-1c3e-817e-82e1aefc001c' AS order_order_id)
     ) transaction_items
WHERE NOT EXISTS(
  SELECT *
  FROM `transaction_items`);
-- --> End Transaction_items TABLE <-- --

-- --> orders_transaction_items TABLE <-- --
INSERT INTO `orders_transaction_items`
SELECT orders_transaction_items.*
FROM ((
        SELECT 'c0a80121-7e81-1c3e-817e-82cc11170003' AS order_order_id
             , 'c0a80121-7e81-1c3e-817e-82cb87330002' AS transaction_items_transaction_item_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cd4a340008' AS order_order_id
             , 'c0a80121-7e81-1c3e-817e-82cc4cc70007' AS transaction_items_transaction_item_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82ce4594000d' AS order_order_id
             , 'c0a80121-7e81-1c3e-817e-82cd7b29000c' AS transaction_items_transaction_item_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82cff3ca0012' AS order_order_id
             , 'c0a80121-7e81-1c3e-817e-82ce655f0011' AS transaction_items_transaction_item_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82d0c0d20017' AS order_order_id
             , 'c0a80121-7e81-1c3e-817e-82d01f3e0016' AS transaction_items_transaction_item_id)
      UNION ALL
      (
        SELECT 'c0a80121-7e81-1c3e-817e-82e1aefc001c' AS order_order_id
             , 'c0a80121-7e81-1c3e-817e-82dfb1cc001b' AS transaction_items_transaction_item_id)
     ) orders_transaction_items
WHERE NOT EXISTS(
  SELECT *
  FROM `orders_transaction_items`);
-- --> End Contact Info TABLE <-- --
