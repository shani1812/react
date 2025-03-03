from fastapi import APIRouter
from starlette.exceptions import HTTPException
from starlette.requests import Request
from starlette.responses import RedirectResponse

from controllers import user_controller
from models.user_model import UserSchema, LoginUserSchema

router = APIRouter()
FRONT_URL = "https://localhost"
@router.post("/signup", response_model=UserSchema, status_code=201)
async def create_user(user: UserSchema):
    return await user_controller.create_user(user)

@router.post("/login", response_model=UserSchema, status_code=200)
async def login(user: LoginUserSchema):
    return await user_controller.login(user)

@router.get("/{email}/availability", status_code=200)
async def login(email: str):
    return {"available": await user_controller.check_email_availability(email)}

@router.get("/callback")
def auth_callback(request: Request):
    try:
        relay_state = f"{FRONT_URL}{request.query_params.get('relayState', FRONT_URL)}"
        jwt_token = request.query_params.get("jwt", FRONT_URL)
        response = RedirectResponse(url=relay_state)
        response.set_cookie(key="access-token", value=jwt_token)
        return response
    except Exception:
        raise HTTPException(status_code=403, detail="Unauthorized")