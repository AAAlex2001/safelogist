# Инструкция по привязке домена safelogist.net

## 1. Настройка DNS записей

В панели управления доменом (у регистратора) добавьте:

**A-запись:**
- Имя: `@` или `safelogist.net`
- Тип: `A`
- Значение: `77.95.201.216`
- TTL: `3600`

**A-запись для www (опционально):**
- Имя: `www`
- Тип: `A`
- Значение: `77.95.201.216`
- TTL: `3600`

**Проверка DNS:**
```bash
# Проверить, что DNS записи применились
nslookup safelogist.net
dig safelogist.net
```

## 2. Установка и настройка Nginx на сервере

### Установка Nginx:
```bash
sudo apt update
sudo apt install nginx -y
```

### Копирование конфигурации:
```bash
sudo cp nginx_safelogist.conf /etc/nginx/sites-available/safelogist.net
sudo ln -s /etc/nginx/sites-available/safelogist.net /etc/nginx/sites-enabled/
```

### Проверка и перезапуск:
```bash
# Проверить конфигурацию
sudo nginx -t

# Перезапустить nginx
sudo systemctl restart nginx

# Проверить статус
sudo systemctl status nginx
```

## 3. Настройка FastAPI приложения

### Запуск через systemd (рекомендуется):

Создайте файл `/etc/systemd/system/safelogist.service`:

```ini
[Unit]
Description=SafeLogist FastAPI Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### Управление сервисом:
```bash
# Включить автозапуск
sudo systemctl enable safelogist

# Запустить
sudo systemctl start safelogist

# Проверить статус
sudo systemctl status safelogist

# Логи
sudo journalctl -u safelogist -f
```

## 4. Настройка SSL (HTTPS) через Let's Encrypt

### Установка Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Получение сертификата:
```bash
sudo certbot --nginx -d safelogist.net -d www.safelogist.net
```

Certbot автоматически настроит nginx для HTTPS.

### Автообновление сертификата:
```bash
# Проверить автообновление
sudo certbot renew --dry-run
```

## 5. Проверка работы

После настройки проверьте:

1. **DNS:**
   ```bash
   ping safelogist.net
   ```

2. **HTTP:**
   ```bash
   curl http://safelogist.net/health
   ```

3. **HTTPS (после настройки SSL):**
   ```bash
   curl https://safelogist.net/health
   ```

## 6. Открытие портов в firewall

```bash
# UFW
sudo ufw allow 'Nginx Full'
sudo ufw allow 22/tcp  # SSH
sudo ufw enable

# Или iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## Полезные команды

```bash
# Проверить, что порт 8000 слушается
sudo netstat -tlnp | grep 8000

# Проверить логи nginx
sudo tail -f /var/log/nginx/safelogist_error.log

# Проверить логи FastAPI
sudo journalctl -u safelogist -f
```

