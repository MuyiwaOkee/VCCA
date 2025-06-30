from fastapi import HTTPException, status
from auth.model import UserCredentialsRequest, UserCredentialResponse
from entities.user import Users
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy.exc import DatabaseError

# Setup password hashing (using bcrypt, with automatic salt generation)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if a plain-text password matches the hashed version."""
    return pwd_context.verify(plain_password, hashed_password)

def does_email_exist(db: Session, email: str):
    try:
        if not email or email == '':
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email not provided"
                )
        user = db.query(Users).filter(Users.email == email).first()

        if user != None:
            return True
        
        return False
    except HTTPException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided"
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

def verify_user_credentials(db: Session, request: UserCredentialsRequest):
    try:
        if not request.email or not request.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing account details"
            )
    
        user = db.query(Users).filter(Users.email == request.email).first()

        if not user or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid account credentials"
            )
        
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