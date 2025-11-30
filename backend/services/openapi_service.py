"""
Универсальный сервис для работы с OpenAPI компаний
"""
import os
import httpx
from typing import TypeVar, Type
from fastapi import HTTPException, status
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

# Токен для OpenAPI
OPENAPI_TOKEN = os.getenv("OPENAPI_TOKEN", "692c9b66aa3165c927048dd3")
OPENAPI_BASE_URL = os.getenv("OPENAPI_BASE_URL", "https://company.openapi.com")

# Тип для ответа API
T = TypeVar('T', bound=BaseModel)


class OpenAPIService:
    """Универсальный сервис для получения данных о компаниях через OpenAPI"""
    
    def __init__(self):
        self.token = OPENAPI_TOKEN
        self.base_url = OPENAPI_BASE_URL
    
    async def get_company(
        self,
        country: str,
        endpoint: str,
        code: str,
        response_model: Type[T]
    ) -> T:
        """
        Получает информацию о компании через OpenAPI
        
        Args:
            country: Код страны (PT, FR, IT и т.д.)
            endpoint: Тип эндпоинта (advanced, aml и т.д.)
            code: VAT код, налоговый код или ID компании
            response_model: Pydantic модель для парсинга ответа
        
        Returns:
            Ответ API с данными о компании
        """
        # Формируем URL: https://company.openapi.com/{COUNTRY}-{endpoint}/{code}
        url = f"{self.base_url}/{country.upper()}-{endpoint}/{code}"
        
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.get(url, headers=headers)
                
                # Проверяем статус ответа
                if response.status_code == 404:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Company not found"
                    )
                
                if response.status_code != 200:
                    error_text = response.text[:200] if response.text else "No error message"
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"External API error: {response.status_code}, {error_text}"
                    )
                
                # Парсим ответ
                data = response.json()
                return response_model(**data)
                
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="External API timeout"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"External API request error: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error: {str(e)}"
            )

