CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--ITEM TYPE
drop table if exists Type cascade;
create table Type
(
    type_code CHAR(1)  NOT NULL,
    Name     varCHAR(30) NOT NULL,
    CONSTRAINT Type_PK PRIMARY KEY (type_code),
    CONSTRAINT Type_AK UNIQUE (Name)
);

-- ENTITY BASE - ITEM
-- Only item_id has auto-generated ID, all other entity types have same ID as Item
drop table if exists Items cascade;
create table Items
(
    item_id          uuid DEFAULT uuid_generate_v4(),
    type_code        CHAR(1)   not null,
    created_at timestamp not null DEFAULT now(),
    updated_at timestamp not null DEFAULT now(),

    constraint Item_PK primary key (item_id),
    constraint Item_to_Type_FK foreign key (type_code) references Type (type_code)
);

-- ENTITY TYPES
drop table if exists Story cascade;
create table Story
(
    story_id       uuid,
    StoryDateTime timestamp not null,
    Header        varchar(255),
    Content       text      not null,

    constraint Story_PK primary key (story_id),
    constraint Story_to_Item_FK foreign key (story_id) references Items (item_id) on delete cascade
);

drop table if exists Photos cascade;
create table Photos
(
    photo_id     uuid,
    Filename    varchar(60) not null,
    Title       varchar(60) not null,
    Description text,

    constraint Photo_PK primary key (photo_id),
    constraint Photo_to_Item_FK foreign key (photo_id) references Items (item_id) on delete cascade
);

drop table if exists People cascade;
create table People
(
    person_id    uuid,
    full_name    varchar(50) not null,
    birth_date   date,
    Description text,

    constraint People_PK primary key (person_id),
    constraint People_to_Item_FK foreign key (person_id) references Items (item_id) on delete cascade
);

drop table if exists Documents;
create table Documents
(
    document_id uuid,
    Title      varchar(50) not null,
    Type       varchar(20) not null, -- Type, raw Enum Value, can be embedded markdown or external word/pdf
    Filename   varchar(60),
    Content    text,

    constraint Documents_PK primary key (document_id),
    constraint Docs_to_Item_FK foreign key (document_id) references Items (item_id) on delete cascade
);

drop table if exists Files cascade;
create table Files
(
    file_id      uuid,
    Filename    varchar(60) not null,
    Title       varchar(60) not null,
    Description text,

    constraint File_PK primary key (file_id),
    constraint File_to_Item_FK foreign key (file_id) references Items (item_id) on delete cascade
);

-- REFERENCE TABLE
drop table if exists Reference cascade;
create table Reference
(
    reference_id uuid DEFAULT uuid_generate_v4(),
    source_id    uuid not null,
    target_id    uuid not null,

    constraint Ref_PK primary key (reference_id),
    constraint Ref_AK unique (source_id, target_id),
    constraint Source_to_Item_FK foreign key (source_id) references Items (item_id) on delete cascade,
    constraint Target_to_Item_FK foreign key (target_id) references Items (item_id) on delete cascade
);

--ENTITY VIEWS - They are fetched by app
drop view if exists story_view;
create view story_view as
select I.item_id AS Id,
       I.created_at,
       I.updated_at,
       S.Header,
       S.StoryDateTime,
       S.Content
from Items I
         JOIN Story S on I.item_id = S.story_id;

drop view if exists file_view;
create view file_view as
select I.item_id AS Id,
       I.created_at,
       I.updated_at,
       F.Title,
       F.Filename,
       F.Description
from Items I
         JOIN Files F on I.item_id = F.file_id;


drop view if exists photo_view;
create view photo_view as
select I.item_id AS Id,
       I.created_at,
       I.updated_at,
       P.Title,
       P.Filename,
       P.Description
from Items I
         JOIN Photos P on I.item_id = P.photo_id;


drop view if exists document_view;
create view document_view as
select I.item_id as Id,
       I.created_at,
       I.updated_at,
       D.Type,
       D.Title,
       D.Content,
       D.Filename
from Items I
         join Documents D on I.item_id = D.document_id;


drop view if exists person_view;
create view person_view as
select I.item_id as Id,
       I.created_at,
       I.updated_at,
       P.full_name,
       P.birth_date,
       P.Description
from Items I
         join People P on I.item_id = P.person_id;


-- REFERENCE VIEW - THE ONLY RIGHT WAY TO ACCESS REFERENCES ;)
drop view if exists reference_view;
create view reference_view as
select I.item_id    as Id,
       IT.type_code as Type,
       S.StoryDateTime,
       S.Header    as StoryHeader,
       F.Title     as FileTitle,
       P.full_name  as PersonName,
       D.Title     as DocumentTitle,
       P2.Title    as PhotoTitle
from Items I
         join Type IT on I.type_code = IT.type_code
         left join Story S on S.story_id = I.item_id
         left join People P on I.item_id = P.person_id
         left join Documents D on I.item_id = D.document_id
         left join Photos P2 on I.item_id = P2.photo_id
         left join Files F on F.file_id = I.item_id;

-- AND VERY USEFUL HELPER VIEWS
drop view if exists referenced_in;
create view referenced_in as
select RV.*,
       R.reference_id,
       R.target_id
from reference_view RV
         join Reference R on R.source_id = RV.Id;

drop view if exists references_to;
create view references_to as
select RV.*,
       R.reference_id,
       R.source_id
from reference_view RV
         join Reference R on R.target_id = RV.Id;

create or replace function reference_targets(source_item_id uuid)
    returns setof references_to
    language plpgsql
as
$$
begin
    return query select * from references_to where source_id = source_item_id;
end;
$$;

create or replace function reference_sources(target_item_id uuid)
    returns setof references_to
    language plpgsql
as
$$
begin
    return query select * from referenced_in where target_id = target_item_id;
end;
$$
