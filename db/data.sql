insert into Type
values ('S', 'Story'),
       ('F', 'File'),
       ('D', 'Document'),
       ('P', 'Person'),
       ('I', 'Photo/Video');

insert into Items (item_id, type_code)
values ('b81763dc-4b7e-4af7-ad64-2af50cb74666', 'S'), -- 1
       ('9477d81a-f324-4835-bea0-7b256ae37069', 'F'), -- 2
       ('22526b6c-0667-4c08-b58c-823b098a94a9', 'F'), -- 3
       ('e20e5eed-dc07-463f-b763-3e508d994353', 'I'), -- 4
       ('d97be831-2e4d-4e85-9b48-f0aa00705e07', 'P'), -- 5
       ('a58e9971-365e-4ba0-94f5-a5ac01a43790', 'D'), -- 6
       ('86048604-74cd-492e-b93e-5f347cbead4c', 'S'), -- 7
       ('87c8aeda-71aa-46ea-9b94-ea759bebf8ae', 'P'), -- 8
       ('e93ae5e0-8e5d-4329-b60a-fcb7f4aab109', 'P'), -- 9
       ('f8199f27-303f-47e1-904c-abcd117b321a', 'D'), -- 10
       ('5503ff00-21e8-47c4-87d6-803e50d50d3f', 'F'), -- 11
       ('31b9dc34-982e-432d-acef-5d526fe25da5', 'P'), -- 12
       ('f02b2d8e-cb30-4a1f-b33c-395736cb1c93', 'I'), -- 13
       ('d0a74e3d-707c-4447-8d8e-d42f27da207b', 'I'), -- 14
       ('08beec18-4593-4a43-b404-739a09fa6633', 'I'), -- 15
       ('b9773f6e-12ea-4c9d-8393-06c0a5b8a1c2', 'I'), -- 16
       ('bf604923-ea85-41d8-93c6-a37bc0485649', 'I'); -- 17

