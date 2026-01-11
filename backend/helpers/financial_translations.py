"""
Переводы для финансовых отчетов Молдовы
Названия групп (BILANȚUL, SITUAȚIA DE PROFIT ȘI PIERDERE и т.д.)
и названия показателей по кодам
"""

# Переводы названий групп (разделов) финансовых отчетов
FINANCIAL_GROUP_NAMES = {
    "ru": {
        # Баланс
        "BILANȚUL": "Баланс",
        "Bilanțul": "Баланс",
        "BILANTUL": "Баланс",
        # Отчет о прибылях и убытках
        "SITUAȚIA DE PROFIT ȘI PIERDERE": "Отчет о прибылях и убытках",
        "Situația de profit și pierdere": "Отчет о прибылях и убытках",
        "SITUATIA DE PROFIT SI PIERDERE": "Отчет о прибылях и убытках",
        # Отчет об изменениях капитала
        "SITUAȚIA MODIFICĂRILOR CAPITALULUI PROPRIU": "Отчет об изменениях собственного капитала",
        "Situația modificărilor capitalului propriu": "Отчет об изменениях собственного капитала",
        "SITUATIA MODIFICARILOR CAPITALULUI PROPRIU": "Отчет об изменениях собственного капитала",
        # Отчет о движении денежных средств
        "SITUAȚIA FLUXURILOR DE NUMERAR": "Отчет о движении денежных средств",
        "Situația fluxurilor de numerar": "Отчет о движении денежных средств",
        "SITUATIA FLUXURILOR DE NUMERAR": "Отчет о движении денежных средств",
        # Отчет о целевом финансировании (для некоммерческих)
        "RAPORTUL PRIVIND UTILIZAREA MIJLOACELOR CU DESTINAȚIE SPECIALĂ": "Отчет об использовании целевых средств",
        "Raportul privind utilizarea mijloacelor cu destinație specială": "Отчет об использовании целевых средств",
        # Сокращенные формы
        "BILANȚUL PRESCURTAT": "Сокращенный баланс",
        "Bilanțul prescurtat": "Сокращенный баланс",
        "SITUAȚIA DE PROFIT ȘI PIERDERE PRESCURTATĂ": "Сокращенный отчет о прибылях и убытках",
        "Situația de profit și pierdere prescurtată": "Сокращенный отчет о прибылях и убытках",
    },
    "en": {
        "BILANȚUL": "Balance Sheet",
        "Bilanțul": "Balance Sheet",
        "BILANTUL": "Balance Sheet",
        "SITUAȚIA DE PROFIT ȘI PIERDERE": "Profit and Loss Statement",
        "Situația de profit și pierdere": "Profit and Loss Statement",
        "SITUATIA DE PROFIT SI PIERDERE": "Profit and Loss Statement",
        "SITUAȚIA MODIFICĂRILOR CAPITALULUI PROPRIU": "Statement of Changes in Equity",
        "Situația modificărilor capitalului propriu": "Statement of Changes in Equity",
        "SITUATIA MODIFICARILOR CAPITALULUI PROPRIU": "Statement of Changes in Equity",
        "SITUAȚIA FLUXURILOR DE NUMERAR": "Cash Flow Statement",
        "Situația fluxurilor de numerar": "Cash Flow Statement",
        "SITUATIA FLUXURILOR DE NUMERAR": "Cash Flow Statement",
        "RAPORTUL PRIVIND UTILIZAREA MIJLOACELOR CU DESTINAȚIE SPECIALĂ": "Report on Use of Special Purpose Funds",
        "Raportul privind utilizarea mijloacelor cu destinație specială": "Report on Use of Special Purpose Funds",
        # Сокращенные формы
        "BILANȚUL PRESCURTAT": "Abbreviated Balance Sheet",
        "Bilanțul prescurtat": "Abbreviated Balance Sheet",
        "SITUAȚIA DE PROFIT ȘI PIERDERE PRESCURTATĂ": "Abbreviated Profit and Loss Statement",
        "Situația de profit și pierdere prescurtată": "Abbreviated Profit and Loss Statement",
    },
    "uk": {
        "BILANȚUL": "Баланс",
        "Bilanțul": "Баланс",
        "BILANTUL": "Баланс",
        "SITUAȚIA DE PROFIT ȘI PIERDERE": "Звіт про прибутки та збитки",
        "Situația de profit și pierdere": "Звіт про прибутки та збитки",
        "SITUATIA DE PROFIT SI PIERDERE": "Звіт про прибутки та збитки",
        "SITUAȚIA MODIFICĂRILOR CAPITALULUI PROPRIU": "Звіт про зміни власного капіталу",
        "Situația modificărilor capitalului propriu": "Звіт про зміни власного капіталу",
        "SITUATIA MODIFICARILOR CAPITALULUI PROPRIU": "Звіт про зміни власного капіталу",
        "SITUAȚIA FLUXURILOR DE NUMERAR": "Звіт про рух грошових коштів",
        "Situația fluxurilor de numerar": "Звіт про рух грошових коштів",
        "SITUATIA FLUXURILOR DE NUMERAR": "Звіт про рух грошових коштів",
        "RAPORTUL PRIVIND UTILIZAREA MIJLOACELOR CU DESTINAȚIE SPECIALĂ": "Звіт про використання цільових коштів",
        "Raportul privind utilizarea mijloacelor cu destinație specială": "Звіт про використання цільових коштів",
        # Сокращенные формы
        "BILANȚUL PRESCURTAT": "Скорочений баланс",
        "Bilanțul prescurtat": "Скорочений баланс",
        "SITUAȚIA DE PROFIT ȘI PIERDERE PRESCURTATĂ": "Скорочений звіт про прибутки та збитки",
        "Situația de profit și pierdere prescurtată": "Скорочений звіт про прибутки та збитки",
    },
    "ro": {
        # Оставляем оригиналы для румынского
        "BILANȚUL": "Bilanțul",
        "Bilanțul": "Bilanțul",
        "BILANTUL": "Bilanțul",
        "SITUAȚIA DE PROFIT ȘI PIERDERE": "Situația de profit și pierdere",
        "Situația de profit și pierdere": "Situația de profit și pierdere",
        "SITUATIA DE PROFIT SI PIERDERE": "Situația de profit și pierdere",
        "SITUAȚIA MODIFICĂRILOR CAPITALULUI PROPRIU": "Situația modificărilor capitalului propriu",
        "Situația modificărilor capitalului propriu": "Situația modificărilor capitalului propriu",
        "SITUATIA MODIFICARILOR CAPITALULUI PROPRIU": "Situația modificărilor capitalului propriu",
        "SITUAȚIA FLUXURILOR DE NUMERAR": "Situația fluxurilor de numerar",
        "Situația fluxurilor de numerar": "Situația fluxurilor de numerar",
        "SITUATIA FLUXURILOR DE NUMERAR": "Situația fluxurilor de numerar",
        "RAPORTUL PRIVIND UTILIZAREA MIJLOACELOR CU DESTINAȚIE SPECIALĂ": "Raportul privind utilizarea mijloacelor cu destinație specială",
        "Raportul privind utilizarea mijloacelor cu destinație specială": "Raportul privind utilizarea mijloacelor cu destinație specială",
        # Сокращенные формы
        "BILANȚUL PRESCURTAT": "Bilanțul prescurtat",
        "Bilanțul prescurtat": "Bilanțul prescurtat",
        "SITUAȚIA DE PROFIT ȘI PIERDERE PRESCURTATĂ": "Situația de profit și pierdere prescurtată",
        "Situația de profit și pierdere prescurtată": "Situația de profit și pierdere prescurtată",
    },
}

