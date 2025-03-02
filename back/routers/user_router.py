import logging

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from controllers import user_controller as controller
from models.user_model import UserSchema, LoginUserSchema

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




@router.get("/{email_address}/availability", status_code=200)
async def check_email_availability(email_address: str):
    response = await controller.check_email_availability(email_address)

    return {"Available" : response}


