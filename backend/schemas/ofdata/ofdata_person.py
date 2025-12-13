from typing import List, Optional

from pydantic import Field

from schemas.ofdata.ofdata_company import (
    OfdataBaseModel,
    Trademark,            # ТоварЗнак
    EFRSPMessage,         # ЕФРСБ
    UnfairSupplierRecord, # НедобПостЗап
    MetaInfo,             # meta
)
from schemas.ofdata.ofdata_entrepreneur import RelatedCompany  # для Руковод / Учред


class PersonIPInfo(OfdataBaseModel):
    """
    Элемент массива «ИП» — индивидуальный предприниматель,
    связанный с физическим лицом.
    """

    ogrnip: Optional[str] = Field(None, alias="ОГРНИП")
    inn: Optional[str] = Field(None, alias="ИНН")
    fio: Optional[str] = Field(None, alias="ФИО")
    tip: Optional[str] = Field(None, alias="Тип")
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    status: Optional[str] = Field(None, alias="Статус")
    data_prekrash: Optional[str] = Field(None, alias="ДатаПрекращ")
    region_kod: Optional[str] = Field(None, alias="РегионКод")
    okved: Optional[str] = Field(None, alias="ОКВЭД")


class OfdataPersonData(OfdataBaseModel):
    """
    Основной блок data ответа /v2/person.
    """

    inn: Optional[str] = Field(None, alias="ИНН")
    fio: Optional[str] = Field(None, alias="ФИО")

    # Компании, в которых физлицо является руководителем
    rukovod: Optional[List[RelatedCompany]] = Field(None, alias="Руковод")

    # Компании, в которых физлицо является учредителем
    uchred: Optional[List[RelatedCompany]] = Field(None, alias="Учред")

    # Индивидуальные предприниматели
    ip: Optional[List[PersonIPInfo]] = Field(None, alias="ИП")

    # Товарные знаки и знаки обслуживания РФ
    tovar_znak: Optional[List[Trademark]] = Field(None, alias="ТоварЗнак")

    # Сообщения из реестра банкротств (ЕФРСБ)
    efrsb: Optional[List[EFRSPMessage]] = Field(None, alias="ЕФРСБ")

    # Недобросовестные поставщики
    nedob_post: Optional[bool] = Field(None, alias="НедобПост")
    nedob_post_zap: Optional[List[UnfairSupplierRecord]] = Field(
        None, alias="НедобПостЗап"
    )

    # Массовые руководители / учредители и санкции
    mass_rukovod: Optional[bool] = Field(None, alias="МассРуковод")
    mass_uchred: Optional[bool] = Field(None, alias="МассУчред")
    sanktsii: Optional[bool] = Field(None, alias="Санкции")
    sanktsii_strany: Optional[List[str]] = Field(None, alias="СанкцииСтраны")


class OfdataPersonResponse(OfdataBaseModel):
    """
    Полный ответ Ofdata для /v2/person.
    """

    data: Optional[OfdataPersonData] = Field(None, alias="data")
    meta: Optional[MetaInfo] = Field(None, alias="meta")









