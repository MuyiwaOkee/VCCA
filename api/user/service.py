from fastapi import HTTPException, status
from user.model import RegisterUserRequest
from entities.user import Users
from sqlalchemy.orm import Session
from uuid import uuid4
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError, DatabaseError

# Setup password hashing (using bcrypt, with automatic salt generation)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def register_user(db: Session, request: RegisterUserRequest):
    try:
        if not request.email or not request.password or not request.role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing account details"
            )
        
        create_user_model = Users(
            id=uuid4(),
            email=request.email,
            password_hash = hash_password(request.password),
            role = request.role,
            sector = request.sector
        )

        db.add(create_user_model)
        db.commit()
    except IntegrityError as e:
        db.rollback()
        if "duplicate key" in str(e).lower() or "unique constraint" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid data provided"
        )
        
    except DatabaseError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable"
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
