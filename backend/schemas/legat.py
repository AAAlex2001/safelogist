from pydantic import BaseModel
from typing import List, Optional, Union, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from schemas.financial_reports import FinancialReportsResponse


# ================================
#   Belarus — /api2/by/court
# ================================

class ByCourtCase(BaseModel):
    number: Optional[str]
    date: Optional[str]
    decision: Optional[str]
    debt: Optional[str]
    claimant: Optional[str]
    cl_unp: Optional[str]
    debtor: Optional[str]
    db_unp: Optional[str]
    region: Optional[str]
    judge: Optional[str]
    year: Optional[str]
    month: Optional[str]
    refusal: Optional[int]


class ByCourtResponse(BaseModel):
    error: Optional[Any]
    total: int
    claimant: Optional[List[ByCourtCase]] = None


# ================================
#   Belarus — /api2/by/actional
# ================================

class ByActionalParty(BaseModel):
    type_name: Optional[str]
    name: Optional[str]
    unp: Optional[str]


class ByActionalCase(BaseModel):
    case_number: Optional[str]
    city: Optional[str]
    court_number: Optional[int]
    date: Optional[str]
    dispute_id: Optional[int]
    dispute_description: Optional[str]
    last_date: Optional[str]
    court_time: Optional[str]
    office_number: Optional[str]
    judge_type: Optional[str]
    judge_name: Optional[str]
    cassation: Optional[int]
    parties: Optional[List[ByActionalParty]] = None
    decision: Optional[Union[str, List[str]]]


class ByActionalResponse(BaseModel):
    error: Optional[Any]
    total: int
    ist: Optional[List[ByActionalCase]] = None


# ================================
#   Belarus — /api2/by/bankrupt
# ================================

class ByBankruptData(BaseModel):
    unp: Optional[str]
    email: Optional[str]
    tel: Optional[str]
    file_number: Optional[str]
    declarant_name: Optional[str]
    legal_address: Optional[str]
    date_start: Optional[str]
    date_close: Optional[str]
    date_receivership: Optional[str]
    date_protection_end: Optional[str]
    date_exclusion: Optional[str]
    date_start_process: Optional[str]
    date_finish_pocess: Optional[str]
    file_status: Optional[int]
    value: Optional[str]
    v_c: Optional[str]
    fio: Optional[str]
    name: Optional[str]
    surname: Optional[str]
    third_name: Optional[str]
    tel_mobile: Optional[str]
    email_m: Optional[str]
    name_m: Optional[str]
    statusProc: Optional[str]


class ByBankruptResponse(BaseModel):
    error: Optional[Any]
    bankrupt: Optional[ByBankruptData]



# ================================
#   Belarus — FULL
# ================================

class ByFullResponse(BaseModel):
    court: Optional[ByCourtResponse]
    actional: Optional[ByActionalResponse]
    bankrupt: Optional[ByBankruptResponse]



# =======================================
#   Kazakhstan — /api2/kz/data
# =======================================

class KzDetails(BaseModel):
    bin: Optional[str]
    name: Optional[str]
    date_reg: Optional[str]
    oked: Optional[str]
    code_oked: Optional[str]
    code_oked2: Optional[str]
    krp: Optional[int]
    nkrp: Optional[str]
    kato: Optional[str]
    address: Optional[str]
    ruk: Optional[str]
    rnn: Optional[str]
    d_reg: Optional[str]
    date_end: Optional[str]
    reason: Optional[str]
    liq: Optional[int]
    status_stat_id: Optional[int]
    status_egov_id: Optional[int]
    date_status_egov: Optional[str]


class KzFalseEnterprise(BaseModel):
    date_cancellations: Optional[str]
    date_doc_cancellations: Optional[str]
    base: Optional[str]
    date: Optional[str]


class KzBankrupt(BaseModel):
    status: Optional[int]
    date_start: Optional[str]
    date_finish: Optional[str]
    decision_number: Optional[str]


class KzDebtCustoms(BaseModel):
    total: Optional[float]
    date: Optional[str]
    months: Optional[int]


