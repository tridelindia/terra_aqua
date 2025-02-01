
const { sql } = require('../db');
const bcrypt = require('bcrypt');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Get all users
const getUsers = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM users`;
        res.json(result.recordset); // SQL Server returns result in `recordset`
    } catch (err) {
        res.status(500).send(err);
        
    }
};
const getRoles = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM roles`;
        res.json(result.recordset); // SQL Server returns result in `recordset`
    } catch (err) {
        res.status(500).send(err);
    }
};
const addRole = async (req, res) => {
    console.log('Received data:', req.body);
    const { role } = req.body;
    
    if (!role) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        const query = `INSERT INTO roles (role) VALUES (@role)`;
        const request = new sql.Request();
        request.input('role', sql.VarChar, role);

        const result = await request.query(query);
        res.status(201).json({
            status: 'success',
            message: 'Role added successfully',
        });
    } catch (error) {
        console.error('Database error:', error); // Changed 'err' to 'error'
        res.status(500).send(error);
    }
};


//designation add and get
const getdesignation = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM designation`;
        res.json(result.recordset); // SQL Server returns result in `recordset`
    } catch (err) {
        res.status(500).send(err);
    }
};
const adddesignation = async (req, res) => {
    console.log('Received data:', req.body);
    const { designation } = req.body;
    
    if (!designation) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        const query = `INSERT INTO designation (designation) VALUES (@designation)`;
        const request = new sql.Request();
        request.input('designation', sql.VarChar, designation);

        const result = await request.query(query);
        res.status(201).json({
            status: 'success',
            message: 'designation added successfully',
        });
    } catch (error) {
        console.error('Database error:', error); // Changed 'err' to 'error'
        res.status(500).send(error);
    }
};


// Register new user
const registerUser = async (req, res) => {
    console.log('Received data:', req.body); // Debugging

    const { name, username, role, designation, email, password } = req.body;
    if (!name || !username || !role || !designation || !email || !password) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // Hash the password before storing it
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users (name, username, role, designation, email, password) 
            VALUES (@name, @username, @role, @designation, @email, @password)
        `;

        // Prepare the statement
        const request = new sql.Request();
        request.input('name', sql.VarChar, name);
        request.input('username', sql.VarChar, username);
        request.input('role', sql.VarChar, role);
        request.input('designation', sql.VarChar, designation);
        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, hashedPassword);

        const result = await request.query(query);
        
        // Send a success response
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: result.rowsAffected[0],
            name,
            username,
            role,
            designation,
            email
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err);
    }
};


//edit user
const editUser = async (req, res) => {
    console.log('Received data for update:', req.body); // Debugging

    const { id, name, username, role, designation, email, password } = req.body;
    
    // Check for required fields
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Start building the update query
    let updateQuery = `UPDATE users SET`;
    const fields = [];
    const request = new sql.Request();

    // Add each field conditionally
    if (name) {
        fields.push(`name = @name`);
        request.input('name', sql.VarChar, name);
    }
    if (username) {
        fields.push(`username = @username`);
        request.input('username', sql.VarChar, username);
    }
    if (role) {
        fields.push(`role = @role`);
        request.input('role', sql.VarChar, role);
    }
    if (designation) {
        fields.push(`designation = @designation`);
        request.input('designation', sql.VarChar, designation);
    }
    if (email) {
        fields.push(`email = @email`);
        request.input('email', sql.VarChar, email);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push(`password = @password`);
        request.input('password', sql.VarChar, hashedPassword);
    }

    // If no fields to update, return error
    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    // Join fields with commas for SQL syntax
    updateQuery += ` ${fields.join(', ')} WHERE id = @id`;
    request.input('id', sql.Int, id);

    // Execute the query
    try {
        const result = await request.query(updateQuery);
        
        // Check if the update was successful
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({
                message: 'User updated successfully',
                id,
                updatedFields: req.body // to show what fields were attempted to update
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err);
    }
};



// Login user
const loginUser = async (req, res) => {
    console.log('recieved' ,req.body);
    const { userName, password } = req.body;


    if (!userName || !password) {
        return res.status(400).json({ message: 'Please provide both username and password' });
    }

    try {
        // Check for the user in the database
        const query = `SELECT * FROM users WHERE userName = @userName`;
        const request = new sql.Request();
        request.input('userName', sql.VarChar, userName);
        const result = await request.query(query);

        const user = result.recordset[0];

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const userWithoutPassword = {
            id: user.id,
            userName: user.userName,
            name: user.name,
            email: user.email,
            role: user.role,
            // Add other fields as needed, but exclude 'password'
        };
        // Return user data upon successful login
        res.json(
            userWithoutPassword
        );
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err);
    }
};


