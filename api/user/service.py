from fastapi import HTTPException, status
from auth.model import UserCredentialResponse
from user.model import RegisterUserRequest
from entities.user import Users
from sqlalchemy.orm import Session
from uuid import uuid4, UUID
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError, DatabaseError

# Setup password hashing with salting
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# hashes plain password string
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# creates new user record in the database based on the information in the request body
def register_user(db: Session, request: RegisterUserRequest):
    try:
        # raise a 400 response if information is not provided
        if not request.email or not request.password or not request.role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing account details"
            )
        
        # Create new user based on the user table schema
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
        # if the email is currently on another user, throw error and raise 400 response
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

def get_user(db: Session, user_id: UUID):
    try:
        # raise a 400 response if information is missing
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User id not provided"
            )
    
        user = db.query(Users).filter(Users.id == user_id).first()
        
        response = UserCredentialResponse(
            id=user.id,
            email=user.email,
            role=user.role,
            sector=user.sector
        )
        
        return response
    except HTTPException as e:
        raise e
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