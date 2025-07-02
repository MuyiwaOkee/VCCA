from fastapi import HTTPException, status
from sqlalchemy import extract, func
from analytics.model import analytic_source_reponse, analytic_datapoint_reponse
from entities.analytics.analytics_sources import AnalyticsSource
from entities.analytics.analytics_categories import AnalyticsCategory
from entities.analytics.analytics_sector import AnalyticsSector
from entities.analytics.analytics_palette import AnalyticsPalette
from entities.analytics.analytics_periods import AnalyticsPeriod
from entities.analytics.analytics_datapoint import AnalyticsDatapoint
from sqlalchemy.orm import Session
from sqlalchemy.exc import DatabaseError
from uuid import UUID
from datetime import datetime, date

def get_all_sources(db: Session):
    try:
        results = (
            db.query(
                AnalyticsSource,
                AnalyticsCategory.name.label("category_name"),
                AnalyticsSector.name.label("sector_name"),
                AnalyticsPalette.fill_hex.label('fill_hex'),
                AnalyticsPalette.stroke_hex.label('stroke_hex'),
                AnalyticsPeriod.name.label('period_name')
            )
            .join(AnalyticsCategory, AnalyticsSource.category_id == AnalyticsCategory.id)
            .join(AnalyticsSector, AnalyticsSource.sector_id == AnalyticsSector.id)
            .join(AnalyticsPalette, AnalyticsSource.palette_id == AnalyticsPalette.id)
            .join(AnalyticsPeriod, AnalyticsSource.period_id == AnalyticsPeriod.id)
            .order_by(AnalyticsCategory.display_order, AnalyticsSector.name)
            .all()
        )

        # if no sources found in the database, raise a 404 reponse       
        if(len(results) == 0):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No analytic sources found"
            )


        # Format as list of dicts
        sources = [
            analytic_source_reponse(
                id=source.id,
                category_name=category_name,
                sector_name=sector_name,
                country_iso_code=source.country_iso_code,
                value_is_percent=source.value_is_percent,
                currency_iso_code=source.currency_iso_code,
                description=source.description,
                period=period_name,
                unit=source.unit,
                stroke_hex=stroke_hex,
                fill_hex=fill_hex
            )
            for source, category_name, sector_name, fill_hex, stroke_hex, period_name in results
        ]

        return sources
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
    finally:
        db.close()

def get_datapoints_from_source(db: Session, source_id: UUID, year: int, period: str):
    # quick argument checking before querying
    if period != 'monthly' and period != 'quarterly':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid period'
        )
    
    # if the user is querying for a future year, return an empty list
    if year > datetime.now().year:
        return []
    
    try:
        if period == 'monthly':
            datapoints = db.query(AnalyticsDatapoint).filter(
            AnalyticsDatapoint.source_id == source_id, 
            extract('year', AnalyticsDatapoint.creation_date_utc) == year
            ).order_by(AnalyticsDatapoint.creation_date_utc).all()
            
            response = [
                analytic_datapoint_reponse(
                    value=datapoint.value,
                    creation_date_utc=datapoint.creation_date_utc,
                    is_forecast=datapoint.is_forecast
                )
                for datapoint in datapoints
            ]

            return response
        else: # period is quarterly
             # First get the analytics_source record
            source = db.query(AnalyticsSource).filter(
                AnalyticsSource.id == source_id
            ).first()
            
            if not source:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail='Analytics source not found'
                )
            
            # Determine quarter start dates
            quarter_starts = [
                date(year, 1, 1),   # Q1
                date(year, 4, 1),    # Q2
                date(year, 7, 1),    # Q3
                date(year, 10, 1)   # Q4
            ]
            
            response = []
            
            for quarter_start in quarter_starts:
                quarter_end_month = quarter_start.month + 2
                quarter_end = date(year, quarter_end_month, 1)
                
                if source.value_is_percent:
                    # Get record with max value in quarter
                    datapoint = db.query(AnalyticsDatapoint).filter(
                        AnalyticsDatapoint.source_id == source_id,
                        AnalyticsDatapoint.creation_date_utc >= quarter_start,
                        AnalyticsDatapoint.creation_date_utc <= quarter_end
                    ).order_by(AnalyticsDatapoint.value.desc()).first()
                    
                    if datapoint:
                        response.append(analytic_datapoint_reponse(
                            value=float(datapoint.value),
                            creation_date_utc=quarter_start,
                            is_forecast=datapoint.is_forecast
                        ))
                else:
                    # Sum values in quarter
                    sum_result = db.query(
                        func.sum(AnalyticsDatapoint.value).label('total')
                    ).filter(
                        AnalyticsDatapoint.source_id == source_id,
                        AnalyticsDatapoint.creation_date_utc >= quarter_start,
                        AnalyticsDatapoint.creation_date_utc <= quarter_end
                    ).first()
                    
                    if sum_result and sum_result.total is not None:
                        response.append(analytic_datapoint_reponse(
                            value=float(sum_result.total),
                            creation_date_utc=quarter_start,
                            is_forecast=False  # Summed values don't preserve forecast status
                        ))
            
            return response
        
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable"
        )
     
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e
        )
    finally:
        db.close()