
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG   x3000

	; =========== MAIN ======================================;

	; int main() {

	; ---- Code ----
	; int a = 3;
	; int b = 5;
	; int c = opadd(a, b);
	; ---- /Code ----

	; Set our stack base pointer.
	LD R6 SBASE

	; int a = 3;
	LD R0 A		; Load A
	ADD R0 R0 #3	; Set A to 3
	ST R0 A		; Store results

	; int b = 5;
	LD R0 B		; Load B
	ADD R0 R0 #5	; Set B to 5
	ST R0 B		; Store results
	
	; int c = opadd(a, b);
	LD R0 A		; Push A onto stack
	JSR PUSH
	LD R0 B		; Push B onto stack
	JSR PUSH

	JSR OPADD	; Call opadd function
	JSR POP		; Get the result of opadd
	ST R0 C		; Store result of opadd into C

	HALT

A	.FILL x0
B	.FILL x0
C	.FILL x0

	; }

	; =========== OPADD ====================================;

OPADD	; int opadd(a, b) {

	; ---- Code ----
	; return a + b;
	; ---- /Code ----

	; Save Registers
	ST R1 BSAVR1
	ST R7 BSAVR7

	JSR POP		; Get B
	ADD R1 R0 #0	; -- Save B into R1
	JSR POP		; Get A
	ADD R0 R0 R1	; A + B

	JSR PUSH	; Push our result onto the stack

	; Restore Registers
	LD R1 BSAVR1
	LD R7 BSAVR7

	RET

BSAVR1	.FILL x0
BSAVR7	.FILL x0

	; }

	; =========== STACK FUNCTIONS ==========================;

PUSH	ST R1 ASAVR1

	; if (max + SP == 0) // Stack overflow
	LD R1 SMAX	; Load max variable
	ADD R1 R6 R1	; Chec if zero
	BRz SFAIL

	ADD R6 R6 #-1
	STR R0 R6 #0
	
	BRnzp SSUCC

POP	ST R1 ASAVR1

	; if (SP + empty - 1 == 0) // Stack underflow
	LD R1 SEMPTY	; Load base
	ADD R1 R1 #-1	; Go down one
	ADD R1 R6 R1	; Check if zero
	BRz SFAIL

	LDR R0 R6 #0
	ADD R6 R6 #1
	
	BRnzp SSUCC

SSUCC	LD R1 ASAVR1
	AND R5 R5 #0	; Success
	RET

SFAIL	LD R1 ASAVR1
	AND R5 R5 #0
	ADD R5 R5 #1	; Fail
	RET

SBASE	.FILL x4000	; Where the stack starts
SMAX	.FILL xC0FF	; Top of stack
			; This is 2 comp of x3FFE
SEMPTY	.FILL xC000	; Where the stack starts
			; This is 2 comp of x4000
ASAVR1	.FILL x0

        .END

`
    }
]
