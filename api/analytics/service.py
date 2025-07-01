from fastapi import HTTPException, status
from entities.analytics.analytics_sources import AnalyticsSource
from entities.analytics.analytics_categories import AnalyticsCategory
from entities.analytics.analytics_sector import AnalyticsSector
from sqlalchemy.orm import Session
from sqlalchemy.exc import DatabaseError

def get_all_sources(db: Session):
    try:
        sources = db.query(AnalyticsSource).join(AnalyticsCategory, AnalyticsSource.category_id == AnalyticsCategory.id).join(AnalyticsSector, AnalyticsSource.sector_id == AnalyticsSector.id).order_by(AnalyticsCategory.display_order, AnalyticsSector.name).all()

        return sources
    except Exception as e:
        raise e