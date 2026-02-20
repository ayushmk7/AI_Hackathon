"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Load settings from .env file or environment variables."""

    DATABASE_URL: str
    OPENAI_API_KEY: str = ""

    # Instructor auth credentials (MVP: basic auth)
    INSTRUCTOR_USERNAME: str = "admin"
    INSTRUCTOR_PASSWORD: str = "admin"

    # Student token expiry in days
    STUDENT_TOKEN_EXPIRY_DAYS: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
