CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--ITEM TYPE
drop table if exists Type cascade;
create table Type
(
    TypeCode CHAR(1)  NOT NULL,
    Name     CHAR(30) NOT NULL,
    CONSTRAINT Type_PK PRIMARY KEY (TypeCode),
    CONSTRAINT Type_AK UNIQUE (Name)
);

-- ENTITY BASE - ITEM
-- Only ItemID has auto-generated ID, all other entity types have same ID as Item
drop table if exists Items cascade;
create table Items
(
    ItemId          uuid DEFAULT uuid_generate_v4(),
    TypeCode        CHAR(1)   not null,
    CreatedDateTime timestamp not null,
    UpdatedDateTime timestamp not null,

    constraint Item_PK primary key (ItemId),
    constraint Item_to_Type_FK foreign key (TypeCode) references Type (TypeCode)
);

-- ENTITY TYPES
drop table if exists Story cascade;
create table Story
(
    StoryId       uuid,
    StoryDateTime timestamp not null,
    Header        varchar(255),
    Content       text      not null,

    constraint Story_PK primary key (StoryId),
    constraint Story_to_Item_FK foreign key (StoryId) references Items (ItemId) on delete cascade
);

drop table if exists Photos cascade;
create table Photos
(
    PhotoId     uuid,
    Filename    char(60) not null,
    Title       char(60) not null,
    Description text,

    constraint Photo_PK primary key (PhotoId),
    constraint Photo_to_Item_FK foreign key (PhotoId) references Items (ItemId) on delete cascade
);

drop table if exists People cascade;
create table People
(
    PersonId    uuid,
    FullName    char(50) not null,
    BirthDate   date,
    Description text,

    constraint People_PK primary key (PersonId),
    constraint People_to_Item_FK foreign key (PersonId) references Items (ItemId) on delete cascade
);

drop table if exists Documents;
create table Documents
(
    DocumentId uuid,
    Title      varchar(50) not null,
    Type       varchar(20) not null, -- Type, raw Enum Value, can be embedded markdown or external word/pdf
    Filename   varchar(60),
    Content    text,

    constraint Documents_PK primary key (DocumentId),
    constraint Docs_to_Item_FK foreign key (DocumentId) references Items (ItemId) on delete cascade
);

drop table if exists Files cascade;
create table Files
(
    FileId      uuid,
    Filename    char(60) not null,
    Title       char(60) not null,
    Description text,

    constraint File_PK primary key (FileId),
    constraint File_to_Item_FK foreign key (FileId) references Items (ItemId) on delete cascade
);

-- REFERENCE TABLE
drop table if exists Reference cascade;
create table Reference
(
    ReferenceId uuid DEFAULT uuid_generate_v4(),
    SourceId    uuid not null,
    TargetId    uuid not null,

    constraint Ref_PK primary key (ReferenceId),
    constraint Ref_AK unique (SourceId, TargetId),
    constraint Source_to_Item_FK foreign key (SourceId) references Items (ItemId) on delete cascade,
    constraint Target_to_Item_FK foreign key (TargetId) references Items (ItemId) on delete cascade
);

--ENTITY VIEWS - They are fetched by app
drop view if exists StoryView;
create view StoryView as
select I.ItemId AS Id,
       I.CreatedDateTime,
       I.UpdatedDateTime,
       S.Header,
       S.StoryDateTime,
       S.Content
from Items I
         JOIN Story S on I.ItemId = S.StoryId;

drop view if exists FileView;
create view FileView as
select I.ItemId AS Id,
       I.CreatedDateTime,
       I.UpdatedDateTime,
       F.Title,
       F.Filename,
       F.Description
from Items I
         JOIN Files F on I.ItemId = F.FileId;


drop view if exists PhotoView;
create view PhotoView as
select I.ItemId AS Id,
       I.CreatedDateTime,
       I.UpdatedDateTime,
       P.Title,
       P.Filename,
       P.Description
from Items I
         JOIN Photos P on I.ItemId = P.PhotoId;


drop view if exists DocumentView;
create view DocumentView as
select I.ItemId as Id,
       I.CreatedDateTime,
       I.UpdatedDateTime,
       D.Type,
       D.Title,
       D.Content,
       D.Filename
from Items I
         join Documents D on I.ItemId = D.DocumentId;


drop view if exists PersonView;
create view PersonView as
select I.ItemId as Id,
       I.CreatedDateTime,
       I.UpdatedDateTime,
       P.FullName,
       P.BirthDate,
       P.Description
from Items I
         join People P on I.ItemId = P.PersonId;


-- REFERENCE VIEW - THE ONLY RIGHT WAY TO ACCESS REFERENCES ;)
drop view if exists ReferenceView;
create view ReferenceView as
select I.ItemId    as Id,
       IT.TypeCode as Type,
       S.StoryDateTime,
       S.Header    as StoryHeader,
       F.Title     as FileTitle,
       P.FullName  as PersonName,
       D.Title     as DocumentTitle,
       P2.Title    as PhotoTitle
from Items I
         join Type IT on I.TypeCode = IT.TypeCode
         left join Story S on S.StoryId = I.ItemId
         left join People P on I.ItemId = P.PersonId
         left join Documents D on I.ItemId = D.DocumentId
         left join Photos P2 on I.ItemId = P2.PhotoId
         left join Files F on F.FileId = I.ItemId;

-- AND VERY USEFUL HELPER VIEWS
drop view if exists ReferencedIn;
create view ReferencedIn as
select RV.*,
       R.ReferenceId,
       R.TargetId
from ReferenceView RV
         join Reference R on R.SourceId = RV.Id;

drop view if exists ReferencesTo;
create view ReferencesTo as
select RV.*,
       R.ReferenceId,
       R.SourceId
from ReferenceView RV
         join Reference R on R.TargetId = RV.Id;

create or replace function reference_targets(source_id uuid)
    returns setof ReferencesTo
    language plpgsql
as
$$
begin
    return query select * from referencesto where SourceId = source_id;
end;
$$;

create or replace function reference_sources(target_id uuid)
    returns setof ReferencesTo
    language plpgsql
as
$$
begin
    return query select * from ReferencedIn where TargetId = target_id;
end;
$$
