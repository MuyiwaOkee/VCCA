from pydantic import BaseModel

class CreateSpendingPredictionRequest(BaseModel):
    mean_desposible_income: list[int | None]
    month: list[int| None]
    year: list[int| None]
    interest_rate: list[float| None]
    unemployment_rate: list[float| None]