<?PHP
    echo file_get_contents('src/header.html');
?>
            <div class="wrapper">
                <h1>Program #1</h1>
                <div class="w50 left">
                    <section id="memory">
                        <h2>Memory</h2>
                        <div class="unit">
                            <div class="unit-header">
                                <label>Jump: <input id="memory-unit-jump" type="text" placeholder="x3000"></label>
                                <p>
                                <button onclick="shiftMemory(-1)">&cuwed;</button>
                                <button onclick="shiftMemory(-8)">&cuwed;&cuwed;</button>
                                <button onclick="shiftMemory(1)">&cuvee;</button>
                                <button onclick="shiftMemory(8)">&cuvee;&cuvee;</button>
                                <button onclick="setMemoryToPC()">PC</button>
                                <button onclick="togglePredict()">Predict</button>
                                </p>
                            </div>
                            <div class="unit-body">
                                <table id="memory-unit-memory">
                                    <tr>
                                        <th></th>
                                        <th>Addr</th>
                                        <th>Label</th>
                                        <th>Hex</th>
                                        <th>Instruction</th>
                                    </tr>
                                    <tr>
                                        <td><button id="memory-unit-breakpoint">Br</button></td>
                                        <td>x3000</td>
                                        <td>Start</td>
                                        <td>x0000</td>
                                        <td>NOP</td>
                                    </tr>
                                    <tr>
                                        <td><button id="memory-unit-breakpoint">Br</button></td>
                                        <td>x3001</td>
                                        <td>Ready</td>
                                        <td>x0000</td>
                                        <td>NOP</td>
                                    </tr>
                                    <tr>
                                        <td><button id="memory-unit-breakpoint">Br</button></td>
                                        <td>x3002</td>
                                        <td>Go</td>
                                        <td>x0000</td>
                                        <td>NOP</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="unit-footer">
                                <button onclick="shiftMemory(-1)">&cuwed;</button>
                                <button onclick="shiftMemory(-8)">&cuwed;&cuwed;</button>
                                <button onclick="shiftMemory(1)">&cuvee;</button>
                                <button onclick="shiftMemory(8)">&cuvee;&cuvee;</button>
                                <button onclick="setMemoryToPC()">PC</button>
                                <button onclick="followPC()">Follow</button>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="w50 right">
                    <section id="status">
                        <h2>Status</h2>
                        <div class="unit">
                            <div class="unit-header">
                                Registers
                            </div>
                            <div class="unit-body">
                                <table id="register-unit-register">
                                </table>
                            </div>
                            <div class="unit-footer">
                                <p>
                                <button onclick="step()">Step</button>
                                <button onclick="run()">Run</button>
                                <button onclick="reset()">Reset</button>
                                <button onclick="hardReset()">Hard Load</button>
                                </p>
                                <p><label>Default PC: <input id="register-unit-default-pc" type="text" placeholder="x3000"></label></p>
                                <p><label>Run Speed (ms): <input id="register-unit-default-run" type="text" placeholder="1000" value="100" class="short"></label></p>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="w100">
                    <section id="gui">
                        <h2>Graphical User Interface</h2>
                        <div class="unit">
                            <div class="unit-body gui">
                                <canvas id="gui-output" width="512" height="288"></canvas>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="w100">
                    <section id="console">
                        <h2>Console</h2>
                        <div class="unit">
                            <div class="unit-body console">
                                <textarea id="console-output"></textarea>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="w100">
                    <section id="codeFiles">
                        <h2>Files</h2>
                    </section>
                    <section class="middle ounit">
                            <button onclick="appendFile()">Add File</button>
                    </section>
                </div>
            </div>
            <?PHP
                // Yes, this is bad practice. It's just super temp.
                $program = htmlspecialchars($_GET['program']);
                
                if (!$program) $program = "default";
                
                echo "<script src='programs/$program.js'></script>";
            ?>
<?PHP
    echo file_get_contents('src/mfooter.html');
?>