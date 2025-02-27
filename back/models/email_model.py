from datetime import datetime
from typing import Optional

from bson import ObjectId
from mongoengine import Document, StringField, DateTimeField, ReferenceField, BooleanField, ObjectIdField

from pydantic import BaseModel

from models.user_model import User, UserSchema
from bson.objectid import ObjectId as BsonObjectId


class Email(Document):
    addressed = ReferenceField(User, required=True)
    addressee = ReferenceField(User, required=True)
    title = StringField(required=True)
    text = StringField(required=True)
    date = DateTimeField(default=datetime.now())
    is_read = BooleanField(default=False)
    addressed_visible = BooleanField(default=True)
    addressee_visible = BooleanField(default=True)

    meta: dict[str, str] = {'collection': 'emails'}


class PydanticObjectId(BsonObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _):
        if not isinstance(v, BsonObjectId):
            raise TypeError('ObjectId required')
        return str(v)

class EmailSchema(BaseModel):
    id: Optional[PydanticObjectId] = None
    addressed: str | UserSchema
    addressee: str | UserSchema
    title: str
    text: str
    date: Optional[datetime] = datetime.now()
    is_read: Optional[bool]= False
    addressed_visible: Optional[bool] = True
    addressee_visible: Optional[bool] = True



    class Config:
        from_attributes = True

