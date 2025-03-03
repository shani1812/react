from typing import List
from bson import ObjectId
from models.email_model import Email, EmailSchema
from managers import email_manager as manager


async def create_email(email: EmailSchema) -> Email:
    return await manager.create_email(email)

async def get_email_by_id(email_id: ObjectId) -> Email:
    return await manager.get_email_by_id(email_id)


async def get_sent_emails(addressee_id: ObjectId) -> List[Email]:
    return await manager.get_sent_emails(addressee_id)


async def get_inbox(addressed_id: ObjectId) -> List[Email]:
    return await manager.get_inbox(addressed_id)


async def read_email(email_id: ObjectId):
    await manager.read_email(email_id)


async def delete_email_from_inbox(email_id: ObjectId):
    await manager.delete_email_from_inbox(email_id)


async def delete_email_from_sent(email_id: ObjectId):
    await manager.delete_email_from_sent(email_id)
