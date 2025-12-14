"""
Универсальный сервис для работы с Offdata API
"""
import os
from typing import TypeVar, Type

import httpx
from fastapi import HTTPException, status
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError

load_dotenv()

OFFDATA_BASE_URL = os.getenv("OFFDATA_BASE_URL", "https://api.ofdata.ru")
OFFDATA_TOKEN = os.getenv("OFFDATA_TOKEN", "6v3eGZEwVXIuCZo3")

T = TypeVar("T", bound=BaseModel)


class OffdataService:
    """Универсальный сервис для получения юридических данных из Offdata API"""

    def __init__(self):
        self.base_url = OFFDATA_BASE_URL
        self.token = OFFDATA_TOKEN

    async def get(
        self,
        endpoint: str,
        response_model: Type[T],
        inn: str
    ) -> T:
        """
        Получение данных из Offdata API по ИНН.

        Параметры:
        - endpoint: "company" или "entrepreneur"
        - response_model: Модель ответа
        - inn: ИНН компании или ИП
        """
        params = {"key": self.token, "inn": inn}

        url = f"{self.base_url}/v2/{endpoint}"

        headers = {
            "Accept": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.get(url, headers=headers, params=params)
        except httpx.TimeoutException:
            raise HTTPException(504, "Offdata API timeout")
        except httpx.RequestError as e:
            raise HTTPException(502, f"Offdata API request error: {e}")

        if response.status_code != 200:
            raise HTTPException(
                502,
                f"Offdata API error {response.status_code}: {response.text}",
            )

        try:
            data = response.json()
        except Exception:
            raise HTTPException(502, "Invalid JSON from Offdata API")

        try:
            return response_model.model_validate(data)
        except ValidationError as e:
            raise HTTPException(502, f"Schema mismatch for Offdata API: {e.errors()}")








