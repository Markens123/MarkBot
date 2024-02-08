#!/bin/bash
source .env

rcon-cli save
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILE_PATH="/palworld/backups/palworld-save-${DATE}.tar.gz"

cd /home/ubuntu/palworld-server/palworld/Pal/ || exit

echo "Creating backup"
tar -zcf "$FILE_PATH" "Saved/"

echo "Backup created at ${FILE_PATH}"

if [ "${DELETE_OLD_BACKUPS,,}" = true ]; then
    if [ -z "${OLD_BACKUP_DAYS}" ]; then
        echo "Unable to delete old backups, OLD_BACKUP_DAYS is empty."
    elif [[ "${OLD_BACKUP_DAYS}" =~ ^[0-9]+$ ]]; then
        echo "Removing backups older than ${OLD_BACKUP_DAYS} days"
        find /home/ubuntu/palworld-server/palworld/backups/ -mindepth 1 -maxdepth 1 -mtime "+${OLD_BACKUP_DAYS}" -type f -name 'palworld-save-*.tar.gz' -print -delete
    else
        echo "Unable to delete old backups, OLD_BACKUP_DAYS is not an integer. OLD_BACKUP_DAYS=${OLD_BACKUP_DAYS}"
    fi
fi