from pydantic import BaseModel

# Request body for register user endpoint
class RegisterUserRequest(BaseModel):
    email: str
    password: str
    role: str
    sector: str | None = None