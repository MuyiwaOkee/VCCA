from fastapi import APIRouter, HTTPException
from database.core import DbSession
from starlette import status
from predict.service import create_spending_predictions
from predict.model import CreateSpendingPredictionRequest

router = APIRouter(
    prefix='/predict',
    tags=['predict']
)

# access the ML model and makes prediction(s) on spending data
@router.post('/', status_code=status.HTTP_200_OK)
async def create_spending_prediction_endpoint(db: DbSession, request: CreateSpendingPredictionRequest):
    try:
        return create_spending_predictions(db, request)
    except HTTPException as e:
        # Re-raise the HTTPException (from service) with original status code and detail
        raise e
              
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )