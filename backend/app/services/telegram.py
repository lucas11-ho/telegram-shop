import hashlib
import hmac
import json
import urllib.parse
from typing import Any, Dict, Tuple

from app.core.config import settings


def _hmac_sha256(key: bytes, msg: bytes) -> bytes:
    return hmac.new(key, msg, hashlib.sha256).digest()


def verify_login_widget(payload: Dict[str, Any]) -> Tuple[bool, str]:
    """Verify Telegram Login Widget payload.

    Expects fields like: id, first_name, username, auth_date, hash, photo_url
    Based on Telegram docs: create data_check_string of sorted key=value (excluding hash),
    then compare HMAC-SHA256 with secret key sha256(bot_token).
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        return False, "TELEGRAM_BOT_TOKEN is not set"

    incoming_hash = payload.get("hash")
    if not incoming_hash:
        return False, "Missing hash"

    data_pairs = []
    for k in sorted(payload.keys()):
        if k == "hash":
            continue
        v = payload[k]
        if v is None:
            continue
        data_pairs.append(f"{k}={v}")
    data_check_string = "\n".join(data_pairs)

    secret_key = hashlib.sha256(settings.TELEGRAM_BOT_TOKEN.encode()).digest()
    calc_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calc_hash, incoming_hash):
        return False, "Hash mismatch"
    return True, "ok"


def verify_webapp_initdata(init_data: str) -> Tuple[bool, str, Dict[str, Any]]:
    """Verify Telegram WebApp initData string.

    initData is querystring; contains hash. Build data_check_string from sorted key=value excluding hash.
    secret key: HMAC-SHA256("WebAppData", bot_token) then HMAC-SHA256(secret_key, data_check_string).
    Returns (ok, reason, parsed_dict)
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        return False, "TELEGRAM_BOT_TOKEN is not set", {}

    parsed = dict(urllib.parse.parse_qsl(init_data, keep_blank_values=True))
    incoming_hash = parsed.get("hash")
    if not incoming_hash:
        return False, "Missing hash", parsed

    data_pairs = []
    for k in sorted(parsed.keys()):
        if k == "hash":
            continue
        data_pairs.append(f"{k}={parsed[k]}")
    data_check_string = "\n".join(data_pairs)

    secret_key = _hmac_sha256(b"WebAppData", settings.TELEGRAM_BOT_TOKEN.encode())
    calc_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calc_hash, incoming_hash):
        return False, "Hash mismatch", parsed

    # user is JSON string
    if "user" in parsed:
        try:
            parsed["user"] = json.loads(parsed["user"])
        except Exception:
            pass

    return True, "ok", parsed
