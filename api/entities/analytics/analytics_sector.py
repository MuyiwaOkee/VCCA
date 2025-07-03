from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database.core import Base
from sqlalchemy.orm import validates

# SQL analytics sector table
class AnalyticsSector(Base):
    __tablename__ = "analytics_sector"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)
    display_order = Column(Integer, nullable=False)

    def __repr__(self):
        return f"<AnalyticsSector(id={self.id}, name='{self.name}', order={self.displayOrder})>"

    #validation for displayOrder to prevent negative numbers
    @validates('displayOrder')
    def validate_display_order(self, key, order):
        if order < 0:
            raise ValueError("Display order must be non-negative")
        return order