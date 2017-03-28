
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG   x3000

	; The user enters in an array of numbers. When the user
	; enters a blank line, they are done entering the array.
	; Notes: don't worry about overflow.
	; 
	; Print out the sum of the array.

	; ============================================================ ;

	; Java solution
	;
	; int main() {
	; 	int sum, num;
	;	sum = 0; // Holds our sum.
	; 	num = next();
	;
	;	while (num > 0) {
	; 		sum += num;
	;		num = next();
	;	}
	;	
	;	print ("Your sum is: ");
	;	print (sum);
	;	print ("\\n");
	; }
	;
	; /**
	;  *  Returns int entered. '-1' if int was
	;  *  invalid. 
	;  */
	; int next() {
	;	char c;
	;	
	;	print("> ");
	;
	;	c = getC() - '0'; // GETC trap, subtract offset ASCII number to get integer.
	;
	;	if (c < 0) {
	;		c = -1;
	;	} else if (c > 9) {
	;		c = -1;
	;	}
	;
	;	return c;
	; }

	; ===================== MAIN ================================= ;

	; int main() {
	
	; sum = 0
	LD R0 SUM	; Load sum variable
	AND R0 R0 #0	; Set sum to 0
	ST R0 SUM	; Store our result.

	; num = next();
	LD R0 NUM	; Load num variable
	JSR NEXT	; Call function.
	ST R0 NUM	; Store our result.

	; While (num > 0) {
whle1	LD R0 NUM
	BRn whle1e
	
	; sum += num;
	LD R0 SUM
	LD R1 NUM
	ADD R0 R0 R1	; Add Num to Sum.
	ST R0 SUM	; Store our result.

	; num = next();
	LD R0 NUM	; Load num variable
	JSR NEXT	; Call function.
	ST R0 NUM	; Store our result.

	; Goto top of while loop.
	brnzp whle1

	; }

	; print ("Your sum is: ");
whle1e	LEA R0 STR1
	PUTS

	; print (sum);
	LD R0 SUM	; Load sum variable
	LD R1 ZERO	; Load ASCII zero offset We want to display
			; "3", not x0003.
	ADD R0 R0 R1	; Add ASCII offset. 
	OUT

	; print ("\\n");
	LD R0 CR	; Load new line
	OUT		;

	HALT
	
SUM	.BLKW #1
NUM	.BLKW #1

ZERO	.FILL x30	; "0"
CR	.FILL xD	; New line
STR1	.STRINGZ "Your sum is: "

	; }

	; ===================== NEXT ================================= ;

	; int next() {
NEXT	ST R1 SAVR1	; Save R1
	ST R7 SAVR7	; Save R7
	
	; print ("> ");
	LEA R0 PROMPT
	PUTS

	; c = getC() - '0';
	LD R0 C	; Load C variable
	GETC	; Get character from keyboard.
	OUT	; Print character

	LD R1 ZERO1	; Load '0'
	NOT R1 R1	; Inverse for subtraction
	ADD R1 R1 #1

	ADD R0 R0 R1	; Perform the subtraction

	ST R0 C		; Store our result

	; if (c < 0) {
	LD R0 C
	BRzp ELIF
	
	; C = -1;
	AND R0 R0 #0	; Clear R0
	ADD R0 R0 #-1	; Set R0 to -1
	ST R0 C		; Save -1 to C

	BRnzp ELIFE	; Go to end of if block
	
	; } else if (c > 9) {
ELIF	LD R0 C		; Load C variable
	ADD R0 R0 #-9	; Add -9 to C
	BRnz ELIFE

	; C = -1;
	AND R0 R0 #0	; Clear R0
	ADD R0 R0 #-1	; Set R0 to -1
	ST R0 C		; Save -1 to C

	; }

ELIFE	; Print "\\n"
	LD R0 CR1
	OUT

	; Load our return variable into R0
	LD R0 C

	; Load save registers
	LD R1 SAVR1
	LD R7 SAVR7

	RET

SAVR1	.BLKW #1
SAVR7	.BLKW #1

C	.BLKW #1

PROMPT	.STRINGZ "> "
ZERO1	.FILL x30	; "0"
CR1	.FILL xD	; "\\n"

        .END

`
    }
]
