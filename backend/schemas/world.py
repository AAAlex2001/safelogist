"""
Схемы для "мирового" поиска компаний (WW-advanced)
"""
from typing import Optional, List, Union
from enum import Enum
from pydantic import BaseModel, Field

# Импортируем уже существующие схемы стран
from schemas.france import FrAdvanced
from schemas.germany import DeAdvanced
from schemas.spain import EsAdvanced
from schemas.portugal import PtAdvanced
from schemas.united_kingdom import GbAdvanced
from schemas.belgium import BeAdvanced
from schemas.austria import AtAdvanced
from schemas.switzerland import ChAdvanced
from schemas.poland import PlAdvanced


# ============================================================================
# Итальянская часть (Advanced / Italy)
# ============================================================================

class ItRegion(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class ItRegisteredOffice(BaseModel):
    toponym: Optional[str] = None
    street: Optional[str] = None
    street_number: Optional[str] = Field(None, alias="streetNumber")
    street_name: Optional[str] = Field(None, alias="streetName")
    town: Optional[str] = None
    hamlet: Optional[str] = None
    province: Optional[str] = None
    zip_code: Optional[str] = Field(None, alias="zipCode")
    gps: Optional["ItGpsCoordinates"] = None
    town_code: Optional[str] = Field(None, alias="townCode")
    region: Optional[ItRegion] = None

    class Config:
        populate_by_name = True


class ItGpsCoordinates(BaseModel):
    coordinates: List[float] = Field(..., description="(longitude, latitude)")


ItRegisteredOffice.model_rebuild()


class ItAddress(BaseModel):
    registered_office: Optional[ItRegisteredOffice] = Field(
        None,
        alias="registeredOffice",
    )

    class Config:
        populate_by_name = True


class ItActivityStatus(str, Enum):
    ATTIVA = "ATTIVA"
    REGISTRATA = "REGISTRATA"
    INATTIVA = "INATTIVA"
    SOSPESA = "SOSPESA"
    IN_ISCRIZIONE = "IN_ISCRIZIONE"
    CESSATA = "CESSATA"


class ItAtecoCode(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class ItAtecoClassification(BaseModel):
    ateco: Optional[ItAtecoCode] = None           # ATECO 2025
    ateco2022: Optional[ItAtecoCode] = None       # ATECO 2022
    ateco2007: Optional[ItAtecoCode] = None       # ATECO 2007


class ItLegalForms(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class ItVatGroup(BaseModel):
    vat_group_participation: Optional[bool] = Field(
        None,
        alias="vatGroupParticipation",
    )
    is_vat_group_leader: Optional[bool] = Field(
        None,
        alias="isVatGroupLeader",
    )
    registry_ok: Optional[bool] = Field(
        None,
        alias="registryOk",
    )

    class Config:
        populate_by_name = True


class ItBalanceSheet(BaseModel):
    year: Optional[int] = None
    balance_sheet_date: Optional[str] = Field(None, alias="balanceSheetDate")
    turnover: Optional[int] = None
    net_worth: Optional[int] = Field(None, alias="netWorth")
    employees: Optional[int] = None
    share_capital: Optional[int] = Field(None, alias="shareCapital")
    total_staff_cost: Optional[int] = Field(None, alias="totalStaffCost")
    total_assets: Optional[int] = Field(None, alias="totalAssets")
    avg_gross_salary: Optional[float] = Field(None, alias="avgGrossSalary")

    class Config:
        populate_by_name = True


class ItBalanceSheets(BaseModel):
    last: Optional[ItBalanceSheet] = None
    all: Optional[List[ItBalanceSheet]] = None


class ItShareHolder(BaseModel):
    company_name: Optional[str] = Field(None, alias="companyName")
    name: Optional[str] = None
    surname: Optional[str] = None
    tax_code: Optional[str] = Field(None, alias="taxCode")
    percent_share: Optional[float] = Field(None, alias="percentShare")

    class Config:
        populate_by_name = True


class ItAdvanced(BaseModel):
    """Italian Advanced (world endpoint)"""
    tax_code: Optional[str] = Field(None, alias="taxCode")
    company_name: Optional[str] = Field(None, alias="companyName")
    vat_code: Optional[str] = Field(None, alias="vatCode")
    address: Optional[ItAddress] = None
    activity_status: Optional[ItActivityStatus] = Field(
        None,
        alias="activityStatus",
    )
    rea_code: Optional[str] = Field(None, alias="reaCode")
    cciaa: Optional[str] = None
    ateco_classification: Optional[ItAtecoClassification] = Field(
        None,
        alias="atecoClassification",
    )
    detailed_legal_form: Optional[ItLegalForms] = Field(
        None,
        alias="detailedLegalForm",
    )
    start_date: Optional[str] = Field(None, alias="startDate")
    registration_date: Optional[str] = Field(None, alias="registrationDate")
    end_date: Optional[str] = Field(None, alias="endDate")
    pec: Optional[str] = None
    tax_code_ceased: Optional[bool] = Field(None, alias="taxCodeCeased")
    tax_code_ceased_timestamp: Optional[int] = Field(
        None,
        alias="taxCodeCeasedTimestamp",
    )
    vat_group: Optional[ItVatGroup] = Field(None, alias="vatGroup")
    creation_timestamp: Optional[int] = Field(None, alias="creationTimestamp")
    last_update_timestamp: Optional[int] = Field(
        None,
        alias="lastUpdateTimestamp",
    )
    sdi_code: Optional[str] = Field(None, alias="sdiCode")
    sdi_code_timestamp: Optional[int] = Field(
        None,
        alias="sdiCodeTimestamp",
    )
    balance_sheets: Optional[ItBalanceSheets] = Field(
        None,
        alias="balanceSheets",
    )
    share_holders: Optional[List[ItShareHolder]] = Field(
        None,
        alias="shareHolders",
    )
    id: Optional[str] = None

    class Config:
        populate_by_name = True


# ============================================================================
# WorldWide (WwAdvanced)
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
    ACTIVE_DEFAULT_PAYMENT = "ACTIVE (DEFAULT OF PAYMENT)"
    ACTIVE_REORGANIZATION = "ACTIVE (REORGANIZATION)"
    DISSOLVED_DEMERGER = "DISSOLVED (DEMERGER)"
    ACTIVE_RESCUE_PLAN = "ACTIVE (RESCUE PLAN)"


class WwGpsCoordinates(BaseModel):
    coordinates: List[float] = Field(..., description="(longitude, latitude)")


class WwRegisteredOffice(BaseModel):
    street_number: Optional[str] = Field(None, alias="streetNumber")
    street_name: Optional[str] = Field(None, alias="streetName")
    town: Optional[str] = None
    zip_code: Optional[str] = Field(None, alias="zipCode")
    country: Optional[str] = None
    gps: Optional[WwGpsCoordinates] = None

    class Config:
        populate_by_name = True


class WwAddress(BaseModel):
    registered_office: Optional[WwRegisteredOffice] = Field(
        None,
        alias="registeredOffice",
    )

    class Config:
        populate_by_name = True


class WwNace(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class WwNaics(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class WwSic(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None


class WwInternationalClassification(BaseModel):
    nace: Optional[WwNace] = None
    naics: Optional[WwNaics] = None
    sic: Optional[WwSic] = None


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


class WwAdvanced(BaseModel):
    id: Optional[str] = None
    company_name: Optional[str] = Field(None, alias="companyName")
    tax_code: Optional[str] = Field(None, alias="taxCode")
    vat_code: Optional[str] = Field(None, alias="vatCode")
    company_number: Optional[str] = Field(None, alias="companyNumber")
    lei_code: Optional[str] = Field(None, alias="leiCode")
    activity_status: Optional[WwActivityStatus] = Field(None, alias="activityStatus")
    incorporation_date: Optional[str] = Field(None, alias="incorporationDate")
    address: Optional[WwAddress] = None
    last_update_timestamp: Optional[int] = Field(None, alias="lastUpdateTimestamp")
    contacts: Optional["WwContacts"] = None
    international_classification: Optional[
        WwInternationalClassification
    ] = Field(None, alias="internationalClassification")
    balance_sheets: Optional[WwBalanceSheets] = Field(None, alias="balanceSheets")

    class Config:
        populate_by_name = True


class WwContacts(BaseModel):
    fax: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


WwAdvanced.model_rebuild()


# ============================================================================
# Union всех возможных типов в мировом ответе
# ============================================================================

WorldCompany = Union[
    ItAdvanced,
    FrAdvanced,
    DeAdvanced,
    EsAdvanced,
    PtAdvanced,
    GbAdvanced,
    BeAdvanced,
    AtAdvanced,
    ChAdvanced,
    PlAdvanced,
    WwAdvanced,
]


class WorldApiResponse(BaseModel):
    data: Optional[List[WorldCompany]] = None
    success: Optional[bool] = None
    message: Optional[str] = None
    error: Optional[int] = None
