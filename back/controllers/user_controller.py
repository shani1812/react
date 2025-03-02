from bson import ObjectId
from models.user_model import User, UserSchema, LoginUserSchema
from managers import user_manager as manager
from fastapi import HTTPException


async def create_user(user: UserSchema):
    return await manager.create_user(user)


async def get_user_by_id(user_id: ObjectId) -> User:
    return await manager.get_user_by_id(user_id)


async def get_user_by_email_address(email_address: ObjectId) -> User:
    return await manager.get_user_by_email_address(email_address)


async def login(user: LoginUserSchema):
    retrieved_user = await manager.get_user_by_email_address(user.email_address)

    if not retrieved_user.password == user.password:
        raise HTTPException(401, "user not found")

    return retrieved_user


async def check_email_availability(email: str):
    user = await manager.check_email_availability(email)

    if not user:
        return "True"
    else:
        return "False"

