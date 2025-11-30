"""Схемы для API французских компаний"""
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum, IntEnum


# ============================================================================
# Enums
# ============================================================================

class FrActivityStatus(str, Enum):
    """Статус французской компании"""
    ACTIVE = "ACTIVE"
    CEASED = "CEASED"


class CreditWorthy(IntEnum):
    """Признак кредитоспособности компании: 0 — нет, 1 — да"""
    NO = 0
    YES = 1


# ============================================================================
# Вложенные модели
# ============================================================================

class GpsCoordinates(BaseModel):
    """GPS координаты компании (longitude, latitude)"""
    coordinates: List[float] = Field(
        ...,
        description="Координаты компании (долгота, широта)",
    )


class Department(BaseModel):
    """Информация о департаменте по INSEE"""
    code: Optional[str] = Field(None, description="INSEE код департамента")
    description: Optional[str] = Field(None, description="Описание департамента по INSEE")


class Region(BaseModel):
    """Информация о регионе по INSEE"""
    code: Optional[str] = Field(None, description="INSEE код региона")
    description: Optional[str] = Field(None, description="Описание региона по INSEE")


class FrOfficeLocation(BaseModel):
    """Детализированный адрес (зарегистрированный офис или филиал)"""
    street: Optional[str] = Field(None, description="Адрес по национальной адресной базе")
    street_number: Optional[str] = Field(
        None,
        alias="streetNumber",
        description="Номер здания по национальной адресной базе",
    )
    street_name: Optional[str] = Field(
        None,
        alias="streetName",
        description="Полное название улицы по данным торговой палаты",
    )
    street_name2: Optional[str] = Field(
        None,
        alias="streetName2",
        description="Вторая строка адреса (опционально)",
    )
    street_name3: Optional[str] = Field(
        None,
        alias="streetName3",
        description="Третья строка адреса (опционально)",
    )
    street_name4: Optional[str] = Field(
        None,
        alias="streetName4",
        description="Четвёртая строка адреса, обычно регион/провинция/округ",
    )
    town: Optional[str] = Field(None, description="Город по данным торговой палаты")
    zip_code: Optional[str] = Field(
        None,
        alias="zipCode",
        description="Почтовый индекс по данным торговой палаты",
    )
    country: Optional[str] = Field(None, description="Страна зарегистрированной компании")
    gps: Optional[GpsCoordinates] = Field(
        None,
        description="GPS координаты по национальной адресной базе",
    )
    town_code: Optional[str] = Field(
        None,
        alias="townCode",
        description="INSEE код коммуны по национальной адресной базе",
    )
    department: Optional[Department] = Field(
        None,
        description="Департамент по данным INSEE",
    )
    region: Optional[Region] = Field(
        None,
        description="Регион по данным INSEE",
    )

    class Config:
        populate_by_name = True


class FrAddress(BaseModel):
    """Адрес компании (зарегистрированный офис или филиал)"""
    registered_office: Optional[FrOfficeLocation] = Field(
        None,
        alias="registeredOffice",
        description="Адрес зарегистрированного офиса",
    )
    branch_office: Optional[FrOfficeLocation] = Field(
        None,
        alias="branchOffice",
        description="Адрес филиала компании",
    )

    class Config:
        populate_by_name = True


class NafCode(BaseModel):
    """NAF код"""
    code: Optional[str] = Field(None, description="NAF код компании")
    description: Optional[str] = Field(None, description="Описание NAF кода")


class NaceCode(BaseModel):
    """NACE код"""
    code: Optional[str] = Field(None, description="NACE код компании")
    description: Optional[str] = Field(None, description="Описание NACE кода")


class InternationalClassificationFr(BaseModel):
    """Международная и национальная классификация деятельности"""
    naf: Optional[NafCode] = Field(None, description="NAF код")
    nace: Optional[NaceCode] = Field(None, description="NACE код")


class DetailedLegalForm(BaseModel):
    """Юридическая форма компании"""
    code: Optional[str] = Field(None, description="Код юридической формы компании")
    description: Optional[str] = Field(None, description="Описание юридической формы компании")


class FrBalanceSheet(BaseModel):
    """Финансовый отчёт компании за год"""
    year: Optional[int] = Field(None, description="Год подачи балансового отчёта")
    balance_sheet_date: Optional[str] = Field(
        None,
        alias="balanceSheetDate",
        description="Дата подачи балансового отчёта",
    )
    turnover: Optional[float] = Field(None, description="Годовой оборот (выручка)")
    net_worth: Optional[float] = Field(
        None,
        alias="netWorth",
        description="Годовая прибыль",
    )
    employees: Optional[int] = Field(None, description="Количество сотрудников")
    ebitda: Optional[float] = Field(None, description="EBITDA компании")

    class Config:
        populate_by_name = True


