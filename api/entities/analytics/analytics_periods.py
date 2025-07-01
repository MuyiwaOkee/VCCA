from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database.core import Base

class AnalyticsPeriod(Base):
    __tablename__ = "analytics_periods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(10), unique=True, nullable=False)

    def __repr__(self):
        return f"<AnalyticsPeriod(id={self.id}, name='{self.name}')>"