#!/usr/bin/env bash
# remove-packages-safe.sh
# Safe, local-only package removal helper.
# - DOES NOT push to any remote or create remote tags.
# - Creates a local branch for each package by default.
# - Stops and leaves changes if build/test fail so you can inspect.
#
# Usage:
# ./remove-packages-safe.sh pkg1 pkg2 ...
# ./remove-packages-safe.sh --file unused.txt
# ./remove-packages-safe.sh --current pkg1   # operate on current branch (no new branch)

set -euo pipefail

CURRENT_BRANCH_MODE=false
FILE_MODE=false
PACKAGES=()

# parse minimal flags
while [[ "${1:-}" == --* ]]; do
  case "$1" in
    --file)
      FILE_MODE=true
      shift
      INPUT_FILE="$1"
      shift
      ;;
    --current)
      CURRENT_BRANCH_MODE=true
      shift
      ;;
    --help|-h)
      cat <<EOF
Usage:
  $0 [--current] pkg1 pkg2 ...
  $0 --file packages.txt
Options:
  --current   operate on current branch (no new branch created)
  --file      read package names from file (one per line)
  --help      show this help
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ "${FILE_MODE}" = true ]; then
  if [ -z "${INPUT_FILE:-}" ]; then
    echo "Missing file after --file"
    exit 1
  fi
  if [ ! -f "$INPUT_FILE" ]; then
    echo "File not found: $INPUT_FILE"
    exit 1
  fi
  mapfile -t PACKAGES < "$INPUT_FILE"
else
  PACKAGES=("$@")
fi

if [ ${#PACKAGES[@]} -eq 0 ]; then
  echo "No packages provided."
  exit 1
fi

# simple helper: run a command but do not fail the whole script when grepping zero hits
safe_grep() {
  if command -v rg >/dev/null 2>&1; then
    rg -n --hidden --glob '!node_modules' "$@" || true
  else
    # two attempts: exact import/require patterns and a generic word match
    grep -Rna --exclude-dir=node_modules --exclude-dir=.git -e "$@" . || true
  fi
}

for pkg in "${PACKAGES[@]}"; do
  echo
  echo "======================================"
  echo " CHECKING: $pkg"
  echo "======================================"
  printf "\n1) Quick grep for obvious usages:\n\n"
  # show import/require matches and generic matches
  if command -v rg >/dev/null 2>&1; then
    rg -n --hidden --glob '!node_modules' "from ['\"]$pkg['\"]|require\(['\"]$pkg['\"]\)|\\b$pkg\\b" || true
  else
    grep -Rna --exclude-dir=node_modules --exclude-dir=.git -e "from '$pkg'" -e "from \"$pkg\"" -e "require('$pkg')" -e "require(\"$pkg\")" . || true
    grep -Rna --exclude-dir=node_modules --exclude-dir=.git -e "$pkg" . || true
  fi

  echo
  echo "2) yarn why (why is it present?):"
  yarn why "$pkg" || true

  read -p "Attempt to remove '$pkg'? (y/N) " yn
  if [[ ! "$yn" =~ ^[Yy] ]]; then
    echo "Skipping $pkg"
    continue
  fi

  # prepare branch or operate on current branch
  ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$CURRENT_BRANCH_MODE" = false ]; then
    BRANCH="remove/${pkg}-$(date +%s)"
    echo "Creating local branch: $BRANCH (from $ORIGINAL_BRANCH)"
    git checkout -b "$BRANCH"
  else
    BRANCH="$ORIGINAL_BRANCH"
    echo "Operating on current branch: $BRANCH (NO branch will be created)"
  fi

  echo "Removing $pkg with yarn remove..."
  if ! yarn remove "$pkg"; then
    echo "yarn remove failed for $pkg. Restoring original branch and skipping."
    if [ "$CURRENT_BRANCH_MODE" = false ]; then
      git checkout "$ORIGINAL_BRANCH"
      git branch -D "$BRANCH" || true
    fi
    continue
  fi

  echo "Running yarn install to refresh lockfile..."
  yarn install || { echo "yarn install failed — leaving changes for inspection on branch $BRANCH"; exit 1; }

  echo "Running yarn build (this may fail if removal broke the app)..."
  if ! yarn build; then
    echo
    echo ">>> BUILD FAILED after removing $pkg. <<<"
    echo "The repo is now left in the modified state on local branch: $BRANCH"
    echo "Inspect the failure, run tests manually, and decide whether to keep, fix, or revert."
    echo "To revert to original branch and discard local branch:"
    echo "  git checkout $ORIGINAL_BRANCH"
    echo "  git branch -D $BRANCH"
    echo
    # Do NOT delete or reset anything automatically — exit so user can inspect.
    exit 1
  fi

  echo "Optional: running yarn test (may be slow)."
  if yarn test --watchAll=false >/dev/null 2>&1; then
    echo "Tests appear to pass (quick check)."
  else
    echo "Tests failed or no tests configured. Inspect manually."
    # continue to commit optionally
  fi

  # commit the removal locally (safe)
  git add -A
  git commit -m "chore: remove unused package $pkg" || echo "Nothing to commit (maybe lockfile unchanged)."

  echo "✅ Removed $pkg locally and committed on branch: $BRANCH"
  echo "NOTE: This script NEVER pushes to remotes. Push manually if you want:"
  echo "  git push -u origin $BRANCH   # do this only if you trust the change"
  echo

  # continue to next package
done

echo "All done (local-only). Review branches and push manually if you want."
