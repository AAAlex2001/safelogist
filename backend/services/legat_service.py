"""
Универсальный сервис для работы с Legat API (Беларусь)
"""
import os
from typing import TypeVar, Type

import httpx
from fastapi import HTTPException, status
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError

load_dotenv()

LEGAT_BASE_URL = os.getenv("LEGAT_BASE_URL", "https://api.legat.by")
LEGAT_TOKEN = os.getenv("LEGAT_TOKEN", "qr55sfp9skoqe5e8d5bvc68eoo7hrr2h")

T = TypeVar("T", bound=BaseModel)


class LegatService:
    """Универсальный сервис для получения юридических данных из Legat API"""

    def __init__(self):
        self.base_url = LEGAT_BASE_URL
        self.token = LEGAT_TOKEN

    async def get(self, path: str, response_model: Type[T]) -> T:
        """
        Универсальный GET запрос.

        path — должен начинаться с "/api2/...".
        Пример:
            "/api2/by/court?unp=101228755"
        """
        url = f"{self.base_url}{path}"

        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {self.token}",
        }

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.get(url, headers=headers)
        except httpx.TimeoutException:
            raise HTTPException(504, "Legat API timeout")
        except httpx.RequestError as e:
            raise HTTPException(502, f"Legat API request error: {e}")

        if response.status_code != 200:
            raise HTTPException(
                502,
                f"Legat API error {response.status_code}: {response.text}",
            )

        try:
            data = response.json()
        except Exception:
            raise HTTPException(502, "Invalid JSON from Legat API")

        try:
            return response_model(**data)
        except ValidationError as e:
            raise HTTPException(502, f"Schema mismatch for Legat API: {e.errors()}")
