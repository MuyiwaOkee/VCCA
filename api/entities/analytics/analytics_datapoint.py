from sqlalchemy import Column, Boolean, Date, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database.core import Base

# SQL analytics datapoint table
class AnalyticsDatapoint(Base):
    __tablename__ = "analytics_datapoint"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id = Column(UUID(as_uuid=True), ForeignKey("analytics_source.id"), nullable=False)
    value = Column(Numeric(19, 4), nullable=False) 
    creation_date_utc = Column(Date, nullable=False)
    is_forecast = Column(Boolean, nullable=False)

    def __repr__(self):
        return f"<AnalyticsDatapoint(id={self.id}, value={self.value}, forecast={self.is_forecast})>"