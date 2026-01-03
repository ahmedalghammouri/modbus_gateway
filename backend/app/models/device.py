from pydantic import BaseModel
from typing import Literal, Optional, List, Tuple

DEFAULT_PM_PARAMS = [
    ("kwh", 2699), ("v1", 3027), ("v2", 3029), ("v3", 3031),
    ("v12", 3019), ("v23", 3021), ("v13", 3023), ("a1", 2999),
    ("a2", 3001), ("a3", 3003), ("a_avg", 3009), ("freq_hz", 3109),
    ("p_total_kw", 3059)
]

class Device(BaseModel):
    name: str
    ip: str
    port: int = 502
    slave_id: int = 1
    type: Literal["oee", "pm", "scale"]
    offset: int
    pm_params: Optional[List[Tuple[str, int]]] = None
    status: Optional[str] = None
    last_error: Optional[str] = None
    
    def get_pm_params(self):
        """Returns PM parameters with calculated relative offsets"""
        params = self.pm_params if self.pm_params else DEFAULT_PM_PARAMS
        return [(name, addr, i*2) for i, (name, addr) in enumerate(params)]
