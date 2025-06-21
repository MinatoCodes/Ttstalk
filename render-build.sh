#!/usr/bin/env bash

# Install Chromium dependencies (for Puppeteer) on Render
apt-get update && apt-get install -y \
  wget gnupg ca-certificates \
  fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
  libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 \
  libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 xdg-utils

# Install Google Chrome
echo "Downloading Chrome..."
mkdir -p /opt/chromium
wget -qO- https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb > /opt/chromium/chrome.deb
dpkg -i /opt/chromium/chrome.deb || apt-get -f install -y
