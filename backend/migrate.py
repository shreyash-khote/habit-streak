import sys
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv()
from sqlalchemy import create_engine, text
import os

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.begin() as conn:
    conn.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR UNIQUE'))
    conn.execute(text('ALTER TABLE users ALTER COLUMN username DROP NOT NULL'))
    conn.execute(text('ALTER TABLE users ALTER COLUMN email DROP NOT NULL'))
    conn.execute(text('ALTER TABLE users ALTER COLUMN hashed_password DROP NOT NULL'))
    print('Migration complete! Users table columns:')
    result = conn.execute(text(
        "SELECT column_name, is_nullable FROM information_schema.columns "
        "WHERE table_name='users' ORDER BY ordinal_position"
    ))
    for row in result:
        print(f'  {row[0]}: nullable={row[1]}')