class KzDebtTax(BaseModel):
    organ: Optional[str]
    total: Optional[float]
    principal: Optional[float]
    fine: Optional[float]
    penalty: Optional[float]
    months: Optional[int]
    date: Optional[str]


class KzDebtPension(BaseModel):
    organ: Optional[str]
    total: Optional[float]
    principal: Optional[float]
    fine: Optional[float]
    penalty: Optional[float]
    months: Optional[int]
    date: Optional[str]


class KzDataResponse(BaseModel):
    error: Optional[Any]
    details: Optional[KzDetails]
    risk: Optional[int]
    false_enterprise: Optional[KzFalseEnterprise]
    bankrupt: Optional[KzBankrupt]
    debt_customs: Optional[KzDebtCustoms]
    debt_tax: Optional[KzDebtTax]
    debt_pension: Optional[KzDebtPension]
    kgk: Optional[int]
    sez: Optional[Any]
    signs: Optional[int]
    license: Optional[int]
    supplier: Optional[Any]
    foreign_branch_rf: Optional[int]
    industrial_products: Optional[int]
    soft_registry: Optional[int]


# =======================================
#   Kazakhstan — /api2/kz/tax
# =======================================

class KzTaxItem(BaseModel):
    year: int
    sum: float


class KzTaxResponse(BaseModel):
    error: Optional[Any]
    date_update: Optional[str]
    tax: Optional[List[KzTaxItem]] = None


# =======================================
#   Kazakhstan — /api2/kz/contacts
# =======================================

class KzContactsData(BaseModel):
    phone: Optional[List[str]] = None
    email: Optional[List[str]] = None
    fax: Optional[str] = None
    site: Optional[str] = None


class KzContactsResponse(BaseModel):
    error: Optional[Any]
    contacts: KzContactsData


# =======================================
#   Kazakhstan — /api2/kz/risk
# =======================================

class KzRiskItem(BaseModel):
    base: Optional[str] = None
    date: Optional[str] = None


class KzRiskData(BaseModel):
    missing_address: Optional[List[KzRiskItem]] = None
    inactive: Optional[List[KzRiskItem]] = None
    registration_invalid: Optional[List[KzRiskItem]] = None
    violations_tax: Optional[List[KzRiskItem]] = None


class KzRiskResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    risk: KzRiskData


# =======================================
#   Kazakhstan — /api2/kz/debt
# =======================================

class KzDebtTaxItem(BaseModel):
    debt_all: float
    debt1: float
    debt2: float
    debt3: float
    period: int
    date: str


class KzDebtPensionItem(BaseModel):
    debt: float
    period: int
    date: str


class KzDebtCustomsItem(BaseModel):
    debt: float
    date: str
    period: int


class KzDebtData(BaseModel):
    debt_tax: Optional[List[KzDebtTaxItem]] = None
    debt_pension: Optional[List[KzDebtPensionItem]] = None
    debt_customs: Optional[List[KzDebtCustomsItem]] = None


class KzDebtResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    debt: KzDebtData


# =======================================
#   Kazakhstan — /api2/kz/court
# =======================================

class KzCourtParty(BaseModel):
    bin: Optional[str]
    name: str


class KzCourtParties(BaseModel):
    ist: Optional[List[KzCourtParty]] = None
    otv: Optional[List[KzCourtParty]] = None


class KzCourtDocument(BaseModel):
    file_name: str


class KzCourtItem(BaseModel):
    case_number: str
    court: str
    date_last: Optional[str]
    court_time: Optional[str]
    room: Optional[str]
    judge: Optional[str]
    parties: KzCourtParties
    documents: Optional[List[KzCourtDocument]] = None


class KzCourtResponse(BaseModel):
    error: Optional[Any]
    total: int
    ist: Optional[List[KzCourtItem]] = None


# =======================================
#   Kazakhstan — /api2/kz/directorsLinks
# =======================================

class KzDirectorCompany(BaseModel):
    company_bin: str
    company_name: str
    address: str
    active: int