//save data
const saveSensorData = async (req, res) => {
    console.log('Received data:', req.body); // Debugging

    const {
        StationID,
        Date,
        Time,
        UTC_Time,
        LAT,
        LONG,
        BatteryVoltage,
        GPS_Date,
        S1_RelativeWaterLevel,
        S2_SurfaceCurrentSpeedDirection,
        Middle_CurrentSpeedDirection,
        Lower_CurrentSpeedDirection,
        Profile4,
        Profile5,
        Profile6,
        Profile7,
        Profile8,
        Profile9,
        Profile10,
        Profile11,
        Profile12,
        Profile13,
        Profile14,
        Profile15,
        Profile16,
        Profile17,
        Profile18,
        Profile19,
        Profile20,
        Profile21,
        Profile22,
        Profile23,
        Profile24,
        Profile25,
        Profile26,
        Profile27,
        Profile28,
        Profile29,
        Profile30,
        Profile31,
        Profile32,
        Profile33,
        Profile34,
        Profile35,
        Profile36,
        Profile37,
        Profile38,
        Profile39,
        Profile40
    } = req.body;

    // Validate input
    if (!StationID || !Date || !Time || !UTC_Time || !LAT || !LONG || !BatteryVoltage || !GPS_Date || !S2_SurfaceCurrentSpeedDirection || !Middle_CurrentSpeedDirection || !Lower_CurrentSpeedDirection || 
        !Profile4 || !Profile5 || !Profile6 || !Profile7 || !Profile8 || !Profile9 || !Profile10 || 
        !Profile11 || !Profile12 || !Profile13 || !Profile14 || !Profile15 || !Profile16 || !Profile17 || !Profile18 || !Profile19 || !Profile20 || !Profile21 || !Profile22 || !Profile23 || !Profile24 || 
        !Profile25 || !Profile26 || !Profile27 || !Profile28 || !Profile29 || !Profile30 || !Profile31 || 
        !Profile32 || !Profile33 || !Profile34 || !Profile35 || !Profile36 || !Profile37 || !Profile38 || 
        !Profile39 || !Profile40) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        // Convert numerical values to strings if necessary
        const stringLAT = String(LAT);
        const stringLONG = String(LONG);
        const stringBatteryVoltage = String(BatteryVoltage);
        const stringS1_RelativeWaterLevel = String(S1_RelativeWaterLevel);

        // Prepare the SQL query
        const query = `
            INSERT INTO db_terra_aqua.dbo.tb_cwprs_01 (
                StationID, [Date], [Time], UTC_Time, LAT, LONG, Battery_Voltage, GPS_Date, S1_RelativeWaterLevel, 
                S2_SurfaceCurrentSpeedDirection, Middle_CurrentSpeedDirection, Lower_CurrentSpeedDirection, 
                profile4, profile5, profile6, profile7, profile8, profile9, profile10,
                profile11, profile12, profile13, profile14, profile15, profile16, profile17, profile18, profile19, 
                profile20, profile21, profile22, profile23, profile24, profile25, profile26, profile27, profile28, 
                profile29, profile30, profile31, profile32, profile33, profile34, profile35, profile36, profile37, 
                profile38, profile39, profile40
            ) VALUES (
                @StationID, @Date, @Time, @UTC_Time, @LAT, @LONG, @BatteryVoltage, @GPS_Date, @S1_RelativeWaterLevel, 
                @S2_SurfaceCurrentSpeedDirection, @Middle_CurrentSpeedDirection, @Lower_CurrentSpeedDirection, 
                @Profile4, @Profile5, @Profile6, @Profile7, @Profile8, @Profile9, @Profile10,
                @Profile11, @Profile12, @Profile13, @Profile14, @Profile15, @Profile16, @Profile17, @Profile18, @Profile19, 
                @Profile20, @Profile21, @Profile22, @Profile23, @Profile24, @Profile25, @Profile26, @Profile27, @Profile28, 
                @Profile29, @Profile30, @Profile31, @Profile32, @Profile33, @Profile34, @Profile35, @Profile36, @Profile37, 
                @Profile38, @Profile39, @Profile40
            )
        `;

        const request = new sql.Request();
        request.input('StationID', sql.VarChar, StationID);
        request.input('Date', sql.VarChar, Date);
        request.input('Time', sql.VarChar, Time);
        request.input('UTC_Time', sql.VarChar, UTC_Time);
        request.input('LAT', sql.VarChar, stringLAT);
        request.input('LONG', sql.VarChar, stringLONG);
        request.input('BatteryVoltage', sql.VarChar, stringBatteryVoltage);
        request.input('GPS_Date', sql.VarChar, GPS_Date);
        request.input('S1_RelativeWaterLevel', sql.VarChar, stringS1_RelativeWaterLevel);
        request.input('S2_SurfaceCurrentSpeedDirection', sql.VarChar, '0.69;221.6'); // Static data, adjust as needed
        request.input('Middle_CurrentSpeedDirection', sql.VarChar, '0.71;249.3'); // Static data, adjust as needed
        request.input('Lower_CurrentSpeedDirection', sql.VarChar, '0.32;254.7'); // Static data, adjust as needed
        request.input('Profile4', sql.VarChar, Profile4);
        request.input('Profile5', sql.VarChar, Profile5);
        request.input('Profile6', sql.VarChar, Profile6);
        request.input('Profile7', sql.VarChar, Profile7);
        request.input('Profile8', sql.VarChar, Profile8);
        request.input('Profile9', sql.VarChar, Profile9);
        request.input('Profile10', sql.VarChar, Profile10);
        request.input('Profile11', sql.VarChar, Profile11);
        request.input('Profile12', sql.VarChar, Profile12);
        request.input('Profile13', sql.VarChar, Profile13);
        request.input('Profile14', sql.VarChar, Profile14);
        request.input('Profile15', sql.VarChar, Profile15);
        request.input('Profile16', sql.VarChar, Profile16);
        request.input('Profile17', sql.VarChar, Profile17);
        request.input('Profile18', sql.VarChar, Profile18);
        request.input('Profile19', sql.VarChar, Profile19);
        request.input('Profile20', sql.VarChar, Profile20);
        request.input('Profile21', sql.VarChar, Profile21);
        request.input('Profile22', sql.VarChar, Profile22);
        request.input('Profile23', sql.VarChar, Profile23);
        request.input('Profile24', sql.VarChar, Profile24);
        request.input('Profile25', sql.VarChar, Profile25);
        request.input('Profile26', sql.VarChar, Profile26);
        request.input('Profile27', sql.VarChar, Profile27);
        request.input('Profile28', sql.VarChar, Profile28);
        request.input('Profile29', sql.VarChar, Profile29);
        request.input('Profile30', sql.VarChar, Profile30);
        request.input('Profile31', sql.VarChar, Profile31);
        request.input('Profile32', sql.VarChar, Profile32);
        request.input('Profile33', sql.VarChar, Profile33);
        request.input('Profile34', sql.VarChar, Profile34);
        request.input('Profile35', sql.VarChar, Profile35);
        request.input('Profile36', sql.VarChar, Profile36);
        request.input('Profile37', sql.VarChar, Profile37);
        request.input('Profile38', sql.VarChar, Profile38);
        request.input('Profile39', sql.VarChar, Profile39);
        request.input('Profile40', sql.VarChar, Profile40);

        const result = await request.query(query);

        // Send response
        res.status(201).json({ message: 'Sensor data saved successfully', data: req.body });
        await axios.get('http://192.168.0.100:3000/api/split');
        console.log('Successfully triggered test API for tide and currents');
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Error saving data', error: err });
    }
};
const saveSensorData2 = async (req, res) => {
    console.log('Received data:', req.body); // Debugging

    const {
        StationID,
        Datee,
        Time,
        UTC_Time,
        LAT,
        LONG,
        BatteryVoltage,
        GPS_Date,
        S1_RelativeWaterLevel,
        S2_SurfaceCurrentSpeedDirection,
        Middle_CurrentSpeedDirection,
        Lower_CurrentSpeedDirection,
        Profile4,
        Profile5,
        Profile6,
        Profile7,
        Profile8,
        Profile9,
        Profile10,
        Profile11,
        Profile12,
        Profile13,
        Profile14,
        Profile15,
        Profile16,
        Profile17,
        Profile18,
        Profile19,
        Profile20,
        Profile21,
        Profile22,
        Profile23,
        Profile24,
        Profile25,
        Profile26,
        Profile27,
        Profile28,
        Profile29,
        Profile30,
        Profile31,
        Profile32,
        Profile33,
        Profile34,
        Profile35,
        Profile36,
        Profile37,
        Profile38,
        Profile39,
        Profile40
    } = req.body;

    // Validate input
    if (
        !StationID || !Datee || !Time || !UTC_Time || !LAT || !LONG ||
        !BatteryVoltage || !GPS_Date ||
        !S2_SurfaceCurrentSpeedDirection || !Middle_CurrentSpeedDirection ||
        !Lower_CurrentSpeedDirection || !Profile4 || !Profile5 || !Profile6 ||
        !Profile7 || !Profile8 || !Profile9 || !Profile10 ||
        !Profile11 || !Profile12 || !Profile13 || !Profile14 || !Profile15 || !Profile16 || !Profile17 || !Profile18 || !Profile19 ||
        !Profile20 || !Profile21 || !Profile22 || !Profile23 || !Profile24 || !Profile25 || !Profile26 || !Profile27 || !Profile28 ||
        !Profile29 || !Profile30 || !Profile31 || !Profile32 || !Profile33 || !Profile34 || !Profile35 || !Profile36 || !Profile37 ||
        !Profile38 || !Profile39 || !Profile40
    ) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        // Convert numerical values to strings if necessary
        const stringLAT = String(LAT);
        const stringLONG = String(LONG);
        const stringBatteryVoltage = String(BatteryVoltage);
        const stringS1_RelativeWaterLevel = String(S1_RelativeWaterLevel);

        // Create the dateTime object
        const dateTime = new Date(`${Datee}T${Time}`);
        if (isNaN(dateTime)) {
            throw new Error('Invalid dateTime format');
        }

        // Prepare the SQL query
        const query = `
            INSERT INTO db_terra_aqua.dbo.tb_cwprs_02 (
                StationID, [Date], [Time], UTC_Time, LAT, LONG, Battery_Voltage, GPS_Date, S1_RelativeWaterLevel, 
                S2_SurfaceCurrentSpeedDirection, Middle_CurrentSpeedDirection, Lower_CurrentSpeedDirection, 
                profile4, profile5, profile6, profile7, profile8, profile9, profile10,
                profile11, profile12, profile13, profile14, profile15, profile16, profile17, profile18, profile19, 
                profile20, profile21, profile22, profile23, profile24, profile25, profile26, profile27, profile28, 
                profile29, profile30, profile31, profile32, profile33, profile34, profile35, profile36, profile37, 
                profile38, profile39, profile40, dateTime
            ) VALUES (
                @StationID, @Date, @Time, @UTC_Time, @LAT, @LONG, @BatteryVoltage, @GPS_Date, @S1_RelativeWaterLevel, 
                @S2_SurfaceCurrentSpeedDirection, @Middle_CurrentSpeedDirection, @Lower_CurrentSpeedDirection, 
                @Profile4, @Profile5, @Profile6, @Profile7, @Profile8, @Profile9, @Profile10,
                @Profile11, @Profile12, @Profile13, @Profile14, @Profile15, @Profile16, @Profile17, @Profile18, @Profile19, 
                @Profile20, @Profile21, @Profile22, @Profile23, @Profile24, @Profile25, @Profile26, @Profile27, @Profile28, 
                @Profile29, @Profile30, @Profile31, @Profile32, @Profile33, @Profile34, @Profile35, @Profile36, @Profile37, 
                @Profile38, @Profile39, @Profile40, @dateTime
            )
        `;

        const request = new sql.Request();
        request.input('StationID', sql.VarChar, StationID);
        request.input('Date', sql.VarChar, Datee);
        request.input('Time', sql.VarChar, Time);
        request.input('UTC_Time', sql.VarChar, UTC_Time);
        request.input('LAT', sql.VarChar, stringLAT);
        request.input('LONG', sql.VarChar, stringLONG);
        request.input('BatteryVoltage', sql.VarChar, stringBatteryVoltage);
        request.input('GPS_Date', sql.VarChar, GPS_Date);
        request.input('S1_RelativeWaterLevel', sql.VarChar, stringS1_RelativeWaterLevel);
        request.input('S2_SurfaceCurrentSpeedDirection', sql.VarChar, S2_SurfaceCurrentSpeedDirection);
        request.input('Middle_CurrentSpeedDirection', sql.VarChar, Middle_CurrentSpeedDirection);
        request.input('Lower_CurrentSpeedDirection', sql.VarChar, Lower_CurrentSpeedDirection);
        request.input('Profile4', sql.VarChar, Profile4);
        request.input('Profile5', sql.VarChar, Profile5);
        request.input('Profile6', sql.VarChar, Profile6);
        request.input('Profile7', sql.VarChar, Profile7);
        request.input('Profile8', sql.VarChar, Profile8);
        request.input('Profile9', sql.VarChar, Profile9);
        request.input('Profile10', sql.VarChar, Profile10);
        request.input('Profile11', sql.VarChar, Profile11);
        request.input('Profile12', sql.VarChar, Profile12);
        request.input('Profile13', sql.VarChar, Profile13);
        request.input('Profile14', sql.VarChar, Profile14);
        request.input('Profile15', sql.VarChar, Profile15);
        request.input('Profile16', sql.VarChar, Profile16);
        request.input('Profile17', sql.VarChar, Profile17);
        request.input('Profile18', sql.VarChar, Profile18);
        request.input('Profile19', sql.VarChar, Profile19);
        request.input('Profile20', sql.VarChar, Profile20);
        request.input('Profile21', sql.VarChar, Profile21);
        request.input('Profile22', sql.VarChar, Profile22);
        request.input('Profile23', sql.VarChar, Profile23);
        request.input('Profile24', sql.VarChar, Profile24);
        request.input('Profile25', sql.VarChar, Profile25);
        request.input('Profile26', sql.VarChar, Profile26);
        request.input('Profile27', sql.VarChar, Profile27);
        request.input('Profile28', sql.VarChar, Profile28);
        request.input('Profile29', sql.VarChar, Profile29);
        request.input('Profile30', sql.VarChar, Profile30);
        request.input('Profile31', sql.VarChar, Profile31);
        request.input('Profile32', sql.VarChar, Profile32);
        request.input('Profile33', sql.VarChar, Profile33);
        request.input('Profile34', sql.VarChar, Profile34);
        request.input('Profile35', sql.VarChar, Profile35);
        request.input('Profile36', sql.VarChar, Profile36);
        request.input('Profile37', sql.VarChar, Profile37);
        request.input('Profile38', sql.VarChar, Profile38);
        request.input('Profile39', sql.VarChar, Profile39);
        request.input('Profile40', sql.VarChar, Profile40);
        request.input('dateTime', sql.DateTime, dateTime);

        const result = await request.query(query);

        // Send response
        res.status(201).json({ message: 'Sensor data saved successfully', data: req.body });
        await axios.get('http://192.168.0.100:3000/api/split');
        console.log('Successfully triggered test API for tide and currents');
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Error saving data', error: err });
    }
};



