
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG   x3000

	; Set our stack base pointer.
	LD R6 SBASE

	; NOTE: Our stack can only hold 2 variables.

	; We want to save 3 to the stack.
	ADD R0 R0 #3

	; Push our 3 twice
	JSR PUSH
	JSR PUSH

	; Push our 3 a third time.
	; This push fails
	JSR PUSH

	; Clear R0
	AND R0 R0 #0	; Reset R0

	; Retrieve our 3 twice
	JSR POP
	JSR POP

	; Retrieve our 3 a third time
	; This pop fails
	JSR POP

	HALT

PUSH	ST R1 SAVR1

	; if (max + SP == 0) // Stack overflow
	LD R1 SMAX	; Load max variable
	ADD R1 R6 R1	; Chec if zero
	BRz SFAIL

	ADD R6 R6 #-1
	STR R0 R6 #0
	
	BRnzp SSUCC

POP	ST R1 SAVR1

	; if (SP + empty - 1 == 0) // Stack underflow
	LD R1 SEMPTY	; Load base
	ADD R1 R1 #-1	; Go down one
	ADD R1 R6 R1	; Check if zero
	BRz SFAIL

	LDR R0 R6 #0
	ADD R6 R6 #1
	
	BRnzp SSUCC

SSUCC	LD R1 SAVR1
	AND R5 R5 #0	; Success
	RET

SFAIL	LD R1 SAVR1
	AND R5 R5 #0
	ADD R5 R5 #1	; Fail
	RET

SBASE	.FILL x4000	; Where the stack starts
SMAX	.FILL xC002	; Top of stack
			; This is 2 comp of x3FFE
SEMPTY	.FILL xC000	; Where the stack starts
			; This is 2 comp of x4000
SAVR1	.FILL x0

        .END


`
    }
]
