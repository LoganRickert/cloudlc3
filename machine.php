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
                                <button onclick="clearBreakPoints()">Clear BPs</button>
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
                                <button onclick="next()">Next</button>
                                <button onclick="run()">Run</button>
                                <button onclick="go()">Go</button>
                                <button onclick="reset()">Reset</button>
                                <button onclick="hardReset()">Full Reload</button>
                                </p>
                                <p><label>Default PC: <input id="register-unit-default-pc" type="text" placeholder="x3000"></label></p>
                                <p><label>Run Speed (ms): <input id="register-unit-default-run" type="text" placeholder="1000" value="50" class="short"></label></p>
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
            <div class="bottom-calc">
                <div>
                    <h1 id="calcheader">Converter</h1>
                    <form id="calcform">
                        <label>Decimal</label>
                        <input id="cbase10" name="base10" value="0" maxlength="6">
                        <label>Hex</label>
                        <input id="cbase16" name="base16" value="0" maxlength="6">
                        <label>2's Hex</label>
                        <input id="cbase16n" name="base16n" value="0" maxlength="6">
                        <label>ASCII</label>
                        <input id="cbasea" name="basea" value="0" maxlength="2">
                        <label>Binary</label>
                        <input id="cbase2" name="base2" value="0" maxlength="16">
                    </form>
                </div>
            </div>
            <div class="bottom-ref">
                <div>
                    <h1 id="refheader">Quick Reference</h1>
                    <ul id="reflist">
                        <li>ADD* DR, SR1, [SR2|x5]
                            <div>
                                <h2>ADD</h2>
                                <p>The ADD instruction takes the second and third
                                arguments and adds them together. The result is
                                stored in the first argument. Immediate must be
                                between #-16 and #15. Sets the CC.</p>
                                <p>Operation:</p>
                                <p>DR = SR1 + (SR2 || SEXT(imm5))</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>ADD R0 R0 R1</li>
                                    <li>ADD R2 R1 #5</li>
                                    <li>ADD R5 R0 x3</li>
                                    <li>ADD R7 R3 #-3</li>
                                </ul>
                            </div>
                        </li>
                        <li>AND* DR, SR1, [SR2|x5]
                            <div>
                                <h2>Bit-Wise AND</h2>
                                <p>The AND instruction takes the second and third
                                arguments and ands them together. The result is
                                stored in the first argument. Immediate must be
                                between #-16 and #15. Sets the CC.</p>
                                <p>Operation:</p>
                                <p>DR = SR1 & (SR2 || SEXT(imm5))</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>AND R0 R0 R1</li>
                                    <li>AND R2 R1 #5</li>
                                    <li>AND R5 R0 x3</li>
                                    <li>AND R7 R3 #-3</li>
                                </ul>
                            </div>
                        </li>
                        <li>NOT* DR, SR
                            <div>
                                <h2>Bit-Wise NOT</h2>
                                <p>NOT* DR, SR</p>
                                <p>The NOT instruction takes the source register,
                                nots the value, and stores the result in the
                                destination register. Sets the CC.</p>
                                <p>Operation:</p>
                                <p>DR = !SR</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>NOT R0 R0</li>
                                </ul>
                            </div>
                        </li>
                        <li>LEA* DR, PCoffset9
                            <div>
                                <h2>Load Effective Address</h2>
                                <p>The LEA instruction takes the program counter
                                and the PCoffset value and adds them together. The
                                value is loaded into the destination register.</p>
                                <p>Operation:</p>
                                <p>DR = PC + SEXT(PCoffset9)</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>LEA R4 #0</li>
                                    <li>LEA R1 x4</li>
                                    <li>LEA R4 label</li>
                                </ul>
                            </div>
                        </li>
                        <li>LD* DR, PCoffset9
                            <div>
                                <h2>Load</h2>
                                <p>The LD instruction takes the program counter
                                and the PCoffset value and adds them together. The
                                value in the memory address at the result of the
                                add is stored in the destination register. Sets
                                the CC.</p>
                                <p>Operation:</p>
                                <p>DR = mem[PC + SEXT(PCoffset9)]</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>LD R0 #10</li>
                                    <li>LD R3 x2</li>
                                    <li>LD R7 #-5</li>
                                    <li>LD R1 label</li>
                                </ul>
                            </div>
                        </li>
                        <li>LDR* DR, BaseR, offset6
                            <div>
                                <h2>Load Register</h2>
                                <p>The LDR instruction takes the base register
                                and the offset value and adds them together. The
                                value in the memory address at the result of the
                                add is stored in the destination register. Sets
                                the CC.</p>
                                <p>Operation:</p>
                                <p>DR = mem[BaseR + SEXT(offset6)]</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>LDR R0 R1 #0</li>
                                    <li>LDR R1 R0 x4</li>
                                    <li>LDR R4 R4 label</li>
                                </ul>
                            </div>
                        </li>
                        <li>LDI* DR, PCoffset9
                            <div>
                                <h2>Load Indirect</h2>
                                <p>The LDI instruction takes the base register
                                and the offset value and adds them together. The
                                value in the memory address at the result of the
                                add is used as the pointer to a second memory
                                address. The value at that second memory address is stored
                                in the destination. Sets the CC.</p>
                                <p>Operation:</p>
                                <p>DR = mem[mem[BaseR + SEXT(offset6)]]</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>LDI R4 #0</li>
                                    <li>LDI R1 x4</li>
                                    <li>LDI R4 label</li>
                                </ul>
                            </div>
                        </li>
                        <li>ST SR, PCoffset9
                            <div>
                                <h2>Store</h2>
                                <p>The ST instruction takes the program counter
                                and the PCoffset value and adds them together. The
                                value in the memory address at the result of the
                                add is set to the value in the source register.</p>
                                <p>Operation:</p>
                                <p>mem[PC + SEXT(PCoffset9)] = SR</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>ST R0 #10</li>
                                    <li>ST R3 x2</li>
                                    <li>ST R7 #-5</li>
                                    <li>ST R1 label</li>
                                </ul>
                            </div>
                        </li>
                        <li>STR SR, BaseR, offset6
                            <div>
                                <h2>Store Register</h2>
                                <p>The STR instruction takes the base register
                                and the offset value and adds them together. The
                                value in the memory address at the result of the
                                add is set to the value in the source register.</p>
                                <p>Operation:</p>
                                <p>mem[BaseR + SEXT(offset6)] = SR</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>STR R0 R1 #0</li>
                                    <li>STR R1 R0 x4</li>
                                    <li>STR R4 R4 label</li>
                                </ul>
                            </div>
                        </li>
                        <li>STI SR, PCoffset9
                            <div>
                                <h2>Store Indirect</h2>
                                <p>The STI instruction takes the base register
                                and the offset value and adds them together. The
                                value in the memory address at the result of the
                                add is used as the pointer to a second memory
                                address. The value at that second memory address
                                is set to the value in the source register.</p>
                                <p>Operation:</p>
                                <p>mem[mem[BaseR + SEXT(offset6)]] = SR</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>STI R4 #0</li>
                                    <li>STI R1 x4</li>
                                    <li>STI R4 label</li>
                                </ul>
                            </div>
                        </li>
                        <li>BR[n|z|p] PCoffset9
                            <div>
                                <h2>Branch</h2>
                                <p>The BR instruction branch jumps to another
                                location in memory if the condition codes are
                                met. To get the new program counter, the pcoffset
                                is added to the current program counter. Instructions
                                with a * next to them set the condition codes. n = 
                                negative, z = zero, p = positive. If the CC is not
                                met, nothing happens.</p>
                                <p>Operation:</p>
                                <p>PC = PC + SEXT(PCoffset9)</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>BRn label</li>
                                    <li>BRnp label</li>
                                    <li>BRzp #5</li>
                                    <li>BRp label</li>
                                    <li>BRnzp x5</li>
                                </ul>
                            </div>
                        </li>
                        <li>JMP BaseR
                            <div>
                                <h2>Jump</h2>
                                <p>The JMP instruction sets the program counter to
                                the value of the base register. JMP R7 and RET are
                                the same command.</p>
                                <p>Operation:</p>
                                <p>PC = BaseR</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>JMP R1</li>
                                </ul>
                            </div>
                        </li>
                        <li>JSR PCoffset11
                            <div>
                                <h2>Jump to Subroutine</h2>
                                <p>The JSR instruction sets register 7 to the value
                                of the program counter. It then sets the program
                                counter to the value of the program counter plus
                                PCoffset11.</p>
                                <p>Operation:</p>
                                <p>R7 = PC</p>
                                <p>PC = PC + SEXT(Poffset11)</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>JSR main</li>
                                    <li>JSR x4</li>
                                    <li>JSR #-10</li>
                                </ul>
                            </div>
                        </li>
                        <li>JSRR BaseR
                            <div>
                                <h2>Jump to Subroutine</h2>
                                <p>The JSRR instruction sets register 7 to the value
                                of the program counter. It then sets the program
                                counter to the value of the program counter plus
                                the value in the base register.</p>
                                <p>Operation:</p>
                                <p>R7 = PC</p>
                                <p>PC = PC + BaseR</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>JSRR R6</li>
                                </ul>
                            </div>
                        </li>
                        <li>TRAP trapvector8
                            <div>
                                <h2>System Call</h2>
                                <p>The TRAP instruction makes a system call. The
                                program counter is stored in register 7. The starting
                                location of the trap is stored at mem[vector8]. The
                                program counter is set to the value in this address.</p>
                                <p>Operation:</p>
                                <p>R7 = PC</p>
                                <p>PC = mem[ZEXT(vect8)]</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>TRAP x23</li>
                                    <li>IN</li>
                                    <li>OUT</li>
                                    <li>PUTS</li>
                                    <li>IN</li>
                                    <li>PUTSP</li>
                                    <li>HALT</li>
                                </ul>
                            </div>
                        </li>
                        <li>RET
                            <div>
                                <h2>Return</h2>
                                <p>The RET instruction takes the program counter
                                and loads it into register 7. Used to return from
                                a JSR.</p>
                                <p>Operation:</p>
                                <p>DR = PC + SEXT(PCoffset9)</p>
                                <p>Examples:</p>
                                <ul>
                                    <li>RET</li>
                                </ul>
                            </div>
                        </li>
                    </ul>
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