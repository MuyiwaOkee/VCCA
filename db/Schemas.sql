-- Create lookup tables first (due to foreign key dependencies)
CREATE TABLE analytics_periods (
    id UUID PRIMARY KEY NOT NULL,
    name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE analytics_palette (
    id UUID PRIMARY KEY NOT NULL,
    strokeHex VARCHAR(7) NOT NULL UNIQUE CHECK (strokeHex LIKE '#______'),
    fillHex VARCHAR(7) NOT NULL UNIQUE CHECK (fillHex LIKE '#______')
);

CREATE TABLE analytics_categories (
    id UUID PRIMARY KEY NOT NULL,
    name VARCHAR(50) UNIQUE NOT NULL,
    displayOrder INT NOT NULL UNIQUE
);

CREATE TABLE analytics_sector (
    id UUID PRIMARY KEY NOT NULL,
    name VARCHAR(50) UNIQUE NOT NULL,
    displayOrder INT NOT NULL
);

-- Main tables
CREATE TABLE analytics_source (
    id UUID PRIMARY KEY NOT NULL,
    category UUID NOT NULL REFERENCES analytics_categories(id),
    sector UUID REFERENCES analytics_sector(id),
    CountryISOCode CHAR(3) NOT NULL CHECK (LENGTH(CountryISOCode) = 3),
    valueIsPercent BOOLEAN NOT NULL DEFAULT FALSE,
    currencyISOCode CHAR(3) DEFAULT 'GBP' CHECK (currencyISOCode IS NULL OR LENGTH(currencyISOCode) = 3),
    PaletteId UUID NOT NULL REFERENCES analytics_palette(id),
    CreationDateUTC DATE NOT NULL,
    LastUpdatedUTC DATE NOT NULL,
    description NVARCHAR(100),
    Period UUID NOT NULL REFERENCES analytics_periods(id),
    unit VARCHAR(10) NOT NULL
);

CREATE TABLE analytics_datapoint (
    id UUID PRIMARY KEY NOT NULL,
    SourceId UUID NOT NULL REFERENCES analytics_source(id),
    value DECIMAL(19,4) NOT NULL,
    CreationDateUTC DATE NOT NULL,
    isForecast BOOLEAN NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_source_country_period ON analytics_source (CountryISOCode, Period);
CREATE INDEX idx_datapoint_source_date ON analytics_datapoint (SourceId, CreationDateUTC);