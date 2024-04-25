DROP TABLE IF EXISTS Account CASCADE;

CREATE TABLE Account (
    email VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    password VARCHAR(60) NOT NULL,
    is_admin BOOLEAN DEFAULT false
);

INSERT INTO Account (email, name, first_name, password, is_admin) VALUES 
('superadmin@slack.be', 'super', 'admin', '$2b$10$dv3c/.ECUGdW3yw0O42XTuV.z3fjDIbegF1nalqRJxNlZeLnPAVFC', true),    
('logan.stls@gmail.com', 'Staelens', 'Logan', '$2b$10$gqxPAbow6oOLbZh3kkGqLuehHP2j/4En2GSImZb47JNfhywU1BG3u', true);

INSERT INTO Account (email, name, first_name, password) VALUES 
('etu48643@henallux.be', 'Frémy', 'Justin', '$2b$10$ijwQvy3iQTN7ERMIrPuEjudkKENt19NaR7hxDMzVuetLLEVURIK/W'),
('eut5789@henallux.be', 'Marton', 'Cédric', '$2b$10$8ECOBKkPAwyH3ng0NrKBVOgCKXZmhMcrJ0ldWYhpR5t4unbA/xYjy'),
('gesimon8363@gmail.com', 'Georges', 'Simon', '$2b$10$ePgsLSMgbYQjuBwIOw4U2ekh17en1ntjAMReKkfrd2RAl7ouB/Ulq'),
('nathantherasse@gmail.com', 'Therasse', 'Nathan', '$2b$10$5XhCZrhRNX6UteNtcY0.COvkNjtxwJ8ebxOMivU3EeVVbURB6AsFO'),
('cyrilbaras@gmail.com', 'Baras', 'Cyril', '$2b$10$V9pdVOlDn8rZLKoSlBaYLufK4vksB.K/6gIn3Ub1XU9cd93Z8jXAu');

DROP TABLE IF EXISTS Garden CASCADE;

CREATE TABLE Garden (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    date DATE NOT NULL,
    plan JSON NOT NULL
);
INSERT INTO Garden (date, name, address, plan) VALUES
(NOW(), 'Potager Glycosine', 'Rue des Martyrs 33,#4587 Hibou#Belgique', '{
    "meta": {
        "sizeX": 5,
        "sizeY": 4
    },
    "content": [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]
}'),

(NOW(), 'Potager Bitumine', 'Rue des Bidonvilles 666,#9999 Baras#Belgique', '{
    "meta": {
        "sizeX": 5,
        "sizeY": 8
    },
    "content": [
        [1, 0, 0, 0, 0],
        [1, 0, 0, 1, 1],
        [1, 1, 1, 1, 1],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]
}'),

(NOW(), 'Potager Beyne', 'Rue de la Laderie 2b,#5080 Emines#Belgique', '{
    "meta": {
        "sizeX": 8,
        "sizeY": 3
    },
    "content": [
        [0, null, 1, null, 2, null, 3, null],
        [0, null, 1, null, 2, null, 3, null],
        [0, null, 1, null, 2, null, 3, null]
    ]
}'),
(NOW(), 'Le monde de la choucroute', 'Rue de la chouchroute 14,# 1414 CrouteChou#Belgique', '{
    "meta": {
        "sizeX": 5,
        "sizeY": 4
    },
    "content": [
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
    ]
}');



DROP TABLE IF EXISTS Affiliation CASCADE;

CREATE TABLE Affiliation (
    garden_id BIGINT REFERENCES Garden(id) ON DELETE CASCADE,
    user_id VARCHAR REFERENCES Account(email) ON DELETE CASCADE,
    role VARCHAR NOT NULL,
    join_date DATE NOT NULL,
    PRIMARY KEY (garden_id, user_id)
);

INSERT INTO Affiliation (garden_id, user_id, role, join_date) VALUES
(1, 'logan.stls@gmail.com', 'affiliate', '2023-10-22 00:00:00'),
(2, 'logan.stls@gmail.com', 'admin', '2023-10-23 00:00:00'),
(1, 'gesimon8363@gmail.com', 'admin', '2023-10-24 00:00:00'),
(2, 'gesimon8363@gmail.com', 'affiliate', '2023-10-25 00:00:00'),
(2, 'nathantherasse@gmail.com', 'affiliate', '2023-10-26 00:00:00'), 
(2, 'cyrilbaras@gmail.com', 'affiliate', NOW()), 
(3, 'nathantherasse@gmail.com', 'admin', NOW()),             
(3, 'logan.stls@gmail.com', 'affiliate', NOW()),
(4, 'cyrilbaras@gmail.com', 'admin', NOW()); 


