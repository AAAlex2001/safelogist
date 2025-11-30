"""
Схемы для API португальских компаний
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


# ============================================================================
# Enums
# ============================================================================

class ActivityStatus(str, Enum):
    """Статус компании"""
    ACTIVE = "ACTIVE"
    DISSOLVED = "DISSOLVED"
    INACTIVE_NO_PRECISION = "INACTIVE (NO PRECISION)"
    ACTIVE_DORMANT = "ACTIVE (DORMANT)"
    STATUS_UNKNOWN = "STATUS UNKNOWN"
    IN_LIQUIDATION = "IN LIQUIDATION"
    DISSOLVED_LIQUIDATION = "DISSOLVED (LIQUIDATION)"
    ADMINISTRATIVELY_SUSPENDED = "ADMINISTRATIVELY SUSPENDED"
    DISSOLVED_MERGER_OR_TAKEOVER = "DISSOLVED (MERGER OR TAKE-OVER)"
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
    """GPS координаты компании (longitude, latitude)"""
    coordinates: List[float] = Field(..., description="Координаты компании (долгота, широта)")


class RegisteredOffice(BaseModel):
    """Адрес зарегистрированного офиса"""
    street_number: Optional[str] = Field(None, alias="streetNumber", description="Номер адреса")
    street_name: Optional[str] = Field(None, alias="streetName", description="Полное название улицы")
    town: Optional[str] = Field(None, description="Город, где находится компания")
    zip_code: Optional[str] = Field(None, alias="zipCode", description="Почтовый индекс")
    country: Optional[str] = Field(None, description="ISO2 код страны штаб-квартиры компании")
    gps: Optional[GpsCoordinates] = Field(None, description="GPS координаты")

    class Config:
        populate_by_name = True


class PtAddress(BaseModel):
    """Адрес компании"""
    registered_office: Optional[RegisteredOffice] = Field(None, alias="registeredOffice")

    class Config:
        populate_by_name = True


class Contacts(BaseModel):
    """Контактная информация компании"""
    fax: Optional[str] = Field(None, description="Факс компании, зарегистрированный в торговой палате")
    phone: Optional[str] = Field(None, description="Телефон компании, зарегистрированный в торговой палате")
    website: Optional[str] = Field(None, description="Основной веб-сайт компании")


class NaceCode(BaseModel):
    """NACE код"""
    code: Optional[str] = Field(None, description="NACE код")
    description: Optional[str] = Field(None, description="Описание NACE кода")


class NaicsCode(BaseModel):
    """NAICS код"""
    code: Optional[str] = Field(None, description="NAICS код")
    description: Optional[str] = Field(None, description="Описание NAICS кода")


class SicCode(BaseModel):
    """SIC код"""
    code: Optional[str] = Field(None, description="SIC код")
    description: Optional[str] = Field(None, description="Описание SIC кода")


class InternationalClassification(BaseModel):
    """Международная классификация"""
    nace: Optional[NaceCode] = Field(None, description="NACE код")
    naics: Optional[NaicsCode] = Field(None, description="NAICS код")
    sic: Optional[SicCode] = Field(None, description="SIC код")


class BalanceSheet(BaseModel):
    """Балансовый отчет за год"""
    year: Optional[int] = Field(None, description="Год подачи балансового отчета")
    balance_sheet_date: Optional[str] = Field(None, alias="balanceSheetDate", description="Дата подачи балансового отчета")
    employees: Optional[int] = Field(None, description="Количество сотрудников")
    net_worth: Optional[float] = Field(None, alias="netWorth", description="Годовая прибыль")
    operating_revenue: Optional[float] = Field(None, alias="operatingRevenue", description="Общая стоимость производства")
    equity: Optional[float] = Field(None, description="Остаточная стоимость активов компании после вычета всех обязательств")
    total_assets: Optional[float] = Field(None, alias="totalAssets", description="Общие активы")

    class Config:
        populate_by_name = True


class WwBalanceSheets(BaseModel):
    """Балансовые отчеты"""
    last: Optional[BalanceSheet] = Field(None, description="Последний балансовый отчет")
    all: Optional[List[BalanceSheet]] = Field(None, description="Все балансовые отчеты")


# ============================================================================
# Основные модели
# ============================================================================

class PtAdvanced(BaseModel):
    """Расширенная информация о компании"""
    id: Optional[str] = Field(None, description="ID компании")
    company_id: Optional[str] = Field(None, alias="company id", description="ID компании")
    company_name: Optional[str] = Field(None, alias="companyName", description="Юридическое название компании")
    vat_code: Optional[str] = Field(None, alias="vatCode", description="Номер регистрации НДС в европейском формате")
    tax_code: Optional[str] = Field(None, alias="taxCode", description="Идентификационный налоговый номер")
    lei_code: Optional[str] = Field(None, alias="leiCode", description="Legal Entity Identifier - уникальный 20-символьный код")
    activity_status: Optional[ActivityStatus] = Field(None, alias="activityStatus", description="Статус компании")
    incorporation_date: Optional[str] = Field(None, alias="incorporationDate", description="Дата регистрации компании")
    address: Optional[PtAddress] = Field(None, description="Адрес компании")
    last_update_timestamp: Optional[int] = Field(None, alias="lastUpdateTimestamp", description="Время последнего обновления данных компании")
    contacts: Optional[Contacts] = Field(None, description="Контактная информация")
    international_classification: Optional[InternationalClassification] = Field(
        None, 
        alias="internationalClassification", 
        description="Международная классификация"
    )
    balance_sheets: Optional[WwBalanceSheets] = Field(None, alias="balanceSheets", description="Балансовые отчеты")

    class Config:
        populate_by_name = True


class PortugalApiResponse(BaseModel):
    """Ответ API португальских компаний"""
    data: Optional[List[PtAdvanced]] = Field(None, description="Список компаний")
    success: Optional[bool] = Field(None, description="Успешность запроса")
    message: Optional[str] = Field(None, description="Сообщение")
    error: Optional[int] = Field(None, description="Код ошибки")

