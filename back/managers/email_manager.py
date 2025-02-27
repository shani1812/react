from datetime import datetime
from typing import List, Coroutine
from bson import ObjectId
from models.email_model import Email, EmailSchema


async def create_email(email: EmailSchema)-> Email:
    email = Email(addressed=email.addressed, addressee=email.addressee, title=email.title, text=email.text)
    return email.save()


async def get_email_by_id(email_id: ObjectId) -> Email:
    return Email.objects.get(id=email_id)


async def get_sent_emails(addressee_id: ObjectId) -> List[Email]:
    return Email.objects(addressee=addressee_id, addressee_visible=True).order_by('-date').all()


async def get_inbox(addressed_id: ObjectId) ->List[Email]:
    return Email.objects(addressed=addressed_id, addressed_visible=True).order_by('-date').all()


async def read_email(email_id: ObjectId):
    (await get_email_by_id(email_id)).update(set__is_read=True)

async def delete_email_from_inbox(email_id: ObjectId):
    (await get_email_by_id(email_id)).update(set__addressed_visible=False)

async def delete_email_from_sent(email_id: ObjectId):
    (await get_email_by_id(email_id)).update(set__addressee_visible=False)
