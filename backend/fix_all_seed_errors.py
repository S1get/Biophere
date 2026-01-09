#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Автоматическое исправление всех синтаксических ошибок в seed_specialists.py"""

import re

def fix_seed_file():
    with open('seed_specialists.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Исправляем отсутствующие запятые после значений в словарях
    # Паттерн: строка с ключом и значением без запятой, за которой следует новая строка с ключом
    # Используем более точный паттерн
    content = re.sub(
        r'("(?:name|position|specialization|workplace|education|extra_qual|photo)":\s*"[^"]*")\n\s*("(?:name|position|specialization|workplace|education|extra_qual|photo)":)',
        r'\1,\n        \2',
        content
    )
    
    # Исправляем отсутствующие запятые между словарями
    content = re.sub(r'}\n\s*{', r'},\n    {', content)
    
    # Исправляем отсутствующие запятые в конце словарей перед закрывающей скобкой списка
    content = re.sub(r'}\n\]', r'},\n]', content)
    
    with open('seed_specialists.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Файл seed_specialists.py исправлен!")
    print("Проверяю синтаксис...")
    
    # Проверяем синтаксис
    try:
        compile(content, 'seed_specialists.py', 'exec')
        print("✅ Синтаксис корректен!")
    except SyntaxError as e:
        print(f"⚠️ Остались ошибки: {e}")
        print(f"Строка {e.lineno}: {e.text}")

if __name__ == "__main__":
    fix_seed_file()