# Переводы показателей по кодам (универсальные для всех групп)
# Формат: код -> {lang: перевод}
FINANCIAL_INDICATORS = {
    # ============ БАЛАНС (BILANȚUL) ============
    # Активы
    "010": {
        "ro": "Imobilizări necorporale",
        "ru": "Нематериальные активы",
        "en": "Intangible assets",
        "uk": "Нематеріальні активи",
    },
    "020": {
        "ro": "Imobilizări corporale în curs de execuție",
        "ru": "Основные средства в процессе создания",
        "en": "Fixed assets under construction",
        "uk": "Основні засоби у процесі створення",
    },
    "030": {
        "ro": "Terenuri",
        "ru": "Земельные участки",
        "en": "Land",
        "uk": "Земельні ділянки",
    },
    "040": {
        "ro": "Mijloace fixe",
        "ru": "Основные средства",
        "en": "Fixed assets",
        "uk": "Основні засоби",
    },
    "050": {
        "ro": "Resurse minerale",
        "ru": "Минеральные ресурсы",
        "en": "Mineral resources",
        "uk": "Мінеральні ресурси",
    },
    "060": {
        "ro": "Active biologice imobilizate",
        "ru": "Долгосрочные биологические активы",
        "en": "Non-current biological assets",
        "uk": "Довгострокові біологічні активи",
    },
    "070": {
        "ro": "Total active imobilizate",
        "ru": "Итого внеоборотные активы",
        "en": "Total non-current assets",
        "uk": "Разом необоротні активи",
    },
    "080": {
        "ro": "Stocuri",
        "ru": "Запасы",
        "en": "Inventories",
        "uk": "Запаси",
    },
    "090": {
        "ro": "Obiecte de mică valoare și scurtă durată",
        "ru": "Малоценные и быстроизнашивающиеся предметы",
        "en": "Low-value and short-term items",
        "uk": "Малоцінні та швидкозношувані предмети",
    },
    "100": {
        "ro": "Creanțe pe termen lung",
        "ru": "Долгосрочная дебиторская задолженность",
        "en": "Long-term receivables",
        "uk": "Довгострокова дебіторська заборгованість",
    },
    "110": {
        "ro": "Creanțe comerciale și avansuri acordate",
        "ru": "Торговая дебиторская задолженность и авансы выданные",
        "en": "Trade receivables and advances paid",
        "uk": "Торгова дебіторська заборгованість та аванси видані",
    },
    "120": {
        "ro": "Creanțe ale bugetului",
        "ru": "Задолженность бюджета",
        "en": "Budget receivables",
        "uk": "Заборгованість бюджету",
    },
    "130": {
        "ro": "Creanțe ale personalului",
        "ru": "Задолженность персонала",
        "en": "Staff receivables",
        "uk": "Заборгованість персоналу",
    },
    "140": {
        "ro": "Alte creanțe curente",
        "ru": "Прочая краткосрочная дебиторская задолженность",
        "en": "Other current receivables",
        "uk": "Інша короткострокова дебіторська заборгованість",
    },
    "150": {
        "ro": "Numerar",
        "ru": "Денежные средства",
        "en": "Cash",
        "uk": "Грошові кошти",
    },
    "160": {
        "ro": "Investiții financiare curente",
        "ru": "Краткосрочные финансовые инвестиции",
        "en": "Current financial investments",
        "uk": "Короткострокові фінансові інвестиції",
    },
    "170": {
        "ro": "Alte active circulante",
        "ru": "Прочие оборотные активы",
        "en": "Other current assets",
        "uk": "Інші оборотні активи",
    },
    "180": {
        "ro": "Total active circulante",
        "ru": "Итого оборотные активы",
        "en": "Total current assets",
        "uk": "Разом оборотні активи",
    },
    "190": {
        "ro": "Total active",
        "ru": "Итого активы",
        "en": "Total assets",
        "uk": "Разом активи",
    },
    # Пассивы
    "200": {
        "ro": "Capital social și suplimentar",
        "ru": "Уставный и добавочный капитал",
        "en": "Share and additional capital",
        "uk": "Статутний і додатковий капітал",
    },
    "210": {
        "ro": "Rezerve",
        "ru": "Резервы",
        "en": "Reserves",
        "uk": "Резерви",
    },
    "220": {
        "ro": "Corecții ale rezultatelor anilor precedenți",
        "ru": "Корректировки результатов предыдущих лет",
        "en": "Prior years adjustments",
        "uk": "Коригування результатів попередніх років",
    },
    "230": {
        "ro": "Profit nerepartizat",
        "ru": "Нераспределенная прибыль",
        "en": "Retained earnings",
        "uk": "Нерозподілений прибуток",
    },
    "240": {
        "ro": "Fond de autofinanțare",
        "ru": "Фонд самофинансирования",
        "en": "Self-financing fund",
        "uk": "Фонд самофінансування",
    },
    "250": {
        "ro": "Alte elemente de capital propriu",
        "ru": "Прочие элементы собственного капитала",
        "en": "Other equity elements",
        "uk": "Інші елементи власного капіталу",
    },
    "260": {
        "ro": "Total capital propriu",
        "ru": "Итого собственный капитал",
        "en": "Total equity",
        "uk": "Разом власний капітал",
    },
    "270": {
        "ro": "Datorii financiare pe termen lung",
        "ru": "Долгосрочные финансовые обязательства",
        "en": "Long-term financial liabilities",
        "uk": "Довгострокові фінансові зобов'язання",
    },
    "280": {
        "ro": "Datorii pe termen lung calculate",
        "ru": "Долгосрочные расчетные обязательства",
        "en": "Long-term calculated liabilities",
        "uk": "Довгострокові розрахункові зобов'язання",
    },
    "290": {
        "ro": "Alte datorii pe termen lung",
        "ru": "Прочие долгосрочные обязательства",
        "en": "Other long-term liabilities",
        "uk": "Інші довгострокові зобов'язання",
    },
    "300": {
        "ro": "Total datorii pe termen lung",
        "ru": "Итого долгосрочные обязательства",
        "en": "Total long-term liabilities",
        "uk": "Разом довгострокові зобов'язання",
    },
    "310": {
        "ro": "Finanțări și încasări cu destinație specială curente",
        "ru": "Текущее целевое финансирование и поступления",
        "en": "Current special purpose financing and receipts",
        "uk": "Поточне цільове фінансування та надходження",
    },
    "320": {
        "ro": "Datorii financiare curente",
        "ru": "Текущие финансовые обязательства",
        "en": "Current financial liabilities",
        "uk": "Поточні фінансові зобов'язання",
    },
    "330": {
        "ro": "Datorii comerciale și avansuri primite",
        "ru": "Торговая кредиторская задолженность и авансы полученные",
        "en": "Trade payables and advances received",
        "uk": "Торгова кредиторська заборгованість та аванси отримані",
    },
    "340": {
        "ro": "Datorii față de personal",
        "ru": "Задолженность перед персоналом",
        "en": "Payables to employees",
        "uk": "Заборгованість перед персоналом",
    },
    "350": {
        "ro": "Datorii față de asigurările sociale și medicale",
        "ru": "Задолженность по социальному и медицинскому страхованию",
        "en": "Social and medical insurance payables",
        "uk": "Заборгованість по соціальному та медичному страхуванню",
    },
    "360": {
        "ro": "Datorii față de buget",
        "ru": "Задолженность перед бюджетом",
        "en": "Budget payables",
        "uk": "Заборгованість перед бюджетом",
    },
    "370": {
        "ro": "Venituri anticipate curente",
        "ru": "Текущие доходы будущих периодов",
        "en": "Current deferred income",
        "uk": "Поточні доходи майбутніх періодів",
    },
    "380": {
        "ro": "Alte datorii curente",
        "ru": "Прочие краткосрочные обязательства",
        "en": "Other current liabilities",
        "uk": "Інші поточні зобов'язання",
    },
    "390": {
        "ro": "Total datorii curente",
        "ru": "Итого краткосрочные обязательства",
        "en": "Total current liabilities",
        "uk": "Разом поточні зобов'язання",
    },
    "400": {
        "ro": "Total pasive",
        "ru": "Итого пассивы",
        "en": "Total liabilities and equity",
        "uk": "Разом пасиви",
    },
    
    # ============ ОТЧЕТ О ПРИБЫЛЯХ И УБЫТКАХ ============
    "011": {
        "ro": "din care: venituri din vînzarea produselor și mărfurilor",
        "ru": "в т.ч.: выручка от продажи продукции и товаров",
        "en": "including: revenue from sale of products and goods",
        "uk": "у т.ч.: виручка від продажу продукції та товарів",
    },
    "021": {
        "ro": "din care: valoarea contabilă a produselor și mărfurilor vîndute",
        "ru": "в т.ч.: балансовая стоимость проданных продукции и товаров",
        "en": "including: book value of products and goods sold",
        "uk": "у т.ч.: балансова вартість проданих продукції та товарів",
    },
    "095": {
        "ro": "venituri din alte investiții financiare pe termen lung",
        "ru": "доходы от прочих долгосрочных финансовых инвестиций",
        "en": "income from other long-term financial investments",
        "uk": "доходи від інших довгострокових фінансових інвестицій",
    },
    "105": {
        "ro": "cheltuieli aferente diferențelor de curs valutar și de sumă",
        "ru": "расходы по курсовым и суммовым разницам",
        "en": "exchange rate and amount difference expenses",
        "uk": "витрати по курсових та сумових різницях",
    },
    
    # ============ РАСШИРЕННЫЙ БАЛАНС (коды 410-880) ============
    "410": {
        "ro": "Numerar și documente bănești",
        "ru": "Денежные средства и документы",
        "en": "Cash and monetary documents",
        "uk": "Грошові кошти та документи",
    },
    "420": {
        "ro": "Total active circulante",
        "ru": "Итого оборотные активы",
        "en": "Total current assets",
        "uk": "Разом оборотні активи",
    },
    "430": {
        "ro": "Total active",
        "ru": "Итого активы",
        "en": "Total assets",
        "uk": "Разом активи",
    },
    "560": {
        "ro": "Profit nerepartizat (pierdere neacoperită) al anilor precedenți",
        "ru": "Нераспределенная прибыль (непокрытый убыток) прошлых лет",
        "en": "Retained earnings (uncovered loss) of previous years",
        "uk": "Нерозподілений прибуток (непокритий збиток) минулих років",
    },
    "570": {
        "ro": "Profit net (pierdere netă) al perioadei de gestiune",
        "ru": "Чистая прибыль (убыток) отчетного периода",
        "en": "Net profit (loss) for the reporting period",
        "uk": "Чистий прибуток (збиток) звітного періоду",
    },
    "590": {
        "ro": "Total profit (pierdere)",
        "ru": "Итого прибыль (убыток)",
        "en": "Total profit (loss)",
        "uk": "Разом прибуток (збиток)",
    },
    "620": {
        "ro": "Total capital propriu",
        "ru": "Итого собственный капитал",
        "en": "Total equity",
        "uk": "Разом власний капітал",
    },
    "630": {
        "ro": "Credite bancare pe termen lung",
        "ru": "Долгосрочные банковские кредиты",
        "en": "Long-term bank loans",
        "uk": "Довгострокові банківські кредити",
    },
    "640": {
        "ro": "Împrumuturi pe termen lung",
        "ru": "Долгосрочные займы",
        "en": "Long-term borrowings",
        "uk": "Довгострокові позики",
    },
    "643": {
        "ro": "alte împrumuturi pe termen lung",
        "ru": "прочие долгосрочные займы",
        "en": "other long-term borrowings",
        "uk": "інші довгострокові позики",
    },
    "700": {
        "ro": "Total datorii pe termen lung",
        "ru": "Итого долгосрочные обязательства",
        "en": "Total long-term liabilities",
        "uk": "Разом довгострокові зобов'язання",
    },
    "720": {
        "ro": "Împrumuturi pe termen scurt, total",
        "ru": "Краткосрочные займы, всего",
        "en": "Short-term borrowings, total",
        "uk": "Короткострокові позики, всього",
    },
    "723": {
        "ro": "alte împrumuturi pe termen scurt",
        "ru": "прочие краткосрочные займы",
        "en": "other short-term borrowings",
        "uk": "інші короткострокові позики",
    },
    "730": {
        "ro": "Datorii comerciale curente",
        "ru": "Текущая торговая кредиторская задолженность",
        "en": "Current trade payables",
        "uk": "Поточна торгова кредиторська заборгованість",
    },
    "770": {
        "ro": "Datorii privind asigurările sociale și medicale",
        "ru": "Задолженность по социальному и медицинскому страхованию",
        "en": "Social and medical insurance payables",
        "uk": "Заборгованість по соціальному та медичному страхуванню",
    },
    "780": {
        "ro": "Datorii față de buget",
        "ru": "Задолженность перед бюджетом",
        "en": "Budget payables",
        "uk": "Заборгованість перед бюджетом",
    },
    "790": {
        "ro": "Datorii față de proprietari",
        "ru": "Задолженность перед собственниками",
        "en": "Payables to owners",
        "uk": "Заборгованість перед власниками",
    },
    "810": {
        "ro": "Alte datorii curente",
        "ru": "Прочие краткосрочные обязательства",
        "en": "Other current liabilities",
        "uk": "Інші поточні зобов'язання",
    },
    "820": {
        "ro": "Total datorii curente",
        "ru": "Итого краткосрочные обязательства",
        "en": "Total current liabilities",
        "uk": "Разом поточні зобов'язання",
    },
    "880": {
        "ro": "Total pasive",
        "ru": "Итого пассивы",
        "en": "Total liabilities and equity",
        "uk": "Разом пасиви",
    },
    # Подкоды для основных средств
    "081": {
        "ro": "clădiri",
        "ru": "здания",
        "en": "buildings",
        "uk": "будівлі",
    },
    "083": {
        "ro": "mașini, utilaje și instalații tehnice",
        "ru": "машины, оборудование и технические установки",
        "en": "machinery, equipment and technical installations",
        "uk": "машини, обладнання та технічні установки",
    },
}

