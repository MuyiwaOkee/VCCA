from pydantic import BaseModel
from uuid import UUID

# request body for verify user credentials endpoint
class UserCredentialsRequest(BaseModel):
    email: str
    password: str

# response body for verify user credentials endpoint
class UserCredentialResponse(BaseModel):
    id: UUID
    email: str
    role: str
    sector: str | None = None