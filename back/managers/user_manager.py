import logging

from bson import ObjectId

from models.user_model import User, UserSchema, LoginUserSchema


async def create_user(user: UserSchema):
    user = User(name=user.name, email_address=user.email_address, password=user.password)
    logging.error(user)
    return user.save()

async def get_user_by_id(user_id: ObjectId) -> User:
    return User.objects.get(id=user_id)


async def get_user_by_email_address(email_address: str) -> User:
    return User.objects.get(email_address=email_address)


async def check_email_availability(email: str):
    return User.objects(email_address=email).first()