const test = async (req, res) => {
    try {
        const result = await sql.query`SELECT TOP 1 * FROM tb_cwprs_01 ORDER BY id DESC`;
        const data = result.recordset[0]; // Get the first record

        // Check if data exists
        if (data) {
            // Extract and format time
            const timeString = data.Time; 
            console.log("fetched time ==", timeString);
            const timee = new Date(timeString); // Use new Date()
            const formattedTime = timee.toISOString().substr(11, 8); // HH:MM:SS
            console.log("convetrted time ==", formattedTime);
            //  formattedTime += '.0000000';

            const utctime = data.UTC_Time;
            const utctimee = new Date(utctime); // Use new Date()
            const formattedUTCTime = utctimee.toISOString().substr(11, 8);

            // Extract and format date
            const dateString = data.Date;
            const datee = new Date(dateString); // Use new Date()
            const formattedDate = datee.toISOString().substr(0, 10); // YYYY-MM-DD

            // Print formatted date and time
            console.log('Formatted Date == ', formattedDate);
            console.log('Formatted Time == ', formattedTime);

            // Assign data to variables
            const StationID = data.StationID;
            const Time = formattedTime; // Use the formatted time
            const UTC_Time = formattedUTCTime; // Use formatted UTC time
            const LAT = String(data.LAT);
            const LONG = String(data.LONG);
            // const Battery_Voltage = String(data.BatteryVoltage); // Check if key matches
            const GPS_Date = String(data.GPS_Date);
            const S1_RelativeWaterLevel = String(data.S1_RelativeWaterLevel);
            const S2_SurfaceCurrentSpeedDirection = String(data.S2_SurfaceCurrentSpeedDirection);
            const Middle_CurrentSpeedDirection = String(data.Middle_CurrentSpeedDirection);
            const Lower_CurrentSpeedDirection = String(data.Lower_CurrentSpeedDirection);

            // Print each piece of data explicitly
            console.log(`Station ID == ${StationID}`);
            console.log(`Date == ${formattedDate}`);
            console.log(`Time == ${formattedTime}`);
            console.log(`UTC Time == ${formattedUTCTime}`);
            console.log(`Latitude == ${LAT}`);
            console.log(`Longitude == ${LONG}`);
            // console.log(`Battery Voltage == ${Battery_Voltage}`);
            console.log(`GPS Date == ${GPS_Date}`);
            console.log(`S1 Relative Water Level == ${S1_RelativeWaterLevel}`);
            console.log(`S2 Surface Current Speed Direction == ${S2_SurfaceCurrentSpeedDirection}`);
            console.log(`Middle Current Speed Direction == ${Middle_CurrentSpeedDirection}`);
            console.log(`Lower Current Speed Direction == ${Lower_CurrentSpeedDirection}`);

            // Save data to tide
            const tidequery = `
                INSERT INTO tide (
                    StationID, Date, [Time], LAT, LONG, S1_RelativeWaterLevel
                ) VALUES (
                    @StationID, @Date, @Time, @LAT, @LONG, @S1_RelativeWaterLevel
                )
            `;

            const currentquery = `
            INSERT INTO currents (
                StationID, Date, [Time], UTC_Time, LAT, LONG, S2_SurfaceCurrentSpeedDirection, Middle_CurrentSpeedDirection, Lower_CurrentSpeedDirection
            ) VALUES (
                @StationID, @Date, @Time, @UTC_Time, @LAT, @LONG, @S2_SurfaceCurrentSpeedDirection, @Middle_CurrentSpeedDirection, @Lower_CurrentSpeedDirection
            )
        `;

            const request = new sql.Request();
            request.input('StationID', sql.VarChar, StationID);
            request.input('Date', sql.Date, formattedDate);
            request.input('Time', sql.VarChar, formattedTime); // Use the formatted time
            request.input('UTC_Time', sql.VarChar, formattedUTCTime); // Use formatted UTC time
            request.input('LAT', sql.VarChar, LAT); // Convert to string
            request.input('LONG', sql.VarChar, LONG); // Convert to string
            request.input('S1_RelativeWaterLevel', sql.VarChar, S1_RelativeWaterLevel); // Convert to string

            // Exclude BatteryVoltage and other columns from the insert if they are not part of your INSERT statement
            // request.input('BatteryVoltage', sql.VarChar, Battery_Voltage);
            // request.input('GPS_Date', sql.VarChar, GPS_Date);
            request.input('S2_SurfaceCurrentSpeedDirection', sql.VarChar, S2_SurfaceCurrentSpeedDirection);
            request.input('Middle_CurrentSpeedDirection', sql.VarChar, Middle_CurrentSpeedDirection);
            request.input('Lower_CurrentSpeedDirection', sql.VarChar, Lower_CurrentSpeedDirection);

            try {
                const tideresult = await request.query(tidequery);
                const currentresult = await request.query(currentquery);
            } catch (error) {
                console.error("Error saving currents data: ", error);
                return res.status(500).json({ message: "Error saving currents data.", error: error.message });
            }
            // Send the data as a response after logging
            return res.json(data); // Send original data if needed, or format as required
        } else {
            return res.status(404).json({ message: "No data found." });
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).send(err); 
    }
};



