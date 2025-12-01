"""
Универсальный сервис для работы с OpenAPI компаний (только WW-top)
"""
import os
from typing import TypeVar, Type

import httpx
from fastapi import HTTPException, status
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError

load_dotenv()

# Токен для OpenAPI
OPENAPI_TOKEN = os.getenv("OPENAPI_TOKEN", "692c9b66aa3165c927048dd3")
OPENAPI_BASE_URL = os.getenv("OPENAPI_BASE_URL", "https://company.openapi.com")

# Тип для ответа API
T = TypeVar("T", bound=BaseModel)


class OpenAPIService:
    """Сервис для получения данных о компаниях через OpenAPI (WW-top)"""

    def __init__(self) -> None:
        self.token = OPENAPI_TOKEN
        self.base_url = OPENAPI_BASE_URL

    async def get_company(
        self,
        country: str,
        endpoint: str,
        code: str,
        response_model: Type[T],
    ) -> T:
        """
        Получает информацию о компании через OpenAPI.

        Args:
            country: Код страны (для WW всегда "WW")
            endpoint: Например: "top/IT", "top/FR", "top/PL" и т.п.
            code: Идентификатор компании
            response_model: Pydantic-модель для парсинга ответа
        """

        # -------------------------------
        # Формирование URL
        # -------------------------------
        url = f"{self.base_url}/WW-{endpoint}/{code}"

        headers = {"Accept": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        # -------------------------------
        # HTTP запрос
        # -------------------------------
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.get(url, headers=headers)
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="External API timeout",
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"External API request error: {str(e)}",
            )

        # -------------------------------
        # HTTP статус
        # -------------------------------
        if response.status_code == status.HTTP_404_NOT_FOUND:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
            )

        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"External API error: {response.status_code}, {response.text}",
            )

        # -------------------------------
        # JSON парсинг
        # -------------------------------
        try:
            data = response.json()
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Invalid JSON from external API: {str(e)}",
            )

        # -------------------------------
        # Валидация ответа схемой
        # -------------------------------
        try:
            return response_model(**data)
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Response schema mismatch: {e.errors()}",
            )