class KzDirectorItem(BaseModel):
    total: int
    name: str
    director: Optional[List[KzDirectorCompany]] = None


class KzDirectorsLinks(BaseModel):
    active: Optional[List[KzDirectorItem]] = None
    history: Optional[List[KzDirectorItem]] = None


class KzDirectorsLinksResponse(BaseModel):
    error: Optional[Any]
    links: KzDirectorsLinks


# =======================================
#   Kazakhstan — FULL
# =======================================

class KzFullResponse(BaseModel):
    data: Optional[KzDataResponse] = None
    tax: Optional[KzTaxResponse] = None
    contacts: Optional[KzContactsResponse] = None
    risk: Optional[KzRiskResponse] = None
    debt: Optional[KzDebtResponse] = None
    court: Optional[KzCourtResponse] = None
    directors: Optional[KzDirectorsLinksResponse] = None


# =======================================
#   Ukraine — /api2/ua/data
# =======================================

class UaDetails(BaseModel):
    edrpou: Optional[str]
    full: Optional[str]
    short: Optional[str]
    address: Optional[str]
    date_reg: Optional[str]
    status: Optional[str]
    status_id: Optional[int]
    ruk: Optional[str]
    code_oked: Optional[str]
    oked: Optional[str]


class UaFounder(BaseModel):
    name: str
    fund: Optional[float] = None


class UaExec(BaseModel):
    debtor: Optional[int] = None
    creditor: Optional[int] = None


class UaCourt(BaseModel):
    criminal: Optional[int] = None
    administrative: Optional[int] = None
    economic: Optional[int] = None
    civil: Optional[int] = None
    cases_administrative: Optional[int] = None


class UaKgk(BaseModel):
    planned: Optional[int] = None
    unplanned: Optional[int] = None


class UaLiquidation(BaseModel):
    action: Optional[str] = None
    liquidator: Optional[str] = None
    committee: Optional[List[str]] = None
    reorg_type: Optional[str] = None


class UaDataResponse(BaseModel):
    error: Optional[Any]
    details: Optional[UaDetails]
    founders: Optional[List[UaFounder]] = None
    exec: Optional[UaExec]
    court: Optional[UaCourt]
    kgk: Optional[UaKgk]
    bankrupt: Optional[int] = None
    sanct: Optional[Any] = None
    liquidation: Optional[UaLiquidation] = None
    foreign_branch_rf: Optional[int] = None


# =======================================
#   Ukraine — /api2/ua/court
# =======================================

class UaCourtCase(BaseModel):
    number: Optional[str] = None
    case_number: Optional[str] = None
    date_decision: Optional[str] = None
    date_legal: Optional[str] = None
    chairmen_Name: Optional[str] = None
    court_name: Optional[str] = None
    jud_decision: Optional[str] = None


class UaCourtResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]

    criminal: Optional[List[UaCourtCase]] = None
    administrative: Optional[List[UaCourtCase]] = None
    economic: Optional[List[UaCourtCase]] = None
    civil: Optional[List[UaCourtCase]] = None
    cases_administrative: Optional[List[UaCourtCase]] = None

# =======================================
#   Ukraine — /api2/ua/bankrupt
# =======================================

class UaBankruptItem(BaseModel):
    date: Optional[str] = None
    number: Optional[str] = None
    type: Optional[str] = None
    name_debtor: Optional[str] = None
    num_court: Optional[str] = None
    date_event_from: Optional[str] = None
    date_event_to: Optional[str] = None
    date_end: Optional[str] = None


class UaBankruptResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    bankrupt: Optional[List[UaBankruptItem]] = None


# =======================================
#   Ukraine — /api2/ua/liquidation
# =======================================

class UaLiquidationItem(BaseModel):
    reg_act: Optional[str] = None
    liquidator: Optional[str] = None
    liq_commission: Optional[str] = None
    date_demand: Optional[str] = None
    type_org: Optional[str] = None


class UaLiquidationResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    liquidation: Optional[List[UaLiquidationItem]] = None