insert into Story (story_id, StoryDateTime, Header, Content)
values ('b81763dc-4b7e-4af7-ad64-2af50cb74666', DATE('2015-07-12'), 'Sample story', '_**Hello, this is an example story that never happened!**_
​
Ut non ex eu velit lobortis cursus. Nulla sodales justo id nisl dapibus fringilla. Curabitur sit amet nisl eget sem porta sagittis. Ut iaculis imperdiet posuere. Praesent nulla mi, varius quis vulputate nec, dictum eget felis. Praesent non felis ut massa sodales lacinia. Pellentesque nec nulla turpis. Donec scelerisque varius ipsum quis tincidunt. Donec lacinia, magna lobortis euismod luctus, augue diam maximus arcu, id finibus lacus ante eget elit. Duis aliquet felis sit amet velit porta facilisis. Pellentesque eget gravida orci. Etiam tempor nibh sed est sodales, a scelerisque erat auctor. Mauris feugiat elit congue, accumsan odio ac, varius ipsum. Fusce pellentesque ligula a nisi congue sodales. Phasellus porta dui in lectus dictum, tincidunt vehicula nisl consectetur. Duis ultricies sodales tempus.
Morbi placerat tempus ipsum, a sagittis sem pulvinar in. Mauris elit turpis, posuere eu pulvinar vitae, consectetur vel ex. Aliquam at tincidunt arcu, non lacinia diam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec hendrerit vitae dolor eget interdum. Donec nec erat sed mi tempor eleifend a bibendum turpis. Etiam accumsan augue a odio venenatis, ac posuere arcu tincidunt. Integer ante mi, efficitur vel tortor a, sagittis finibus felis.
'),
       ('86048604-74cd-492e-b93e-5f347cbead4c', DATE('2018-09-20'), 'Another story', '### Lorem ipsum
Some _example story content_
**Header Lorem**
 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque leo arcu, et iaculis dui aliquet eu. In et magna eget elit placerat posuere. Mauris sodales, ante vitae cursus bibendum, mi dui venenatis tortor, a porta urna lectus at ante. Etiam porta, quam vitae dignissim rhoncus, augue est bibendum quam, ac varius nisl lacus at velit. Sed vestibulum libero ac sagittis venenatis. Integer non nibh eros. Donec laoreet pulvinar diam, in maximus libero vestibulum eget. Quisque a ultricies neque. Vestibulum consequat orci et ultricies accumsan. Donec volutpat orci neque, gravida scelerisque urna pretium vitae. Nulla volutpat, massa nec consectetur tristique, eros arcu interdum sapien, sodales vulputate erat sem vel risus. Praesent dolor diam, tempus sed arcu eget, maximus vestibulum justo. Aliquam ornare sollicitudin fringilla. Vivamus semper, purus non vestibulum varius, mi felis egestas sem, non sodales magna turpis non lacus. Cras arcu dui, iaculis a aliquam et, cursus a ipsum. In rhoncus volutpat iaculis.
');

insert into Files (file_id, Filename, Title, Description)
values ('9477d81a-f324-4835-bea0-7b256ae37069', 'file.tmp', 'File 1', 'This file actually **does not** exist'),
       ('22526b6c-0667-4c08-b58c-823b098a94a9', 'file2.tmp', 'File 2', 'Other temp _non-existing file'),
       ('5503ff00-21e8-47c4-87d6-803e50d50d3f', 'archive.zip', 'A Zip archive', 'Archive description');

insert into Photos (photo_id, Filename, Title, Description)
values ('e20e5eed-dc07-463f-b763-3e508d994353', 'example-photo-1.jpg', 'Example photo', 'This is a photo description.
The photo has been downloaded from [https://unsplash.com/search/photos/sample](https://unsplash.com/search/photos/sample)
'),
       ('f02b2d8e-cb30-4a1f-b33c-395736cb1c93', 'example-photo-2.jpg', 'Buses', 'This is a photo description.
The photo has been downloaded from [https://unsplash.com/search/photos/sample](https://unsplash.com/search/photos/sample)
'),
       ('d0a74e3d-707c-4447-8d8e-d42f27da207b', 'example-photo-3.jpg', 'Example photo 3', 'This is a photo description.
The photo has been downloaded from [https://unsplash.com/search/photos/sample](https://unsplash.com/search/photos/sample)
'),
       ('08beec18-4593-4a43-b404-739a09fa6633', 'example-photo-4.jpg', 'Paris', 'This is a photo description.
The photo has been downloaded from [https://unsplash.com/search/photos/sample](https://unsplash.com/search/photos/sample)
'),

       ('b9773f6e-12ea-4c9d-8393-06c0a5b8a1c2', 'example-photo-5.jpg', 'Example photo 5', 'This is a photo description.
The photo has been downloaded from [https://unsplash.com/search/photos/sample](https://unsplash.com/search/photos/sample)
'),

       ('bf604923-ea85-41d8-93c6-a37bc0485649', 'example-photo-7.jpg', 'A laptop', 'This is a photo description.
The photo has been downloaded from [https://unsplash.com/search/photos/sample](https://unsplash.com/search/photos/sample)
');


insert into People (person_id, full_name, birth_date, Description)
values ('d97be831-2e4d-4e85-9b48-f0aa00705e07', 'John Smith', '1979-10-29', 'Example _person_'),
       ('87c8aeda-71aa-46ea-9b94-ea759bebf8ae', 'Benjamin Henderson', '1981-05-14',
        'Person created using random name generator'),
       ('e93ae5e0-8e5d-4329-b60a-fcb7f4aab109', 'Bob Hunter', '1975-01-08', 'This is also randomly generated name'),
       ('31b9dc34-982e-432d-acef-5d526fe25da5', 'Samuel Austin', '1990-12-11', 'This name is also generated, [https://www.fantasynamegenerators.com/english_names.php](https://www.fantasynamegenerators.com/english_names.php)
');

insert into Documents (document_id, Title, Type, Filename, Content)
VALUES ('a58e9971-365e-4ba0-94f5-a5ac01a43790', 'Task list', 'EXTERNAL', 'tasks.docx', null),
       ('f8199f27-303f-47e1-904c-abcd117b321a', 'Embedded document', 'EMBEDDED', null, '## Document title
Documents could also be **embedded** and use _markdown_ syntax!
 > This is a sample quote
### Subtitle
 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque leo arcu, et iaculis dui aliquet eu. In et magna eget elit placerat posuere. Mauris sodales, ante vitae cursus bibendum, mi dui venenatis tortor, a porta urna lectus at ante. Etiam porta, quam vitae dignissim rhoncus, augue est bibendum quam, ac varius nisl lacus at velit. Sed vestibulum libero ac sagittis venenatis. Integer non nibh eros. Donec laoreet pulvinar diam, in maximus libero vestibulum eget. Quisque a ultricies neque. Vestibulum consequat orci et ultricies accumsan. Donec volutpat orci neque, gravida scelerisque urna pretium vitae. Nulla volutpat, massa nec consectetur tristique, eros arcu interdum sapien, sodales vulputate erat sem vel risus. Praesent dolor diam, tempus sed arcu eget, maximus vestibulum justo. Aliquam ornare sollicitudin fringilla. Vivamus semper, purus non vestibulum varius, mi felis egestas sem, non sodales magna turpis non lacus. Cras arcu dui, iaculis a aliquam et, cursus a ipsum. In rhoncus volutpat iaculis.
');

insert into Reference (source_id, target_id)
values ('d97be831-2e4d-4e85-9b48-f0aa00705e07', 'f8199f27-303f-47e1-904c-abcd117b321a'),
       ('d0a74e3d-707c-4447-8d8e-d42f27da207b', 'b9773f6e-12ea-4c9d-8393-06c0a5b8a1c2'),
       ('5503ff00-21e8-47c4-87d6-803e50d50d3f', '87c8aeda-71aa-46ea-9b94-ea759bebf8ae'),
       ('e93ae5e0-8e5d-4329-b60a-fcb7f4aab109', '86048604-74cd-492e-b93e-5f347cbead4c'),
       ('a58e9971-365e-4ba0-94f5-a5ac01a43790', '31b9dc34-982e-432d-acef-5d526fe25da5'),
       ('b81763dc-4b7e-4af7-ad64-2af50cb74666', 'e20e5eed-dc07-463f-b763-3e508d994353'),
       ('d97be831-2e4d-4e85-9b48-f0aa00705e07', 'bf604923-ea85-41d8-93c6-a37bc0485649'),
       ('f02b2d8e-cb30-4a1f-b33c-395736cb1c93', 'd97be831-2e4d-4e85-9b48-f0aa00705e07'),
       ('f02b2d8e-cb30-4a1f-b33c-395736cb1c93', '08beec18-4593-4a43-b404-739a09fa6633'),
       ('e20e5eed-dc07-463f-b763-3e508d994353', '86048604-74cd-492e-b93e-5f347cbead4c'),
       ('f8199f27-303f-47e1-904c-abcd117b321a', '87c8aeda-71aa-46ea-9b94-ea759bebf8ae'),
       ('86048604-74cd-492e-b93e-5f347cbead4c', 'd0a74e3d-707c-4447-8d8e-d42f27da207b'),
       ('31b9dc34-982e-432d-acef-5d526fe25da5', 'e93ae5e0-8e5d-4329-b60a-fcb7f4aab109'),
       ('5503ff00-21e8-47c4-87d6-803e50d50d3f', 'd97be831-2e4d-4e85-9b48-f0aa00705e07'),
       ('86048604-74cd-492e-b93e-5f347cbead4c', '22526b6c-0667-4c08-b58c-823b098a94a9'),
       ('87c8aeda-71aa-46ea-9b94-ea759bebf8ae', '5503ff00-21e8-47c4-87d6-803e50d50d3f'),
       ('b81763dc-4b7e-4af7-ad64-2af50cb74666', '31b9dc34-982e-432d-acef-5d526fe25da5'),
       ('e93ae5e0-8e5d-4329-b60a-fcb7f4aab109', 'f8199f27-303f-47e1-904c-abcd117b321a'),
       ('d97be831-2e4d-4e85-9b48-f0aa00705e07', 'e20e5eed-dc07-463f-b763-3e508d994353');