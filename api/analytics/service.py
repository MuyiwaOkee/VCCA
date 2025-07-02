from fastapi import HTTPException, status
from analytics.model import analytic_source_reponse
from entities.analytics.analytics_sources import AnalyticsSource
from entities.analytics.analytics_categories import AnalyticsCategory
from entities.analytics.analytics_sector import AnalyticsSector
from entities.analytics.analytics_palette import AnalyticsPalette
from entities.analytics.analytics_periods import AnalyticsPeriod
from sqlalchemy.orm import Session
from sqlalchemy.exc import DatabaseError

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