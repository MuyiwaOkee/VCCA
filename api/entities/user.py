# Here we will create the layout for the db table user
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database.core import Base

class Users(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default='Business')
    sector = Column(String, nullable=True)