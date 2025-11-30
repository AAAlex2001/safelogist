"""
Сервис для работы с API португальских компаний
"""
import os
import httpx
from fastapi import HTTPException, status
from dotenv import load_dotenv

from schemas.portugal import PortugalApiResponse

load_dotenv()

# Токен для API португальских компаний
PORTUGAL_API_TOKEN = os.getenv("PORTUGAL_API_TOKEN", "692c9b66aa3165c927048dd3")
PORTUGAL_API_BASE_URL = os.getenv("PORTUGAL_API_BASE_URL", "https://company.openai.com")


class PortugalService:
    """Сервис для получения данных о португальских компаниях"""
    
    def __init__(self):
        self.token = PORTUGAL_API_TOKEN
        self.base_url = PORTUGAL_API_BASE_URL
    
    async def get_company_by_code(
        self, 
        vat_code_tax_code_or_id: str
    ) -> PortugalApiResponse:
        """
        Получает информацию о компании по VAT коду, налоговому коду или ID
        
        Args:
            vat_code_tax_code_or_id: VAT код, налоговый код или ID компании (например: PT500273170)
        
        Returns:
            PortugalApiResponse: Ответ API с данными о компании
        """
        url = f"{self.base_url}/PT-advanced/{vat_code_tax_code_or_id}"
        
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers)
                
                # Проверяем статус ответа
                if response.status_code == 404:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Company not found"
                    )
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"External API error: {response.status_code}"
                    )
                
                # Парсим ответ
                data = response.json()
                return PortugalApiResponse(**data)
                
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

