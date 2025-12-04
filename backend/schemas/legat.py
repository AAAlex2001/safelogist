from pydantic import BaseModel
from typing import List, Optional, Union


# ================================
#   SCHEMA: /api2/by/court
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
    error: Optional[str]
    total: int
    claimant: List[ByCourtCase]


# ================================
#   SCHEMA: /api2/by/actional
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
    parties: List[ByActionalParty]
    decision: Optional[Union[str, List[str]]]


class ByActionalResponse(BaseModel):
    error: Optional[dict]
    total: int
    ist: List[ByActionalCase]


# ================================
#   SCHEMA: /api2/by/bankrupt
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
    error: Optional[dict]
    bankrupt: Optional[ByBankruptData]



# ================================
#   SCHEMA: /api2/by/full
# ================================

class ByFullResponse(BaseModel):
    court: Optional[ByCourtResponse]
    actional: Optional[ByActionalResponse]
    bankrupt: Optional[ByBankruptResponse]