DROP TABLE IF EXISTS Area CASCADE;

CREATE TABLE Area (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    garden_id BIGINT REFERENCES Garden(id) ON DELETE CASCADE,
    area_index INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    description VARCHAR
);

INSERT INTO Area(garden_id, area_index, name, description) VALUES (2, 0, 'Carottes', 'In pretium maximus semper. Curabitur molestie ullamcorper sem. Aliquam justo dui, auctor eget volutpat vitae, fermentum vel justo. Integer ullamcorper, libero eget varius pellentesque, quam arcu imperdiet magna, eget imperdiet velit dui quis nisl. Mauris porta lorem lobortis lectus porta imperdiet. Sed ut interdum justo. Aliquam leo ex, feugiat ut lacus id, pretium ultrices risus. Nulla sagittis bibendum lorem sit amet interdum. Ut in dignissim diam, non euismod nisl. Curabitur vitae metus at odio dignissim porta. Integer a egestas augue, eget mattis libero. Quisque viverra sem sed odio accumsan, eget dignissim turpis aliquam. Suspendisse nunc massa, facilisis dictum nisl nec, luctus volutpat diam. Vivamus sem nunc, auctor sit amet libero at, pellentesque iaculis sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi nec libero sed ex feugiat gravida. Mauris vel erat pellentesque, aliquet ex at, consequat risus. Nunc efficitur posuere elit, et semper est laoreet et. Duis venenatis turpis non mi lobortis, nec scelerisque quam pellentesque. Proin ornare sollicitudin dui nec lobortis. Vivamus pulvinar purus in nulla luctus, ut pellentesque lectus lacinia.');
INSERT INTO Area(garden_id, area_index, name) VALUES 
(2, 1, 'Pattates'),
(3, 0, 'Potiron'),  
(3, 1, 'Carottes'),  
(3, 2, 'Tomates'),  
(3, 3, 'Courgette'),
(4, 1, 'Choux blanc');


DROP TABLE IF EXISTS Task CASCADE;

CREATE TABLE Task (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    area_id BIGINT REFERENCES Area(id) ON DELETE CASCADE,
    title VARCHAR  NOT NULL,
    description VARCHAR,
    start_date TIMESTAMP NOT NULL,
    deadline_date TIMESTAMP NOT NULL,
    validated BOOLEAN DEFAULT FALSE
);