//get all sensor data
const getSensors = async (req, res) => {
    const { fromDate, toDate } = req.query;

    // Validate the presence of both parameters
    if (!fromDate || !toDate) {
        return res.status(400).json({ message: 'fromDate and toDate are required.' });
    }

    try {
        console.log('Received fromDate:', fromDate);
        console.log('Received toDate:', toDate);

        // Define your queries for both tables
        const querySensorsData = `
            SELECT * 
            FROM tb_cwprs_01
            WHERE Date >= @fromDate AND Date <= @toDate
        `;

        const queryCWPRSData = `
            SELECT * 
            FROM tb_cwprs_02
            WHERE Date >= @fromDate AND Date <= @toDate
        `;

        const request = new sql.Request();
        request.input('fromDate', sql.DateTime, new Date(fromDate));
        request.input('toDate', sql.DateTime, new Date(toDate));

        // Log the parsed dates
        console.log('Parsed fromDate:', new Date(fromDate));
        console.log('Parsed toDate:', new Date(toDate));

        // Execute the first query for tb_cwprs_01
        const resultSensorsData = await request.query(querySensorsData);
        const data1 = resultSensorsData.recordset.reverse(); // Fetching and reversing order

        // Execute the second query for tb_cwprs_02
        const resultCWPRSData = await request.query(queryCWPRSData);
        const data2 = resultCWPRSData.recordset.reverse(); // Fetching and reversing order

        // Structure the response as required
        const response = {
            buoy1: data1,
            buoy2: data2
        };

        // Return the structured response
        res.json(response);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send(err);
    }
};


