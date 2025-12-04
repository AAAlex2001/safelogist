from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any


# ================================
#   Базовый класс с конфигом
# ================================

class OfdataBaseModel(BaseModel):
    """Базовый класс для всех моделей Ofdata с поддержкой алиасов"""
    model_config = ConfigDict(populate_by_name=True)


# ================================
#   Вложенные модели
# ================================

class StatusInfo(OfdataBaseModel):
    """Статус"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class LiquidationInfo(OfdataBaseModel):
    """Сведения о ликвидации"""
    data: Optional[str] = Field(None, alias="Дата")
    naim: Optional[str] = Field(None, alias="Наим")


class RegionInfo(OfdataBaseModel):
    """Регион"""
    kod: Optional[str] = Field(None, alias="Код")
    naim: Optional[str] = Field(None, alias="Наим")


class LegalAddress(OfdataBaseModel):
    """Юридический адрес"""
    nas_punkt: Optional[str] = Field(None, alias="НасПункт")
    adres_rf: Optional[str] = Field(None, alias="АдресРФ")
    id_gar: Optional[str] = Field(None, alias="ИдГАР")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    mass_adres: Optional[Any] = Field(None, alias="МассАдрес")  # Может быть List[str] или bool


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


class CapitalInfo(OfdataBaseModel):
    """Уставный капитал"""
    tip: Optional[str] = Field(None, alias="Тип")
    summa: Optional[int] = Field(None, alias="Сумма")


class ManagementOrg(OfdataBaseModel):
    """Управляющая организация"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    data_ogrn: Optional[str] = Field(None, alias="ДатаОГРН")
    naim_sokr: Optional[str] = Field(None, alias="НаимСокр")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    in_strana: Optional[str] = Field(None, alias="ИнСтрана")
    in_adres: Optional[str] = Field(None, alias="ИнАдрес")
    in_reg_nomer: Optional[str] = Field(None, alias="ИнРегНомер")
    in_data_reg: Optional[str] = Field(None, alias="ИнДатаРег")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    data_zapisi: Optional[str] = Field(None, alias="ДатаЗаписи")


class ShareInfo(OfdataBaseModel):
    """Доля в уставном капитале"""
    nominal: Optional[float] = Field(None, alias="Номинал")
    procent: Optional[float] = Field(None, alias="Процент")


class PledgeHolder(OfdataBaseModel):
    """Залогодержатель"""
    inn: Optional[str] = Field(None, alias="ИНН")
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    fio: Optional[str] = Field(None, alias="ФИО")


class NotaryInfo(OfdataBaseModel):
    """Нотариальное удостоверение договора"""
    data: Optional[str] = Field(None, alias="Дата")
    nomer: Optional[str] = Field(None, alias="Номер")


class Encumbrance(OfdataBaseModel):
    """Сведения об обременениях и залогах доли участника"""
    tip: Optional[str] = Field(None, alias="Тип")
    zalogoderzh: Optional[PledgeHolder] = Field(None, alias="Залогодерж")
    notarial: Optional[NotaryInfo] = Field(None, alias="Нотариал")


class FounderFL(OfdataBaseModel):
    """Физическое лицо - учредитель"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    fio: Optional[str] = Field(None, alias="ФИО")
    inn: Optional[str] = Field(None, alias="ИНН")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    mass_uchred: Optional[bool] = Field(None, alias="МассУчред")
    dolya: Optional[ShareInfo] = Field(None, alias="Доля")
    obrem: Optional[List[Encumbrance]] = Field(None, alias="Обрем")


class FounderRusOrg(OfdataBaseModel):
    """Российское юридическое лицо - учредитель"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    data_ogrn: Optional[str] = Field(None, alias="ДатаОГРН")
    naim_sokr: Optional[str] = Field(None, alias="НаимСокр")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    dolya: Optional[ShareInfo] = Field(None, alias="Доля")
    obrem: Optional[List[Encumbrance]] = Field(None, alias="Обрем")
    data_zapisi: Optional[str] = Field(None, alias="ДатаЗаписи")


class FounderForeignOrg(OfdataBaseModel):
    """Иностранное юридическое лицо - учредитель"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    strana: Optional[str] = Field(None, alias="Страна")
    adres: Optional[str] = Field(None, alias="Адрес")
    reg_nomer: Optional[str] = Field(None, alias="РегНомер")
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    dolya: Optional[ShareInfo] = Field(None, alias="Доля")
    obrem: Optional[List[Encumbrance]] = Field(None, alias="Обрем")
    data_zapisi: Optional[str] = Field(None, alias="ДатаЗаписи")


class ManagementCompany(OfdataBaseModel):
    """Управляющая компания"""
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    data_ogrn: Optional[str] = Field(None, alias="ДатаОГРН")
    naim_sokr: Optional[str] = Field(None, alias="НаимСокр")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")


class FounderPIF(OfdataBaseModel):
    """Паевой инвестиционный фонд - учредитель"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    naim: Optional[str] = Field(None, alias="Наим")
    upr_kom: Optional[ManagementCompany] = Field(None, alias="УпрКом")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    dolya: Optional[ShareInfo] = Field(None, alias="Доля")
    obrem: Optional[List[Encumbrance]] = Field(None, alias="Обрем")
    data_zapisi: Optional[str] = Field(None, alias="ДатаЗаписи")


