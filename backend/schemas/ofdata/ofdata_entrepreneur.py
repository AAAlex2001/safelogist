from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
from schemas.ofdata.ofdata_company import OfdataBaseModel


# ================================
#   Переиспользуемые модели из ofdata_company
# ================================

class StatusInfo(OfdataBaseModel):
    """Статус"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class TerminationInfo(OfdataBaseModel):
    """Сведения о прекращении деятельности"""
    data: Optional[str] = Field(None, alias="Дата")
    naim: Optional[str] = Field(None, alias="Наим")


class RegionInfo(OfdataBaseModel):
    """Регион"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class OkvedInfo(OfdataBaseModel):
    """ОКВЭД"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")
    versiya: Optional[str] = Field(None, alias="Версия")


class OkopfInfo(OfdataBaseModel):
    """Организационно-правовая форма"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class OkfsInfo(OfdataBaseModel):
    """Форма собственности"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class OkoguInfo(OfdataBaseModel):
    """Общероссийский классификатор органов государственной власти и управления"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class OkatoInfo(OfdataBaseModel):
    """Общероссийский классификатор объектов административно-территориального деления"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class OktmoInfo(OfdataBaseModel):
    """Общероссийский классификатор территорий муниципальных образований"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class TaxOrgInfo(OfdataBaseModel):
    """Информация о налоговом органе"""
    kod_org: Optional[str] = Field(None, alias="КодОрг")
    naim_org: Optional[str] = Field(None, alias="НаимОрг")
    adres_org: Optional[str] = Field(None, alias="АдресОрг")


class CurrentTaxOrgInfo(OfdataBaseModel):
    """Текущая постановка на учет в налоговом органе"""
    kod_org: Optional[str] = Field(None, alias="КодОрг")
    naim_org: Optional[str] = Field(None, alias="НаимОрг")
    data: Optional[str] = Field(None, alias="Дата")


class PfrInfo(OfdataBaseModel):
    """Регистрация в ПФР"""
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    reg_nomer: Optional[str] = Field(None, alias="РегНомер")
    kod_org: Optional[str] = Field(None, alias="КодОрг")
    naim_org: Optional[str] = Field(None, alias="НаимОрг")


class FssInfo(OfdataBaseModel):
    """Регистрация в ФСС"""
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    reg_nomer: Optional[str] = Field(None, alias="РегНомер")
    kod_org: Optional[str] = Field(None, alias="КодОрг")
    naim_org: Optional[str] = Field(None, alias="НаимОрг")


class RelatedCompany(OfdataBaseModel):
    """Компания, связанная с предпринимателем"""
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    kpp: Optional[str] = Field(None, alias="КПП")
    naim_sokr: Optional[str] = Field(None, alias="НаимСокр")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    status: Optional[str] = Field(None, alias="Статус")
    data_likv: Optional[str] = Field(None, alias="ДатаЛикв")
    region_kod: Optional[str] = Field(None, alias="РегионКод")
    yur_adres: Optional[str] = Field(None, alias="ЮрАдрес")
    okved: Optional[str] = Field(None, alias="ОКВЭД")


class License(OfdataBaseModel):
    """Лицензия"""
    nomer: Optional[str] = Field(None, alias="Номер")
    data: Optional[str] = Field(None, alias="Дата")
    data_nach: Optional[str] = Field(None, alias="ДатаНач")
    data_okonch: Optional[str] = Field(None, alias="ДатаОконч")
    lits_org: Optional[str] = Field(None, alias="ЛицОрг")
    vid_deyat: Optional[List[str]] = Field(None, alias="ВидДеят")


class Trademark(OfdataBaseModel):
    """Товарный знак и знак обслуживания РФ"""
    id: Optional[int] = Field(None, alias="ID")
    url: Optional[str] = Field(None, alias="URL")
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    data_okonch: Optional[str] = Field(None, alias="ДатаОконч")


class Taxes(OfdataBaseModel):
    """Информация о налогах и сборах"""
    osob_rezhim: Optional[List[str]] = Field(None, alias="ОсобРежим")


class RMSP(OfdataBaseModel):
    """Информация о включении в Единый реестр субъектов малого и среднего предпринимательства"""
    kat: Optional[str] = Field(None, alias="Кат")
    data_vkl: Optional[str] = Field(None, alias="ДатаВкл")


class MSPSupport(OfdataBaseModel):
    """Поддержка государством, корпорацией развития МСП или организациями поддержки субъектов МСП"""
    data: Optional[str] = Field(None, alias="Дата")
    tip: Optional[str] = Field(None, alias="Тип")
    forma: Optional[str] = Field(None, alias="Форма")
    naim_org: Optional[str] = Field(None, alias="НаимОрг")
    inn: Optional[str] = Field(None, alias="ИНН")
    razmer: Optional[str] = Field(None, alias="Размер")
    narush: Optional[bool] = Field(None, alias="Наруш")


