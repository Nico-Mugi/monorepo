# Kills any leftover Vite/Wrangler dev-server processes for this monorepo.
#
# Backgrounded `pnpm dev` / `vite dev` processes can survive their parent
# shell being stopped, leaving dev ports (3000-3010) and CF inspector ports
# (9229-9239) locked, which makes the next `pnpm dev` fail with EADDRINUSE.
#
# Usage: pnpm kill-dev

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path

$procs = Get-CimInstance Win32_Process -Filter "Name='node.exe' OR Name='workerd.exe'" |
    Where-Object {
        $_.CommandLine -and
        $_.CommandLine -like "*$repoRoot*" -and
        $_.CommandLine -match 'vite|wrangler'
    }

if (-not $procs) {
    Write-Host "No leftover dev-server processes found."
    exit 0
}

foreach ($p in $procs) {
    Write-Host "Killing PID $($p.ProcessId): $($p.CommandLine)"
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
}
