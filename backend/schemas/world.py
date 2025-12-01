from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


# ============================================================================
# Activity status
# ============================================================================

class WwActivityStatus(str, Enum):
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
    ACTIVE_DEFAULT_OF_PAYMENT = "ACTIVE (DEFAULT OF PAYMENT)"
    ACTIVE_REORGANIZATION = "ACTIVE (REORGANIZATION)"
    DISSOLVED_DEMERGER = "DISSOLVED (DEMERGER)"
    ACTIVE_RESCUE_PLAN = "ACTIVE (RESCUE PLAN)"


# ============================================================================
# Company markers
# ============================================================================

class WwMarker(BaseModel):
    label: Optional[str] = None
    number: Optional[str] = None
    types: Optional[List[str]] = None


# ============================================================================
# Address + GPS
# ============================================================================

class WwGps(BaseModel):
    coordinates: List[float] = Field(..., description="(longitude, latitude)")


class WwLocationArea(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None


class WwRegisteredOfficeTop(BaseModel):
    town: Optional[str] = None
    native_town: Optional[str] = Field(None, alias="nativeTown")
    country: Optional[str] = None
    zip_code: Optional[str] = Field(None, alias="zipCode")
    street_number: Optional[str] = Field(None, alias="streetNumber")
    street_name: Optional[str] = Field(None, alias="streetName")
    gps: Optional[WwGps] = None

    county: Optional[str] = None

    nuts1: Optional[str] = None
    nuts2: Optional[str] = None
    nuts3: Optional[str] = None

    us_metropolitan_area: Optional[str] = Field(None, alias="usMetropolitanArea")
    us_state: Optional[str] = Field(None, alias="usState")

    location_area: Optional[List[WwLocationArea]] = Field(None, alias="locationArea")

    class Config:
        populate_by_name = True


class WwAddressTop(BaseModel):
    registered_office: Optional[WwRegisteredOfficeTop] = Field(None, alias="registeredOffice")

    class Config:
        populate_by_name = True


# ============================================================================
# International classification (NACE / NAICS / SIC)
# ============================================================================

class WwNaceCode(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None
    core: Optional[str] = None
    section: Optional[str] = None
    division: Optional[str] = None
    group: Optional[str] = None


class WwNaceClassification(BaseModel):
    primary: Optional[List[WwNaceCode]] = None
    secondary: Optional[List[WwNaceCode]] = None


class WwNaicsCode(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None
    section: Optional[str] = None
    division: Optional[str] = None
    group: Optional[str] = None


class WwNaicsClassification(BaseModel):
    primary: Optional[List[WwNaicsCode]] = None
    secondary: Optional[List[WwNaicsCode]] = None


class WwSicCode(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None
    section: Optional[str] = None
    division: Optional[str] = None
    group: Optional[str] = None


class WwSicClassification(BaseModel):
    primary: Optional[List[WwSicCode]] = None
    secondary: Optional[List[WwSicCode]] = None


class WwInternationalClassificationTop(BaseModel):
    nace: Optional[WwNaceClassification] = None
    naics: Optional[WwNaicsClassification] = None
    sic: Optional[WwSicClassification] = None


# ============================================================================
# National classification
# ============================================================================

class WwNationalClassification(BaseModel):
    type: Optional[List[str]] = None
    primary: Optional[List[str]] = None
    secondary: Optional[List[str]] = None


# ============================================================================
# Balance sheets
# ============================================================================

class WwTopBalanceEntry(BaseModel):
    year: Optional[int] = None
    balance_sheet_date: Optional[str] = Field(None, alias="balanceSheetDate")
    employees: Optional[int] = None
    net_worth: Optional[float] = Field(None, alias="netWorth")
    operating_revenue: Optional[float] = Field(None, alias="operatingRevenue")
    equity: Optional[float] = None
    total_assets: Optional[float] = Field(None, alias="totalAssets")

    class Config:
        populate_by_name = True


class WwBalanceSheetsTop(BaseModel):
    last: Optional[WwTopBalanceEntry] = None
    all: Optional[List[WwTopBalanceEntry]] = None


# ============================================================================
# Contacts
# ============================================================================

class WwTopContacts(BaseModel):
    fax: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


# ============================================================================
# MAIN ENTITY
# ============================================================================

class WwTop(BaseModel):
    id: Optional[str] = None
    last_update_timestamp: Optional[int] = Field(None, alias="lastUpdateTimestamp")

    company_name: Optional[str] = Field(None, alias="companyName")
    native_company_name: Optional[str] = Field(None, alias="nativeCompanyName")

    company_size: Optional[str] = Field(None, alias="companySize")

    tax_code: Optional[str] = Field(None, alias="taxCode")
    vat_code: Optional[str] = Field(None, alias="vatCode")
    company_number: Optional[str] = Field(None, alias="companyNumber")
    lei_code: Optional[str] = Field(None, alias="leiCode")

    markers: Optional[List[WwMarker]] = None
    address: Optional[WwAddressTop] = None

    activity_status: Optional[WwActivityStatus] = Field(None, alias="activityStatus")
    incorporation_date: Optional[str] = Field(None, alias="incorporationDate")

    contacts: Optional[WwTopContacts] = None

    international_classification: Optional[WwInternationalClassificationTop] = Field(
        None, alias="internationalClassification"
    )

    national_classification: Optional[WwNationalClassification] = Field(
        None, alias="nationalClassification"
    )

    balance_sheets: Optional[WwBalanceSheetsTop] = Field(None, alias="balanceSheets")

    class Config:
        populate_by_name = True


# ============================================================================
# API WRAPPER
# ============================================================================

class WwTopApiResponse(BaseModel):
    data: Optional[List[WwTop]] = None
    success: Optional[bool] = None
    message: Optional[str] = None
    error: Optional[int] = None
