from pydantic import BaseModel

class CreateSpendingPredictionRequest(BaseModel):
    mean_desposible_income: list[int]
    month: list[int]
    interest_rate: list[float]
    unemployment_rate: list[float]