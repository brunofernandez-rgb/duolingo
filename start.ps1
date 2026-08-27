$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "backend"
$frontendPath = Join-Path $root "frontend"
$backendVenvPython = Join-Path $backendPath "venv\Scripts\python.exe"
$frontendModules = Join-Path $frontendPath "node_modules"

function Find-FrontendCommand {
    $bun = Get-Command bun -ErrorAction SilentlyContinue
    if ($bun) {
        return $bun.Source
    }

    $npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if ($npm) {
        return $npm.Source
    }

    $npmCandidates = @(
        (Join-Path ${env:ProgramFiles} "nodejs\npm.cmd"),
        (Join-Path ${env:LOCALAPPDATA} "Programs\nodejs\npm.cmd"),
        (Join-Path ${env:APPDATA} "npm\npm.cmd")
    )

    foreach ($npmPath in $npmCandidates) {
        if (Test-Path $npmPath) {
            return $npmPath
        }
    }

    throw "No se encontro Node.js/npm ni Bun. Instala Node.js LTS y vuelve a ejecutar este script."
}

if (-not (Test-Path $backendPath)) {
    throw "No se encontró la carpeta backend."
}

if (-not (Test-Path $frontendPath)) {
    throw "No se encontró la carpeta frontend."
}

if (Test-Path $backendVenvPython) {
    $backendCommand = "& '$backendVenvPython' -m uvicorn src.app:app --reload --host 0.0.0.0 --port 8000"
} else {
    $backendCommand = "python -m uvicorn src.app:app --reload --host 0.0.0.0 --port 8000"
}

$npmPath = Find-FrontendCommand
$nodePath = Split-Path -Parent $npmPath
$frontendCommand = if (Test-Path $frontendModules) {
    "`$env:Path = '$nodePath;' + `$env:Path; & '$npmPath' run dev -- --host 0.0.0.0"
} else {
    "`$env:Path = '$nodePath;' + `$env:Path; Write-Host 'Instalando dependencias del frontend...' -ForegroundColor Yellow; & '$npmPath' install; if (`$LASTEXITCODE -ne 0) { exit `$LASTEXITCODE }; & '$npmPath' run dev -- --host 0.0.0.0"
}

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    "Set-Location -LiteralPath '$backendPath'; Write-Host 'Backend: http://localhost:8000/docs' -ForegroundColor Cyan; $backendCommand"
)

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    "Set-Location -LiteralPath '$frontendPath'; Write-Host 'Frontend: http://localhost:5173' -ForegroundColor Cyan; $frontendCommand"
)

Write-Host "Backend y frontend iniciados en terminales separadas." -ForegroundColor Green