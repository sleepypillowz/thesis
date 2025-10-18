import os
from os import path
from pathlib import Path
import dotenv   
from datetime import timedelta
from corsheaders.defaults import default_headers


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

dotenv_file = BASE_DIR / '.env'

if path.isfile(dotenv_file):
    dotenv.load_dotenv(dotenv_file)
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '4THuuuW08eGLG3VsT8Ey4clCk43YlYMeUbTuukJmuvgFCm3SorHaCiupv5uf5J87N2wFUzen+evrQ5qnrm+buQ=='

DEBUG = True # for production - os.getenv('DJANGO_DEBUG', 'False') == 'True'

SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
CORS_ALLOW_HEADERS = (
    *default_headers,
)
CORS_ALLOW_CREDENTIALS = True

INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # third apps
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'djoser',
    'channels',

    # installed apps
    'patient.apps.PatientConfig',
    'queueing.apps.QueueingConfig',
    'user.apps.UserConfig',
    'medicine.apps.MedicineConfig',
    'appointment.apps.AppointmentConfig'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',

    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',


]
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://meditrakk.up.railway.app",
        
    "https://thesis-backend.up.railway.app",
    "https://thesis-c1rq.vercel.app",

    "http://localhost:3000",

]
ALLOWED_HOSTS = [
    "thesis-sg26.onrender.com",
    "thesis-c1rq.vercel.app",
    'localhost',
    'thesis-backend.up.railway.app',  # Also add your backend's own domain.
    'meditrakk.up.railway.app'
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "https://thesis-c1rq.vercel.app",
    "https://meditrakk.up.railway.app",
    "https://thesis-backend.up.railway.app",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    'authorization',
    'content-type',
]
CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH', 
    'DELETE',
    'OPTIONS'
]

CORS_ALLOW_CREDENTIALS = True



ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# websocket
# settings.py

ASGI_APPLICATION = "backend.asgi.application"

REDIS_URL = os.environ.get("REDIS_URL")

if REDIS_URL:
    # channels_redis accepts a URL string in the hosts list
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [REDIS_URL],
            },
        },
    }
else:
    # fallback to separate host/port env vars or localhost for dev
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [
                    (
                        os.environ.get("REDIS_HOST", "127.0.0.1"),
                        int(os.environ.get("REDIS_PORT", 6379)),
                    )
                ],
            },
        },
    }



# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

import os
import dj_database_url

import dj_database_url

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL"),
        conn_max_age=int(os.environ.get("DB_CONN_MAX_AGE", 600)),
        conn_health_checks=True,
        ssl_require=os.environ.get("DB_SSL_REQUIRE", "True").lower() in ("1","true","yes"),
    )
}




# email settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# DEFAULT_FROM_EMAIL = getenv('AWS_SES_FROM_EMAIL') 

# AWS_SES_ACCESS_KEY_ID = getenv('AWS_SES_ACCESS_KEY_ID')
# AWS_SES_SECRET_ACCESS_KEY = getenv('AWS_SES_SECRET_ACCESS_KEY')
# AWS_SES_REGION_NAME = getenv('AWS_SES_REGION_NAME')
# AWS_SES_REGION_ENDPOINT = f'email.{AWS_SES_REGION_NAME}.amazonaws.com'
# AWS_SES_FROM_EMAIL = getenv('AWS_SES_FROM_EMAIL')
# USE_SES = True

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=90),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=90), 
    'TOKEN_OBTAIN_SERIALIZER': 'user.serializers.CustomTokenObtainPairSerializer',
}
DJOSER = {
    "SERIALIZERS": {
        "user": "user.serializers.UserAccountSerializer",
        "user_create": "user.serializers.UserAccountSerializer",
    },
    'LOGIN_FIELD': 'email',
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,  # Disable activation email for development
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'TOKEN_MODEL': None,
    'TOKEN_OBTAIN_SERIALIZER': 'user.serializers.CustomTokenObtainPairSerializer',

}

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# REST_FRAMEWORK = {
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
#     ]
# }

# Default primary key field type            
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
MEDIA_ROOT = BASE_DIR / "media"


# URL that handles the media served from MEDIA_ROOT
MEDIA_URL = "/media/"

AUTH_USER_MODEL = "user.UserAccount"

# settings.py
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "ralphancheta000@gmail.com"
EMAIL_HOST_PASSWORD = "rshc xsyo mdwg svjc"  # NOT your real Gmail password
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
