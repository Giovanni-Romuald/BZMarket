#!/bin/bash
set -e

echo "===================================="
echo " Installing Python dependencies"
echo "===================================="
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo "===================================="
echo " Applying database migrations"
echo "===================================="
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "===================================="
echo " Collecting static files"
echo "===================================="
python manage.py collectstatic --noinput --clear

echo "===================================="
echo " Build completed successfully"
echo "===================================="
