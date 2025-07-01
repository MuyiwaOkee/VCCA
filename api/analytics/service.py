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
                AnalyticsPalette.stroke_hex.label('stroke_hex')
            )
            .join(AnalyticsCategory, AnalyticsSource.category_id == AnalyticsCategory.id)
            .join(AnalyticsSector, AnalyticsSource.sector_id == AnalyticsSector.id)
            .join(AnalyticsPalette, AnalyticsSource.palette_id == AnalyticsPalette.id)
            .order_by(AnalyticsCategory.display_order, AnalyticsSector.name)
            .all()
        )

        # Format as list of dicts
        sources = [
            {
                **source.__dict__,
                "category_name": category_name,
                "sector_name": sector_name,
                "stroke_hex": stroke_hex,
                "fill_hex": fill_hex
            }
            # analytic_source_reponse(
            #     id=source.id,
            #     category_name=category_name,
            #     sector_name=sector_name,
            #     country_iso_code=source.country_iso_code,
            #     value_is_percent=source.value_is_percent,
            #     currency_iso_code=source.currency_iso_code,
            #     palette_id=source.palette_id,
            #     description=source.description,
            #     period=source.period_id,
            #     unit=source.unit,
            #     stroke_hex=stroke_hex,
            #     fill_hex=fill_hex
            # )
            for source, category_name, sector_name, fill_hex, stroke_hex  in results
        ]
        return sources
    except Exception as e:
        raise e