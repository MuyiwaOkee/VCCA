from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database.core import Base

class AnalyticsPalette(Base):
    __tablename__ = "analytics_palette"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stroke_hex = Column(String(7), unique=True, nullable=False)
    fill_hex = Column(String(7), unique=True, nullable=False)

    def __repr__(self):
        return f"<AnalyticsPalette(id={self.id}, stroke='{self.strokeHex}', fill='{self.fillHex}')>"