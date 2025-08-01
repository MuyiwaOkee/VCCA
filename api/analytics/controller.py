from fastapi import APIRouter, HTTPException, Depends, Query
from database.core import DbSession
from starlette import status
from analytics.service import get_all_sources, get_datapoints_from_source, get_datapoints_from_sources
from uuid import UUID
from typing import List, Optional, Annotated
from datetime import datetime

router = APIRouter(
    prefix='/analytics',
    tags=['analytics']
)

# turns a string into a list of UUIDs. Used to turn the string search query param into UUIDs to query sources and datapoints for
def parse_uuid_list(source_ids: str) -> List[UUID]:
    result = []
    for id in source_ids.split(";"):
        id = id.strip()
        if not id:
            continue
        try:
            result.append(UUID(id))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{id}' is not a valid UUID"
            )
    return result

# create dependencies
Str_To_List_UUID = Annotated[list[UUID], Depends(parse_uuid_list)]
Year_Dependency = Annotated[Optional[int], Query(ge=2020, le=datetime.now().year)]

# get all sources endpoint
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

# get all datapoints from muliple sources endpoint
@router.get('/sources/data', status_code=status.HTTP_200_OK)
async def get_datapoint_from_sources_endpoint(db: DbSession, source_ids: Str_To_List_UUID, year: Year_Dependency = datetime.now().year, period: Optional[str] = 'monthly'):
    try:
        return get_datapoints_from_sources(db, source_ids, year, period)
    except HTTPException as e:
        # Re-raise the HTTPException (from service) with original status code and detail
        raise e
            
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )

# get datapoints from a single source endpoint
@router.get('/source/data/{source_id}', status_code=status.HTTP_200_OK)
async def get_datapoint_from_source_endpoint(db: DbSession, source_id: UUID, year: Year_Dependency = datetime.now().year, period: Optional[str] = 'monthly'):
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