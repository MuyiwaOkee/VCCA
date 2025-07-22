import datetime
from xgboost import XGBRegressor
from fastapi import HTTPException, status
from analytics.model import datapoints_response, analytic_datapoint_reponse
import pandas as pd
from sqlalchemy.orm import Session
from predict.model import CreateSpendingPredictionRequest
from calendar import month_name

def load_model():
    model = XGBRegressor()
    model.load_model('models_data/xgb_model.json')

    return model

def create_spending_predictions(db: Session, request: CreateSpendingPredictionRequest):
    try:
        # check the data in the request body
        # 1. Check theres no duplicate months
        months_no_null = [m for m in request.month if m is not None]
        months_no_null_len = len(months_no_null)

        if months_no_null_len == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Invalid months'
            )

        # Make a set and get its length
        if len(set(months_no_null)) != months_no_null_len:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Duplicate month'
            )
        
        # 2. Check for predictions for past dates
        current_year = datetime.datetime.now().year
        has_past_year = any(y is not None and y < current_year for y in request.year)

        if has_past_year:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='date has already past'
            )
        
        current_month = datetime.datetime.now().month
        has_past_month = any(y is not None and y < current_month for y in request.month)

        if has_past_month:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'date has already past, the current month is {current_month}'
            )


        # 3. Check for incomplete data
        for index, month in enumerate(request.month):
            if month == None:
                continue

            mean_desposible_income = request.mean_desposible_income[index]
            interest_rate = request.interest_rate[index]
            unemployment_rate = request.unemployment_rate[index]

            if unemployment_rate == None or interest_rate == None or mean_desposible_income == None:
                raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'incomplete data needed to predict a spending value for the month of {month_name[month]}'
            )


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
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )