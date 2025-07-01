from pydantic import BaseModel
from datetime import datetime

# response classes for get all sources endpoint
class analytic_source_reponse(BaseModel):
    id = str,
    category = str,
    sector = str | None,
    country_iso_code = str,
    value_is_percent = bool,
    currency_iso_code = str,
    palette_id = str,
    description = str | None,
    period = str,
    unit = str,

class sources_reponse(BaseModel):
    sources: list[analytic_source_reponse]

# reponse classes for get data source by id
class analytic_datapoint_reponse(BaseModel):
    value = float
    creation_date_utc = datetime
    is_forecast = bool

class datapoint_from_source_reponse(BaseModel):
    datapoints: list[analytic_datapoint_reponse]

class datapoint_from_sources_reponse(BaseModel):
    data: list[datapoint_from_source_reponse]
