from collections import defaultdict
from fastapi import HTTPException, status
from sqlalchemy import and_, extract, func
from analytics.model import analytic_source_reponse, analytic_datapoint_reponse, datapoints_response
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
    
    query_result = db.query(
                AnalyticsSource.value_is_percent,
                AnalyticsPalette.fill_hex.label('fill_hex'),
                AnalyticsPalette.stroke_hex.label('stroke_hex'),
            ).filter(AnalyticsSource.id == source_id).join(AnalyticsPalette, AnalyticsSource.palette_id == AnalyticsPalette.id).first()
    
    is_value_percent, fill_hex, stroke_hex = query_result

    if not query_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Analytics source not found'
        )        
    
    try:
        if period == 'monthly':
            datapoints = db.query(AnalyticsDatapoint).filter(
            AnalyticsDatapoint.source_id == source_id, 
            extract('year', AnalyticsDatapoint.creation_date_utc) == year
            ).order_by(AnalyticsDatapoint.creation_date_utc).all()
            
            data = [
                analytic_datapoint_reponse(
                    value=datapoint.value,
                    creation_date_utc=datapoint.creation_date_utc,
                    is_forecast=datapoint.is_forecast
                )
                for datapoint in datapoints
            ]

            response = datapoints_response(
                stroke_hex=stroke_hex,
                fill_hex=fill_hex,
                is_value_percent=is_value_percent,
                data=data
            )

            return response
        else: # period is quarterly
            # Determine quarter start dates
            quarter_starts = [
                date(year, 1, 1),   # Q1
                date(year, 4, 1),    # Q2
                date(year, 7, 1),    # Q3
                date(year, 10, 1)   # Q4
            ]
            
            data = []
            
            for quarter_start in quarter_starts:
                quarter_end_month = quarter_start.month + 2
                quarter_end = date(year, quarter_end_month, 1)
                
                if is_value_percent:
                    # Get record with max value in quarter
                    datapoint = db.query(AnalyticsDatapoint).filter(
                        AnalyticsDatapoint.source_id == source_id,
                        AnalyticsDatapoint.creation_date_utc >= quarter_start,
                        AnalyticsDatapoint.creation_date_utc <= quarter_end
                    ).order_by(AnalyticsDatapoint.value.desc()).first()
                    
                    if datapoint:
                        data.append(analytic_datapoint_reponse(
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
                        data.append(analytic_datapoint_reponse(
                            value=float(sum_result.total),
                            creation_date_utc=quarter_start,
                            is_forecast=False  # Summed values don't preserve forecast status
                        ))

            response = datapoints_response(
                stroke_hex=stroke_hex,
                fill_hex=fill_hex,
                is_value_percent=is_value_percent,
                data=data
            )
            
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

def get_datapoints_from_sources(db: Session, source_ids: list[UUID], year: int, period: str):
    # quick argument checking before querying
    if period != 'monthly' and period != 'quarterly':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid period'
        )
    
    if len(source_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='no sources requested'
        )
    
    # if the user is querying for a future year, return an empty list
    if year > datetime.now().year:
        return []
    
    sources = db.query(
        AnalyticsSource.id,
        AnalyticsSource.value_is_percent,
        AnalyticsPalette.fill_hex.label('fill_hex'),
        AnalyticsPalette.stroke_hex.label('stroke_hex'),
    ).filter(
        AnalyticsSource.id.in_(source_ids)
    ).join(AnalyticsPalette, AnalyticsSource.palette_id == AnalyticsPalette.id
    ).all()
            
    if not sources:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='No sources found'
        )
    
    try:
        if period == 'monthly':
            datapoints = db.query(AnalyticsDatapoint).filter(
                and_(
                    AnalyticsDatapoint.source_id.in_(source_ids),
                    extract('year', AnalyticsDatapoint.creation_date_utc) == year
                )
            ).order_by(
                AnalyticsDatapoint.source_id,
                AnalyticsDatapoint.creation_date_utc
            ).all()
            
            response = []
            for id, is_value_percent, fill_hex, stroke_hex in sources:
                
                data = [
                    analytic_datapoint_reponse(
                        value=datapoint.value,
                        creation_date_utc=datapoint.creation_date_utc,
                        is_forecast=datapoint.is_forecast
                    )
                    for datapoint in datapoints if datapoint.source_id == id
                ]

                datapoints_response_dict = datapoints_response(
                    stroke_hex=stroke_hex,
                    fill_hex=fill_hex,
                    is_value_percent=is_value_percent,
                    data=data
                )

                response.append(datapoints_response_dict)

            return response
        else: # period is quarterly
            # Create a mapping of source_id to value_is_percent
            source_config = {s.id: s.value_is_percent for s in sources}
            
            # Define quarters
            quarters = [
                (1, date(year, 1, 1), date(year, 3, 31)),
                (2, date(year, 4, 1), date(year, 6, 30)),
                (3, date(year, 7, 1), date(year, 9, 30)),
                (4, date(year, 10, 1), date(year, 12, 31))
            ]
            
            results = defaultdict(list)

            for _, quarter_start, quarter_end in quarters:
                # For percent sources (get max value per quarter)
                percent_sources = [id for id, is_percent in source_config.items() if is_percent]
                if percent_sources:
                    max_values = db.query(
                        AnalyticsDatapoint.source_id,
                        func.max(AnalyticsDatapoint.value).label('max_value'),
                        func.max(AnalyticsDatapoint.creation_date_utc).label('latest_date')
                    ).filter(
                        and_(
                            AnalyticsDatapoint.source_id.in_(percent_sources),
                            AnalyticsDatapoint.creation_date_utc >= quarter_start,
                            AnalyticsDatapoint.creation_date_utc <= quarter_end
                        )
                    ).group_by(
                        AnalyticsDatapoint.source_id
                    ).all()
                    
                    for source_id, max_value, _ in max_values:
                        results[str(source_id)].append(analytic_datapoint_reponse(
                            value=float(max_value),
                            creation_date_utc=quarter_start,
                            is_forecast=False  # Would need additional logic to determine
                        ))

                # For non-percent sources (get sum per quarter)
                non_percent_sources = [id for id, is_percent in source_config.items() if not is_percent]
                if non_percent_sources:
                    sums = db.query(
                        AnalyticsDatapoint.source_id,
                        func.sum(AnalyticsDatapoint.value).label('total_value')
                    ).filter(
                        and_(
                            AnalyticsDatapoint.source_id.in_(non_percent_sources),
                            AnalyticsDatapoint.creation_date_utc >= quarter_start,
                            AnalyticsDatapoint.creation_date_utc <= quarter_end
                        )
                    ).group_by(
                        AnalyticsDatapoint.source_id
                    ).all()
                    
                    for source_id, total_value in sums:
                        results[str(source_id)].append(analytic_datapoint_reponse(
                            value=float(total_value),
                            creation_date_utc=quarter_start,
                            is_forecast=False
                        ))
            
            response = []
            for id, is_value_percent, fill_hex, stroke_hex in sources:

                datapoints_response_dict = datapoints_response(
                    stroke_hex=stroke_hex,
                    fill_hex=fill_hex,
                    is_value_percent=is_value_percent,
                    data=results[str(id)]
                )

                response.append(datapoints_response_dict)

            return response
        
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database unavailable"
        )
     
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e
        )
