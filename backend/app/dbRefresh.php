<?php
// echo "hi";

public function refreshdata() {
    $this->layout = "";

    ini_set('memory_limit', '512M');
    set_time_limit(0);

    //ENTER THE RELEVANT INFO BELOW
    $mysqlDatabaseName = 'jbsoftwarels_job_board_script';
    $mysqlUserName = 'jbsoftwarels';
    $mysqlPassword = 'Ntv*3?2%^xnS';
    $mysqlHostName = 'localhost';
    $mysqlImportFilename = BASE_PATH . '/jbsoftwarels_job_board_script.sql';

    mysql_connect($mysqlHostName, $mysqlUserName, $mysqlPassword) or die('Error connecting to MySQL server: ' . mysql_error());
    // Select database
    mysql_select_db($mysqlDatabaseName) or die('Error selecting MySQL database: ' . mysql_error());

    $sql = "SHOW TABLES FROM $mysqlDatabaseName";
    if ($result = mysql_query($sql)) {
        /* add table name to array */
        while ($row = mysql_fetch_row($result)) {
            $found_tables[] = $row[0];
        }
    } else {
        die("Error, could not list tables. MySQL Error: " . mysql_error());
    }

    /* loop through and drop each table */
    foreach ($found_tables as $table_name) {
        $sql = "DROP TABLE $mysqlDatabaseName.$table_name";
        if ($result = mysql_query($sql)) {
            //echo "Success - table $table_name deleted.";
        }
    }

    //DONT EDIT BELOW THIS LINE
    //Export the database and output the status to the page
    $command = 'mysql -h' . $mysqlHostName . ' -u' . $mysqlUserName . ' -p' . $mysqlPassword . ' ' . $mysqlDatabaseName . ' < ' . $mysqlImportFilename;
    exec($command, $output = array(), $worked);
    //   print_r($output);
    switch ($worked) {
        case 0:
            echo '<br>Successfully imported to database <b>' . $mysqlDatabaseName . '</b>';
            break;
        case 1:
            echo 'There was an error during import. Please make sure the import file is saved in the same folder as this script and check your values:<br/><br/><table><tr><td>MySQL Database Name:</td><td><b>' . $mysqlDatabaseName . '</b></td></tr><tr><td>MySQL User Name:</td><td><b>' . $mysqlUserName . '</b></td></tr><tr><td>MySQL Password:</td><td><b>NOTSHOWN</b></td></tr><tr><td>MySQL Host Name:</td><td><b>' . $mysqlHostName . '</b></td></tr><tr><td>MySQL Import Filename:</td><td><b>' . $mysqlImportFilename . '</b></td></tr></table>';
            break;
    }
    exit;
}
?>