# =======================================
#   Ukraine — /api2/ua/vehicles
# =======================================

class UaVehicleItem(BaseModel):
    licStatus: Optional[str] = None
    licStartDate: Optional[str] = None
    vhclType: Optional[str] = None
    vhclVendorID: Optional[str] = None
    vhclModel: Optional[str] = None
    vchlManufYear: Optional[str] = None
    vhclSerie: Optional[str] = None
    docNum: Optional[str] = None


class UaVehiclesResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    vehicles: Optional[List[UaVehicleItem]] = None


# =======================================
#   Ukraine — FULL
# =======================================

class UaFullResponse(BaseModel):
    data: Optional[UaDataResponse] = None
    court: Optional[UaCourtResponse] = None
    bankrupt: Optional[UaBankruptResponse] = None
    liquidation: Optional[UaLiquidationResponse] = None
    vehicles: Optional[UaVehiclesResponse] = None



# =======================================
#   Kyrgyzstan — /api2/kg/data
# =======================================

class KgDetails(BaseModel):
    full_off: Optional[str] = None
    full_offkr: Optional[str] = None
    short: Optional[str] = None
    short_off: Optional[str] = None
    inn: Optional[str] = None
    number: Optional[str] = None
    date: Optional[str] = None
    okpo: Optional[str] = None
    status: Optional[str] = None
    legal_form: Optional[str] = None
    alien: Optional[str] = None
    region: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    microdistrict: Optional[str] = None
    street: Optional[str] = None
    hause: Optional[str] = None
    apartament: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    email: Optional[str] = None
    date_first: Optional[str] = None
    create: Optional[str] = None
    form_create: Optional[str] = None
    fio: Optional[str] = None
    activities: Optional[str] = None
    code: Optional[str] = None
    quantity_fiz: Optional[int] = None
    quantity_ur: Optional[int] = None
    quantity_partner: Optional[int] = None


class KgSez(BaseModel):
    name_sez: Optional[str] = None
    project: Optional[str] = None
    date: Optional[str] = None
    name_authority: Optional[str] = None
    number: Optional[str] = None


class KgDataResponse(BaseModel):
    error: Optional[Any]
    details: Optional[KgDetails]
    sez: Optional[KgSez] = None
    foreign_branch_rf: Optional[int] = None
    soft_registry: Optional[int] = None


# =======================================
#   Kyrgyzstan — /api2/kg/debt
# =======================================


class KgDebtItem(BaseModel):
    date: Optional[str] = None
    sum: Optional[float] = None


class KgDebtResponse(BaseModel):
    error: Optional[Any]
    debt: Optional[List[KgDebtItem]] = None



# =======================================
#   Kyrgyzstan — FULL
# =======================================

class KgFullResponse(BaseModel):
    data: KgDataResponse
    debt: KgDebtResponse




# =======================================
#   Moldova — /api2/mda/data
# =======================================

class MdaDetails(BaseModel):
    idno: Optional[str] = None
    name: Optional[str] = None
    date: Optional[str] = None
    date_liquidation: Optional[str] = None
    address: Optional[str] = None
    status: Optional[int] = None
    status_name: Optional[str] = None
    forma: Optional[str] = None
    ruk: Optional[str] = None
    founder: Optional[str] = None


