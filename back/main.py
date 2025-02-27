# main.py
from bson.errors import InvalidId
from fastapi import FastAPI, status
from fastapi.exceptions import ValidationException


from fastapi.middleware.cors import CORSMiddleware
from mongoengine import connect, NotUniqueError, DoesNotExist
from starlette.requests import Request
from starlette.responses import JSONResponse

from routers.user_router import router as user_router
from routers.email_router import router as email_router
from mongoengine import ValidationError

origins = ["*"]
app = FastAPI()

app.include_router(email_router, prefix="/emails")
app.include_router(user_router, prefix="/users")


@app.exception_handler(Exception)
async def handle_errors(_: Request,exc: Exception):
    status_code = 500
    if isinstance(exc,ValidationError) or isinstance(exc,ValidationException) or isinstance(exc,NotUniqueError) or isinstance(exc, InvalidId):
        status_code = status.HTTP_400_BAD_REQUEST
    elif isinstance(exc, DoesNotExist):
        status_code = status.HTTP_404_NOT_FOUND


    return JSONResponse(
        status_code=status_code,
        content={"error": str(exc)},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connect('emails_db')


@app.get("/")
async def root():
    return {"message": "Hello World"}