class EFRSPMessage(OfdataBaseModel):
    """Сообщение из реестра банкротств (ЕФРСБ)"""
    tip: Optional[str] = Field(None, alias="Тип")
    data: Optional[str] = Field(None, alias="Дата")
    delo: Optional[str] = Field(None, alias="Дело")


class UnfairSupplierRecord(OfdataBaseModel):
    """Запись реестра недобросовестных поставщиков"""
    reestr_nomer: Optional[str] = Field(None, alias="РеестрНомер")
    data_pub: Optional[str] = Field(None, alias="ДатаПуб")
    data_utv: Optional[str] = Field(None, alias="ДатаУтв")
    zakaz_naim_sokr: Optional[str] = Field(None, alias="ЗаказНаимСокр")
    zakaz_naim_poln: Optional[str] = Field(None, alias="ЗаказНаимПолн")
    zakaz_inn: Optional[str] = Field(None, alias="ЗаказИНН")
    zakaz_kpp: Optional[str] = Field(None, alias="ЗаказКПП")
    zakup_nomer: Optional[str] = Field(None, alias="ЗакупНомер")
    zakup_opis: Optional[str] = Field(None, alias="ЗакупОпис")
    tsena_kontr: Optional[int] = Field(None, alias="ЦенаКонтр")


# ================================
#   Основная модель данных предпринимателя
# ================================

class EntrepreneurData(OfdataBaseModel):
    """Основная информация о предпринимателе"""
    ogrnip: Optional[str] = Field(None, alias="ОГРНИП")
    inn: Optional[str] = Field(None, alias="ИНН")
    okpo: Optional[str] = Field(None, alias="ОКПО")
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    data_ogrnip: Optional[str] = Field(None, alias="ДатаОГРНИП")
    fio: Optional[str] = Field(None, alias="ФИО")
    tip: Optional[str] = Field(None, alias="Тип")
    tip_sokr: Optional[str] = Field(None, alias="ТипСокр")
    pol: Optional[str] = Field(None, alias="Пол")
    status: Optional[StatusInfo] = Field(None, alias="Статус")
    prekrashch: Optional[TerminationInfo] = Field(None, alias="Прекращ")
    region: Optional[RegionInfo] = Field(None, alias="Регион")
    nas_punkt: Optional[str] = Field(None, alias="НасПункт")
    okved: Optional[OkvedInfo] = Field(None, alias="ОКВЭД")
    okved_dop: Optional[List[OkvedInfo]] = Field(None, alias="ОКВЭДДоп")
    okopf: Optional[OkopfInfo] = Field(None, alias="ОКОПФ")
    okfs: Optional[OkfsInfo] = Field(None, alias="ОКФС")
    okogu: Optional[OkoguInfo] = Field(None, alias="ОКОГУ")
    okato: Optional[OkatoInfo] = Field(None, alias="ОКАТО")
    oktmo: Optional[OktmoInfo] = Field(None, alias="ОКТМО")
    reg_fns: Optional[TaxOrgInfo] = Field(None, alias="РегФНС")
    tek_fns: Optional[CurrentTaxOrgInfo] = Field(None, alias="ТекФНС")
    reg_pfr: Optional[PfrInfo] = Field(None, alias="РегПФР")
    reg_fss: Optional[FssInfo] = Field(None, alias="РегФСС")
    svyaz_rukovod: Optional[List[RelatedCompany]] = Field(None, alias="СвязРуковод")
    svyaz_uchred: Optional[List[RelatedCompany]] = Field(None, alias="СвязУчред")
    litsenz: Optional[List[License]] = Field(None, alias="Лиценз")
    tovar_znak: Optional[List[Trademark]] = Field(None, alias="ТоварЗнак")
    data_vyp: Optional[str] = Field(None, alias="ДатаВып")
    nalogi: Optional[Taxes] = Field(None, alias="Налоги")
    rmsp: Optional[RMSP] = Field(None, alias="РМСП")
    podderzh_msp: Optional[List[MSPSupport]] = Field(None, alias="ПоддержМСП")
    efrsb: Optional[List[EFRSPMessage]] = Field(None, alias="ЕФРСБ")
    nedob_post: Optional[bool] = Field(None, alias="НедобПост")
    nedob_post_zap: Optional[List[UnfairSupplierRecord]] = Field(None, alias="НедобПостЗап")
    mass_rukovod: Optional[bool] = Field(None, alias="МассРуковод")
    mass_uchred: Optional[bool] = Field(None, alias="МассУчред")



# ================================
#   Модели ответа API
# ================================

class MetaInfo(OfdataBaseModel):
    """Информация о результате запроса"""
    status: Optional[str] = Field(None, alias="status")
    today_request_count: Optional[int] = Field(None, alias="today_request_count")
    balance: Optional[float] = Field(None, alias="balance")
    message: Optional[str] = Field(None, alias="message")


class OfdataEntrepreneurResponse(OfdataBaseModel):
    """Полный ответ от API Ofdata для предпринимателя"""
    data: Optional[EntrepreneurData] = Field(None, alias="data")
    source_data: Optional[Any] = Field(None, alias="source_data")
    meta: Optional[MetaInfo] = Field(None, alias="meta")


