#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Скрипт для исправления синтаксических ошибок в seed_specialists.py"""

import re

def fix_seed_file():
    with open('seed_specialists.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Исправляем отсутствующие запятые после значений в словарях
    # Паттерн: строка с ключом и значением без запятой, за которой следует новая строка с ключом
    patterns = [
        (r'("(?:name|position|specialization|workplace|education|extra_qual|photo)":\s*"[^"]+")\n\s*("(?:name|position|specialization|workplace|education|extra_qual|photo)":)', r'\1,\n        \2'),
        (r'("(?:name|position|specialization|workplace|education|extra_qual|photo)":\s*"")\n\s*("(?:name|position|specialization|workplace|education|extra_qual|photo)":)', r'\1,\n        \2'),
        (r'}\n\s*{', r'},\n    {'),
    ]
    
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)
    
    with open('seed_specialists.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Файл исправлен!")

if __name__ == "__main__":
    fix_seed_file()