class FrBalanceSheets(BaseModel):
    """Набор финансовых отчётов компании"""
    last: Optional[FrBalanceSheet] = Field(
        None,
        description="Последний доступный финансовый отчёт",
    )
    all: Optional[List[FrBalanceSheet]] = Field(
        None,
        description="Все доступные финансовые отчёты",
    )


class FrOffice(BaseModel):
    """Информация об офисе/подразделении компании"""
    siret_code: Optional[str] = Field(
        None,
        alias="siretCode",
        description="Локальный идентификатор офиса (SIRET)",
    )
    company_name: Optional[str] = Field(
        None,
        alias="companyName",
        description="Юридическое название компании",
    )
    address: Optional[FrAddress] = Field(
        None,
        description="Адрес данного офиса",
    )
    activity_status: Optional[FrActivityStatus] = Field(
        None,
        alias="activityStatus",
        description="Статус офиса",
    )

    class Config:
        populate_by_name = True


# ============================================================================
# Основная модель компании
# ============================================================================

class FrAdvanced(BaseModel):
    """Расширенная информация о французской компании"""
    siret_code: Optional[str] = Field(
        None,
        alias="siretCode",
        description="Локальный идентификатор компании (SIRET)",
    )
    company_name: Optional[str] = Field(
        None,
        alias="companyName",
        description="Юридическое название компании",
    )
    trading_name: Optional[str] = Field(
        None,
        alias="tradingName",
        description="Торговое название компании, если отличается",
    )
    alias_name: Optional[str] = Field(
        None,
        alias="aliasName",
        description="Альтернативное название компании",
    )
    siren_code: Optional[str] = Field(
        None,
        alias="sirenCode",
        description="Локальный идентификатор компании без идентификатора филиала (SIREN)",
    )
    co_code: Optional[str] = Field(
        None,
        alias="coCode",
        description="Альтернативный регистрационный номер компании",
    )
    activity_status: Optional[FrActivityStatus] = Field(
        None,
        alias="activityStatus",
        description="Статус компании",
    )
    credit_worthy: Optional[CreditWorthy] = Field(
        None,
        alias="creditWorthy",
        description="Признак кредитоспособности компании (0 — нет, 1 — да)",
    )
    registration_date: Optional[str] = Field(
        None,
        alias="registrationDate",
        description="Дата регистрации компании",
    )
    vat_code: Optional[str] = Field(
        None,
        alias="vatCode",
        description="Номер регистрации НДС",
    )
    address: Optional[FrAddress] = Field(
        None,
        description="Адрес головного офиса компании",
    )
    international_classification: Optional[InternationalClassificationFr] = Field(
        None,
        alias="internationalClassification",
        description="NAF и NACE классификация деятельности компании",
    )
    detailed_legal_form: Optional[DetailedLegalForm] = Field(
        None,
        alias="detailedLegalForm",
        description="Подробная юридическая форма компании",
    )
    balance_sheets: Optional[FrBalanceSheets] = Field(
        None,
        alias="balanceSheets",
        description="Финансовая отчётность по годам",
    )
    creation_timestamp: Optional[int] = Field(
        None,
        alias="creationTimestamp",
        description="Время создания записи о компании во внутренней системе",
    )
    last_update_timestamp: Optional[int] = Field(
        None,
        alias="lastUpdateTimestamp",
        description="Время последнего обновления данных компании",
    )
    all_office: Optional[List[FrOffice]] = Field(
        None,
        alias="allOffice",
        description="Все офисы/подразделения компании",
    )
    id: Optional[str] = Field(
        None,
        description="Внутренний идентификатор компании",
    )

    class Config:
        populate_by_name = True


# ============================================================================
# Ответ API
# ============================================================================

class FranceApiResponse(BaseModel):
    """Ответ API французских компаний"""
    data: Optional[List[FrAdvanced]] = Field(
        None,
        description="Список компаний",
    )
    success: Optional[bool] = Field(
        None,
        description="Флаг успешности запроса",
    )
    message: Optional[str] = Field(
        None,
        description="Сопроводительное сообщение",
    )
    error: Optional[int] = Field(
        None,
        description="Код ошибки, если запрос завершился неуспешно",
    )
