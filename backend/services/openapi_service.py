"""
Универсальный сервис для работы с OpenAPI компаний
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
    """Универсальный сервис для получения данных о компаниях через OpenAPI"""

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
        Получает информацию о компании через OpenAPI

        Args:
            country: Код страны (PT, FR, IT и т.д.)
            endpoint: Тип эндпоинта (advanced, aml и т.д.)
            code: VAT код, налоговый код или ID компании
            response_model: Pydantic модель для парсинга ответа

        Returns:
            Экземпляр response_model с данными о компании
        """
        # Формируем URL: https://company.openapi.com/{COUNTRY}-{endpoint}/{code}
        url = f"{self.base_url}/{country.upper()}-{endpoint}/{code}"

        headers = {
            "Accept": "application/json",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        # ---- 1. Делаем запрос и обрабатываем сетевые ошибки ----
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

        # ---- 2. Обрабатываем HTTP-статусы ----
        if response.status_code == status.HTTP_404_NOT_FOUND:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
            )

        if response.status_code != status.HTTP_200_OK:
            error_text = response.text[:200] if response.text else "No error message"
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"External API error: {response.status_code}, {error_text}",
            )

        # ---- 3. Парсим JSON ----
        try:
            data = response.json()
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Invalid JSON from external API: {str(e)}",
            )

        # ---- 4. Валидируем через response_model ----
        try:
            return response_model(**data)
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Response schema mismatch from external API: {e.errors()}",
            )
