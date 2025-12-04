from typing import List, Optional

from pydantic import Field

from schemas.ofdata.ofdata_company import OfdataBaseModel, MetaInfo
from schemas.ofdata.ofdata_entrepreneur import RelatedCompany


class InspectionEntrepreneurInfo(OfdataBaseModel):
    """
    Базовая информация об ИП для ответа /v2/inspections.
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


class ControlOrgInfo(OfdataBaseModel):
    """
    Орган контроля (надзора) — блок ОргКонтр.
    """

    ogrn: Optional[str] = Field(None, alias="ОГРН")
    naim: Optional[str] = Field(None, alias="Наим")
    funk: Optional[str] = Field(None, alias="Функ")


class ResponsiblePerson(OfdataBaseModel):
    """
    Должностные лица, уполномоченные на проведение проверки — блок ДолжЛица.
    """

    fio: Optional[str] = Field(None, alias="ФИО")
    dolzh: Optional[str] = Field(None, alias="Долж")


class ResultRepresentative(OfdataBaseModel):
    """
    Руководитель/представитель, присутствовавший при проверке — блок Пред.
    """

    fio: Optional[str] = Field(None, alias="ФИО")
    dolzh: Optional[str] = Field(None, alias="Долж")


class ResultCourtInfo(OfdataBaseModel):
    """
    Судебные сведения о выявленных нарушениях — блок СудСвед.
    """

    tip: Optional[str] = Field(None, alias="Тип")
    text: Optional[str] = Field(None, alias="Текст")


class ResultPrescription(OfdataBaseModel):
    """
    Сведения о выданных предписаниях — блок Предпис.
    """

    kod: Optional[str] = Field(None, alias="Код")
    text: Optional[str] = Field(None, alias="Текст")
    data: Optional[str] = Field(None, alias="Дата")


class ResultViolation(OfdataBaseModel):
    """
    Нарушения, связанные с результатами проверки — блок Наруш.
    """

    text: Optional[str] = Field(None, alias="Текст")
    sud_sved: Optional[List[ResultCourtInfo]] = Field(None, alias="СудСвед")
    predpis: Optional[List[ResultPrescription]] = Field(None, alias="Предпис")


class ResultInfoItem(OfdataBaseModel):
    """
    Информация о результатах проверки — блок Инфо.
    """

    tip: Optional[str] = Field(None, alias="Тип")
    text: Optional[str] = Field(None, alias="Текст")


class ObjectResult(OfdataBaseModel):
    """
    Результат проведения проверки по объекту — блок Результ.
    """

    data_akt: Optional[str] = Field(None, alias="ДатаАкт")
    pred: Optional[ResultRepresentative] = Field(None, alias="Пред")
    info: Optional[List[ResultInfoItem]] = Field(None, alias="Инфо")
    narush: Optional[List[ResultViolation]] = Field(None, alias="Наруш")


class InspectionObject(OfdataBaseModel):
    """
    Объект проверки — элемент массива Объекты.
    """

    adres: Optional[str] = Field(None, alias="Адрес")
    rezultat: Optional[ObjectResult] = Field(None, alias="Результ")


class InspectionMeasure(OfdataBaseModel):
    """
    Мероприятие по контролю — элемент массива Меропр.
    """

    naim: Optional[str] = Field(None, alias="Наим")
    data_nach: Optional[str] = Field(None, alias="ДатаНач")
    data_okonch: Optional[str] = Field(None, alias="ДатаОконч")


class InspectionRecord(OfdataBaseModel):
    """
    Одна запись о проверке — элемент массива Записи.
    """

    nomer: Optional[str] = Field(None, alias="Номер")
    status: Optional[str] = Field(None, alias="Статус")
    zaversh: Optional[bool] = Field(None, alias="Заверш")
    narush: Optional[bool] = Field(None, alias="Наруш")
    tip_rasp: Optional[str] = Field(None, alias="ТипРасп")
    tip_prov: Optional[str] = Field(None, alias="ТипПров")
    klass_risk: Optional[str] = Field(None, alias="КлассРиск")
    data_nach: Optional[str] = Field(None, alias="ДатаНач")
    data_okonch: Optional[str] = Field(None, alias="ДатаОконч")
    tsel: Optional[str] = Field(None, alias="Цель")
    obosn: Optional[str] = Field(None, alias="Обосн")
    org_kontr: Optional[ControlOrgInfo] = Field(None, alias="ОргКонтр")
    treb: Optional[List[str]] = Field(None, alias="Треб")
    dolzh_litsa: Optional[ResponsiblePerson] = Field(None, alias="ДолжЛица")
    obekty: Optional[List[InspectionObject]] = Field(None, alias="Объекты")
    meropr: Optional[List[InspectionMeasure]] = Field(None, alias="Меропр")


class InspectionsData(OfdataBaseModel):
    """
    Блок data ответа /v2/inspections (пагинация + список проверок).
    """

    zap_vsego: Optional[int] = Field(None, alias="ЗапВсего")
    str_vsego: Optional[int] = Field(None, alias="СтрВсего")
    str_tekushch: Optional[int] = Field(None, alias="СтрТекущ")
    zapisi: Optional[List[InspectionRecord]] = Field(None, alias="Записи")


class InspectionCompanyInfo(RelatedCompany):
    """
    Базовая информация о компании в ответе /v2/inspections.
    Структура полей совпадает с RelatedCompany (ОГРН, ИНН, КПП, и т.д.),
    поэтому наследуемся от неё и просто указываем другой смысловой контекст.
    """


class OfdataInspectionsResponse(OfdataBaseModel):
    """
    Полный ответ Ofdata для /v2/inspections.
    """

    company: Optional[InspectionCompanyInfo] = Field(None, alias="company")
    entrepreneur: Optional[InspectionEntrepreneurInfo] = Field(None, alias="entrepreneur")
    data: Optional[InspectionsData] = Field(None, alias="data")
    meta: Optional[MetaInfo] = Field(None, alias="meta")


