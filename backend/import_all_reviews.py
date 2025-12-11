"""
Импорт отзывов в таблицу reviews из двух файлов:
1) JSON { "reviews_b2bhintcompany": [ {...}, ... ] } — reviews_b2bhintcompany_202508191624.json
2) JSONL — reviews_review.jsonl

Стримовый парсер массива, батчи 200, ON CONFLICT DO NOTHING.
Пропускает записи без name/subject.
"""
import json
import asyncio
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import insert
from database import AsyncSessionLocal
from models.review import Review

JSON_PATH = "reviews_b2bhintcompany_202508191624.json"
JSONL_PATH = "reviews_review.jsonl"
BATCH = 200

def parse_dt(val: str):
    if not val:
        return None
    try:
        return datetime.fromisoformat(val.replace("Z", "+00:00"))
    except Exception:
        return None

def stream_array(path: str):
    decoder = json.JSONDecoder()
    buf = ""
    in_array = False
    with open(path, "r", encoding="utf-8") as f:
        while True:
            chunk = f.read(65536)
            if not chunk:
                break
            buf += chunk
            if not in_array:
                pos = buf.find("[")
                if pos == -1:
                    buf = ""
                    continue
                in_array = True
                buf = buf[pos + 1 :]
            while True:
                buf = buf.lstrip()
                if not buf:
                    break
                if buf[0] == "]":
                    return
                try:
                    obj, end = decoder.raw_decode(buf)
                    yield obj
                    buf = buf[end:]
                    if buf.startswith(","):
                        buf = buf[1:]
                except json.JSONDecodeError:
                    break

async def insert_batch(session, rows, attempts_counter):
    if not rows:
        return attempts_counter
    stmt = insert(Review).values(rows).on_conflict_do_nothing()
    await session.execute(stmt)
    await session.commit()
    attempts_counter += len(rows)
    if attempts_counter % 2000 == 0:
        print(f"✅ Попыток вставки: {attempts_counter}", flush=True)
    return attempts_counter

async def import_json(session, path):
    batch = []
    attempts = 0
    errors = 0
    for idx, rec in enumerate(stream_array(path), 1):
        try:
            subject = rec.get("name")
            if not subject:
                errors += 1
                continue
            row = {
                "id": rec.get("id"),
                "subject": subject,
                "review_id": f"b2b-{rec.get('id')}",
                "comment": rec.get("comment"),
                "reviewer": rec.get("reviewer"),
                "rating": rec.get("rating"),
                "status": rec.get("status"),
                "review_date": parse_dt(rec.get("review_date")),
                "source": rec.get("source") or "b2bhint",
                "jurisdiction": rec.get("jurisdiction"),
                "country": rec.get("country"),
                "company_number": rec.get("company_number"),
                "registration_number": rec.get("registration_number"),
                "registration_date": rec.get("registration_date"),
                "legal_form": rec.get("legal_form"),
                "short_name": rec.get("short_name"),
                "cin": rec.get("cin"),
                "authorized_capital": rec.get("authorized_capital"),
                "paid_up_capital": rec.get("paid_up_capital"),
                "subtype": rec.get("subtype"),
                "activity_type": rec.get("activity_type"),
                "legal_address": rec.get("legal_address"),
                "ogrn": rec.get("ogrn"),
                "inn": rec.get("inn"),
                "liquidation_date": rec.get("liquidation_date"),
                "managers": rec.get("managers"),
                "branch": rec.get("branch"),
                "mailing_address": rec.get("mailing_address"),
                "created_at": parse_dt(rec.get("created_at")) or datetime.now(timezone.utc),
            }
            batch.append(row)
            if len(batch) >= BATCH:
                attempts = await insert_batch(session, batch, attempts)
                batch = []
        except Exception as e:
            errors += 1
            if errors < 10:
                print(f"❌ Ошибка в JSON записи {idx}: {e}")
            continue
    attempts = await insert_batch(session, batch, attempts)
    print(f"✅ Импорт JSON завершён. Попыток вставки: {attempts}, ошибок: {errors}")

async def import_jsonl(session, path):
    batch = []
    attempts = 0
    errors = 0
    try:
        with open(path, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    subject = data.get("subject")
                    if not subject:
                        errors += 1
                        continue
                    row = {
                        "id": data.get("id"),
                        "subject": subject,
                        "review_id": data.get("review_id"),
                        "comment": data.get("comment"),
                        "reviewer": data.get("reviewer"),
                        "rating": data.get("rating"),
                        "status": data.get("status"),
                        "review_date": parse_dt(data.get("review_date")),
                        "source": data.get("source"),
                        "jurisdiction": data.get("jurisdiction"),
                        "country": data.get("country"),
                        "company_number": data.get("company_number"),
                        "registration_number": data.get("registration_number"),
                        "registration_date": data.get("registration_date"),
                        "legal_form": data.get("legal_form"),
                        "short_name": data.get("short_name"),
                        "cin": data.get("cin"),
                        "authorized_capital": data.get("authorized_capital"),
                        "paid_up_capital": data.get("paid_up_capital"),
                        "subtype": data.get("subtype"),
                        "activity_type": data.get("activity_type"),
                        "legal_address": data.get("legal_address"),
                        "ogrn": data.get("ogrn"),
                        "inn": data.get("inn"),
                        "liquidation_date": data.get("liquidation_date"),
                        "managers": data.get("managers"),
                        "branch": data.get("branch"),
                        "mailing_address": data.get("mailing_address"),
                        "created_at": parse_dt(data.get("created_at")),
                    }
                    batch.append(row)
                    if len(batch) >= BATCH:
                        attempts = await insert_batch(session, batch, attempts)
                        batch = []
                except Exception as e:
                    errors += 1
                    if errors < 10:
                        print(f"❌ Ошибка в JSONL строке {idx}: {e}")
                    continue
    except FileNotFoundError:
        print(f"⚠️ JSONL файл {path} не найден, пропускаем.")
    attempts = await insert_batch(session, batch, attempts)
    print(f"✅ Импорт JSONL завершён. Попыток вставки: {attempts}, ошибок: {errors}")

async def main():
    async with AsyncSessionLocal() as session:
        print("🚀 Импорт JSON...")
        await import_json(session, JSON_PATH)
        print("🚀 Импорт JSONL...")
        await import_jsonl(session, JSONL_PATH)

if __name__ == "__main__":
    asyncio.run(main())