class OrgExercisingRights(OfdataBaseModel):
    """Орган или юридическое лицо, осуществляющее права учредителя"""
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")


class FLExercisingRights(OfdataBaseModel):
    """Физическое лицо, осуществляющее права учредителя"""
    fio: Optional[str] = Field(None, alias="ФИО")
    inn: Optional[str] = Field(None, alias="ИНН")


class FounderRF(OfdataBaseModel):
    """Российская Федерация, субъекты РФ и муниципальные образования - учредитель"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    tip: Optional[str] = Field(None, alias="Тип")
    region: Optional[RegionInfo] = Field(None, alias="Регион")
    org_osush_prav: Optional[List[OrgExercisingRights]] = Field(None, alias="ОргОсущПрав")
    fl_osush_prav: Optional[List[FLExercisingRights]] = Field(None, alias="ФЛОсущПрав")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    dolya: Optional[ShareInfo] = Field(None, alias="Доля")
    obrem: Optional[List[Encumbrance]] = Field(None, alias="Обрем")
    data_zapisi: Optional[str] = Field(None, alias="ДатаЗаписи")


class Founders(OfdataBaseModel):
    """Учредители (участники)"""
    fl: Optional[List[FounderFL]] = Field(None, alias="ФЛ")
    ros_org: Optional[List[FounderRusOrg]] = Field(None, alias="РосОрг")
    in_org: Optional[List[FounderForeignOrg]] = Field(None, alias="ИнОрг")
    pif: Optional[List[FounderPIF]] = Field(None, alias="ПИФ")
    rf: Optional[List[FounderRF]] = Field(None, alias="РФ")


class RelatedManagementOrg(OfdataBaseModel):
    """Юридическое лицо, находящееся под управлением данной организации"""
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


class RelatedFounder(OfdataBaseModel):
    """Юридическое лицо, учрежденное данной организацией"""
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


class RegistryHolder(OfdataBaseModel):
    """Держатель реестра акционеров"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")


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


class Branch(OfdataBaseModel):
    """Филиал"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    kpp: Optional[str] = Field(None, alias="КПП")
    adres: Optional[str] = Field(None, alias="Адрес")
    strana: Optional[str] = Field(None, alias="Страна")
    in_adres: Optional[str] = Field(None, alias="ИнАдрес")


class Representative(OfdataBaseModel):
    """Представительство организации"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    kpp: Optional[str] = Field(None, alias="КПП")
    adres: Optional[str] = Field(None, alias="Адрес")
    strana: Optional[str] = Field(None, alias="Страна")
    in_adres: Optional[str] = Field(None, alias="ИнАдрес")


class Subdivisions(OfdataBaseModel):
    """Подразделения организации"""
    filial: Optional[List[Branch]] = Field(None, alias="Филиал")
    predstav: Optional[List[Representative]] = Field(None, alias="Представ")


class Predecessor(OfdataBaseModel):
    """Правопредшественник"""
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")


class Successor(OfdataBaseModel):
    """Правопреемник"""
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")


class Contacts(OfdataBaseModel):
    """Контактная информация"""
    tel: Optional[List[str]] = Field(None, alias="Тел")
    email: Optional[List[str]] = Field(None, alias="Емэйл")
    web_sait: Optional[str] = Field(None, alias="ВебСайт")


class TaxPayment(OfdataBaseModel):
    """Уплаченный налог или сбор"""
    naim: Optional[str] = Field(None, alias="Наим")
    summa: Optional[float] = Field(None, alias="Сумма")


class Taxes(OfdataBaseModel):
    """Информация о налогах и сборах"""
    osob_rezhim: Optional[List[str]] = Field(None, alias="ОсобРежим")
    sved_upl: Optional[List[TaxPayment]] = Field(None, alias="СведУпл")
    sum_upl: Optional[float] = Field(None, alias="СумУпл")
    sved_upl_god: Optional[str] = Field(None, alias="СведУплГод")
    sum_nedоim: Optional[float] = Field(None, alias="СумНедоим")
    nedоim_data: Optional[str] = Field(None, alias="НедоимДата")


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


