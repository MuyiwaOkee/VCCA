from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

# response classes for get all sources endpoint
class analytic_source_reponse(BaseModel):
    id: UUID
    category_name: str
    sector_name: Optional[str]
    country_iso_code: str
    value_is_percent: bool
    currency_iso_code: str
    description: Optional[str]
    period: str
    unit: str
    stroke_hex: str
    fill_hex: str

# reponse classes for get data source by id
class analytic_datapoint_reponse(BaseModel):
    value: float
    creation_date_utc: datetime
    is_forecast: bool

class datapoints_response(BaseModel):
    stroke_hex: str
    fill_hex: str
    is_value_percent: bool
    data: list[analytic_datapoint_reponse]