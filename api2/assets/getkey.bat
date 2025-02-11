@echo off

:: Fetch the API key from system environment variables

set API_KEY_FOR_TERRA=%API_KEY_FOR_TERRA%
 
:: Check if the variable is empty

if "%API_KEY_FOR_TERRA%"=="" (

    echo {"error": "API key not found in system environment variables."}

) else (

    echo {"apiKey": "%API_KEY_FOR_TERRA%"}

)
 
pause

 