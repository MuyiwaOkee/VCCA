from fastapi import APIRouter
from starlette import status

router = APIRouter(
    prefix='/health',
    tags=['health']
)

# get checks if the api is alive
@router.get('/alive', status_code=status.HTTP_200_OK)
async def alive_endpoint():
   return {'message' : 'alive'}