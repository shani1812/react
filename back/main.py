import jwt
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from routers.auth_router import router as auth_router
from routers.user_router import router as user_router
from routers.email_router import router as email_router
from mongoengine import connect, ValidationError, DoesNotExist, NotUniqueError

SECRET_KEY = "secret_key"
FRONT_URL = "http://localhost"
app = FastAPI()
connect('emails_db', host='mongodb://mongodb:27017/emails_db')


def parse_jwt(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONT_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_error_response(message: str, status_code: int):
    response = JSONResponse(content={"error": message}, status_code=status_code)
    response.headers["Access-Control-Allow-Origin"] = FRONT_URL
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.middleware("http")
async def authenticate_request(request: Request, call_next):
    if request.url.path.startswith("/api"):
        if request.method == "OPTIONS":
            response = await call_next(request)
            return response

        token = request.cookies.get("access-token")
        if not token:
            return create_error_response("Authentication required", 401)

        try:
            request.state.user = parse_jwt(token)
        except HTTPException:
            return create_error_response("Invalid token", 401)

    response = await call_next(request)
    return response



app.include_router(auth_router, prefix="/auth")
app.include_router(email_router, prefix="/api/emails")
app.include_router(user_router, prefix="/api/users")


@app.exception_handler(Exception)
async def handle_errors(request: Request, exc: Exception):
    status_code = 500
    if isinstance(exc, (ValidationError, NotUniqueError)):
        status_code = status.HTTP_400_BAD_REQUEST
    elif isinstance(exc, DoesNotExist):
        status_code = status.HTTP_404_NOT_FOUND

    return create_error_response(str(exc), status_code)

