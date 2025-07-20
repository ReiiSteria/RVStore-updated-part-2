# Database Configuration for TopUp Game MIS
# FastAPI + SQLAlchemy + MySQL

import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Configuration
class DatabaseConfig:
    # MySQL Database Settings
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "topup_game_mis")
    
    # Connection Pool Settings
    POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "10"))
    MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "20"))
    POOL_TIMEOUT = int(os.getenv("DB_POOL_TIMEOUT", "30"))
    POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", "3600"))
    
    # SQLAlchemy Settings
    ECHO_SQL = os.getenv("ECHO_SQL", "False").lower() == "true"
    
    @property
    def database_url(self) -> str:
        """Generate MySQL database URL"""
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            f"?charset=utf8mb4"
        )
    
    @property
    def async_database_url(self) -> str:
        """Generate async MySQL database URL"""
        return (
            f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
            f"?charset=utf8mb4"
        )

# Initialize database configuration
db_config = DatabaseConfig()

# Create SQLAlchemy engine
engine = create_engine(
    db_config.database_url,
    poolclass=QueuePool,
    pool_size=db_config.POOL_SIZE,
    max_overflow=db_config.MAX_OVERFLOW,
    pool_timeout=db_config.POOL_TIMEOUT,
    pool_recycle=db_config.POOL_RECYCLE,
    echo=db_config.ECHO_SQL,
    # MySQL specific settings
    connect_args={
        "charset": "utf8mb4",
        "autocommit": False,
        "connect_timeout": 60,
        "read_timeout": 30,
        "write_timeout": 30,
    }
)

# Create SessionLocal class
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create Base class for models
Base = declarative_base()

# Metadata for reflection
metadata = MetaData()

def get_database():
    """
    Dependency function to get database session
    Use this in FastAPI endpoints
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def create_tables():
    """Create all tables in the database"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        raise

def test_connection():
    """Test database connection"""
    try:
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            logger.info("Database connection successful")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False

# Health check function
def get_db_health():
    """Get database health status"""
    try:
        with engine.connect() as connection:
            # Test basic query
            connection.execute("SELECT 1")
            
            # Get connection pool status
            pool = engine.pool
            pool_status = {
                "pool_size": pool.size(),
                "checked_in": pool.checkedin(),
                "checked_out": pool.checkedout(),
                "overflow": pool.overflow(),
                "invalid": pool.invalid()
            }
            
            return {
                "status": "healthy",
                "database": db_config.MYSQL_DATABASE,
                "host": db_config.MYSQL_HOST,
                "pool_status": pool_status
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "database": db_config.MYSQL_DATABASE,
            "host": db_config.MYSQL_HOST
        }

# Initialize database on import
if __name__ == "__main__":
    # Test connection when run directly
    print("Testing database connection...")
    if test_connection():
        print("✅ Database connection successful!")
        print(f"Connected to: {db_config.MYSQL_DATABASE} at {db_config.MYSQL_HOST}")
    else:
        print("❌ Database connection failed!")