///getSensor two for report and analisys
//get all sensor data
const getSensorsTime = async (req, res) => {
        const { fromDate, toDate } = req.query;
    
        if (!fromDate || !toDate) {
            return res.status(400).json({ message: 'fromDate and toDate are required.' });
        }
    
        try {
            console.log('Received fromDate:', fromDate);
            console.log('Received toDate:', toDate);
    
            // Convert to local time if necessary
            const fromDateObj = toLocalDate(fromDate);
            const toDateObj = toLocalDate(toDate);
    
            console.log('Parsed fromDate (local):', fromDateObj);
            console.log('Parsed toDate (local):', toDateObj);
    
            const querySensorsData = `
                SELECT *
                FROM tb_cwprs_01
                WHERE (CAST(Date AS DATETIME) + CAST(Time AS DATETIME)) >= @fromDate
                  AND (CAST(Date AS DATETIME) + CAST(Time AS DATETIME)) <= @toDate
            `;
    
            const queryCWPRSData = `
                SELECT *
                FROM tb_cwprs_02
                WHERE (CAST(Date AS DATETIME) + CAST(Time AS DATETIME)) >= @fromDate
                  AND (CAST(Date AS DATETIME) + CAST(Time AS DATETIME)) <= @toDate
            `;
    
            const request = new sql.Request();
            request.input('fromDate', sql.DateTime, fromDateObj);
            request.input('toDate', sql.DateTime, toDateObj);
    
            const resultSensorsData = await request.query(querySensorsData);
            const data1 = resultSensorsData.recordset.reverse();
    
            const resultCWPRSData = await request.query(queryCWPRSData);
            const data2 = resultCWPRSData.recordset.reverse();
    
            res.json({
                buoy1: data1,
                buoy2: data2
            });
        } catch (err) {
            console.error('Error executing query:', err);
            res.status(500).send(err);
        }
    };
    
    const toLocalDate = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    };
    




