
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG x3000
        
        ;; --------\\ Bootstrap \\-------- ;;

        LD R5 STK_PTR
        LD R6 STK_PTR

        JSR MAIN            ; Call main
        JSR POP             ; Pop return value from main

        HALT

STK_PTR .FILL x4000         ; Stack Pointer

        ;; --------/ Bootstrap /-------- ;;

MAIN    ; int main() {

        ;; --------\\ Program \\-------- ;;
        ;; print("> ");
        ;; 
        ;; int buffsize = 16;
        ;; int buffpointer = 0;
        ;; bool continue = true;
        ;; char nextChar;
        ;; 
        ;; while (continue) {
        ;;     nextChar = IN();
        ;;     
        ;;     if (nextChar == '\\n' or nextChar == ' ') {
        ;;         nextChar = NULL;
        ;;         continue = false;
        ;;     }
        ;; 
        ;;     buffer[buffpointer] = nextChar;
        ;;     buffpointer += 1;
        ;; }
        ;; 
        ;; // Capitalize all letter.
        ;; upper(buffer);
        ;; 
        ;; print(buffer);
        ;; --------/ Program /-------- ;;

        ;; --------\\ Stack \\-------- ;;
        ;; | continue              | ;; #-19 | R6 - Stack Pointer
        ;; | nextChar              | ;; #-18
        ;; | buffpointer           | ;; #-17
        ;; | buffsize              | ;; #-16
        ;; | buffer[0]             | ;; #-15
        ;; | buffer[1]             | ;; #-14
        ;; | buffer[2]             | ;; #-13
        ;; | buffer[3]             | ;; #-12
        ;; | buffer[4]             | ;; #-11
        ;; | buffer[5]             | ;; #-10
        ;; | buffer[6]             | ;; #-9
        ;; | buffer[7]             | ;; #-8
        ;; | buffer[8]             | ;; #-7
        ;; | buffer[9]             | ;; #-6
        ;; | buffer[10]            | ;; #-5
        ;; | buffer[11]            | ;; #-4
        ;; | buffer[12]            | ;; #-3
        ;; | buffer[13]            | ;; #-2
        ;; | buffer[14]            | ;; #-1
        ;; | buffer[15]            | ;; #0 | R5 - Frame Pointer
        ;; | Frame Pointer (R5)    | ;;
        ;; | Return Address (R7)   | ;;
        ;; | Return Value          | ;; #3
        ;; | -- Bottom of Stack -- | ;;
        ;; --------/ Stack /-------- ;;

        ;; --------\\ Build Stack Frame  \\-------- ;;
        ;|                                        |;
        ;| Push slot Return Value                 |;
           ADD R6 R6 #-1        ; PUSH            ;|
        ;|                                        |;
        ;| Push Return Address.                   |;
           ADD R6 R6 #-1        ; PUSH            |;
           STR R7 R6 #0         ; Store Return Address
        ;|                                        |;
        ;| Push Frame Pointer                     |;
           ADD R0 R5 #0         ; Store R5 in R0  |;
           JSR PUSH             ; Push Frame Pointer
        ;|                                        |;
        ;| Set Frame Pointer                      |;
        ;| R5 = R6 - 1                            |;
           ADD R5 R6 #-1        ; Set R5 to R6 minus 1
        ;|                                        |;
        ;| Allocate space for 19 variables        |;
           LD R0 NUMN19          ; Add only supports +15 so we store 19
           ADD R6 R6 R0                           ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_MAIN
        ; print("> ")
        LEA R0 PROMPT
        PUTS                ; Display "> "

        ; int buffsize = 16
        LD R0 NUM16         ; Add only supports +15 so we store 16
        ADD R0 R0 #0
        STR R0 R5 #-16

        ; int buffpointer = 0
        AND R0 R0 #0
        STR R0 R5 #-17

        ; bool continue = true
        AND R0 R0 #0
        ADD R0 R0 #1
        STR R0 R5 #-19

        ; while (continue) {
MAINWHILE1
        LDR R0 R5 #-19      ; Load 'continue'
        BRz MAINWHILE1E     ; If 'continue' == false, quit loop

        ; nextChar = IN()
        IN          ; Get next character
        STR R0 R5 #-18      ; Store character

MAINIF1
        ; if (nextChar == '\\n' or nextChar == ' ') {
        LDR R0 R5 #-18      ; Load nextChar
        LD R1 CR            ; Load \\n
        ADD R0 R0 R1        ; Compare
        BRnp MAINIF1E       ; If not equal, end.
        BRz MAINIF1B        ; Char is \\n, so skip to if body

        LDR R0 R5 #-18      ; Load nextChar
        LD R1 SPACE         ; Load space
        ADD R0 R0 R1        ; Compare
        BRnp MAINIF1E       ; If not equal, end.

MAINIF1B
                ; // Write newline to end of buffer
                ; nextChar = x0
                AND R0 R0 #0    ; Get x0
                STR R0 R5 #-18  ; Store x0 at buffer[buffpointer]

                ; continue = false;
                AND R0 R0 #0    ; false
                STR R0 R5 #-19  ; Set continue to false
MAINIF1E
        ; } // end if

        ; buffer[buffpointer] = nextChar;
        ; -- // buffer[buffpointer]
        AND R0 R0 #0        ; Store address of buffer in R0
        ADD R0 R5 #-15      ; Get address of buffer
        LDR R1 R5 #-17      ; Load buffpointer
        ADD R0 R0 R1        ; Move buffer down by buffpointer

        ; -- // nextChar
        LDR R1 R5 #-18      ; Load nextChar

        ; -- // assignment
        STR R1 R0 #0        ; Store nextChar at buffer[buffpointer]

        ; buffpointer += 1;
        LDR R0 R5 #-17      ; Load buffpointer
        ADD R0 R0 #1        ; Add 1
        STR R0 R5 #-17      ; Store result in buffpointer

        BRnzp MAINWHILE1

MAINWHILE1E
        ;} // end while

        ; upper(buffer, buffpointer);
        LDR R0 R5 #-17      ; Load buffpointer
        JSR PUSH            ; Push buffpointer

        AND R0 R0 #0        ; Store address of buffer in R0
        ADD R0 R5 #-15      ; Get address of buffer
        JSR PUSH            ; Push buffer

        JSR UPPER           ; Call function
        JSR POP             ; Pop the return value

        ; -- // Clean up upper
        ADD R6 R6 #2        ; Pop 2 parameters

        ; print(buffer);
        AND R0 R0 #0        ; Store address of buffer in R0
        ADD R0 R5 #-15      ; Get address of buffer
        PUTS                ; Print out buffer

        ;; --------\\ Tear Down Stack Frame  \\-------- ;;
        ;|                                            |;
        ;| Deallocate space 19 variables              |;
           LD R0 NUM19                                ;|
           ADD R6 R6 R0                               ;|
        ;|                                            |;
        ;| Pop Frame Pointer                          |;
           JSR POP               ; Pop Frame Pointer  |;
           ADD R5 R0 #0          ; Set Frame Pointer  |;
        ;|                                            |;
        ;| Pop Return Address                         |;
           JSR POP               ; Pop Return Address |;
           ADD R7 R0 #0          ; Set Return Address |;
        ;|                                            |;
        ;; --------/ Tear Down Stack Frame  /-------- ;;

        RET

PROMPT  .STRINGZ "> "
CR      .FILL x-D
SPACE   .FILL x-20
NUM16   .FILL #16
NUMN19  .FILL #-19
NUM19   .FILL #19

        ; } // End of main()

