from dotenv import load_dotenv
load_dotenv()

from services.database import Base, engine
from services.models import Admin

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created!")
