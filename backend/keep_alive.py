"""
Скрипт для поддержания активности сервера на Render
Запускается как background service и пингует /ping каждые 10 минут
"""
import time
import requests
import os
import sys

def ping_server():
    """Пингует сервер каждые 10 минут"""
    backend_url = os.getenv('BACKEND_URL', 'https://biosfera-backend-ru6v.onrender.com')
    ping_url = f"{backend_url}/ping"
    
    while True:
        try:
            response = requests.get(ping_url, timeout=10)
            if response.status_code == 200:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping successful: {response.json()}")
            else:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping failed: Status {response.status_code}")
        except Exception as e:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping error: {e}")
        
        # Ждем 10 минут (600 секунд) перед следующим пингом
        time.sleep(600)

if __name__ == "__main__":
    print("Starting keep-alive service...")
    print(f"Backend URL: {os.getenv('BACKEND_URL', 'https://biosfera-backend-ru6v.onrender.com')}")
    ping_server()




