import json
from pathlib import Path

_departments: dict = {}
_issues: dict = {}
_aliases: dict = {}
_lookup: dict = {}


def load_knowledge_base(data_dir: Path) -> None:
    global _departments, _issues, _aliases, _lookup

    with open(data_dir / "departments.json", encoding="utf-8") as f:
        _departments = json.load(f)

    with open(data_dir / "issues.json", encoding="utf-8") as f:
        _issues = json.load(f)

    with open(data_dir / "aliases.json", encoding="utf-8") as f:
        _aliases = json.load(f)

    _lookup = {}
    for entry in _departments.get("entries", []):
        for city in entry.get("cities", []):
            for issue_id in entry.get("issue_ids", []):
                _lookup[(city.lower(), issue_id.lower())] = entry


def resolve_department(city: str, issue_id: str) -> dict:
    key = (city.lower(), issue_id.lower())
    if key in _lookup:
        return _lookup[key]

    alias_id = _aliases.get(issue_id.lower())
    if alias_id:
        key = (city.lower(), alias_id.lower())
        if key in _lookup:
            return _lookup[key]

    return {
        "name": "Unknown Department",
        "reason": "Could not determine the responsible department.",
        "channels": [],
    }
