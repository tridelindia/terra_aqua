@echo off

:: Title of the script

title Fetch System Details in JSON
 
:: Fetch details

for /f "tokens=2 delims==" %%A in ('wmic computersystem get name /value') do set "COMPUTER_NAME=%%A"

for /f "tokens=2 delims==" %%A in ('wmic cpu get processorid /value') do set "PROCESSOR_ID=%%A"

for /f "tokens=2 delims==" %%A in ('wmic bios get serialnumber /value') do set "BIOS_SERIAL=%%A"

for /f "tokens=2 delims==" %%A in ('wmic diskdrive where "MediaType='Fixed hard disk media'" get serialnumber /value') do set "DISK_SERIAL=%%A"

for /f "tokens=2 delims==" %%A in ('wmic nic where "NetEnabled=True" get macaddress /value') do set "MAC_ADDRESS=%%A"

for /f "tokens=2 delims==" %%A in ('wmic os get caption /value') do set "OS_NAME=%%A"

for /f "tokens=2 delims==" %%A in ('wmic os get osarchitecture /value') do set "OS_ARCH=%%A"
 
:: Attempt to fetch SID using current username

for /f "tokens=2 delims==" %%A in ('wmic useraccount where name^="%USERNAME%" get sid /value') do set "SID=%%A"
 
:: If SID is still blank, fallback to get all user accounts and match the current username

if "%SID%"=="" (

    for /f "tokens=2,3 delims=," %%A in ('wmic useraccount get name^,sid /format:csv') do (

        if "%%A"=="%COMPUTERNAME%" (

            if "%%B"=="%USERNAME%" (

                set "SID=%%C"

            )

        )

    )

)
 
:: Format output as JSON

echo {^

"computerName": "%COMPUTER_NAME%",^

"userName": "%USERNAME%",^

"processorId": "%PROCESSOR_ID%",^

"biosSerial": "%BIOS_SERIAL%",^

"diskSerial": "%DISK_SERIAL%",^

"macAddress": "%MAC_ADDRESS%",^

"osName": "%OS_NAME%",^

"osArchitecture": "%OS_ARCH%",^

"sid": "%SID%"^

}

 