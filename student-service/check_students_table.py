
from sqlalchemy import inspect

from app.database import engine
from app.models import Student

inspector = inspect(engine)

if inspector.has_table("students"):
    print("Students table exists.")

    columns = inspector.get_columns("students")
    print("Columns in the database:")

    for column in columns:
        print(f"- {column['name']}")
else:
    print("Students table was not found.")

print("\nStudent model table:", Student.__tablename__)
