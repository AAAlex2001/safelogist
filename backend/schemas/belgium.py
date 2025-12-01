"""
Схемы для API бельгийских компаний
"""
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field


# ============================================================================
# Статус компании
# ============================================================================

class BeActivityStatus(str, Enum):
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
    ACTIVE_ADMIN_NON_COMPLIANT = "ACTIVE (ADMINISTRATIVELY NON-COMPLIANT)"
    BANKRUPTCY = "BANKRUPTCY"
    ACTIVE_INSOLVENCY_PROCEEDINGS = "ACTIVE (INSOLVENCY PROCEEDINGS)"
    ACTIVE_DEFAULT_PAYMENT = "ACTIVE (DEFAULT OF PAYMENT)"
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

class BeRegisteredOffice(BaseModel):
    street_number: Optional[str] = Field(None, alias="streetNumber")
    street_name: Optional[str] = Field(None, alias="streetName")
    town: Optional[str] = None
    zip_code: Optional[str] = Field(None, alias="zipCode")
    country: Optional[str] = None
    gps: Optional[GpsCoordinates] = None

    class Config:
        populate_by_name = True


class BeAddress(BaseModel):
    registered_office: Optional[BeRegisteredOffice] = Field(
        None, alias="registeredOffice"
    )

    class Config:
        populate_by_name = True


# ============================================================================
# Контакты
# ============================================================================

class BeContacts(BaseModel):
    fax: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


# ============================================================================
# Международные классификации
# ============================================================================

class BeNace(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class BeNaics(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class BeSic(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class BeInternationalClassification(BaseModel):
    nace: Optional[BeNace] = None
    naics: Optional[BeNaics] = None
    sic: Optional[BeSic] = None


# ============================================================================
# Финансовые отчёты (WW)
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
# Основная модель BE
# ============================================================================

class BeAdvanced(BaseModel):
    id: Optional[str] = None
    company_name: Optional[str] = Field(None, alias="companyName")
    company_number: Optional[str] = Field(None, alias="companyNumber")
    establishment_number: Optional[str] = Field(None, alias="establishmentNumber")
    vat_code: Optional[str] = Field(None, alias="vatCode")
    lei_code: Optional[str] = Field(None, alias="leiCode")
    tax_code: Optional[str] = Field(None, alias="taxCode")
    activity_status: Optional[BeActivityStatus] = Field(None, alias="activityStatus")
    incorporation_date: Optional[str] = Field(None, alias="incorporationDate")
    address: Optional[BeAddress] = None
    last_update_timestamp: Optional[int] = Field(None, alias="lastUpdateTimestamp")
    contacts: Optional[BeContacts] = None
    international_classification: Optional[
        BeInternationalClassification
    ] = Field(None, alias="internationalClassification")
    balance_sheets: Optional[WwBalanceSheets] = Field(None, alias="balanceSheets")

    class Config:
        populate_by_name = True


# ============================================================================
# API Response
# ============================================================================

class BelgiumApiResponse(BaseModel):
    data: Optional[List[BeAdvanced]] = None
    success: Optional[bool] = None
    message: Optional[str] = None
    error: Optional[int] = None
