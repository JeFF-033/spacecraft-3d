$response = Invoke-RestMethod -Uri 'https://api.github.com/search/code?q=filename:apartment.glb' -Headers @{'User-Agent'='Mozilla/5.0'}
$url = $response.items[0].html_url.Replace('github.com','raw.githubusercontent.com').Replace('/blob/','/')
Write-Host "Downloading from: $url"
Invoke-WebRequest -Uri $url -OutFile 'public/models/house-scan.glb'
