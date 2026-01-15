from sqlalchemy import (
    Column,
    String,
    DateTime,
    BigInteger,
    Integer,
    Text,
)
from dataclasses import dataclass
from typing import Dict, List, Literal
from enum import Enum as PyEnum
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base

# ---------------- SQLALCHEMY MODELS ----------------

Base = declarative_base()


class UrlStatus(PyEnum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class IndexAction(PyEnum):
    INDEX = "INDEX"  # submit/update
    DELETE = "DELETE"  # remove from index
    IGNORE = "IGNORE"  # do nothing


class Auth(Base):
    __tablename__ = "Auth"

    id = Column(String, primary_key=True)
    shop = Column(String, index=True, nullable=False)
    googleConfig = Column(JSONB, nullable=False)
    bingIndexingUrl = Column(String, nullable=False)
    settings = Column(JSONB, nullable=False)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

    def to_dict(self) -> dict:
        return {
            "shop": self.shop,
            "googleConfig": self.googleConfig,
            "bingIndexingUrl": self.bingIndexingUrl,
            "settings": self.settings,
        }


class UrlEntry(Base):
    __tablename__ = "UrlEntry"

    id = Column(String, primary_key=True)
    shop = Column(String, index=True, nullable=False)
    baseId = Column(BigInteger, nullable=False)
    webUrl = Column(Text, nullable=False)
    slug = Column(String)

    indexAction = Column(SQLEnum(IndexAction, name="indexaction"), index=True)
    status = Column(SQLEnum(UrlStatus, name="urlstatus"), index=True)

    attempts = Column(Integer)
    submittedAt = Column(DateTime, index=True)
    lastEventAt = Column(DateTime)
    lastTriedAt = Column(DateTime)
    lastIndexedAt = Column(DateTime)
    processedAt = Column(DateTime)
    meta = Column("metadata", JSONB)


IndexActionStr = Literal["INDEX", "DELETE"]


@dataclass
class UrlItem:
    originalUrl: str
    attempts: int

    def to_dict(self) -> dict:
        return {
            "originalUrl": self.originalUrl,
            "attempts": self.attempts,
        }


@dataclass
class UrlIndexBatchJob:
    jobType: Literal["URL_INDEXING_BATCH"]
    version: int
    # provider: Literal["BING", "GOOGLE"]
    actions: Dict[IndexActionStr, List[Dict]]
    auth: Auth
    shop: str

    def to_dict(self) -> dict:
        return {
            "jobType": self.jobType,
            "version": self.version,
            "shop": self.shop,
            "actions": self.actions,
            "auth": self.auth,
        }
