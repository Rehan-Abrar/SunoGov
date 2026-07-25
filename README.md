# ModelScope download setup

This workspace contains a PowerShell helper for downloading models from ModelScope.

## Prerequisites

Install ModelScope into the configured Python environment:

```powershell
C:/Users/rehan/AppData/Local/Python/pythoncore-3.14-64/python.exe -m pip install modelscope
```

## Download a model

Run the helper script and enter your ModelScope token when prompted:

```powershell
.\scripts\download-model.ps1
```

The default model is `Qwen-Ambassador/Qwen3.7-Max`.

You can also run the Python downloader directly:

```powershell
C:/Users/rehan/AppData/Local/Python/pythoncore-3.14-64/python.exe .\scripts\download-model.py
```

## Optional parameters

You can override the model id, endpoint, or destination folder:

```powershell
.\scripts\download-model.ps1 -ModelId 'Qwen-Ambassador/Qwen3.7-Max' -LocalDir '.\dir'
```

## Notes

- The token is requested at runtime and is not written to disk.
- The script sets `MODELSCOPE_ENDPOINT` for the current session before downloading.

## Start coding

Use `main.py` as the first file to extend. It verifies that the workspace is configured and that a ModelScope token is available from `.env`.

```powershell
C:/Users/rehan/AppData/Local/Python/pythoncore-3.14-64/python.exe .\main.py
```

After that, replace the placeholder section in `main.py` with your application logic.