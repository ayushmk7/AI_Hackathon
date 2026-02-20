"""Authentication dependencies for FastAPI."""

import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.config import settings

security = HTTPBasic()


async def get_current_instructor(
    credentials: HTTPBasicCredentials = Depends(security),
) -> str:
    """Validate instructor credentials via HTTP Basic Auth.

    Returns the username if valid, raises 401 otherwise.
    """
    correct_username = secrets.compare_digest(
        credentials.username.encode("utf-8"),
        settings.INSTRUCTOR_USERNAME.encode("utf-8"),
    )
    correct_password = secrets.compare_digest(
        credentials.password.encode("utf-8"),
        settings.INSTRUCTOR_PASSWORD.encode("utf-8"),
    )

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username
