from pydantic import Field
from typing import Optional
from schemas.ofdata.ofdata_company import OfdataCompanyResponse, OfdataBaseModel
from schemas.ofdata.ofdata_entrepreneur import OfdataEntrepreneurResponse


class OfdataFullResponse(OfdataBaseModel):
    """Полный агрегированный ответ с данными компании и предпринимателя"""
    company: Optional[OfdataCompanyResponse] = Field(None, alias="company")
    entrepreneur: Optional[OfdataEntrepreneurResponse] = Field(None, alias="entrepreneur")

