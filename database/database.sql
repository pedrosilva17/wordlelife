DROP TABLE IF EXISTS Wrestlers;

CREATE TABLE Wrestlers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    gender TEXT,
    date_of_birth TEXT,
    birth_place TEXT,
    country TEXT,
    cc TEXT,
    latitude REAL,
    longitude REAL,
    billed_from TEXT,
    height_ft TEXT,
    height_cm TEXT,
    weight_lbs TEXT,
    weight_kg TEXT,
    nicknames TEXT,
    promotion TEXT,
    alignment TEXT,
    finisher TEXT,
    theme_song TEXT
);