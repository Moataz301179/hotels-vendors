"""
OpenClaw Skills Registry v1
Loads, parses, and executes SKILL.md files as browser automation procedures.
Skills are self-contained markdown files with structured procedures.
"""

import os
import re
import json
from pathlib import Path
from typing import Any, Optional
from dataclasses import dataclass, field

SKILLS_DIR = Path(os.getenv("OPENCLAW_SKILLS", "/app/skills"))


@dataclass
class SkillProcedure:
    name: str
    steps: list[dict[str, Any]]
    notes: str = ""


@dataclass
class Skill:
    name: str
    description: str
    purpose: str
    when_to_use: str
    content: str
    procedures: list[SkillProcedure] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


class SkillsRegistry:
    def __init__(self, skills_dir: Path = SKILLS_DIR):
        self.skills_dir = skills_dir
        self.skills: dict[str, Skill] = {}
        self._load_all()

    def _load_all(self):
        if not self.skills_dir.exists():
            return
        for skill_dir in self.skills_dir.iterdir():
            if skill_dir.is_dir():
                skill_md = skill_dir / "SKILL.md"
                if skill_md.exists():
                    skill = self._parse_skill(skill_dir.name, skill_md.read_text())
                    self.skills[skill.name] = skill

    def _parse_skill(self, name: str, content: str) -> Skill:
        lines = content.split("\n")
        
        # Extract header sections
        description = ""
        purpose = ""
        when_to_use = ""
        
        # Simple markdown parsing
        in_code_block = False
        code_lang = ""
        current_procedure_name = ""
        current_procedure_steps: list[dict] = []
        current_procedure_notes = ""
        procedures: list[SkillProcedure] = []
        
        for line in lines:
            stripped = line.strip()
            
            # Code block detection
            if stripped.startswith("```"):
                if not in_code_block:
                    in_code_block = True
                    code_lang = stripped[3:].strip()
                else:
                    in_code_block = False
                    # If we were collecting a procedure, finalize it
                    if current_procedure_name and current_procedure_steps:
                        procedures.append(SkillProcedure(
                            name=current_procedure_name,
                            steps=current_procedure_steps,
                            notes=current_procedure_notes,
                        ))
                        current_procedure_name = ""
                        current_procedure_steps = []
                        current_procedure_notes = ""
                continue
            
            # Extract purpose from header
            if stripped.startswith("## Purpose"):
                purpose = ""
                continue
            if stripped.startswith("## When to Use"):
                when_to_use = ""
                continue
            if stripped.startswith("# ") and not description:
                description = stripped[2:]
                continue
            
            # Collect purpose text
            if not stripped.startswith("##") and not stripped.startswith("```") and not in_code_block:
                if "purpose" in content.lower()[:500] and not purpose and not stripped.startswith("-"):
                    purpose += " " + stripped
                if "when to use" in content.lower()[:800] and not when_to_use and not stripped.startswith("-"):
                    when_to_use += " " + stripped
            
            # Detect procedure names in code blocks
            if in_code_block and stripped.startswith("Goal:"):
                current_procedure_name = stripped.replace("Goal:", "").strip()
            elif in_code_block and stripped.startswith("### "):
                current_procedure_name = stripped[4:]
            elif in_code_block and re.match(r"^Step \d+:", stripped):
                step_text = re.sub(r"^Step \d+:", "", stripped).strip()
                current_procedure_steps.append({"action": "text", "instruction": step_text})
            elif in_code_block and stripped.startswith("-"):
                step_text = stripped[1:].strip()
                current_procedure_steps.append({"action": "text", "instruction": step_text})
            elif in_code_block and stripped.startswith("1."):
                step_text = re.sub(r"^\d+\.\s*", "", stripped).strip()
                current_procedure_steps.append({"action": "text", "instruction": step_text})
        
        # If there's a trailing procedure not closed by ```
        if current_procedure_name and current_procedure_steps:
            procedures.append(SkillProcedure(
                name=current_procedure_name,
                steps=current_procedure_steps,
                notes=current_procedure_notes,
            ))
        
        # Also parse JSON blocks if present
        json_blocks = re.findall(r'```json\s*([\s\S]*?)```', content)
        for block in json_blocks:
            try:
                data = json.loads(block)
                if isinstance(data, dict):
                    procedures.append(SkillProcedure(
                        name=data.get("name", "unnamed"),
                        steps=data.get("steps", []),
                        notes=data.get("notes", ""),
                    ))
            except json.JSONDecodeError:
                pass
        
        return Skill(
            name=name,
            description=description.strip() or name,
            purpose=purpose.strip() or description.strip() or name,
            when_to_use=when_to_use.strip(),
            content=content,
            procedures=procedures,
        )

    def list_skills(self) -> list[dict]:
        return [
            {
                "name": s.name,
                "description": s.description,
                "purpose": s.purpose,
                "when_to_use": s.when_to_use,
                "procedures": [p.name for p in s.procedures],
            }
            for s in self.skills.values()
        ]

    def get(self, name: str) -> Optional[Skill]:
        return self.skills.get(name)

    def get_procedure(self, skill_name: str, procedure_name: Optional[str] = None) -> Optional[SkillProcedure]:
        skill = self.skills.get(skill_name)
        if not skill:
            return None
        if not skill.procedures:
            return None
        if procedure_name:
            for p in skill.procedures:
                if p.name.lower() == procedure_name.lower():
                    return p
            return None
        return skill.procedures[0]  # Default to first

    def search(self, query: str) -> list[dict]:
        results = []
        q = query.lower()
        for s in self.skills.values():
            score = 0
            if q in s.name.lower():
                score += 10
            if q in s.description.lower():
                score += 5
            if q in s.purpose.lower():
                score += 3
            if q in s.content.lower():
                score += 1
            if score > 0:
                results.append({"skill": s.name, "score": score, "description": s.description})
        results.sort(key=lambda x: x["score"], reverse=True)
        return results

    def reload(self):
        self.skills.clear()
        self._load_all()


# Singleton
registry = SkillsRegistry()
