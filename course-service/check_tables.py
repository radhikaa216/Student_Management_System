
from sqlalchemy import inspect

from app.models import Course, Enrollment
from app.database import engine

inspector = inspect(engine)

for table_name in ("courses", "enrollments"):
    if inspector.has_table(table_name):
        print(f"\n{table_name} table exists.")
        for column in inspector.get_columns(table_name):
            print(f"  - {column['name']}")
    else:
        print(f"\nWARNING: {table_name} table was not found.")

print("\nCourse model:", Course.__tablename__)
print("Enrollment model:", Enrollment.__tablename__)
