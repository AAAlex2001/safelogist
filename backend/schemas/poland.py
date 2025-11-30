"""
Схемы для API польских компаний
"""
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field


# ============================================================================
# Enums
# ============================================================================

class PlActivityStatus(str, Enum):
    """Статус польской компании"""
    ACTIVE = "ACTIVE"
    DISSOLVED = "DISSOLVED"
    INACTIVE_NO_PRECISION = "INACTIVE (NO PRECISION)"
    ACTIVE_DORMANT = "ACTIVE (DORMANT)"
    STATUS_UNKNOWN = "STATUS UNKNOWN"
    IN_LIQUIDATION = "IN LIQUIDATION"
    DISSOLVED_LIQUIDATION = "DISSOLVED (LIQUIDATION)"
    ADMINISTRATIVELY_SUSPENDED = "ADMINISTRATIVELY SUSPENDED"
    DISSOLVED_MERGER_OR_TAKE_OVER = "DISSOLVED (MERGER OR TAKE-OVER)"
    DISSOLVED_BANKRUPTCY = "DISSOLVED (BANKRUPTCY)"
    ACTIVE_ADMINISTRATIVELY_NON_COMPLIANT = "ACTIVE (ADMINISTRATIVELY NON-COMPLIANT)"
    BANKRUPTCY = "BANKRUPTCY"
    ACTIVE_INSOLVENCY_PROCEEDINGS = "ACTIVE (INSOLVENCY PROCEEDINGS)"
    ACTIVE_DEFAULT_OF_PAYMENT = "ACTIVE (DEFAULT OF PAYMENT)"
    ACTIVE_REORGANIZATION = "ACTIVE (REORGANIZATION)"
    DISSOLVED_DEMERGER = "DISSOLVED (DEMERGER)"
    ACTIVE_RESCUE_PLAN = "ACTIVE (RESCUE PLAN)"


# ============================================================================
# Вложенные модели
# ============================================================================

class GpsCoordinates(BaseModel):
    """GPS координаты (longitude, latitude)"""
    coordinates: List[float] = Field(
        ...,
        description="Координаты компании (долгота, широта)",
    )


class PlRegisteredOffice(BaseModel):
    """Адрес зарегистрированного офиса в Польше"""
    street_number: Optional[str] = Field(
        None,
        alias="streetNumber",
        description="Номер здания",
    )
    street_name: Optional[str] = Field(
        None,
        alias="streetName",
        description="Полное название улицы",
    )
    town: Optional[str] = Field(
        None,
        description="Город",
    )
    zip_code: Optional[str] = Field(
        None,
        alias="zipCode",
        description="Почтовый индекс",
    )
    country: Optional[str] = Field(
        None,
        description="ISO2 код страны",
    )
    gps: Optional[GpsCoordinates] = Field(
        None,
        description="GPS координаты компании",
    )

    class Config:
        populate_by_name = True


class PlAddress(BaseModel):
    """Адрес компании"""
    registered_office: Optional[PlRegisteredOffice] = Field(
        None,
        alias="registeredOffice",
        description="Адрес зарегистрированного офиса компании",
    )

    class Config:
        populate_by_name = True


class PlContacts(BaseModel):
    """Контакты компании"""
    fax: Optional[str] = Field(None, description="Факс компании")
    phone: Optional[str] = Field(None, description="Телефон компании")
    website: Optional[str] = Field(None, description="Веб-сайт компании")


class PlNace(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class PlNaics(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class PlSic(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class PlInternationalClassification(BaseModel):
    nace: Optional[PlNace] = None
    naics: Optional[PlNaics] = None
    sic: Optional[PlSic] = None


class WwBalanceSheet(BaseModel):
    """Балансовый отчёт за год"""
    year: Optional[int] = Field(None, description="Год подачи отчёта")
    balance_sheet_date: Optional[str] = Field(
        None,
        alias="balanceSheetDate",
        description="Дата подачи отчёта",
    )
    employees: Optional[int] = Field(None, description="Количество сотрудников")
    net_worth: Optional[float] = Field(None, alias="netWorth", description="Годовая прибыль")
    operating_revenue: Optional[float] = Field(
        None,
        alias="operatingRevenue",
        description="Общая стоимость продукции",
    )
    equity: Optional[float] = Field(None, description="Собственный капитал")
    total_assets: Optional[float] = Field(
        None,
        alias="totalAssets",
        description="Всего активов",
    )

    class Config:
        populate_by_name = True


class WwBalanceSheets(BaseModel):
    """Список всех балансов"""
    last: Optional[WwBalanceSheet] = None
    all: Optional[List[WwBalanceSheet]] = None


# ============================================================================
# Основная модель польской компании
# ============================================================================

class PlAdvanced(BaseModel):
    """Расширенные данные польской компании"""
    id: Optional[str] = Field(None, description="ID компании")
    company_name: Optional[str] = Field(None, alias="companyName")
    company_number: Optional[str] = Field(None, alias="companyNumber")
    regon_number: Optional[str] = Field(None, alias="regonNumber")
    tax_code: Optional[str] = Field(None, alias="taxCode")
    lei_code: Optional[str] = Field(None, alias="leiCode")
    vat_code: Optional[str] = Field(None, alias="vatCode")
    activity_status: Optional[PlActivityStatus] = Field(
        None,
        alias="activityStatus",
    )
    incorporation_date: Optional[str] = Field(
        None,
        alias="incorporationDate",
        description="Дата регистрации компании",
    )
    address: Optional[PlAddress] = None
    last_update_timestamp: Optional[int] = Field(
        None,
        alias="lastUpdateTimestamp",
        description="Дата обновления данных",
    )
    contacts: Optional[PlContacts] = None
    international_classification: Optional[PlInternationalClassification] = Field(
        None,
        alias="internationalClassification",
    )
    balance_sheets: Optional[WwBalanceSheets] = Field(
        None,
        alias="balanceSheets",
    )

    class Config:
        populate_by_name = True


# ============================================================================
# Ответ API
# ============================================================================

class PolandApiResponse(BaseModel):
    """Формат ответа для польских компаний"""
    data: Optional[List[PlAdvanced]] = None
    success: Optional[bool] = None
    message: Optional[str] = None
    error: Optional[int] = None
