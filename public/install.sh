#!/usr/bin/env bash
# 🦞 Lobster Farmer Installer
# Usage: curl -fsSL https://lobsterfarmer.com/api/install?product=persona&token=xxx | bash
# Or: bash install.sh <zip_path>
set -euo pipefail

LOBSTER="🦞"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${GREEN}${LOBSTER} $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err() { echo -e "${RED}❌ $1${NC}"; exit 1; }

# --- Detect workspace ---
detect_workspace() {
  # Check common locations
  for dir in "$HOME/clawd" "$HOME/openclaw" "$HOME/.openclaw/workspace"; do
    if [ -d "$dir" ] && ([ -f "$dir/AGENTS.md" ] || [ -f "$dir/SOUL.md" ]); then
      echo "$dir"
      return
    fi
  done
  # Fallback: create ~/clawd
  echo "$HOME/clawd"
}

WORKSPACE=$(detect_workspace)
BACKUP_DIR="$WORKSPACE/.lobster-backup/$(date +%Y%m%d-%H%M%S)"
INSTALL_REPORT="$WORKSPACE/INSTALL_REPORT.md"
ZIP_PATH=""
PRODUCT=""

# --- Parse args ---
if [ $# -ge 1 ] && [ -f "$1" ]; then
  ZIP_PATH="$1"
  PRODUCT=$(basename "$1" .zip | sed 's/-v[0-9].*//')
fi

# --- If no local zip, download from URL env vars ---
if [ -z "$ZIP_PATH" ] && [ -n "${LOBSTER_DOWNLOAD_URL:-}" ]; then
  TMPZIP="/tmp/lobster-download-$$.zip"
  log "Downloading package..."
  curl -fsSL "$LOBSTER_DOWNLOAD_URL" -o "$TMPZIP"
  ZIP_PATH="$TMPZIP"
  PRODUCT="${LOBSTER_PRODUCT:-unknown}"
fi

if [ -z "$ZIP_PATH" ]; then
  err "Usage: bash install.sh <path-to-zip>\n   Or: LOBSTER_DOWNLOAD_URL=... LOBSTER_PRODUCT=persona bash install.sh"
fi

if [ ! -f "$ZIP_PATH" ]; then
  err "File not found: $ZIP_PATH"
fi

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  ${LOBSTER} Lobster Farmer Installer        ║${NC}"
echo -e "${CYAN}║  Product: $(printf '%-25s' "$PRODUCT")  ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

log "Workspace: $WORKSPACE"
mkdir -p "$WORKSPACE"

# --- Backup existing files ---
BACKED_UP=()
for f in SOUL.md AGENTS.md IDENTITY.md USER.md HEARTBEAT.md ShadowOps_Manual.md; do
  if [ -f "$WORKSPACE/$f" ]; then
    mkdir -p "$BACKUP_DIR"
    cp "$WORKSPACE/$f" "$BACKUP_DIR/$f"
    BACKED_UP+=("$f")
  fi
done

if [ ${#BACKED_UP[@]} -gt 0 ]; then
  log "Backed up ${#BACKED_UP[@]} existing files → $BACKUP_DIR"
fi

# --- Extract to temp dir first ---
TMPDIR=$(mktemp -d)
unzip -q "$ZIP_PATH" -d "$TMPDIR"

# --- Smart merge: don't overwrite existing persona files, DO overwrite skills ---
INSTALLED_FILES=()
SKIPPED_FILES=()
NEW_SKILLS=()

# Copy persona files (backup + skip if exists with content)
PERSONA_FILES=(SOUL.md AGENTS.md IDENTITY.md USER.md HEARTBEAT.md ShadowOps_Manual.md)
for f in "${PERSONA_FILES[@]}"; do
  SRC="$TMPDIR/$f"
  DST="$WORKSPACE/$f"
  if [ -f "$SRC" ]; then
    if [ -f "$DST" ] && [ -s "$DST" ]; then
      # Existing file has content - save new version as .lobster-new
      cp "$SRC" "$DST.lobster-new"
      SKIPPED_FILES+=("$f (kept yours, new version → $f.lobster-new)")
    else
      cp "$SRC" "$DST"
      INSTALLED_FILES+=("$f")
    fi
  fi
done

# Copy other files (README, INSTALL, CHANGELOG, setup-guide, etc.)
for f in README.md INSTALL.md CHANGELOG.md setup-guide.md; do
  if [ -f "$TMPDIR/$f" ]; then
    cp "$TMPDIR/$f" "$WORKSPACE/$f"
    INSTALLED_FILES+=("$f")
  fi
done

# Copy cron-examples
if [ -d "$TMPDIR/cron-examples" ]; then
  mkdir -p "$WORKSPACE/cron-examples"
  cp -r "$TMPDIR/cron-examples/"* "$WORKSPACE/cron-examples/"
  INSTALLED_FILES+=("cron-examples/")
fi

# Copy guide (bundle only)
if [ -d "$TMPDIR/guide" ]; then
  mkdir -p "$WORKSPACE/guide"
  cp -r "$TMPDIR/guide/"* "$WORKSPACE/guide/"
  INSTALLED_FILES+=("guide/ (PDF + markdown)")
fi

# Install skills (always overwrite - these are product updates)
if [ -d "$TMPDIR/skills" ]; then
  mkdir -p "$WORKSPACE/skills"
  for skill_dir in "$TMPDIR/skills"/*/; do
    if [ -d "$skill_dir" ]; then
      skill_name=$(basename "$skill_dir")
      cp -r "$skill_dir" "$WORKSPACE/skills/"
      NEW_SKILLS+=("$skill_name")
      INSTALLED_FILES+=("skills/$skill_name/")
    fi
  done
fi

# Cleanup
rm -rf "$TMPDIR"
if [ -n "${TMPZIP:-}" ] && [ -f "${TMPZIP:-}" ]; then
  rm -f "$TMPZIP"
fi

# --- Generate Install Report ---
SKILL_LIST=""
for s in "${NEW_SKILLS[@]:-}"; do
  if [ -f "$WORKSPACE/skills/$s/SKILL.md" ]; then
    desc=$(head -20 "$WORKSPACE/skills/$s/SKILL.md" | grep "^description:" | sed 's/description: *//' | head -1)
    SKILL_LIST="$SKILL_LIST\n- **$s**: $desc"
  else
    SKILL_LIST="$SKILL_LIST\n- **$s**"
  fi
done

cat > "$INSTALL_REPORT.tmp" << REPORT_EOF
# 🦞 Lobster Farmer — Install Report

**Product:** $PRODUCT
**Installed:** $(date '+%Y-%m-%d %H:%M:%S')
**Workspace:** $WORKSPACE

## ✅ Installed Files
$(for f in "${INSTALLED_FILES[@]:-}"; do echo "- $f"; done)

## ⏭ Skipped (your existing files preserved)
$(if [ ${#SKIPPED_FILES[@]} -gt 0 ]; then for f in "${SKIPPED_FILES[@]}"; do echo "- $f"; done; else echo "- (none)"; fi)

## 🎯 New Skills
$(echo -e "$SKILL_LIST")

## 📋 What To Do Next

### 1. Personalize Your Agent
Edit these files to match your style:
- \`USER.md\` — Tell your agent about yourself (name, goals, preferences)
- \`SOUL.md\` — Your agent's personality (sharp? warm? degen? professional?)
- \`IDENTITY.md\` — Your agent's name and identity

### 2. Review New Versions (if you had existing files)
$(if [ ${#SKIPPED_FILES[@]} -gt 0 ]; then echo "We preserved your existing config. New versions saved as \`.lobster-new\` files."; echo "Compare and merge what you like:"; for f in "${SKIPPED_FILES[@]}"; do fname=$(echo "$f" | cut -d' ' -f1); echo "- \`diff $fname ${fname}.lobster-new\`"; done; else echo "Fresh install — no merge needed!"; fi)

### 3. Restart Your Agent
Your agent will pick up the new skills on the next session. If running:
\`\`\`
openclaw gateway restart
\`\`\`

---
*🦞 养虾户 / Lobster Farmer — lobsterfarmer.com*
REPORT_EOF

mv "$INSTALL_REPORT.tmp" "$INSTALL_REPORT"

# --- Summary ---
echo ""
log "Installation complete! ✅"
echo ""
echo -e "  ${CYAN}Files installed:${NC}  ${#INSTALLED_FILES[@]}"
echo -e "  ${CYAN}Files skipped:${NC}   ${#SKIPPED_FILES[@]}"
echo -e "  ${CYAN}New skills:${NC}      ${#NEW_SKILLS[@]}"
if [ ${#NEW_SKILLS[@]} -gt 0 ]; then
  for s in "${NEW_SKILLS[@]}"; do
    echo -e "    ${GREEN}+ $s${NC}"
  done
fi
echo ""
echo -e "  ${CYAN}Install report:${NC} $INSTALL_REPORT"
echo -e "  ${CYAN}Backup:${NC}         ${BACKUP_DIR:-none}"
echo ""

# --- Generate message for the agent to read ---
cat << 'AGENT_MSG'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🦞 INSTALL COMPLETE — READ INSTALL_REPORT.md

Hey! A new Lobster Farmer package was just installed.
Please read INSTALL_REPORT.md and tell your human:

1. What new skills you learned
2. What they should personalize (USER.md, SOUL.md)
3. Any recommended next steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AGENT_MSG
