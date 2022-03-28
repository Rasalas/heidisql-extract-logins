<?php

/**
 * decode the hexadecimal representation of the heidiSQL database password
 * @source https://gist.github.com/trevorbicewebdesign/6b747ba8e00a2e9f8001
 * 
 * @param string $hex the hexadecimal representation of the password
 * @return string the decoded password
 */
function decodeHeidisql($hex) {
	$string	= '';
	$shift 	= substr($hex, -1, 1);
	$hex 	= substr($hex, 0, -1);
	for($i=0;$i<strlen($hex); $i += 2) {
		$string .= chr(intval(substr($hex, $i, 2), 16)-$shift);
	}
	return $string;
}

/**
 * render a view
 * 
 * @param string $view the file name of the view to render
 * @param array $data your accociative array with data to be displayed in the view
 */
function render($view, $args = [])
{
    extract($args, EXTR_SKIP);
    $file = "Views/$view";
    if (is_readable($file)) {
        require $file;
    } else {
        die("$file not found");
    }
}

$interesting_rows = ['Password', 'User', 'Host', 'Port',];

$file_contents = file_get_contents('heidisql_backup.txt');

$data = [];

foreach(explode("\n", $file_contents) as $line) {
	
	// separate the elements of the URI (Servers\folder\subfolder\{key}<|||>{?}<|||>{value}) 
	$line = explode('\\', $line);
	
	// get the key and value
	$name_value = explode('<|||>', $line[count($line)-1]);
	
	// if the key is in the interesting list, add it to the data array
	if(in_array($name_value[0], $interesting_rows)) {
		unset($line[count($line)-1]);
		unset($line[0]);

		// sanitize
		$search = ['ä', 'ö', 'ü', 'ß'];
        $replace = ['ae', 'oe', 'ue', 'ss'];
        $key = str_replace($search, $replace, strtolower(implode('/', $line)));
        $key = preg_replace('/^\W$/','_',$key);

		$data[$key][$name_value[0]] =( $name_value[0] == 'Password' ? htmlentities(decodeHeidisql(trim($name_value[2]))) : trim($name_value[2]));
	}
}

// render the table
render('table.php', [
	'data' => $data,
	'table_header' => array_keys($data[array_key_first($data)]),
]);
