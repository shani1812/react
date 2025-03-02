# main.py
import logging

from bson.errors import InvalidId
from fastapi import FastAPI, status, Depends
from fastapi.exceptions import ValidationException, HTTPException

from fastapi.middleware.cors import CORSMiddleware
import jwt
from mongoengine import connect, NotUniqueError, DoesNotExist
from starlette.requests import Request
from starlette.responses import JSONResponse, Response, RedirectResponse

from models.user_model import UserSchema, LoginUserSchema
from routers.user_router import router as user_router
from routers.email_router import router as email_router
from mongoengine import ValidationError
import controllers.user_controller as user_controller

origins = ["*"]


def parse_jwt(token: str):
    try:
        return jwt.decode(token, options={"verify_signature": False})
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


app = FastAPI()

from fastapi import Request, Response
from typing import Callable


@app.middleware("http")
async def authenticate_request(request: Request, call_next: Callable):
    # Only apply the middleware to paths that start with /api
    if request.url.path.startswith("/api"):
        token = request.cookies.get("access-token")
        if token:
            try:
                # Assuming parse_jwt is a function to decode and validate the JWT token
                request.state.user = parse_jwt(token)
                response = await call_next(request)
                return response
            except Exception:
                return Response("Authentication required", status_code=401)
        else:
            return Response("Authentication required", status_code=401)

    # If the path doesn't start with "/api", just proceed without authentication
    response = await call_next(request)
    return response


@app.post("/users", response_model=UserSchema, status_code=201)
async def create_user(user: UserSchema):
    created_user = await user_controller.create_user(user)

    return created_user


@app.post("/users/login",response_model=UserSchema, status_code=200)
async def login(user: LoginUserSchema):
    return await user_controller.login(user)

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse

app = FastAPI()

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse

app = FastAPI()


def get_jwt_from_request(request: Request):
    jwt_token = request.query_params.get("jwt")
    if not jwt_token:
        raise HTTPException(status_code=400, detail="Missing JWT token")
    return jwt_token


@app.get("/callback")
def auth_callback(request: Request, jwt_token: str = Depends(get_jwt_from_request)):
    try:
        relay_state = request.query_params.get("RelayState", "http://localhost:5173/")  # Default frontend URL

        response = RedirectResponse(url=relay_state)
        response.set_cookie(key="access-token", value=jwt_token)
        return response
    except Exception:
        raise HTTPException(status_code=403, detail="Unauthorized")


app.include_router(email_router, prefix="/api/emails")
app.include_router(user_router, prefix="/api/users")


@app.exception_handler(Exception)
async def handle_errors(_: Request, exc: Exception):
    status_code = 500
    if isinstance(exc, ValidationError) or isinstance(exc, ValidationException) or isinstance(exc,
                                                                                              NotUniqueError) or isinstance(
        exc, InvalidId):
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