# Переводы общих показателей по названию (для тех что не имеют уникального кода)
FINANCIAL_INDICATORS_BY_NAME = {
    # ====== ОТЧЕТ О ПРИБЫЛЯХ И УБЫТКАХ ======
    "Venituri din vînzări, total": {
        "ru": "Выручка от продаж, всего",
        "en": "Sales revenue, total",
        "uk": "Виручка від продажів, всього",
        "ro": "Venituri din vînzări, total",
    },
    "venituri din vînzarea produselor și mărfurilor": {
        "ru": "выручка от продажи продукции и товаров",
        "en": "revenue from sale of products and goods",
        "uk": "виручка від продажу продукції та товарів",
        "ro": "venituri din vînzarea produselor și mărfurilor",
    },
    "Costul vînzărilor, total": {
        "ru": "Себестоимость продаж, всего",
        "en": "Cost of sales, total",
        "uk": "Собівартість продажів, всього",
        "ro": "Costul vînzărilor, total",
    },
    "valoarea contabilă a produselor și mărfurilor vîndute": {
        "ru": "балансовая стоимость проданных продукции и товаров",
        "en": "book value of products and goods sold",
        "uk": "балансова вартість проданих продукції та товарів",
        "ro": "valoarea contabilă a produselor și mărfurilor vîndute",
    },
    "Profit brut (pierdere brută)": {
        "ru": "Валовая прибыль (убыток)",
        "en": "Gross profit (loss)",
        "uk": "Валовий прибуток (збиток)",
        "ro": "Profit brut (pierdere brută)",
    },
    "Alte venituri din activitatea operațională": {
        "ru": "Прочие доходы от операционной деятельности",
        "en": "Other operating income",
        "uk": "Інші доходи від операційної діяльності",
        "ro": "Alte venituri din activitatea operațională",
    },
    "Cheltuieli de distribuire": {
        "ru": "Расходы на сбыт",
        "en": "Distribution expenses",
        "uk": "Витрати на збут",
        "ro": "Cheltuieli de distribuire",
    },
    "Cheltuieli administrative": {
        "ru": "Административные расходы",
        "en": "Administrative expenses",
        "uk": "Адміністративні витрати",
        "ro": "Cheltuieli administrative",
    },
    "Alte cheltuieli din activitatea operațională": {
        "ru": "Прочие операционные расходы",
        "en": "Other operating expenses",
        "uk": "Інші операційні витрати",
        "ro": "Alte cheltuieli din activitatea operațională",
    },
    "Rezultatul din activitatea operațională: profit (pierdere)": {
        "ru": "Результат операционной деятельности: прибыль (убыток)",
        "en": "Operating result: profit (loss)",
        "uk": "Результат операційної діяльності: прибуток (збиток)",
        "ro": "Rezultatul din activitatea operațională: profit (pierdere)",
    },
    "Venituri financiare, total": {
        "ru": "Финансовые доходы, всего",
        "en": "Financial income, total",
        "uk": "Фінансові доходи, всього",
        "ro": "Venituri financiare, total",
    },
    "venituri din alte investiții financiare pe termen lung": {
        "ru": "доходы от прочих долгосрочных финансовых инвестиций",
        "en": "income from other long-term financial investments",
        "uk": "доходи від інших довгострокових фінансових інвестицій",
        "ro": "venituri din alte investiții financiare pe termen lung",
    },
    "Cheltuieli financiare, total": {
        "ru": "Финансовые расходы, всего",
        "en": "Financial expenses, total",
        "uk": "Фінансові витрати, всього",
        "ro": "Cheltuieli financiare, total",
    },
    "cheltuieli aferente diferențelor de curs valutar și de sumă": {
        "ru": "расходы по курсовым и суммовым разницам",
        "en": "exchange rate and amount difference expenses",
        "uk": "витрати по курсових та сумових різницях",
        "ro": "cheltuieli aferente diferențelor de curs valutar și de sumă",
    },
    "Rezultatul: profit (pierdere) financiar(ă)": {
        "ru": "Результат: финансовая прибыль (убыток)",
        "en": "Result: financial profit (loss)",
        "uk": "Результат: фінансовий прибуток (збиток)",
        "ro": "Rezultatul: profit (pierdere) financiar(ă)",
    },
    "Rezultatul din alte activități: profit (pierdere)": {
        "ru": "Результат от прочей деятельности: прибыль (убыток)",
        "en": "Result from other activities: profit (loss)",
        "uk": "Результат від іншої діяльності: прибуток (збиток)",
        "ro": "Rezultatul din alte activități: profit (pierdere)",
    },
    "Profit (pierdere) pînă la impozitare": {
        "ru": "Прибыль (убыток) до налогообложения",
        "en": "Profit (loss) before taxation",
        "uk": "Прибуток (збиток) до оподаткування",
        "ro": "Profit (pierdere) pînă la impozitare",
    },
    "Cheltuieli privind impozitul pe venit": {
        "ru": "Расходы по налогу на прибыль",
        "en": "Income tax expense",
        "uk": "Витрати з податку на прибуток",
        "ro": "Cheltuieli privind impozitul pe venit",
    },
    "Profit net (pierdere netă) al perioadei de gestiune": {
        "ru": "Чистая прибыль (убыток) отчетного периода",
        "en": "Net profit (loss) for the reporting period",
        "uk": "Чистий прибуток (збиток) звітного періоду",
        "ro": "Profit net (pierdere netă) al perioadei de gestiune",
    },
    
    # ====== ОТЧЕТ ОБ ИЗМЕНЕНИЯХ КАПИТАЛА ======
    "Profit nerepartizat (pierdere neacoperită) al anilor precedenți": {
        "ru": "Нераспределенная прибыль (непокрытый убыток) прошлых лет",
        "en": "Retained earnings (uncovered loss) of previous years",
        "uk": "Нерозподілений прибуток (непокритий збиток) минулих років",
        "ro": "Profit nerepartizat (pierdere neacoperită) al anilor precedenți",
    },
    "Total profit (pierdere)": {
        "ru": "Итого прибыль (убыток)",
        "en": "Total profit (loss)",
        "uk": "Разом прибуток (збиток)",
        "ro": "Total profit (pierdere)",
    },
    "Total capital propriu": {
        "ru": "Итого собственный капитал",
        "en": "Total equity",
        "uk": "Разом власний капітал",
        "ro": "Total capital propriu",
    },
    
    # ====== ОТЧЕТ О ДВИЖЕНИИ ДЕНЕЖНЫХ СРЕДСТВ ======
    "Încasări din vînzări": {
        "ru": "Поступления от продаж",
        "en": "Receipts from sales",
        "uk": "Надходження від продажів",
        "ro": "Încasări din vînzări",
    },
    "Plăți pentru stocuri și servicii procurate": {
        "ru": "Платежи за запасы и услуги",
        "en": "Payments for inventories and services",
        "uk": "Платежі за запаси та послуги",
        "ro": "Plăți pentru stocuri și servicii procurate",
    },
    "Plăți către angajați și organe de asigurare socială și medicală": {
        "ru": "Платежи работникам и органам социального и медицинского страхования",
        "en": "Payments to employees and social/medical insurance bodies",
        "uk": "Платежі працівникам та органам соціального і медичного страхування",
        "ro": "Plăți către angajați și organe de asigurare socială și medicală",
    },
    "Dobînzi plătite": {
        "ru": "Уплаченные проценты",
        "en": "Interest paid",
        "uk": "Сплачені відсотки",
        "ro": "Dobînzi plătite",
    },
    "Plata impozitului pe venit": {
        "ru": "Уплата налога на прибыль",
        "en": "Income tax paid",
        "uk": "Сплата податку на прибуток",
        "ro": "Plata impozitului pe venit",
    },
    "Alte încasări": {
        "ru": "Прочие поступления",
        "en": "Other receipts",
        "uk": "Інші надходження",
        "ro": "Alte încasări",
    },
    "Alte plăți": {
        "ru": "Прочие платежи",
        "en": "Other payments",
        "uk": "Інші платежі",
        "ro": "Alte plăți",
    },
    "Fluxul net de numerar din activitatea operațională": {
        "ru": "Чистый денежный поток от операционной деятельности",
        "en": "Net cash flow from operating activities",
        "uk": "Чистий грошовий потік від операційної діяльності",
        "ro": "Fluxul net de numerar din activitatea operațională",
    },
    "Alte încasări (plăți)": {
        "ru": "Прочие поступления (платежи)",
        "en": "Other receipts (payments)",
        "uk": "Інші надходження (платежі)",
        "ro": "Alte încasări (plăți)",
    },
    "Fluxul net de numerar din activitatea de investiții": {
        "ru": "Чистый денежный поток от инвестиционной деятельности",
        "en": "Net cash flow from investing activities",
        "uk": "Чистий грошовий потік від інвестиційної діяльності",
        "ro": "Fluxul net de numerar din activitatea de investiții",
    },
    "Încasări sub formă de credite și împrumuturi": {
        "ru": "Поступления в виде кредитов и займов",
        "en": "Receipts in the form of loans and borrowings",
        "uk": "Надходження у вигляді кредитів та позик",
        "ro": "Încasări sub formă de credite și împrumuturi",
    },
    "Plăți aferente rambursării creditelor și împrumuturilor": {
        "ru": "Платежи по погашению кредитов и займов",
        "en": "Payments for loan and borrowing repayments",
        "uk": "Платежі по погашенню кредитів та позик",
        "ro": "Plăți aferente rambursării creditelor și împrumuturilor",
    },
    "Fluxul net de numerar din activitatea financiară": {
        "ru": "Чистый денежный поток от финансовой деятельности",
        "en": "Net cash flow from financing activities",
        "uk": "Чистий грошовий потік від фінансової діяльності",
        "ro": "Fluxul net de numerar din activitatea financiară",
    },
    "Fluxul net de numerar total": {
        "ru": "Общий чистый денежный поток",
        "en": "Total net cash flow",
        "uk": "Загальний чистий грошовий потік",
        "ro": "Fluxul net de numerar total",
    },
    "Sold de numerar la începutul perioadei de gestiune": {
        "ru": "Остаток денежных средств на начало отчетного периода",
        "en": "Cash balance at the beginning of the reporting period",
        "uk": "Залишок грошових коштів на початок звітного періоду",
        "ro": "Sold de numerar la începutul perioadei de gestiune",
    },
    "Sold de numerar la sfîrșitul perioadei de gestiune": {
        "ru": "Остаток денежных средств на конец отчетного периода",
        "en": "Cash balance at the end of the reporting period",
        "uk": "Залишок грошових коштів на кінець звітного періоду",
        "ro": "Sold de numerar la sfîrșitul perioadei de gestiune",
    },
    
    # ====== ОТЧЕТ ОБ ИСПОЛЬЗОВАНИИ ЦЕЛЕВЫХ СРЕДСТВ (для НКО) ======
    "Alte finanțări și încasări cu destinație specială": {
        "ru": "Прочее целевое финансирование и поступления",
        "en": "Other special purpose financing and receipts",
        "uk": "Інше цільове фінансування та надходження",
        "ro": "Alte finanțări și încasări cu destinație specială",
    },
    "Total mijloace cu destinație specială": {
        "ru": "Итого целевые средства",
        "en": "Total special purpose funds",
        "uk": "Разом цільові кошти",
        "ro": "Total mijloace cu destinație specială",
    },
    "Fondul de autofinanțare": {
        "ru": "Фонд самофинансирования",
        "en": "Self-financing fund",
        "uk": "Фонд самофінансування",
        "ro": "Fondul de autofinanțare",
    },
    "Total fonduri": {
        "ru": "Итого фонды",
        "en": "Total funds",
        "uk": "Разом фонди",
        "ro": "Total fonduri",
    },
    "Total surse de finanțare": {
        "ru": "Итого источники финансирования",
        "en": "Total financing sources",
        "uk": "Разом джерела фінансування",
        "ro": "Total surse de finanțare",
    },
    "Venituri aferente mijloacelor cu destinație specială": {
        "ru": "Доходы от целевых средств",
        "en": "Income from special purpose funds",
        "uk": "Доходи від цільових коштів",
        "ro": "Venituri aferente mijloacelor cu destinație specială",
    },
    "Cheltuieli aferente mijloacelor cu destinație specială": {
        "ru": "Расходы по целевым средствам",
        "en": "Expenses for special purpose funds",
        "uk": "Витрати по цільових коштах",
        "ro": "Cheltuieli aferente mijloacelor cu destinație specială",
    },
    "Alte venituri (cu excepția veniturilor din activitatea economică)": {
        "ru": "Прочие доходы (кроме доходов от экономической деятельности)",
        "en": "Other income (excluding income from economic activities)",
        "uk": "Інші доходи (крім доходів від економічної діяльності)",
        "ro": "Alte venituri (cu excepția veniturilor din activitatea economică)",
    },
    "Alte cheltuieli (cu excepția cheltuielilor din activitatea economică)": {
        "ru": "Прочие расходы (кроме расходов от экономической деятельности)",
        "en": "Other expenses (excluding expenses from economic activities)",
        "uk": "Інші витрати (крім витрат від економічної діяльності)",
        "ro": "Alte cheltuieli (cu excepția cheltuielilor din activitatea economică)",
    },
    "Excedent (deficit) aferent altor activități": {
        "ru": "Профицит (дефицит) от прочей деятельности",
        "en": "Surplus (deficit) from other activities",
        "uk": "Профіцит (дефіцит) від іншої діяльності",
        "ro": "Excedent (deficit) aferent altor activități",
    },
    "Excedent net (deficit net) al perioadei de gestiune": {
        "ru": "Чистый профицит (дефицит) отчетного периода",
        "en": "Net surplus (deficit) for the reporting period",
        "uk": "Чистий профіцит (дефіцит) звітного періоду",
        "ro": "Excedent net (deficit net) al perioadei de gestiune",
    },
    
    # ====== ДОПОЛНИТЕЛЬНЫЕ ПОКАЗАТЕЛИ ИЗ БАЛАНСА ======
    "Imobilizări corporale în curs de execuție": {
        "ru": "Основные средства в процессе создания",
        "en": "Fixed assets under construction",
        "uk": "Основні засоби у процесі створення",
        "ro": "Imobilizări corporale în curs de execuție",
    },
    "Total active imobilizate": {
        "ru": "Итого внеоборотные активы",
        "en": "Total non-current assets",
        "uk": "Разом необоротні активи",
        "ro": "Total active imobilizate",
    },
    "Obiecte de mică valoare și scurtă durată": {
        "ru": "Малоценные и быстроизнашивающиеся предметы",
        "en": "Low-value and short-term items",
        "uk": "Малоцінні та швидкозношувані предмети",
        "ro": "Obiecte de mică valoare și scurtă durată",
    },
    "Creanțe comerciale și avansuri acordate": {
        "ru": "Торговая дебиторская задолженность и авансы выданные",
        "en": "Trade receivables and advances paid",
        "uk": "Торгова дебіторська заборгованість та аванси видані",
        "ro": "Creanțe comerciale și avansuri acordate",
    },
    "Creanțe ale bugetului": {
        "ru": "Задолженность бюджета",
        "en": "Budget receivables",
        "uk": "Заборгованість бюджету",
        "ro": "Creanțe ale bugetului",
    },
    "Numerar": {
        "ru": "Денежные средства",
        "en": "Cash",
        "uk": "Грошові кошти",
        "ro": "Numerar",
    },
    "Total active circulante": {
        "ru": "Итого оборотные активы",
        "en": "Total current assets",
        "uk": "Разом оборотні активи",
        "ro": "Total active circulante",
    },
    "Total active": {
        "ru": "Итого активы",
        "en": "Total assets",
        "uk": "Разом активи",
        "ro": "Total active",
    },
    "Fond de autofinanțare": {
        "ru": "Фонд самофинансирования",
        "en": "Self-financing fund",
        "uk": "Фонд самофінансування",
        "ro": "Fond de autofinanțare",
    },
    "Finanțări și încasări cu destinație specială curente": {
        "ru": "Текущее целевое финансирование и поступления",
        "en": "Current special purpose financing and receipts",
        "uk": "Поточне цільове фінансування та надходження",
        "ro": "Finanțări și încasări cu destinație specială curente",
    },
    "Datorii comerciale și avansuri primite": {
        "ru": "Торговая кредиторская задолженность и авансы полученные",
        "en": "Trade payables and advances received",
        "uk": "Торгова кредиторська заборгованість та аванси отримані",
        "ro": "Datorii comerciale și avansuri primite",
    },
    "Datorii față de personal": {
        "ru": "Задолженность перед персоналом",
        "en": "Payables to employees",
        "uk": "Заборгованість перед персоналом",
        "ro": "Datorii față de personal",
    },
    "Venituri anticipate curente": {
        "ru": "Текущие доходы будущих периодов",
        "en": "Current deferred income",
        "uk": "Поточні доходи майбутніх періодів",
        "ro": "Venituri anticipate curente",
    },
    "Total datorii curente": {
        "ru": "Итого краткосрочные обязательства",
        "en": "Total current liabilities",
        "uk": "Разом поточні зобов'язання",
        "ro": "Total datorii curente",
    },
    "Total pasive": {
        "ru": "Итого пассивы",
        "en": "Total liabilities and equity",
        "uk": "Разом пасиви",
        "ro": "Total pasive",
    },
    
    # ====== РАСШИРЕННЫЕ ПОКАЗАТЕЛИ БАЛАНСА ======
    "clădiri": {
        "ru": "здания",
        "en": "buildings",
        "uk": "будівлі",
        "ro": "clădiri",
    },
    "mașini, utilaje și instalații tehnice": {
        "ru": "машины, оборудование и технические установки",
        "en": "machinery, equipment and technical installations",
        "uk": "машини, обладнання та технічні установки",
        "ro": "mașini, utilaje și instalații tehnice",
    },
    "Credite bancare pe termen lung": {
        "ru": "Долгосрочные банковские кредиты",
        "en": "Long-term bank loans",
        "uk": "Довгострокові банківські кредити",
        "ro": "Credite bancare pe termen lung",
    },
    "Împrumuturi pe termen lung": {
        "ru": "Долгосрочные займы",
        "en": "Long-term borrowings",
        "uk": "Довгострокові позики",
        "ro": "Împrumuturi pe termen lung",
    },
    "alte împrumuturi pe termen lung": {
        "ru": "прочие долгосрочные займы",
        "en": "other long-term borrowings",
        "uk": "інші довгострокові позики",
        "ro": "alte împrumuturi pe termen lung",
    },
    "Împrumuturi pe termen scurt, total": {
        "ru": "Краткосрочные займы, всего",
        "en": "Short-term borrowings, total",
        "uk": "Короткострокові позики, всього",
        "ro": "Împrumuturi pe termen scurt, total",
    },
    "alte împrumuturi pe termen scurt": {
        "ru": "прочие краткосрочные займы",
        "en": "other short-term borrowings",
        "uk": "інші короткострокові позики",
        "ro": "alte împrumuturi pe termen scurt",
    },
    "Datorii comerciale curente": {
        "ru": "Текущая торговая кредиторская задолженность",
        "en": "Current trade payables",
        "uk": "Поточна торгова кредиторська заборгованість",
        "ro": "Datorii comerciale curente",
    },
    "Datorii privind asigurările sociale și medicale": {
        "ru": "Задолженность по социальному и медицинскому страхованию",
        "en": "Social and medical insurance payables",
        "uk": "Заборгованість по соціальному та медичному страхуванню",
        "ro": "Datorii privind asigurările sociale și medicale",
    },
    "Datorii față de proprietari": {
        "ru": "Задолженность перед собственниками",
        "en": "Payables to owners",
        "uk": "Заборгованість перед власниками",
        "ro": "Datorii față de proprietari",
    },
    "TOTAL ACTIVE CIRCULANTE": {
        "ru": "ИТОГО ОБОРОТНЫЕ АКТИВЫ",
        "en": "TOTAL CURRENT ASSETS",
        "uk": "РАЗОМ ОБОРОТНІ АКТИВИ",
        "ro": "TOTAL ACTIVE CIRCULANTE",
    },
    "TOTAL ACTIVE": {
        "ru": "ИТОГО АКТИВЫ",
        "en": "TOTAL ASSETS",
        "uk": "РАЗОМ АКТИВИ",
        "ro": "TOTAL ACTIVE",
    },
    "TOTAL CAPITAL PROPRIU": {
        "ru": "ИТОГО СОБСТВЕННЫЙ КАПИТАЛ",
        "en": "TOTAL EQUITY",
        "uk": "РАЗОМ ВЛАСНИЙ КАПІТАЛ",
        "ro": "TOTAL CAPITAL PROPRIU",
    },
    "TOTAL DATORII PE TERMEN LUNG": {
        "ru": "ИТОГО ДОЛГОСРОЧНЫЕ ОБЯЗАТЕЛЬСТВА",
        "en": "TOTAL LONG-TERM LIABILITIES",
        "uk": "РАЗОМ ДОВГОСТРОКОВІ ЗОБОВ'ЯЗАННЯ",
        "ro": "TOTAL DATORII PE TERMEN LUNG",
    },
    "TOTAL DATORII CURENTE": {
        "ru": "ИТОГО КРАТКОСРОЧНЫЕ ОБЯЗАТЕЛЬСТВА",
        "en": "TOTAL CURRENT LIABILITIES",
        "uk": "РАЗОМ ПОТОЧНІ ЗОБОВ'ЯЗАННЯ",
        "ro": "TOTAL DATORII CURENTE",
    },
    "TOTAL PASIVE": {
        "ru": "ИТОГО ПАССИВЫ",
        "en": "TOTAL LIABILITIES AND EQUITY",
        "uk": "РАЗОМ ПАСИВИ",
        "ro": "TOTAL PASIVE",
    },
    "venituri din prestarea serviciilor și executarea lucrărilor": {
        "ru": "выручка от предоставления услуг и выполнения работ",
        "en": "revenue from services rendered and work performed",
        "uk": "виручка від надання послуг та виконання робіт",
        "ro": "venituri din prestarea serviciilor și executarea lucrărilor",
    },
    "Total capital social și neînregistrat": {
        "ru": "Итого уставный и незарегистрированный капитал",
        "en": "Total registered and unregistered capital",
        "uk": "Разом статутний і незареєстрований капітал",
        "ro": "Total capital social și neînregistrat",
    },
    "Capital social": {
        "ru": "Уставный капитал",
        "en": "Share capital",
        "uk": "Статутний капітал",
        "ro": "Capital social",
    },
}


