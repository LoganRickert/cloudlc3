
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG x3000
        
        ;; --------\\ Boot \\-------- ;;

        LD R5 STK_PTR
        LD R6 STK_PTR

        JSR MAIN            ; Call main
        JSR POP             ; Pop return value from main

        HALT

STK_PTR .FILL x4000         ; Stack Pointer

        ;; --------/ Boot /-------- ;;

MAIN    ; int main() {

        ;; --------\\ Program \\-------- ;;
        ;; int A = 3;
        ;; int B = 7;
        ;; int C = addNum(A, B);
        ;; --------/ Program /-------- ;;

        ;; --------\\ Stack \\-------- ;;
        ;; | C                     | ;; #-2 | R6 - Stack Pointer
        ;; | B                     | ;; #-1
        ;; | A                     | ;; #0 | R5 - Frame Pointer
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
           ADD R5 R6 #-1        ; Set R5 to R6 minus
        ;|                                        |;
        ;| Allocate space for 3 variables         |;
           ADD R6 R6 #-3                          ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_MAIN   ; int A = 3;
        AND R0 R0 #0        ; Clear R0
        ADD R0 R0 #3        ; Set R0 = 3
        STR R0 R5 #0        ; Store 3 into A

        ; int B = 7;
        AND R0 R0 #0        ; Clear R0
        ADD R0 R0 #7        ; Set R0 = 7
        STR R0 R5 #-1       ; Store 7 into B

        ; int C = addNum(A, B);
        ; -- // addNum(A, B);
        LDR R0 R5 #-1       ; Load B
        JSR PUSH            ; Push B

        LDR R0 R5 #0        ; Load A
        JSR PUSH            ; Push A

        JSR ADDNUM          ; Call add
        
        ; -- // C = [addNum return value]
        JSR POP             ; R0 = return value of addNum
        STR R0 R5 #-2       ; Store return value in C

        ; -- // addNum cleanup.
        ADD R6 R6 #2        ; Pop A and B parameters (2 parameters).

        ;; --------\\ Tear Down Stack Frame  \\-------- ;;
        ;|                                            |;
        ;| Deallocate space 3 variables               |;
           ADD R6 R6 #3                               ;|
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

        ; } // End of main()

ADDNUM  ; int addNum(A, B) {

        ;; --------\\ Program \\-------- ;;
        ;; return A + B;
        ;; --------/ Program /-------- ;;

        ;; --------\\ Stack \\-------- ;;
        ;; | ----                  | ;; R5 - FP / R6 - SP
        ;; | Frame Pointer (R5)    | ;;
        ;; | Return Address (R7)   | ;;
        ;; | Return Value          | ;; #3
        ;; | A                     | ;; #4
        ;; | B                     | ;; #5
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
           ADD R5 R6 #-1        ; Set R5 to R6 minus
        ;|                                        |;
        ;| Allocate space for 0 variables         |;
           ADD R6 R6 #0                           ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_ADDNUM ; return A + B;
        ; -- // Get A and Get B
        LDR R0 R5 #4        ; Load A into R0
        LDR R1 R5 #5        ; Load B into R1

        ; -- // A + B
        ADD R0 R0 R1        ; Add A + B. Store in R0

        ; -- // return (result of A + b)
        STR R0 R5 #3        ; Store R0 into Return Value

        ;; --------\\ Tear Down Stack Frame  \\-------- ;;
        ;|                                            |;
        ;| Deallocate space 0 variables               |;
           ADD R6 R6 #0                               ;|
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

        ; } // End of addNum()

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
