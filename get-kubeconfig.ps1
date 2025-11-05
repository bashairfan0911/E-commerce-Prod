# PowerShell script to get kubeconfig and encode it for GitHub

Write-Host "========================================" -ForegroundColor Green
Write-Host "Get Kubeconfig for GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Get kubeconfig from Kind
Write-Host "Getting kubeconfig from Kind cluster..." -ForegroundColor Yellow
$kubeconfigPath = "kind-kubeconfig.yaml"

try {
    kind get kubeconfig --name kind | Out-File -FilePath $kubeconfigPath -Encoding UTF8
    Write-Host "✓ Kubeconfig saved to: $kubeconfigPath" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get kubeconfig" -ForegroundColor Red
    Write-Host "  Make sure Kind cluster is running: kind get clusters" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Display kubeconfig
Write-Host "Kubeconfig content:" -ForegroundColor Cyan
Write-Host "-------------------" -ForegroundColor Gray
Get-Content $kubeconfigPath
Write-Host "-------------------" -ForegroundColor Gray
Write-Host ""

# Encode to base64
Write-Host "Encoding to base64 for GitHub..." -ForegroundColor Yellow
$kubeconfigContent = Get-Content $kubeconfigPath -Raw
$kubeconfigBytes = [System.Text.Encoding]::UTF8.GetBytes($kubeconfigContent)
$kubeconfigBase64 = [Convert]::ToBase64String($kubeconfigBytes)

# Save to file
$base64Path = "kubeconfig-base64.txt"
$kubeconfigBase64 | Out-File -FilePath $base64Path -Encoding ASCII -NoNewline

Write-Host "✓ Base64 encoded kubeconfig saved to: $base64Path" -ForegroundColor Green
Write-Host ""

# Display first 100 characters
Write-Host "Base64 preview (first 100 chars):" -ForegroundColor Cyan
Write-Host $kubeconfigBase64.Substring(0, [Math]::Min(100, $kubeconfigBase64.Length)) -ForegroundColor Gray
Write-Host "..." -ForegroundColor Gray
Write-Host ""

# Display instructions
Write-Host "========================================" -ForegroundColor Green
Write-Host "Next Steps" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. Copy the base64 content:" -ForegroundColor Yellow
Write-Host "   The file $base64Path will open in Notepad" -ForegroundColor White
Write-Host "   Select All (Ctrl+A) and Copy (Ctrl+C)" -ForegroundColor White
Write-Host ""

Write-Host "2. Add to GitHub Secrets:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/bashairfan0911/E-commerce-Prod/settings/secrets/actions" -ForegroundColor Cyan
Write-Host "   - Click 'New repository secret'" -ForegroundColor Cyan
Write-Host "   - Name: KUBE_CONFIG" -ForegroundColor Cyan
Write-Host "   - Value: Paste the copied base64 string" -ForegroundColor Cyan
Write-Host "   - Click 'Add secret'" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Add Razorpay secrets (optional):" -ForegroundColor Yellow
Write-Host "   If you don't have Razorpay keys, add placeholders:" -ForegroundColor White
Write-Host "   - Name: KEY_ID, Value: placeholder" -ForegroundColor Cyan
Write-Host "   - Name: KEY_SECRET, Value: placeholder" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. Push to trigger deployment:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'chore: add kubeconfig setup'" -ForegroundColor Cyan
Write-Host "   git push origin test-dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  IMPORTANT NOTE:" -ForegroundColor Red
Write-Host "Kind cluster runs locally on your machine." -ForegroundColor Yellow
Write-Host "GitHub Actions CANNOT access your local cluster." -ForegroundColor Yellow
Write-Host ""
Write-Host "This kubeconfig is useful for:" -ForegroundColor White
Write-Host "  ✓ Understanding the process" -ForegroundColor Green
Write-Host "  ✓ Testing locally" -ForegroundColor Green
Write-Host "  ✓ Manual deployments" -ForegroundColor Green
Write-Host ""
Write-Host "For GitHub Actions to work, you need:" -ForegroundColor White
Write-Host "  • Cloud cluster (AWS EKS, Google GKE, Azure AKS)" -ForegroundColor Cyan
Write-Host "  • Or expose local cluster (not recommended)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opening base64 file..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process notepad.exe $base64Path

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
