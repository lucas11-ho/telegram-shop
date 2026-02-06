import json
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from app.models import LogEntry


def log(db: Session, action: str, user_id: Optional[int] = None, meta: Optional[Dict[str, Any]] = None) -> None:
    entry = LogEntry(user_id=user_id, action=action, meta=json.dumps(meta) if meta else None)
    db.add(entry)
    db.commit()