//delete role
const deleteRole = async (req, res) => {
    const { id } = req.params; // Assuming you're getting the id from the URL parameters

    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }

    try {
        const query = `DELETE FROM roles WHERE id = @id`;
        const request = new sql.Request();
        request.input('id', sql.Int, id); // Make sure to match the data type with your database schema

        const result = await request.query(query);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send(error);
    }
};


const deleteUser =async(req, res) =>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const query = `DELETE FROM users WHERE id = @id`;
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    const result  = await request.query(query);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Designation not found' });
    }
    
        res.status(200).json({message: 'User deleted successfully'});
    
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send(error);
    }
    
}
//delete Designation

const DeleteDesignation = async (req, res) => {
    const { id } = req.params; // Assuming you're getting the id from the URL parameters

    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }

    try {
        const query = `DELETE FROM designation WHERE id = @id`;
        const request = new sql.Request();
        request.input('id', sql.Int, id); // Make sure to match the data type with your database schema

        const result = await request.query(query);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Designation not found' });
        }

        res.status(200).json({ message: 'Designation deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send(error);
    }
};


// module.exports = { saveSensorData };


//configurations

const updateConfigs = async (req, res) => {
    const { sensor_type, value, unit, above_warning, below_warning, above_danger, below_danger, bins, e_bins } = req.body;
    console.log("recieved data", req.body);
    // Update logic based on sensor type
    let query = '';
    let params = [];

    switch (sensor_type) {
        case 'tide':
            query = 'UPDATE configs SET value = @value, unit = @unit WHERE sensor_type = @sensor_type';
            params = [{ name: 'value', type: sql.VarChar, value }, { name: 'unit', type: sql.VarChar, value: unit }, { name: 'sensor_type', type: sql.VarChar, value: 'tide' }];
            break;
        
        case 'adcp':
            query = 'UPDATE configs SET unit = @unit, bins = @bins, e_bins = @e_bins WHERE sensor_type = @sensor_type';
            params = [
                { name: 'unit', type: sql.VarChar, value: unit }, 
                { name: 'sensor_type', type: sql.VarChar, value: 'adcp' },
                { name: 'bins', type: sql.VarChar, value: bins},
                { name: 'e_bins', type: sql.VarChar, value: e_bins}
            ];
            break;

        case 'battery':
            query = 'UPDATE configs SET above_warning = @above_warning, below_warning = @below_warning, above_danger = @above_danger, below_danger = @below_danger WHERE sensor_type = @sensor_type';
            params = [
                { name: 'above_warning', type: sql.Int, value: above_warning },
                { name: 'below_warning', type: sql.Int, value: below_warning },
                { name: 'above_danger', type: sql.Int, value: above_danger },
                { name: 'below_danger', type: sql.Int, value: below_danger },
                { name: 'sensor_type', type: sql.VarChar, value: 'battery' }
            ];
            break;

        default:
            return res.status(400).json({ message: 'Invalid sensor type' });
    }

    try {
        const request = new sql.Request();
        params.forEach(param => request.input(param.name, param.type, param.value));
        
        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'No data updated' });
        }

        res.json({ message: 'Sensor data updated successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'An error occurred while updating sensor data', error: err.message });
    }
};



