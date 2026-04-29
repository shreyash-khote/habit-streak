import os
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
import models

# Initialize Firebase Admin SDK once at startup
_service_account_path = os.path.join(os.path.dirname(__file__), "firebase_service_account.json")
cred = credentials.Certificate(_service_account_path)
firebase_admin.initialize_app(cred)

security = HTTPBearer()

def get_current_user(
    http_credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.User:
    """
    FastAPI dependency that:
    1. Verifies the Firebase ID token from the Authorization header
    2. Finds or auto-creates the matching User row in Neon PostgreSQL
    3. Returns the User ORM object for use in route handlers
    """
    token = http_credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    firebase_uid = decoded["uid"]
    email = decoded.get("email", "")

    # Look up existing user by Firebase UID
    user = db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()

    if not user:
        # First login — create a new row in Neon
        username = email.split("@")[0] if email else firebase_uid[:12]
        # Ensure username uniqueness
        existing = db.query(models.User).filter(models.User.username == username).first()
        if existing:
            username = f"{username}_{firebase_uid[:6]}"

        user = models.User(
            firebase_uid=firebase_uid,
            email=email,
            username=username,
            hashed_password="",  # Firebase handles authentication
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
