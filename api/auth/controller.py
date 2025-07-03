from fastapi import APIRouter, HTTPException, Response
from database.core import DbSession
from starlette import status
from auth.model import UserCredentialsRequest
from auth.service import verify_user_credentials, does_email_exist

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

# verify user credentials endpoint
@router.post('/verify', status_code=status.HTTP_200_OK)
async def verify_user_credentials_endpoint(db: DbSession, register_user_request: UserCredentialsRequest, response: Response):
    try:
        return verify_user_credentials(db, register_user_request)
    except HTTPException as e:
            # Re-raise the HTTPException (from service) with original status code and detail
            raise e
                
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )

# does email exist endpoint
@router.get('/email/{email}', status_code=status.HTTP_200_OK)
async def does_email_exist_endpoint(email:str, db: DbSession):
    try:
        return does_email_exist(db, email)
    except HTTPException as e:
        # Re-raise the HTTPException (from service) with original status code and detail
        raise e
            
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )