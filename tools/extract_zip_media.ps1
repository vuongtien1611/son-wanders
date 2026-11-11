Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\Admin\Documents\sơn myhouse\Sơn WANDERS.xlsx')
$count = 0
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like 'xl/media/*') {
        Write-Host "$($entry.FullName) | $($entry.Length) bytes"
        $count++
    }
}
Write-Host "Total media entries in Excel: $count"
$zip.Dispose()