//get configs
const getconfigs = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM configs`;
        res.json(result.recordset); // SQL Server returns result in `recordset`
    } catch (err) {
        res.status(500).send(err);
    }
};

//update station config


const updateStationConfig = async (req, res) => {
    console.log('Received update request with body:', req.body);
    const {station, station_name, warning_circle, danger_circle, geo_format, latitude_dd, longitude_dd, latitude_deg, latitude_min, latitude_sec, longitude_deg, longitude_min, longitude_sec } = req.body;

    // Validate the required fields
    if (!station_name || !geo_format) {
        return res.status(400).json({ message: 'Station name and geo_format are required' });
    }

    // Update logic based on geo_format (either 'DD' or 'DMS')
    let query = '';
    let params = [
        { name: 'station', type: sql.VarChar, value: station },
        { name: 'station_name', type: sql.VarChar, value: station_name },
        { name: 'warning_circle', type: sql.Float, value: warning_circle },
        { name: 'danger_circle', type: sql.Float, value: danger_circle },
        { name: 'geo_format', type: sql.VarChar, value: geo_format }
    ];

    if (geo_format === 'DD') {
        // Update for Decimal Degrees (DD)
        query = `UPDATE station_configurations 
                 SET station = @station, warning_circle = @warning_circle, danger_circle = @danger_circle, 
                 latitude_dd = @latitude_dd, longitude_dd = @longitude_dd, geo_format = @geo_format
                 WHERE station_name = @station_name`;

        params.push(
            { name: 'latitude_dd', type: sql.Float, value: latitude_dd },
            { name: 'longitude_dd', type: sql.Float, value: longitude_dd }
        );
    } else if (geo_format === 'DMS') {
        // Update for Degrees, Minutes, Seconds (DMS)
        query = `UPDATE station_configurations 
                 SET station = @station, warning_circle = @warning_circle, danger_circle = @danger_circle, 
                 latitude_deg = @latitude_deg, latitude_min = @latitude_min, latitude_sec = @latitude_sec,
                 longitude_deg = @longitude_deg, longitude_min = @longitude_min, longitude_sec = @longitude_sec, 
                 geo_format = @geo_format
                 WHERE station_name = @station_name`;

        params.push(
            { name: 'latitude_deg', type: sql.Int, value: latitude_deg },
            { name: 'latitude_min', type: sql.Int, value: latitude_min },
            { name: 'latitude_sec', type: sql.Float, value: latitude_sec },
            { name: 'longitude_deg', type: sql.Int, value: longitude_deg },
            { name: 'longitude_min', type: sql.Int, value: longitude_min },
            { name: 'longitude_sec', type: sql.Float, value: longitude_sec }
        );
    } else {
        return res.status(400).json({ message: 'Invalid geo_format. Must be "DD" or "DMS".' });
    }

    try {
        const request = new sql.Request();
        params.forEach(param => request.input(param.name, param.type, param.value));

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Station configuration not found' });
        }

        res.json({ message: 'Station configuration updated successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'An error occurred while updating the station configuration', error: error.message });
    }
};


//get Station configs
const getStationconfigs = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM station_configurations`;
        res.json(result.recordset); // SQL Server returns result in `recordset`
    } catch (err) {
        res.status(500).send(err);
    }
};