INSERT INTO Task (area_id, title, description, start_date, deadline_date, validated) VALUES
(1, 'Sed pulvinar', 'Praesent nec tortor eros. Etiam quis sapien sed nulla pretium eleifend. Pellentesque quis sem sollicitudin, laoreet ligula sed, vestibulum elit. Proin eros lectus, condimentum non posuere sed, sollicitudin sit amet diam.', '2023-11-15 00:00:00', '2024-02-16 00:00:00', false),
(1, 'Curabitur convallis', 'Sed egestas sollicitudin metus quis mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur aliquet, velit pharetra auctor molestie, quam libero volutpat magna, non pellentesque libero ligula vel tellus.', '2023-10-12 00:00:00', '2024-03-14 00:00:00', false),
(1, 'Nunc tristique', 'Aliquam porta semper ex nec ultricies. Nulla vel fringilla justo. Quisque eu rhoncus tortor. Integer malesuada lectus mauris, ut semper ligula sodales sit amet. Maecenas nec tellus venenatis, condimentum ex sed, auctor enim. In tempus dictum risus, eget imperdiet nulla dictum vitae. Morbi sollicitudin aliquam metus eget consectetur. Nam ullamcorper, orci at scelerisque volutpat, ante sem malesuada turpis, vitae blandit urna augue quis leo.', '2023-10-15 00:00:00', '2024-03-14 00:00:00', true),
(1, 'Vivamus faucibus', 'Nam et venenatis mi. Integer at nisl fringilla, eleifend arcu a, gravida tortor. Morbi in scelerisque sem. Nunc laoreet nisi ut lacus aliquet venenatis. Aliquam rutrum tellus nibh, quis suscipit justo vestibulum id. Duis et egestas ligula, sit amet dictum elit. Duis dignissim nisl sed hendrerit imperdiet. Fusce a ex ac purus eleifend malesuada. Fusce ultricies ornare urna, eu commodo mauris porttitor ornare.', '2023-10-18 00:00:00', '2023-12-14 00:00:00', false),
(2, 'Duis vulputate', 'Nulla vitae fermentum sapien, nec sodales turpis. Vestibulum elementum risus eget turpis tempor cursus. Phasellus at consequat lacus. Nullam feugiat lacus ut ante cursus, eget egestas nibh aliquet. Aenean a lacus a nibh efficitur lobortis. Phasellus interdum quis dui tristique sollicitudin. Maecenas at tempor orci. Ut ut eros ut libero euismod maximus sit amet nec mauris. Donec at ullamcorper eros, non sollicitudin nibh. Sed aliquet velit risus, eget maximus lectus consequat quis. Ut vestibulum tellus in tellus egestas efficitur.', '2023-10-19 00:00:00', '2024-03-14 00:00:00', false),
(2, 'Nunc lacinia', 'Sed maximus felis sem, non iaculis ligula commodo ut. In molestie risus nisl. Donec porta venenatis tortor eget finibus. Phasellus sit amet vestibulum sapien. Phasellus odio augue, ultricies id tortor id, laoreet dictum massa. Duis tristique maximus massa, et cursus eros venenatis a. Praesent vulputate felis quis est imperdiet viverra in sed mauris. Vivamus venenatis augue sed turpis rhoncus ultrices. Donec sollicitudin, elit sit amet malesuada placerat, nunc libero laoreet orci, vitae aliquam metus lectus vitae nisi. Vivamus tristique ullamcorper quam, quis laoreet nibh accumsan id. Sed mollis odio nec mauris congue, et mattis urna maximus. Maecenas at lacus ut dui aliquam molestie quis id lorem.', '2023-10-22 00:00:00', '2024-03-14 00:00:00', false),
(2, 'Vestibulum', 'Nullam viverra odio quis odio laoreet, sit amet fermentum est posuere. Cras semper dui eget velit lacinia venenatis. Maecenas gravida molestie lacus. Praesent interdum elit id orci condimentum, a scelerisque sem consectetur. In nec feugiat felis. Duis mollis ligula purus, sed porttitor tellus lacinia sed. Proin fermentum est sem, sed blandit tellus dignissim sit amet. Nunc suscipit tellus sit amet felis varius, tincidunt euismod augue feugiat. Curabitur mollis iaculis arcu, sit amet fermentum tortor elementum ac. Integer volutpat elit a mauris vehicula interdum.', '2023-10-23 00:00:00', '2024-03-14 00:00:00', false),
(1, 'Tempus', 'Aliquam posuere elit et tellus sagittis, sit amet facilisis quam aliquam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque mollis nisi in diam dapibus auctor. Donec tincidunt risus vitae risus dapibus, nec iaculis felis vulputate. Mauris placerat elit in porta tincidunt. Suspendisse ultrices porta mauris, vel iaculis purus interdum nec. Ut pellentesque dapibus dui, interdum dapibus odio sollicitudin eget. In fermentum elit volutpat felis pharetra, sed mattis mi aliquet. Donec viverra risus turpis, id aliquam nisl feugiat quis. Quisque elementum erat vitae neque vestibulum ornare. Curabitur egestas dolor eu felis ultricies, ut pulvinar lacus ultrices. Vestibulum blandit sem mauris, vitae lobortis tellus dapibus sit amet.', '2023-10-25 00:00:00', '2024-02-14 00:00:00', false),
(2, 'Pellentesque ', 'Duis sollicitudin tortor dictum augue bibendum, eget vulputate dui sagittis. Praesent nisl metus, malesuada ut nisi ut, pretium dictum nisl. Ut blandit orci ultricies molestie tempus. Ut scelerisque nibh magna, sit amet pulvinar sem condimentum consectetur. Sed mi neque, ultrices vitae arcu gravida, congue accumsan urna. Curabitur lobortis consectetur libero ut gravida. Sed in est nec eros faucibus varius non et eros. Nam vel vestibulum enim.', '2023-10-29 00:00:00', '2024-03-14 00:00:00', false);
