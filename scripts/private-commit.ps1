<#
  Commits pending changes in every private app repo (apps/<name>/ with its own .git,
  gitignored from the monorepo root) using the same message. Opt-in only — never run
  automatically by a git hook, since a private app can have unrelated WIP at any given
  moment. Usage: pnpm private:commit -- -Message "your message"
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Message
)

$appsDir = Join-Path $PSScriptRoot "..\apps"
$privateApps = Get-ChildItem -Path $appsDir -Directory -ErrorAction SilentlyContinue | Where-Object {
  Test-Path (Join-Path $_.FullName ".git")
}

if (-not $privateApps -or $privateApps.Count -eq 0) {
  Write-Host "No private app repos found under apps/*."
  exit 0
}

foreach ($app in $privateApps) {
  Push-Location $app.FullName
  try {
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
      Write-Host "[$($app.Name)] nothing to commit, skipping."
      continue
    }
    Write-Host "[$($app.Name)] committing changes..."
    git add -A
    git commit -m $Message
  } finally {
    Pop-Location
  }
}
