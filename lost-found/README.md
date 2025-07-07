# M335








Remove-Item "$env:USERPROFILE\.gradle" -Recurse -Force
[System.Environment]::SetEnvironmentVariable("Path", "$env:Path;${env:JAVA_HOME}\bin", "User")
$env:JAVA_HOME
where java
java -version
C:\Users\a929920\Github\M335\android\local.properties
sdk.dir=C:\\Users\\a929920\\AppData\\Local\\Android\\Sdk


npm install @capacitor/android
$env:Path += ";C:\Users\a929920\AppData\Roaming\npm"
ionic serve  
ionic build
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap open android