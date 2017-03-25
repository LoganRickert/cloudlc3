var codeFiles = [
    {
        name: "main.asm",
        code: `

	.ORIG   x3000

	; Pick a number
picknum	LDI R0 rand
	AND R0 R0 #7
	ADD R0 R0 #1

	; Store the picked number
	ST R0 num

	; Print welcome message
welc	LEA R0 msg1
	PUTS
	LD R0 enter
	OUT
tryagan	LEA R0 msg2
	PUTS
	LD R0 enter
	OUT

	; Print prompt
prompt	LD R0 arrow
	OUT
	LD R0 space
	OUT

	; Get user input and print it out
getnum	GETC
	OUT

	; Convert from ASCII to int
	LD R1 zero
	NOT R1 R1
	ADD R1 R1 #1
	ADD R0 R0 R1

	; Check if they guessed correct.
	LD R1 num
	NOT R1 R1
	ADD R1 R1 #1
	ADD R0 R0 R1

	Brnp wrong

	; Answer is correct
correct LD R0 enter
	OUT
	LEA R0 msg3
	PUTS
	LD R0 enter
	OUT
	OUT
	Brnzp picknum

	; Answer is wrong
wrong	LD R0 enter
	OUT
	LEA R0 msg4
	PUTS
	LD R0 enter
	OUT
	OUT
	Brnzp tryagan

	HALT

	; Variables
arrow	.fill x3e ; ">"
space	.fill x20 ; " "
enter	.fill x0d ; "\\n"
zero	.fill x30 ; "0"
num	.fill x0
rand	.fill xFE20
msg1	.stringz "Welcome to the game!"
msg2	.stringz "Guess a number between 1 and 8!"
msg3	.stringz "You guessed correct! Play again!"
msg4	.stringz "You guessed wrong!"

        .END
`
    }
]
