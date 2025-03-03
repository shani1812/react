from typing import List
from bson import ObjectId
from fastapi import APIRouter
from starlette.requests import Request

from controllers import email_controller as controller
from models.email_model import EmailSchema


router = APIRouter()

@router.get("/inbox",status_code=200,  response_model=List[EmailSchema])
async def get_user_inbox(request: Request):
    inbox = await controller.get_inbox(request.state.user.get("id"))
    return inbox

@router.get("/sent",status_code=200, response_model=List[EmailSchema])
async def get_user_sent_email(request: Request):
    sent_emails = await controller.get_sent_emails(request.state.user.get("id"))
    return sent_emails

@router.get("/{email_id}",status_code=200, response_model=EmailSchema)
async def get_email_by_id(email_id: str):
    email = await controller.get_email_by_id(ObjectId(email_id))
    return email

@router.post("", status_code=201, response_model=EmailSchema)
async def create_email(email: EmailSchema):
    created_email = await controller.create_email(email)
    return created_email

@router.patch("/{email_id}/read",status_code=200)
async def read_email(email_id: str):
    await controller.read_email(ObjectId(email_id))
    return {"message" : f"email ${email_id} read"}

@router.patch("/{email_id}/delete-from-inbox",status_code=200)
async def delete_email_from_inbox(email_id: str):
    await controller.delete_email_from_inbox(ObjectId(email_id))
    return {"message": f"email ${email_id} deleted from inbox"}

@router.patch("/{email_id}/delete-from-sent",status_code=200)
async def delete_email_from_sent(email_id: str):
    await controller.delete_email_from_sent(ObjectId(email_id))
    return {"message": f"email ${email_id} deleted from sent"}