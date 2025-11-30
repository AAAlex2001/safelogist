"""
Схемы для API швейцарских компаний
"""
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field


# ============================================================================
# Enum статуса
# ============================================================================

class ChActivityStatus(str, Enum):
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
# GPS
# ============================================================================

class GpsCoordinates(BaseModel):
    coordinates: List[float] = Field(..., description="(longitude, latitude)")


# ============================================================================
# Адрес
# ============================================================================

class ChRegisteredOffice(BaseModel):
    street_number: Optional[str] = Field(None, alias="streetNumber")
    street_name: Optional[str] = Field(None, alias="streetName")
    town: Optional[str] = None
    zip_code: Optional[str] = Field(None, alias="zipCode")
    country: Optional[str] = None
    gps: Optional[GpsCoordinates] = None

    class Config:
        populate_by_name = True


class ChAddress(BaseModel):
    registered_office: Optional[ChRegisteredOffice] = Field(
        None, alias="registeredOffice"
    )

    class Config:
        populate_by_name = True


# ============================================================================
# Контакты
# ============================================================================

class ChContacts(BaseModel):
    fax: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


# ============================================================================
# Классификации деятельности
# ============================================================================

class ChNace(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class ChNaics(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class ChSic(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class ChInternationalClassification(BaseModel):
    nace: Optional[ChNace] = None
    naics: Optional[ChNaics] = None
    sic: Optional[ChSic] = None


# ============================================================================
# Финансовые отчёты (стандарт WW)
# ============================================================================

class WwBalanceSheet(BaseModel):
    year: Optional[int] = None
    balance_sheet_date: Optional[str] = Field(None, alias="balanceSheetDate")
    employees: Optional[int] = None
    net_worth: Optional[float] = Field(None, alias="netWorth")
    operating_revenue: Optional[float] = Field(None, alias="operatingRevenue")
    equity: Optional[float] = None
    total_assets: Optional[float] = Field(None, alias="totalAssets")

    class Config:
        populate_by_name = True


class WwBalanceSheets(BaseModel):
    last: Optional[WwBalanceSheet] = None
    all: Optional[List[WwBalanceSheet]] = None


# ============================================================================
# Основная модель компании
# ============================================================================

class ChAdvanced(BaseModel):
    id: Optional[str] = None
    company_name: Optional[str] = Field(None, alias="companyName")
    company_number: Optional[str] = Field(None, alias="companyNumber")
    vat_code: Optional[str] = Field(None, alias="vatCode")
    tax_code: Optional[str] = Field(None, alias="taxCode")
    lei_code: Optional[str] = Field(None, alias="leiCode")
    activity_status: Optional[ChActivityStatus] = Field(None, alias="activityStatus")
    incorporation_date: Optional[str] = Field(None, alias="incorporationDate")
    address: Optional[ChAddress] = None
    last_update_timestamp: Optional[int] = Field(None, alias="lastUpdateTimestamp")
    contacts: Optional[ChContacts] = None
    international_classification: Optional[ChInternationalClassification] = Field(
        None, alias="internationalClassification"
    )
    balance_sheets: Optional[WwBalanceSheets] = Field(None, alias="balanceSheets")

    class Config:
        populate_by_name = True


# ============================================================================
# Ответ API
# ============================================================================

class SwitzerlandApiResponse(BaseModel):
    data: Optional[List[ChAdvanced]] = None
    success: Optional[bool] = None
    message: Optional[str] = None
    error: Optional[int] = None