class Manager(OfdataBaseModel):
    """Руководитель (лицо, имеющее право действовать без доверенности)"""
    ogr_dostup: Optional[bool] = Field(None, alias="ОгрДоступ")
    fio: Optional[str] = Field(None, alias="ФИО")
    inn: Optional[str] = Field(None, alias="ИНН")
    vid_dolzhn: Optional[str] = Field(None, alias="ВидДолжн")
    naim_dolzhn: Optional[str] = Field(None, alias="НаимДолжн")
    nedost: Optional[bool] = Field(None, alias="Недост")
    nedost_opis: Optional[str] = Field(None, alias="НедостОпис")
    mass_rukovod: Optional[bool] = Field(None, alias="МассРуковод")
    diskv_litso: Optional[bool] = Field(None, alias="ДисквЛицо")
    diskv_data_nach: Optional[str] = Field(None, alias="ДисквДатаНач")
    diskv_data_okonch: Optional[str] = Field(None, alias="ДисквДатаОконч")
    svyaz_rukovod: Optional[List[str]] = Field(None, alias="СвязРуковод")
    svyaz_uchred: Optional[List[str]] = Field(None, alias="СвязУчред")
    data_zapisi: Optional[str] = Field(None, alias="ДатаЗаписи")


# ================================
#   Основная модель данных компании
# ================================

class CompanyData(OfdataBaseModel):
    """Основная информация о компании"""
    ogrn: Optional[str] = Field(None, alias="ОГРН")
    inn: Optional[str] = Field(None, alias="ИНН")
    kpp: Optional[str] = Field(None, alias="КПП")
    okpo: Optional[str] = Field(None, alias="ОКПО")
    data_reg: Optional[str] = Field(None, alias="ДатаРег")
    data_ogrn: Optional[str] = Field(None, alias="ДатаОГРН")
    naim_sokr: Optional[str] = Field(None, alias="НаимСокр")
    naim_poln: Optional[str] = Field(None, alias="НаимПолн")
    naim_angl: Optional[str] = Field(None, alias="НаимАнгл")
    status: Optional[StatusInfo] = Field(None, alias="Статус")
    likvid: Optional[LiquidationInfo] = Field(None, alias="Ликвид")
    region: Optional[RegionInfo] = Field(None, alias="Регион")
    yur_adres: Optional[LegalAddress] = Field(None, alias="ЮрАдрес")
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
    ust_kap: Optional[CapitalInfo] = Field(None, alias="УстКап")
    upr_org: Optional[ManagementOrg] = Field(None, alias="УпрОрг")
    rukovod: Optional[List[Manager]] = Field(None, alias="Руковод")
    uchred: Optional[Founders] = Field(None, alias="Учред")
    svyaz_upr_org: Optional[List[RelatedManagementOrg]] = Field(None, alias="СвязУпрОрг")
    svyaz_uchred: Optional[List[RelatedFounder]] = Field(None, alias="СвязУчред")
    derzh_reestr_ao: Optional[RegistryHolder] = Field(None, alias="ДержРеестрАО")
    litsenz: Optional[List[License]] = Field(None, alias="Лиценз")
    tovar_znak: Optional[List[Trademark]] = Field(None, alias="ТоварЗнак")
    podrazd: Optional[Subdivisions] = Field(None, alias="Подразд")
    pravopredsh: Optional[List[Predecessor]] = Field(None, alias="Правопредш")
    pravopreem: Optional[List[Successor]] = Field(None, alias="Правопреем")
    data_vyp: Optional[str] = Field(None, alias="ДатаВып")
    kontakty: Optional[Contacts] = Field(None, alias="Контакты")
    nalogi: Optional[Taxes] = Field(None, alias="Налоги")
    rmsp: Optional[RMSP] = Field(None, alias="РМСП")
    podderzh_msp: Optional[List[MSPSupport]] = Field(None, alias="ПоддержМСП")
    schr: Optional[int] = Field(None, alias="СЧР")
    efrsb: Optional[List[EFRSPMessage]] = Field(None, alias="ЕФРСБ")
    nedob_post: Optional[bool] = Field(None, alias="НедобПост")
    nedob_post_zap: Optional[List[UnfairSupplierRecord]] = Field(None, alias="НедобПостЗап")
    diskv_litsa: Optional[bool] = Field(None, alias="ДисквЛица")
    mass_rukovod: Optional[bool] = Field(None, alias="МассРуковод")
    mass_uchred: Optional[bool] = Field(None, alias="МассУчред")
    nelegal_fin: Optional[bool] = Field(None, alias="НелегалФин")
    nelegal_fin_status: Optional[str] = Field(None, alias="НелегалФинСтатус")
    sanktsii: Optional[bool] = Field(None, alias="Санкции")
    sanktsii_strany: Optional[List[str]] = Field(None, alias="СанкцииСтраны")
    sankts_uchr: Optional[bool] = Field(None, alias="СанкцУчр")


# ================================
#   Модели ответа API
# ================================

class MetaInfo(OfdataBaseModel):
    """Информация о результате запроса"""
    status: Optional[str] = Field(None, alias="status")
    today_request_count: Optional[int] = Field(None, alias="today_request_count")
    balance: Optional[float] = Field(None, alias="balance")
    message: Optional[str] = Field(None, alias="message")


class OfdataCompanyResponse(OfdataBaseModel):
    """Полный ответ от API Ofdata"""
    data: Optional[CompanyData] = Field(None, alias="data")
    source_data: Optional[Any] = Field(None, alias="source_data")
    meta: Optional[MetaInfo] = Field(None, alias="meta")

