from fastapi import HTTPException, status
from auth.model import UserCredentialsRequest, UserCredentialResponse
from entities.user import Users
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy.exc import DatabaseError

# Setup password hashing and salting
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# checks if an unhashed password string matches the hashed password in the database
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if a plain-text password matches the hashed version."""
    return pwd_context.verify(plain_password, hashed_password)

# checks if the email provided already exists in the database. returns true if a user is found, and false if otherwise
def does_email_exist(db: Session, email: str):
    try:
        # raise 400 response if the email is not provided
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

# checks if the user has valid credentials to log in, and returns the user information if so.
def verify_user_credentials(db: Session, request: UserCredentialsRequest):
    try:
        # raise a 400 response if information is missing
        if not request.email or not request.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing account details"
            )
    
        user = db.query(Users).filter(Users.email == request.email).first()

        # if a user is not found or the password for the user is incorrect, return a 401
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