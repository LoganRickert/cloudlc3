
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG   x3000

	; Print prompt
prompt	LD R0 arrow
	OUT
B_stop	LD R0 space
	OUT

	; Get user input and print it out
start	GETC
	OUT

	; If enter, print prompt again
	LD R1 enter
	NOT R1 R1
	add R1 R1 #1
	add R0 R0 R1
	BRz prompt

	; Not enter, just get next character
	BRnzp start

	HALT

	; Variables
arrow	.fill x3e
space	.fill x20
enter	.fill x0d

        .END
`
    }
]
