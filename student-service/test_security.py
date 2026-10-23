
from app.security import get_current_user

print("JWT authentication module imported successfully.")
print("Authentication dependency:", get_current_user.__name__)
