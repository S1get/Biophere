import time
from typing import Any, Dict, List, Optional, Tuple

import httpx
from fastapi import APIRouter, HTTPException


router = APIRouter(prefix="/pricelist", tags=["pricelist"])


API_BASE = "https://p.bios.re/api"
PRICE_SOURCE_URL = f"{API_BASE}/pricelist?version=services"
SECTIONS_SOURCE_URL = f"{API_BASE}/pricelist/sections?version=services"
DEFAULT_CACHE_TTL_SECONDS = 60 * 60 * 6  # 6 hours

_cache: Dict[str, Any] = {
    "timestamp": 0.0,
    "data": None,
}


def _format_price(variant: Dict[str, Any]) -> str:
    start = variant.get("service_start")
    end = variant.get("service_end")
    if start is None:
        return ""
    if end is None or end == start:
        return str(start)
    return f"{start}-{end}"


async def _fetch_json() -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
    timeout = httpx.Timeout(20.0, connect=10.0)
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        headers = {"User-Agent": "BiosphereVetClinic/1.0 (+render)"}

        r_sections = await client.get(SECTIONS_SOURCE_URL, headers=headers)
        if r_sections.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Не удалось загрузить секции прайса (status {r_sections.status_code})")
        sections_map = r_sections.json()
        if not isinstance(sections_map, dict):
            raise HTTPException(status_code=502, detail="Некорректный формат секций прайса")

        r = await client.get(PRICE_SOURCE_URL, headers=headers)
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Не удалось загрузить прайс (status {r.status_code})")
        data = r.json()
        if not isinstance(data, list):
            raise HTTPException(status_code=502, detail="Некорректный формат прайса")

        # Normalize values to strings for stable output
        normalized_sections: Dict[str, str] = {str(k): str(v) for k, v in sections_map.items()}
        return data, normalized_sections


async def _fetch_and_parse() -> Dict[str, Any]:
    raw_services, sections_map = await _fetch_json()

    items: List[Dict[str, Optional[str]]] = []
    for svc in raw_services:
        section_id = str(svc.get("section", ""))
        section_name = sections_map.get(section_id, section_id)
        base_name = str(svc.get("name", "")).strip()
        variants = svc.get("variants") or []
        if not base_name or not isinstance(variants, list) or not variants:
            continue
        for v in variants:
            if not isinstance(v, dict):
                continue
            note = str(v.get("name", "")).strip()
            price = _format_price(v)
            if not price:
                continue
            # Keep the old site "variant in note" style when present
            items.append(
                {
                    "section": section_name or "",
                    "name": base_name,
                    "note": note or None,
                    "price": price,
                }
            )

    if not items:
        raise HTTPException(status_code=502, detail="Прайс загружен, но услуги не распарсились")

    sections = sorted({i["section"] for i in items if i.get("section")})
    return {
        "source_url": PRICE_SOURCE_URL,
        "sections": sections,
        "items": items,
    }


@router.get("")
@router.get("/")
async def get_pricelist(ttl_seconds: int = DEFAULT_CACHE_TTL_SECONDS, refresh: bool = False):
    """
    Возвращает актуальный прейскурант (JSON) из внешнего источника с кэшированием.
    """
    ttl = max(60, min(int(ttl_seconds), 60 * 60 * 24))  # 1 min .. 24h
    now = time.time()

    if not refresh and _cache["data"] is not None and (now - float(_cache["timestamp"])) < ttl:
        return {"cached": True, "fetched_at": _cache["timestamp"], **_cache["data"]}

    data = await _fetch_and_parse()
    _cache["data"] = data
    _cache["timestamp"] = now
    return {"cached": False, "fetched_at": now, **data}

