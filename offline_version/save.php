<?php
    $editor_data = $_POST[ 'editor1' ];
    $editor_data = str_replace(' ', '</span>
    	<span id="text^" onclick="changeColor(\'text^\'); return false;">', $editor_data);
    $editor_data = str_replace('<p>', '<span id="text^" onclick="changeColor(\'text^\'); return false;">', $editor_data);
    $editor_data = str_replace('</p>', '</span>', $editor_data);
    $count = 0;
    for ($i = 0; $i < strlen($editor_data); $i++) {
    	if ($editor_data[$i] == '^') {
    		$editor_data[$i] = $count / 2;
    		$count++;
    	}
    }
?>

<html>
<script>
var i = 0;
function changeColor(id) {
	if (i == 0) {
        document.getElementById(id).style.color = "red";
    }
	if (i == 1) {
		document.getElementById(id).style.color = "blue"
	};
	if (i == 2) {
		document.getElementById(id).style.color = "green"
	};
	i = (i + 1) % 3;
}
</script>

<p align="center"><font color="blue">Temporal</font></p>
<p align="center"><font color="green">Deontic</font></p>
<p align="center"><font color="red">Operational</font></p>
<?= $editor_data ?>

</html>