import os
from datetime import timedelta

class Config:
    # Secret key for signing JWT tokens
    SECRET_KEY = os.environ.get('SECRET_KEY', 'nothinglastlikesecret')
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///notely.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'secretkeycanbeanything')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # Token expires after 24 hours
    
    # CORS configuration
    CORS_HEADERS = 'Content-Type'