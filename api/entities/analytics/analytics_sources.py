from sqlalchemy import Column, String, Boolean, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database.core import Base

# SQL analytics source table
class AnalyticsSource(Base):
    __tablename__ = "analytics_source"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(UUID(as_uuid=True), ForeignKey("analytics_categories.id"), nullable=False)
    sector_id = Column(UUID(as_uuid=True), ForeignKey("analytics_sector.id"), nullable=True)
    country_iso_code = Column(String(3), nullable=False)  # char(3) in SQL becomes String(3)
    value_is_percent = Column(Boolean, nullable=False, default=False)
    currency_iso_code = Column(String(3), nullable=True, default="GBP")
    palette_id = Column(UUID(as_uuid=True), ForeignKey("analytics_palette.id"), nullable=False)
    creation_date_utc = Column(Date, nullable=False)
    last_updated_utc = Column(Date, nullable=False)
    description = Column(String(100), nullable=True)
    period_id = Column(UUID(as_uuid=True), ForeignKey("analytics_periods.id"), nullable=False)
    unit = Column(String(10), nullable=False)

    def __repr__(self):
        return f"<AnalyticsSource(id={self.id}, country='{self.country_iso_code}')>"