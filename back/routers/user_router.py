import logging

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from controllers import user_controller as controller
from models.user_model import UserSchema

router = APIRouter()


@router.get("/{user_id}", response_model=UserSchema)
async def get_user_by_id(user_id: str):
    user = await controller.get_user_by_id(ObjectId(user_id))
    logging.error(user.to_mongo())

    return user


@router.get("/email-address/{email_address}", response_model=UserSchema)
async def get_user_by_email_address(email_address: str):
    user = await controller.get_user_by_email_address(email_address)

    return user


@router.post("", response_model=UserSchema, status_code=201)
async def create_user(user: UserSchema):
    created_user = await  controller.create_user(user)

    return created_user
