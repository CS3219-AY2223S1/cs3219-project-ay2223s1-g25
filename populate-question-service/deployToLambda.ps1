$zipFile = "function.zip"
$functionName = "CS3219-Populate-Question"

if (Test-Path -Path $zipFile -PathType Leaf) {
    Write-Output "Removing old $zipFile file..."
    Remove-Item $zipFile
}

Compress-Archive -Path .\* -DestinationPath $zipFile

aws lambda update-function-code --function-name $functionName --zip-file fileb://$zipFile