def get_translated_group_name(original_name: str, lang: str) -> str:
    """Получить перевод названия группы финансового отчета"""
    lang = lang.lower() if lang else "ru"
    if lang not in FINANCIAL_GROUP_NAMES:
        lang = "ru"
    
    translations = FINANCIAL_GROUP_NAMES.get(lang, {})
    return translations.get(original_name, original_name)


def get_translated_indicator(code: str, original_name: str, lang: str) -> str:
    """
    Получить перевод показателя по коду или названию.
    Сначала ищем по коду, затем по названию.
    """
    lang = lang.lower() if lang else "ru"
    if lang not in ["ru", "en", "uk", "ro"]:
        lang = "ru"
    
    # Если язык румынский - возвращаем оригинал
    if lang == "ro":
        return original_name
    
    # Пробуем найти по коду
    if code in FINANCIAL_INDICATORS:
        indicator_trans = FINANCIAL_INDICATORS[code]
        if lang in indicator_trans:
            return indicator_trans[lang]
    
    # Пробуем найти по названию (убираем возможные скобки с формулами)
    clean_name = original_name.split("(rd.")[0].strip() if "(rd." in original_name else original_name
    
    # Ищем точное совпадение
    if original_name in FINANCIAL_INDICATORS_BY_NAME:
        trans = FINANCIAL_INDICATORS_BY_NAME[original_name]
        if lang in trans:
            return trans[lang]
    
    # Ищем без формулы
    if clean_name != original_name and clean_name in FINANCIAL_INDICATORS_BY_NAME:
        trans = FINANCIAL_INDICATORS_BY_NAME[clean_name]
        if lang in trans:
            return trans[lang]
    
    # Ищем частичное совпадение (начало строки)
    for name_key, trans in FINANCIAL_INDICATORS_BY_NAME.items():
        if original_name.startswith(name_key) or name_key.startswith(clean_name):
            if lang in trans:
                return trans[lang]
    
    # Возвращаем оригинал если перевод не найден
    return original_name
