from typing import Optional
from mongoengine import Document, StringField, EmailField
from pydantic import BaseModel, validator
from bson.objectid import ObjectId as BsonObjectId


class User(Document):
    name: StringField = StringField(required=True)
    email_address: EmailField = EmailField(required=True, unique=True)
    password: StringField = StringField(required=True)

    meta: dict[str, str] = {'collection': 'users'}


class PydanticObjectId(BsonObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value: str, values: Optional[dict] = None, config: Optional[dict] = None, field: Optional[BaseModel] = None):
        if not isinstance(value, BsonObjectId):
            raise TypeError('ObjectId required')
        return str(value)


class UserSchema(BaseModel):
    id: Optional[PydanticObjectId] = None
    name: str
    email_address: str
    password: str

    class Config:
        from_attributes = True


class LoginUserSchema(BaseModel):
    email_address: str
    password: str

    class Config:
        from_attributes = True
