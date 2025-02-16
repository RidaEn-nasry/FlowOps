from datetime import datetime
from pydantic import BaseModel, ConfigDict

class BaseModelWithConfig(BaseModel):
    model_config = ConfigDict(
        json_encoders={
            datetime: lambda dt: dt.isoformat()
        }
    ) 