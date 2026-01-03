from pydantic import BaseModel
from typing import Literal, Optional

class Device(BaseModel):
    name: str
    ip: str
    port: int = 502
    slave_id: int = 1
    type: Literal["oee", "pm", "scale"]
    offset: int
    status: Optional[str] = None
    last_error: Optional[str] = None
