from fastapi import APIRouter, HTTPException, Request
from database.core import DbSession
from starlette import status
from user.model import RegisterUserRequest
from user.service import register_user, get_user
from uuid import UUID

router = APIRouter(
    prefix='/user',
    tags=['user']
)

# endpoint for user registration
@router.post('/', status_code=status.HTTP_201_CREATED)
async def register_user_endpoint(db: DbSession, register_user_request: RegisterUserRequest):
    try:
        register_user(db, register_user_request)
    except HTTPException as e:
        # Re-raise the HTTPException (from service) with original status code and detail
        raise e
        
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )

@router.get('/{user_id}', status_code=status.HTTP_200_OK)   
async def get_user_endpoint(db: DbSession, user_id: UUID):
    try:
        return get_user(db, user_id)
    except HTTPException as e:
        # Re-raise the HTTPException (from service) with original status code and detail
        raise e
        
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )

