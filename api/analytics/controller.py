from fastapi import APIRouter, HTTPException, Response
from database.core import DbSession
from starlette import status
from analytics.service import get_all_sources, get_datapoints_from_source
from sqlalchemy.exc import DatabaseError
from uuid import UUID
from typing import Optional
from datetime import datetime

router = APIRouter(
    prefix='/analytics',
    tags=['analytics']
)

@router.get('/sources/all', status_code=status.HTTP_200_OK)
async def get_all_sources_endpoint(db: DbSession):
    try:
        return get_all_sources(db)
    except HTTPException as e:
        # Re-raise the HTTPException (from service) with original status code and detail
        raise e
            
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )
    
@router.get('/source/data/{source_id}', status_code=status.HTTP_200_OK)
async def get_datapoint_from_source_endpoint(db: DbSession, source_id: UUID, year: Optional[int] = datetime.now().year, period: Optional[str] = 'monthly'):
    try:
        return get_datapoints_from_source(db, source_id, year, period)
    except HTTPException as e:
        # Re-raise the HTTPException (from service) with original status code and detail
        raise e
            
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )