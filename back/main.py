import jwt
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse, RedirectResponse
from models.user_model import UserSchema, LoginUserSchema
from routers.user_router import router as user_router
from routers.email_router import router as email_router
import controllers.user_controller as user_controller
from mongoengine import connect, ValidationError, DoesNotExist, NotUniqueError

SECRET_KEY = "secret_key"
FRONT_URL = "http://localhost:5173"
app = FastAPI()
connect('emails_db')

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


@app.middleware("http")
async def authenticate_request(request: Request, call_next):
    if request.url.path.startswith("/api"):
        if request.method == "OPTIONS":
            response = await call_next(request)

            return response

        token = request.cookies.get("access-token")
        if not token:
            response = JSONResponse(content={"message": "Authentication required"}, status_code=401)

            return response

        try:
            request.state.user = parse_jwt(token)
        except HTTPException:
            response = JSONResponse(content={"message": "Invalid token"}, status_code=401)

            return response

    response = await call_next(request)
    return response


@app.post("/auth/signup", response_model=UserSchema, status_code=201)
async def create_user(user: UserSchema):
    return await user_controller.create_user(user)


@app.post("/auth/login", response_model=UserSchema, status_code=200)
async def login(user: LoginUserSchema):
    return await user_controller.login(user)

@app.get("/auth/{email}/availability", status_code=200)
async def login(email: str):
    return  {"available" : await user_controller.check_email_availability(email)}


@app.get("/auth/callback")
def auth_callback(request: Request):
    try:
        relay_state = f"{FRONT_URL}{request.query_params.get("relayState", FRONT_URL)}"
        jwt_token = request.query_params.get("jwt", FRONT_URL)
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
    if isinstance(exc, (ValidationError, NotUniqueError)):
        status_code = status.HTTP_400_BAD_REQUEST
    elif isinstance(exc, DoesNotExist):
        status_code = status.HTTP_404_NOT_FOUND

    return JSONResponse(
        status_code=status_code,
        content={"error": str(exc)},
    )



