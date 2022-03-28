<?php

function decodeHeidisql($hex) {
	$string	= '';
	$shift 	= substr($hex, -1, 1);
	$hex 	= substr($hex, 0, -1);
	for($i=0;$i<strlen($hex); $i += 2) {
		$string .= chr(intval(substr($hex, $i, 2), 16)-$shift);
	}
	return $string;
}

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
	
	$line = explode('\\', $line);
	

	$name_value = explode('<|||>', $line[count($line)-1]);
	
	if(in_array($name_value[0], $interesting_rows)) {
		unset($line[count($line)-1]);
		unset($line[0]);

		//sanitize
		$search = ['ä', 'ö', 'ü', 'ß'];
        $replace = ['ae', 'oe', 'ue', 'ss'];
        $key = str_replace($search, $replace, strtolower(implode('/', $line)));
        $key = preg_replace('/^\W$/','_',$key);

		$data[$key][$name_value[0]] =( $name_value[0] == 'Password' ? htmlentities(decodeHeidisql(trim($name_value[2]))) : trim($name_value[2]));
	}
}

//echo "<pre>",json_encode($data,JSON_PRETTY_PRINT)."</pre>";
//extract($data, EXTR_SKIP);

render('table.php', [
	'data' => $data,
	'table_header' => array_keys($data[array_key_first($data)]),
]);
