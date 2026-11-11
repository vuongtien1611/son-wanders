Add-Type -AssemblyName System.Drawing
$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$parentDir = Split-Path -Parent $currentDir
$srcFile = Join-Path $parentDir "website_download\images\collection-purple-room.jpg"
$destFile = Join-Path $parentDir "website_download\images\room-purple-clean.jpg"

$item = Get-Item -LiteralPath $srcFile
$bmp = [System.Drawing.Bitmap]::FromFile($item.FullName)
Write-Host "Image Size: $($bmp.Width) x $($bmp.Height)"

$rect = [System.Drawing.Rectangle]::FromLTRB(48, 114, 406, 554)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$cropped.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()
$cropped.Dispose()
Write-Host "Successfully saved: $destFile"
