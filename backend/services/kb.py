import json
from pathlib import Path

_departments: dict = {}
_issues: dict = {}
_aliases: dict = {}
_lookup: dict = {}
_alias_index: dict = {}


def load_knowledge_base(data_dir: Path) -> None:
    global _departments, _issues, _aliases, _lookup, _alias_index

    with open(data_dir / "departments.json", encoding="utf-8") as f:
        _departments = json.load(f)

    with open(data_dir / "issues.json", encoding="utf-8") as f:
        _issues = json.load(f)

    with open(data_dir / "aliases.json", encoding="utf-8") as f:
        _aliases = json.load(f)

    _lookup = {}
    for city, issues_list in _issues.items():
        for issue in issues_list:
            _lookup[(city.lower(), issue["issue_id"].lower())] = issue

    _alias_index = {}
    for issue_id, synonyms in _aliases.items():
        for synonym in synonyms:
            _alias_index[synonym.lower()] = issue_id


def resolve(city: str, issue_id: str) -> dict | None:
    key = (city.lower(), issue_id.lower())
    if key in _lookup:
        return _lookup[key]
    return None


def resolve_with_alias(city: str, issue_id: str) -> dict | None:
    result = resolve(city, issue_id)
    if result:
        return result

    mapped_id = _alias_index.get(issue_id.lower())
    if mapped_id:
        return resolve(city, mapped_id)

    return None


def get_department(department_id: str) -> dict | None:
    return _departments.get(department_id)


def get_all_issue_ids() -> list[str]:
    return list(_aliases.keys())


def get_all_cities() -> list[str]:
    return list(_issues.keys())
