from pathlib import Path

from scripts.modelscope_utils import load_token


def ensure_workspace_ready() -> None:
    project_root = Path(__file__).resolve().parent
    env_path = project_root / '.env'

    if not env_path.exists():
        raise FileNotFoundError('Missing .env file at project root.')

    token = load_token()
    if not token:
        raise RuntimeError('ModelScope token was not found in .env or environment variables.')

    print('ModelScope setup is ready.')
    print('Next step: replace the placeholder section in main.py with your own code.')


if __name__ == '__main__':
    ensure_workspace_ready()