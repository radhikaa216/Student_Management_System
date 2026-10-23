
from sqlalchemy import text
from app.database import engine

with engine.connect() as connection:
    result = connection.execute(
        text("SELECT DATABASE(), VERSION()")
    )
    print("Database connection successful:", result.fetchone())
