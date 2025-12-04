from pydantic import Field
from typing import Optional
from schemas.ofdata.ofdata_company import OfdataCompanyResponse, OfdataBaseModel
from schemas.ofdata.ofdata_entrepreneur import OfdataEntrepreneurResponse
from schemas.ofdata.ofdata_person import OfdataPersonResponse
from schemas.ofdata.ofdata_inspections import OfdataInspectionsResponse
from schemas.ofdata.ofdata_enforcements import OfdataEnforcementsResponse


class OfdataFullResponse(OfdataBaseModel):
    """
    Полный агрегированный ответ с данными компании, предпринимателя, физлица,
    проверок и исполнительных производств.
    """
    company: Optional[OfdataCompanyResponse] = Field(None, alias="company")
    entrepreneur: Optional[OfdataEntrepreneurResponse] = Field(None, alias="entrepreneur")
    person: Optional[OfdataPersonResponse] = Field(None, alias="person")
    inspections: Optional[OfdataInspectionsResponse] = Field(None, alias="inspections")
    enforcements: Optional[OfdataEnforcementsResponse] = Field(None, alias="enforcements")

