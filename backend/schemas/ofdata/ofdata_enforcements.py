from typing import List, Optional

from pydantic import Field

from schemas.ofdata.ofdata_company import OfdataBaseModel, MetaInfo
from schemas.ofdata.ofdata_entrepreneur import RelatedCompany


class EnforcementCompanyInfo(RelatedCompany):
    """
    Базовая информация о компании в ответе /v2/enforcements.
    Наследуемся от RelatedCompany (ОГРН, ИНН, КПП, НаимСокр, НаимПолн, и т.д.).
    """


class EnforcementRecord(OfdataBaseModel):
    """
    Исполнительное производство — элемент массива Записи.
    """

    dolzh_naim: Optional[str] = Field(None, alias="ДолжНаим")
    dolzh_adres: Optional[str] = Field(None, alias="ДолжАдрес")
    isp_pr_nomer: Optional[str] = Field(None, alias="ИспПрНомер")
    isp_pr_data: Optional[str] = Field(None, alias="ИспПрДата")
    isp_dok_nomer: Optional[str] = Field(None, alias="ИспДокНомер")
    isp_dok_tip: Optional[str] = Field(None, alias="ИспДокТип")
    isp_dok_data: Optional[str] = Field(None, alias="ИспДокДата")
    predm_isp: Optional[str] = Field(None, alias="ПредмИсп")
    sud_prist_naim: Optional[str] = Field(None, alias="СудПристНаим")
    sud_prist_adres: Optional[str] = Field(None, alias="СудПристАдрес")
    sum_dolg: Optional[float] = Field(None, alias="СумДолг")
    ost_zadolzh: Optional[float] = Field(None, alias="ОстЗадолж")


class EnforcementsData(OfdataBaseModel):
    """
    Блок data ответа /v2/enforcements.
    """

    str_vsego: Optional[int] = Field(None, alias="СтрВсего")
    str_tekushch: Optional[int] = Field(None, alias="СтрТекущ")
    zapisi: Optional[List[EnforcementRecord]] = Field(None, alias="Записи")


class OfdataEnforcementsResponse(OfdataBaseModel):
    """
    Полный ответ Ofdata для /v2/enforcements.
    """

    company: Optional[EnforcementCompanyInfo] = Field(None, alias="company")
    data: Optional[EnforcementsData] = Field(None, alias="data")
    meta: Optional[MetaInfo] = Field(None, alias="meta")










