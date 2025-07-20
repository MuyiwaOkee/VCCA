import datetime
from xgboost import XGBRegressor
from fastapi import HTTPException, status
from analytics.model import datapoints_response, analytic_datapoint_reponse
import pandas as pd
from sqlalchemy.orm import Session
from predict.model import CreateSpendingPredictionRequest

def load_model():
    model = XGBRegressor()
    model.load_model('models_data/xgb_model.json')

    return model

def create_spending_predictions(db: Session, request: CreateSpendingPredictionRequest):
    try:
        # Load model
        model = load_model()

        # create record(s) for predicion
        X = pd.DataFrame({
            'mean_desposible_income': request.mean_desposible_income,
            'month': request.month,
            'interest_rate': request.interest_rate,
            'unemployment_rate': request.unemployment_rate,
        })
 
        # make prediction
        y_pred = model.predict(X)

        # send response
        y_pred_float = [
            analytic_datapoint_reponse(
                value=float(y_hat),
                creation_date_utc=datetime.date(request.year[index], request.month[index], 1),
                is_forecast=True
            )
            for index, y_hat in enumerate(y_pred)
            if request.month[index] is not None
        ]

        response = datapoints_response(
            stroke_hex='#023436',
            fill_hex='#06D6A0',
            is_value_percent=False,
            data=y_pred_float,
            source_id=None,
            unit=''
        )

        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )