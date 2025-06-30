from pydantic import BaseModel
from uuid import UUID

class UserCredentialsRequest(BaseModel):
    email: str
    password: str

class UserCredentialResponse(BaseModel):
    id: UUID
    email: str
    role: str
    sector: str | None = None