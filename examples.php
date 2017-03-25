<?PHP

    $examples = array(
        array("name" => "Text Prompt", "file" => "default"),
        array("name" => "Draw A Line", "file" => "basicgui"),
        array("name" => "Guessing Game", "file" => "guessgame"),
    );
    
    echo file_get_contents('src/header.html');
?>
            <div class="wrapper">
                <div class="wrapper">
                <h1>Cloud LC3</h1>
                <section class="content">
                    <ul class="infolist">
                        <?PHP
                            foreach($examples as $ex) {
                                echo "<li><a href='machine.php?program=" . $ex['file'] . "'>" . $ex['name'] . "</a></li>";
                            }
                        ?>
                    </ul>
                </section>
            </div>
<?PHP
    echo file_get_contents('src/footer.html');
?>