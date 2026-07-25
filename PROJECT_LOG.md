# Project Log

## 2026-07-25

- Added a PowerShell helper for ModelScope downloads with runtime token entry.
- Added README usage instructions for installing ModelScope and downloading `Qwen-Ambassador/Qwen3.7-Max`.
- Updated the helper to use the installed ModelScope executable directly when it is not on PATH.
- Switched the setup to the Python SDK path because application control blocks the CLI executable.
- Updated the downloader to read the ModelScope token from `.env` and successfully downloaded `Qwen-Ambassador/Qwen3.7-Max`.
- Added a starter `main.py` entrypoint so coding can begin from a runnable workspace file.