//logs
const addLog = async (req, res)=>{
    console.log('Received update request with body:', req.body);
    const {log} = req.body;

    if (!log) {
        return res.status(400).json({ message: 'log required' });
    }

    try {
        const query = `INSERT INTO logs (log) VALUES(@log)`;

        const request = new sql.Request();
            request.input('log', sql.VarChar, log);
            const result = await request.query(query);
            res.status(201).json({
                status: 'success',
                message: 'Log added successfully',
                logId: result.rowsAffected[0]
            })
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send(error);
    }
}




const support = async(req, res)=>{
    const batFilePath = path.join(__dirname, '../assets/key.bat');
 
  exec(batFilePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing .bat file: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
 
    try {
      // Parse batch output as JSON
      const deviceDetails = JSON.parse(stdout);
      res.json(deviceDetails);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError.message);
      res.status(500).json({ error: 'Failed to parse batch output as JSON' });
    }
  });
}


 
const setKeys = async (req, res) => {
    const apiKey = req.body;
    console.log("Received API key ==", apiKey.apiKey);
 
    // Check if the API key is provided
    if (!apiKey || !apiKey.apiKey) {
        return res.status(400).json({ message: 'Error: No API key provided.' });
    }
 
    try {
        // Create folder 'systems' in C drive if it doesn't exist
        const folderPath = path.join('C:', 'systems');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
 
        // Define the path of the text file where the API key will be saved
        const filePath = path.join(folderPath, 'apikey.txt');
 
        // Write the API key into the text file
        fs.writeFile(filePath, JSON.stringify(apiKey.apiKey), (err) => {
            if (err) {
                console.error('Error writing to file:', err.message);
                return res.status(500).json({
                    message: 'Failed to save API key to file.',
                    error: err.message,
                });
            }
 
            console.log('API key saved successfully!');
            return res.status(200).json({
                status: 'success',
                message: 'The API key has been saved to a file.',
                api_key: apiKey.apiKey,
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({
            message: 'An unexpected error occurred.',
            error: error.message,
        });
    }
};
 
 
const fetchKey = async (req, res) => {
    // Define the path of the text file where the API key is stored
    const folderPath = path.join('C:', 'systems');
    const filePath = path.join(folderPath, 'apikey.txt');
 
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'API key file not found.' });
    }
 
    // Read the API key from the file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err.message);
        return res.status(500).json({ message: 'Failed to read API key from file.', error: err.message });
      }
 
      // Return the API key
      res.json({ api_key: data });
    });
  };
 
 


module.exports = {
    addRole,
    getUsers,
    registerUser,
    loginUser,
    saveSensorData,
    getSensors,
    setKeys,
    support,
    fetchKey,
    getSensorsTime,
    getRoles,
    getdesignation,
    adddesignation,
    deleteRole,
    DeleteDesignation,
    test,
    saveSensorData2,
    updateConfigs,
    getconfigs,
    updateStationConfig,
    getStationconfigs,
    editUser,
    addLog,
    deleteUser
};


//sample body data format for savestationdata
// {
//     "StationID": "CWPRS01",
//     "Date": "2024-10-03",
//     "Time": "11:30:31",
//     "UTC_Time": "06:00:00",
//     "LAT": 12.90935941869516,
//     "LONG": 77.59784407291754,
//     "BatteryVoltage": 12.4,
//     "GPS_Date": "11:30:00",
//     "S1_RelativeWaterLevel": 2.5,
//     "S2_Bin1_Surface": 3.4,
//     "S2_Bin4_Middle": 2.1,
//     "S2_Bin7_Lower": 4.2
//   }
  