class MdaActivityItem(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None


class MdaDataResponse(BaseModel):
    error: Optional[Any]
    details: Optional[MdaDetails] = None
    unlicensed: Optional[List[MdaActivityItem]] = None
    licensed: Optional[List[MdaActivityItem]] = None


# =======================================
#   Moldova — /api2/mda/directors
# =======================================

class MdaDirectorItem(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    date_update: Optional[str] = None
    active: Optional[int] = None


class MdaDirectorsResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    directors: Optional[List[MdaDirectorItem]] = None


# =======================================
#   Moldova — /api2/mda/founders
# =======================================

class MdaFounderItem(BaseModel):
    name: Optional[str] = None
    percent: Optional[float] = None
    date_update: Optional[str] = None
    active: Optional[int] = None


class MdaFoundersResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    founders: Optional[List[MdaFounderItem]] = None


# =======================================
#   Moldova — /api2/mda/beneficiaries
# =======================================

class MdaBeneficiaryItem(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    date_update: Optional[str] = None
    active: Optional[int] = None


class MdaBeneficiariesResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    beneficiaries: Optional[List[MdaBeneficiaryItem]] = None



# =======================================
#   Moldova — FULL
# =======================================

class MdaFullResponse(BaseModel):
    data: Optional[MdaDataResponse] = None
    directors: Optional[MdaDirectorsResponse] = None
    founders: Optional[MdaFoundersResponse] = None
    beneficiaries: Optional[MdaBeneficiariesResponse] = None
    financial_reports: Optional[dict] = None



# =======================================
#   Uzbekistan — /api2/uz/data
# =======================================

class UzDirector(BaseModel):
    name: Optional[str] = None
    inn: Optional[str] = None


class UzFounder(BaseModel):
    name: Optional[str] = None
    percent: Optional[float] = None


class UzDetails(BaseModel):
    type: Optional[int] = None
    pinfl: Optional[str] = None
    inn: Optional[str] = None
    full: Optional[str] = None
    address: Optional[str] = None
    reg_number: Optional[str] = None
    status: Optional[str] = None
    status_id: Optional[int] = None
    date_reg: Optional[str] = None
    date_update: Optional[str] = None
    date_liquidation: Optional[str] = None
    liquidation_reason: Optional[str] = None
    date_liquidation_begin: Optional[str] = None
    date_liquidation_end: Optional[str] = None
    reg_org: Optional[str] = None
    opf_code: Optional[int] = None
    opf_name: Optional[str] = None
    soogu_code: Optional[int] = None
    soogu_name: Optional[str] = None
    capital: Optional[float] = None
    currency: Optional[str] = None
    small: Optional[int] = None
    okved_code: Optional[str] = None
    okved_name: Optional[str] = None
    director: Optional[UzDirector] = None
    founders: Optional[List[UzFounder]] = None


class UzSales(BaseModel):
    outlets: Optional[int] = None
    kiosks: Optional[int] = None
    location: Optional[str] = None


class UzSharePartState(BaseModel):
    share: Optional[float] = None
    active: Optional[int] = None


class UzDataResponse(BaseModel):
    error: Optional[Any] = None
    details: Optional[UzDetails] = None
    foreign_branch_rf: Optional[int] = None
    sales: Optional[UzSales] = None
    dominant: Optional[int] = None
    sharepart_state: Optional[UzSharePartState] = None


# =======================================
#   Uzbekistan — /api2/uz/unscrupulous
# =======================================

class UzUnscrupulousItem(BaseModel):
    number_decision: Optional[str] = None
    date_decision: Optional[str] = None
    date_begin: Optional[str] = None
    date_end: Optional[str] = None


class UzUnscrupulousResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    unscrupulous: Optional[List[UzUnscrupulousItem]] = None


# =======================================
#   Uzbekistan — /api2/uz/risk
# =======================================

class UzRiskLawViolationItem(BaseModel):
    law: Optional[str] = None
    violation: Optional[str] = None
    date: Optional[str] = None
    active: Optional[int] = None


class UzRiskData(BaseModel):
    abusing_vat: Optional[int] = None
    law_violation: Optional[List[UzRiskLawViolationItem]] = None


class UzRiskResponse(BaseModel):
    error: Optional[Any]
    risk: Optional[UzRiskData] = None



# =======================================
#   Uzbekistan — /api2/uz/court
# =======================================

class UzCourtParty(BaseModel):
    name: Optional[str] = None
    inn: Optional[str] = None


class UzCourtParties(BaseModel):
    ist: Optional[List[UzCourtParty]] = None
    otv: Optional[List[UzCourtParty]] = None
    dr: Optional[List[UzCourtParty]] = None


class UzCourtHearing(BaseModel):
    name_court: Optional[str] = None
    instance: Optional[str] = None
    judge: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    name_doc: Optional[str] = None
    result: Optional[str] = None
    decision_number: Optional[str] = None
    parties: Optional[UzCourtParties] = None


class UzCourtItem(BaseModel):
    case_number: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    dispute: Optional[str] = None
    court_hearing: Optional[List[UzCourtHearing]] = None


class UzCourtResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    ist: Optional[List[UzCourtItem]] = None
    otv: Optional[List[UzCourtItem]] = None
    dr: Optional[List[UzCourtItem]] = None


# =======================================
#   Uzbekistan — /api2/uz/founders
# =======================================

class UzFounderItem(BaseModel):
    name: Optional[str] = None
    percent: Optional[float] = None
    active: Optional[int] = None


class UzFoundersResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    founders: Optional[List[UzFounderItem]] = None


# =======================================
#   Uzbekistan — /api2/uz/contacts
# =======================================

class UzContactsData(BaseModel):
    phone: Optional[List[str]] = None
    email: Optional[List[str]] = None
    fax: Optional[str] = None
    site: Optional[str] = None


class UzContactsResponse(BaseModel):
    error: Optional[Any]
    contacts: Optional[UzContactsData] = None


# =======================================
#   Uzbekistan — /api2/uz/address
# =======================================

class UzAddressItem(BaseModel):
    address: Optional[str] = None
    soato_code: Optional[str] = None
    soato_name: Optional[str] = None
    active: Optional[int] = None


class UzAddressResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    address: Optional[List[UzAddressItem]] = None


# =======================================
#   Uzbekistan — /api2/uz/full
# =======================================

class UzFullResponse(BaseModel):
    data: Optional[UzDataResponse] = None
    unscrupulous: Optional[UzUnscrupulousResponse] = None
    risk: Optional[UzRiskResponse] = None
    court: Optional[UzCourtResponse] = None
    founders: Optional[UzFoundersResponse] = None
    contacts: Optional[UzContactsResponse] = None
    address: Optional[UzAddressResponse] = None


# =======================================
#   Armenia — /api2/am/data
# =======================================

class AmDetails(BaseModel):
    inn: Optional[str] = None
    reg_number: Optional[str] = None
    full: Optional[str] = None
    full_ru: Optional[str] = None
    address: Optional[str] = None

    status_egr: Optional[str] = None
    status_egr_ru: Optional[str] = None
    status_egr_id: Optional[int] = None

    status: Optional[str] = None
    status_ru: Optional[str] = None
    status_id: Optional[int] = None

    date_reg_egr: Optional[str] = None
    date_reg: Optional[str] = None

    reg_name: Optional[str] = None
    reg_name_ru: Optional[str] = None

    tax_regime: Optional[str] = None
    tax_regime_ru: Optional[str] = None

    z_code: Optional[int] = None

    opf_code: Optional[int] = None
    opf_name: Optional[str] = None
    opf_name_ru: Optional[str] = None

    okved_code: Optional[str] = None
    okved_name: Optional[str] = None
    okved_name_ru: Optional[str] = None


class AmDataResponse(BaseModel):
    error: Optional[Any] = None
    details: Optional[AmDetails] = None
    foreign_branch_rf: Optional[int] = None


# =======================================
#   Armenia — /api2/am/address
# =======================================

class AmAddressItem(BaseModel):
    address: Optional[str] = None
    postcode: Optional[str] = None
    active: Optional[int] = None


class AmAddressResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    address: Optional[List[AmAddressItem]] = None


# =======================================
#   Armenia — /api2/am/names
# =======================================

class AmNameItem(BaseModel):
    full: Optional[str] = None
    full_ru: Optional[str] = None
    active: Optional[int] = None


class AmNamesResponse(BaseModel):
    error: Optional[Any]
    total: Optional[int]
    names: Optional[List[AmNameItem]] = None


# =======================================
#   Armenia — Full
# =======================================

class AmFullResponse(BaseModel):
    data: Optional[AmDataResponse] = None
    address: Optional[AmAddressResponse] = None
    names: Optional[AmNamesResponse] = None
