from bson import ObjectId
from mongoengine import ValidationError

from models.user_model import User, UserSchema
from managers import user_manager as manager
from fastapi import HTTPException


async def create_user(user: UserSchema):
    return await manager.create_user(user)


async def get_user_by_id(user_id: ObjectId) -> User:
    return await manager.get_user_by_id(user_id)


async def get_user_by_email_address(email_address: str) -> User:
    return await manager.get_user_by_email_address(email_address)
