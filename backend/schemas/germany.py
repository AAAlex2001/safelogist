"""
Схемы для API немецких компаний
"""
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field


# ============================================================================
# Статус компании
# ============================================================================

class DeActivityStatus(str, Enum):
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

class DeRegisteredOffice(BaseModel):
    street_number: Optional[str] = Field(None, alias="streetNumber")
    street_name: Optional[str] = Field(None, alias="streetName")
    town: Optional[str] = None
    zip_code: Optional[str] = Field(None, alias="zipCode")
    country: Optional[str] = None
    gps: Optional[GpsCoordinates] = None

    class Config:
        populate_by_name = True


class DeAddress(BaseModel):
    registered_office: Optional[DeRegisteredOffice] = Field(
        None, alias="registeredOffice"
    )

    class Config:
        populate_by_name = True


# ============================================================================
# Контакты
# ============================================================================

class DeContacts(BaseModel):
    fax: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


# ============================================================================
# Классификации деятельности
# ============================================================================

class DeNace(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class DeNaics(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class DeSic(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class DeInternationalClassification(BaseModel):
    nace: Optional[DeNace] = None
    naics: Optional[DeNaics] = None
    sic: Optional[DeSic] = None


# ============================================================================
# Финансовая отчётность (WW формат)
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

class DeAdvanced(BaseModel):
    id: Optional[str] = None
    company_name: Optional[str] = Field(None, alias="companyName")
    vat_code: Optional[str] = Field(None, alias="vatCode")
    company_number: Optional[str] = Field(None, alias="companyNumber")
    lei_code: Optional[str] = Field(None, alias="leiCode")
    activity_status: Optional[DeActivityStatus] = Field(None, alias="activityStatus")
    incorporation_date: Optional[str] = Field(None, alias="incorporationDate")
    address: Optional[DeAddress] = None
    last_update_timestamp: Optional[int] = Field(None, alias="lastUpdateTimestamp")
    contacts: Optional[DeContacts] = None
    international_classification: Optional[
        DeInternationalClassification
    ] = Field(None, alias="internationalClassification")
    balance_sheets: Optional[WwBalanceSheets] = Field(None, alias="balanceSheets")

    class Config:
        populate_by_name = True


# ============================================================================
# API Response
# ============================================================================

class GermanyApiResponse(BaseModel):
    data: Optional[List[DeAdvanced]] = None
    success: Optional[bool] = None
    message: Optional[str] = None
    error: Optional[int] = None