UPPER   ; void upper(char* buffer, int length) {

        ;; --------\\ Program \\-------- ;;
        ;; length -= 2; // length used as index.
        ;;              // -1 for zero indexed and -1 for ignore NULL
        ;; 
        ;; while (length >= 0) {
        ;;     char C = buffer[length];
        ;;
        ;;     if (C >= 'a' and C <= 'z') {
        ;;         C = C - 32;
        ;;         buffer[length] = C;
        ;;     }
        ;;
        ;;     length -= 1;
        ;; }
        ;; --------/ Program /-------- ;;

        ;; --------\\ Stack \\-------- ;;
        ;; | C                     | ;; #0 | R5 - FP / R6 - SP
        ;; | Frame Pointer (R5)    | ;;
        ;; | Return Address (R7)   | ;;
        ;; | Return Value          | ;; #3
        ;; | *buffer               | ;; #4
        ;; | length                | ;; #5
        ;; | -- Bottom of Stack -- | ;;
        ;; --------/ Stack /-------- ;;

        ;; --------\\ Build Stack Frame  \\-------- ;;
        ;|                                        |;
        ;| Push slot Return Value                 |;
           ADD R6 R6 #-1        ; PUSH            ;|
        ;|                                        |;
        ;| Push Return Address.                   |;
           ADD R6 R6 #-1        ; PUSH            |;
           STR R7 R6 #0         ; Store Return Address
        ;|                                        |;
        ;| Push Frame Pointer                     |;
           ADD R0 R5 #0         ; Store R5 in R0  |;
           JSR PUSH             ; Push Frame Pointer
        ;|                                        |;
        ;| Set Frame Pointer                      |;
        ;| R5 = R6 - 1                            |;
           ADD R5 R6 #-1        ; Set R5 to R6 minus 1
        ;|                                        |;
        ;| Allocate space for 1 variables         |;
           ADD R6 R6 #-1                           ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

        ; length -= 2;
        LDR R0 R5 #5            ; Load length
        ADD R0 R0 #-2           ; Subtract 1
        STR R0 R5 #5            ; Store result

UPPERWHILE1
        ; while (length > 0) {
        LDR R0 R5 #5
        BRn UPPERWHILE1E

        ; char C = buffer[length];
        ; -- // buffer[length]
        LDR R0 R5 #4            ; Load buffer starting address
        LDR R1 R5 #5            ; Load length
        ADD R0 R0 R1            ; Add buffer offset
        LDR R0, R0, #0

        ; -- // C = buffer[length]
        STR R0 R5 #0

UPPERIF1        
        ; if (C >= 'a' and C <= 'z') {
        LDR R0 R5 #0            ; Load C
        LD R1 ASCIIA            ; Load 'a'
        ADD R0 R0 R1            ; Compare
        BRn UPPERIF1E

        LDR R0 R5 #0            ; Load C
        LD R1 ASCIIZ            ; Load 'z'
        ADD R0 R0 R1            ; Compare
        BRp UPPERIF1E

                ; C = C - 32;
                ; -- // C - 32
                LDR R0 R5 #0    ; Load C
                LD R1 NUMN32    ; Load -32
                ADD R0 R0 R1    ; Subtract
                
                ; -- // C = [result]
                STR R0 R5 #0    ; Store result into C

                ; buffer[length] = c;
                ; -- // buffer[length]
                LDR R0 R5 #4            ; Load buffer starting address
                LDR R1 R5 #5            ; Load length
                ADD R0 R0 R1            ; Add buffer offset
                
                ; -- // C
                LDR R1 R5 #0            ; Load C
                
                ; -- // buffer[length] = [result]
                STR R1 R0 #0            ; Save result

UPPERIF1E
        ; } // end if 1

        ; length -= 1;
        LDR R0 R5 #5            ; Load length
        ADD R0 R0 #-1           ; Subtract 1
        STR R0 R5 #5            ; Store result

        BRnzp UPPERWHILE1

UPPERWHILE1E
        ; } // end while 1

        ;; --------\\ Tear Down Stack Frame  \\-------- ;;
        ;|                                            |;
        ;| Deallocate space 1 variables               |;
           ADD R6 R6 #1                               ;|
        ;|                                            |;
        ;| Pop Frame Pointer                          |;
           JSR POP               ; Pop Frame Pointer  |;
           ADD R5 R0 #0          ; Set Frame Pointer  |;
        ;|                                            |;
        ;| Pop Return Address                         |;
           JSR POP               ; Pop Return Address |;
           ADD R7 R0 #0          ; Set Return Address |;
        ;|                                            |;
        ;; --------/ Tear Down Stack Frame  /-------- ;;

        RET

ASCIIA  .FILL x-61
ASCIIZ  .FILL x-7A
NUMN32  .FILL #-32

        ; } // End of upper()

;; ========== Sub-routines ========== ;;

PUSH    ADD R6 R6 #-1
        STR R0 R6 #0
        RET

POP     LDR R0 R6 #0
        ADD R6 R6 #1
        RET

        .END
`
    }
]
