
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG   x3000

	; Set our stack base pointer.
	LD R6 SBASE

	; We want to save 3 to the stack.
	ADD R0 R0 #3

	; Push our 3
	JSR PUSH

	; Clear R0
	AND R0 R0 #0	; Reset R0

	; Retrieve our 3
	JSR POP

	HALT

PUSH	ADD R6 R6 #-1
	STR R0 R6 #0
	RET

POP	LDR R0 R6 #0
	ADD R6 R6 #1
	RET

SBASE	.FILL x4000	; Where the stack starts

        .END


`
    }
]
