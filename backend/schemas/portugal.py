"""Схемы для API португальских компаний"""
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field


# ============================================================================
# Enums
# ============================================================================

class PtActivityStatus(str, Enum):
    """Статус португальской компании"""
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
    """GPS координаты компании (longitude, latitude)"""
    coordinates: List[float] = Field(
        ...,
        description="Координаты компании (долгота, широта)",
    )


class PtRegisteredOffice(BaseModel):
    """Адрес зарегистрированного офиса компании в Португалии"""
    street_number: Optional[str] = Field(
        None,
        alias="streetNumber",
        description="Номер здания/адреса",
    )
    street_name: Optional[str] = Field(
        None,
        alias="streetName",
        description="Полное название улицы, где расположена компания",
    )
    town: Optional[str] = Field(
        None,
        description="Город, где расположена компания",
    )
    zip_code: Optional[str] = Field(
        None,
        alias="zipCode",
        description="Почтовый индекс",
    )
    country: Optional[str] = Field(
        None,
        description="ISO2-код страны головного офиса компании",
    )
    gps: Optional[GpsCoordinates] = Field(
        None,
        description="GPS координаты местоположения компании",
    )

    class Config:
        populate_by_name = True


class PtAddress(BaseModel):
    """Адрес компании (зарегистрированный офис)"""
    registered_office: Optional[PtRegisteredOffice] = Field(
        None,
        alias="registeredOffice",
        description="Адрес зарегистрированного офиса компании",
    )

    class Config:
        populate_by_name = True


class PtContacts(BaseModel):
    """Контактная информация компании"""
    fax: Optional[str] = Field(
        None,
        description="Факс компании, зарегистрированный в торговой палате",
    )
    phone: Optional[str] = Field(
        None,
        description="Телефон компании, зарегистрированный в торговой палате",
    )
    website: Optional[str] = Field(
        None,
        description="Основной сайт компании",
    )


class PtNace(BaseModel):
    """NACE классификация деятельности"""
    code: Optional[str] = Field(None, description="NACE код")
    description: Optional[str] = Field(None, description="Описание NACE кода")


class PtNaics(BaseModel):
    """NAICS классификация деятельности"""
    code: Optional[str] = Field(None, description="NAICS код")
    description: Optional[str] = Field(None, description="Описание NAICS кода")


class PtSic(BaseModel):
    """SIC классификация деятельности"""
    code: Optional[str] = Field(None, description="SIC код")
    description: Optional[str] = Field(None, description="Описание SIC кода")


class PtInternationalClassification(BaseModel):
    """Международная классификация деятельности компании"""
    nace: Optional[PtNace] = Field(None, description="NACE классификация")
    naics: Optional[PtNaics] = Field(None, description="NAICS классификация")
    sic: Optional[PtSic] = Field(None, description="SIC классификация")


class WwBalanceSheet(BaseModel):
    """Финансовый отчёт компании за год (worldwide схему назвали Ww*)"""
    year: Optional[int] = Field(
        None,
        description="Год подачи последнего балансового отчёта",
    )
    balance_sheet_date: Optional[str] = Field(
        None,
        alias="balanceSheetDate",
        description="Дата подачи балансового отчёта",
    )
    employees: Optional[int] = Field(
        None,
        description="Количество сотрудников",
    )
    net_worth: Optional[float] = Field(
        None,
        alias="netWorth",
        description="Годовая прибыль (annual profit)",
    )
    operating_revenue: Optional[float] = Field(
        None,
        alias="operatingRevenue",
        description="Общая стоимость произведённой продукции (Total value of production)",
    )
    equity: Optional[float] = Field(
        None,
        description="Собственный капитал (активы минус обязательства)",
    )
    total_assets: Optional[float] = Field(
        None,
        alias="totalAssets",
        description="Общие активы компании",
    )

    class Config:
        populate_by_name = True


class WwBalanceSheets(BaseModel):
    """Набор финансовых отчётов компании"""
    last: Optional[WwBalanceSheet] = Field(
        None,
        description="Последний доступный финансовый отчёт",
    )
    all: Optional[List[WwBalanceSheet]] = Field(
        None,
        description="Все доступные финансовые отчёты",
    )


# ============================================================================
# Основная модель компании
# ============================================================================

class PtAdvanced(BaseModel):
    """Расширенная информация о португальской компании"""
    id: Optional[str] = Field(
        None,
        description="Внутренний идентификатор компании",
    )
    company_name: Optional[str] = Field(
        None,
        alias="companyName",
        description="Юридическое название компании",
    )
    vat_code: Optional[str] = Field(
        None,
        alias="vatCode",
        description="Номер регистрации НДС в европейском формате",
    )
    tax_code: Optional[str] = Field(
        None,
        alias="taxCode",
        description="Налоговый идентификационный номер",
    )
    lei_code: Optional[str] = Field(
        None,
        alias="leiCode",
        description=(
            "Legal Entity Identifier (20-значный буквенно-цифровой код, "
            "уникальный для юридического лица на финансовых рынках)"
        ),
    )
    activity_status: Optional[PtActivityStatus] = Field(
        None,
        alias="activityStatus",
        description="Статус компании",
    )
    incorporation_date: Optional[str] = Field(
        None,
        alias="incorporationDate",
        description="Дата регистрации/создания компании",
    )
    address: Optional[PtAddress] = Field(
        None,
        description="Адрес зарегистрированного офиса компании",
    )
    last_update_timestamp: Optional[int] = Field(
        None,
        alias="lastUpdateTimestamp",
        description="Момент последнего обновления данных компании",
    )
    contacts: Optional[PtContacts] = Field(
        None,
        description="Контактная информация компании",
    )
    international_classification: Optional[PtInternationalClassification] = Field(
        None,
        alias="internationalClassification",
        description="NACE/NAICS/SIC классификация деятельности",
    )
    balance_sheets: Optional[WwBalanceSheets] = Field(
        None,
        alias="balanceSheets",
        description="Финансовая отчётность компании",
    )

    class Config:
        populate_by_name = True


# ============================================================================
# Ответ API
# ============================================================================

class PortugalApiResponse(BaseModel):
    """Ответ API для португальских компаний"""
    data: Optional[List[PtAdvanced]] = Field(
        None,
        description="Список компаний",
    )
    success: Optional[bool] = Field(
        None,
        description="Флаг успешности запроса",
    )
    message: Optional[str] = Field(
        None,
        description="Текстовое сообщение/комментарий к ответу",
    )
    error: Optional[int] = Field(
        None,
        description="Код ошибки, если запрос завершился неуспешно",
    )
