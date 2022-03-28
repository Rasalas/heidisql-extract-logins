<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table</title>
    <link rel="stylesheet" href="css/picocss/pico.min.css">
</head>

<body>
    <main>

        <table>
            <thead>
                <tr>
                    <th>Folder</th>
                    <?php foreach ($table_header as $key => $value) : ?>
                        <th><?= $value ?></th>
                    <?php endforeach; ?>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($data as $key => $value) : ?>
                    <tr>
                        <td><?=$key?></td>
                        <?php foreach ($value as $key2 => $value2) : ?>
                            <td><?php if(!empty($value2)):?><kbd style="background-color:var(--code-background-color);color:var(--code-color)"><?= $value2 ?></kbd><?php endif; ?></td>
                        <?php endforeach; ?>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</body>

</html>