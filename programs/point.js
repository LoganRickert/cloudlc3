
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG x3000
        
        ;; --------\\ Bootstrap \\-------- ;;

BOOTSTRAP
        ; Set up the stack
        LD R5 STK_PTR
        LD R6 STK_PTR

        JSR MAIN            ; Call main
        JSR POP             ; Pop return value from main

        HALT

STK_PTR .FILL x4FFF         ; Stack Pointer

        ;; --------/ Bootstrap /-------- ;;

MAIN    ; int main() {

        ;; --------\\ Program \\-------- ;;
        ;; --------/ Program /-------- ;;

        ;; --------\\ Stack \\-------- ;;
        ;; | testPoint*            | ;; #0 | R6 - Stack Pointer | R5 - Frame Pointer
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
        ;| Allocate space for 1 variables         |;
           ADD R6 R6 #-1                          ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_MAIN   ; Point* testPoint = new Point();
        JSR POINT___NEW__       ; call Point.__new__();
        JSR POP                 ; Get return address of Point object
        STR R0 R5 #0            ; Store return in testPoint

        ; testPoint.setX(4);
        AND R0 R0 #0
        ADD R0 R0 #4            ; Get 4
        JSR PUSH                ; Push 4
        LDR R0 R5 #0            ; Get testPoint
        JSR PUSH                ; Push testPoint
        JSR POINT_SETX          ; call setX(testPoint, 4)
        JSR POP                 ; Get return value
        ADD R6 R6 #2            ; Pop pushed arguments

        ; temp = testPoint.getX();
        LDR R0 R5 #0            ; Get testPoint
        JSR PUSH                ; Push testPoint
        JSR POINT_GETX          ; call getX(testPoint);
        JSR POP                 ; Get return value
        ADD R6 R6 #1            ; Pop pushed arguments

        ; print(temp);
        LD R1 ASCII_ZERO        ; Convert int to char
        ADD R0 R0 R1            ; Add offset
        OUT                     ; Print character out

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

ASCII_ZERO .FILL x30

        ; } // End of main()

        ; class Point {
        ; int x;        #0
        ; int y;        #1

POINT___NEW__
        ; function Point* __new__() {

        ;; --------\\ Stack \\-------- ;;
        ;; | ----                  | ;; #0  | R5 - Frame Pointer | R6 - Stack Pointer 
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
        ;| Allocate space for 0 variables         |;
           ADD R6 R6 #0                           ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_POINT___NEW__
        ; temp = alloc(2); // 2 variables
        AND R0 R0 #0            ; Get 0
        ADD R0 R0 #2            ; Space for x and y
        JSR PUSH                ; Push 2
        JSR ALLOC               ; Call alloc(2);
        JSR POP                 ; Get return value
        ADD R6 R6 #1            ; Remove variable pushed

        ; return temp;
        STR R0 R5 #3            ; Store in return value;
        
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

        ; } // End of __new__()

POINT_SETX
        ; function void setX(Point* this, int x) {
        
        ;; --------\\ Stack \\-------- ;;
        ;; | ----                  | ;; #0  | R5 - Frame Pointer | R6 - Stack Pointer 
        ;; | Frame Pointer (R5)    | ;;
        ;; | Return Address (R7)   | ;;
        ;; | Return Value          | ;; #3
        ;; | this*                 | ;; #4
        ;; | x                     | ;; #5
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
        ;| Allocate space for 0 variables         |;
           ADD R6 R6 #0                           ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_POINT_SETX
        ; this->x = x;
        LDR R0 R5 #4            ; Load this
        LDR R1 R5 #5            ; Load x
        STR R1 R0 #0            ; this->x = temp;
        
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

        ; } // End of setX()

POINT_GETX
        ; function int getX(Point* this) {
        
        ;; --------\\ Stack \\-------- ;;
        ;; | ----                  | ;; #0  | R5 - Frame Pointer | R6 - Stack Pointer 
        ;; | Frame Pointer (R5)    | ;;
        ;; | Return Address (R7)   | ;;
        ;; | Return Value          | ;; #3
        ;; | this*                 | ;; #4
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
        ;| Allocate space for 0 variables         |;
           ADD R6 R6 #0                           ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_POINT_GETX
        ; temp = this->x;
        LDR R0 R5 #4            ; Load this
        LDR R0 R0 #0            ; this->x;
        
        ; return temp;
        STR R0 R5 #3            ; Store in return value;

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

        ; } // End of getX()

        ; } // End of Point class

ALLOC   ; int alloc(int space) {

        ;; --------\\ Program \\-------- ;;
        ;;
        ;; int alloc(int space) {
        ;;     int HEAP_POINTER = 0x5000;
        ;;     int HEAP_SIZE = 0xFF;
        ;;     int HEAP_BLOCK = 0x10;
        ;;     
        ;;     int heapPointer = NULL;
        ;;     
        ;;     if (space > 0) {
        ;;         space = (space / HEAP_BLOCK) + 1;
        ;;         
        ;;         int found = 0;
        ;;         // Skip the heap table
        ;;         int heapIndex = HEAP_BLOCK;
        ;;         
        ;;         while (found < space && heapIndex <= HEAP_SIZE) {
        ;;             int val = HEAP_POINTER[heapIndex];
        ;; 
        ;;             if (val == 0) {
        ;;                 if (heapPointer == NULL) {
        ;;                     heapPointer = heapIndex;
        ;;                 }
        ;;                 heapIndex++;
        ;;                 found++;
        ;;             } else {
        ;;                 heapIndex += val;
        ;;                 found = 0;
        ;;                 heapPointer = NULL;
        ;;             }
        ;;         }
        ;;         
        ;;         if (found < space) {
        ;;             heapPointer = NULL;
        ;;         } else {
        ;;             HEAP_POINTER[heapPointer] = space;
        ;;             heapPointer = (heapPointer << 4) + HEAP_POINTER;
        ;;         }
        ;;     }
        ;; 
        ;;     return heapPointer;
        ;; }
        ;; 
        ;; --------/ Program /-------- ;;

        ;; --------\\ Stack \\-------- ;;
        ;; | heapIndex             | ;; #-3 | R6 - Stack Pointer 
        ;; | val                   | ;; #-2
        ;; | found                 | ;; #-1
        ;; | heapPointer           | ;; #0  | R5 - Frame Pointer
        ;; | Frame Pointer (R5)    | ;;
        ;; | Return Address (R7)   | ;;
        ;; | Return Value          | ;; #3
        ;; | space                 | ;; #4
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
        ;| Allocate space for 4 variables         |;
           ADD R6 R6 #-4                           ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;

_ALLOC
        ; int heapPointer = NULL;
        AND R0 R0 #0            ; Get 0
        STR R0 R5 #0            ; Set heapPointer = 0;

        ; if (space > 0) { // if 1
ALLOCIF1
        LDR R0 R5 #4            ; Load Space
        BRnz ALLOCIF1E          ; If <= 0, goto end

        ; space = (space / HEAP_BLOCK) + 1;
        ; -- // space / HEAP_BLOCK
        LDR R0 R5 #4            ; Load space
        LD R1 HEAP_BLOCK        ; Load heap_block
        JSR DIVIDE              ; r = a / b

        ; -- // r = r + 1
        ADD R0 R0 #1            ; r + 1
        
        ; -- // space = r
        STR R0 R5 #4

        ; int found = 0;
        AND R0 R0 #0
        STR R0 R5 #-1

        ; // The heap table takes up the first xF slots.
        ; int heapIndex = HEAP_BLOCK
        LD R0 HEAP_BLOCK
        STR R0 R5 #-3

        ; while (found < space && heapIndex <= HEAP_SIZE) { // while 1
ALLOCWHILE1
        ; -- // found + -space != zero | positive
        LDR R0 R5 #-1           ; Load found
        LDR R1 R5 #4            ; Load space
        NOT R1 R1               ; -space
        ADD R1 R1 #1            ; -space
        ADD R0 R0 R1            ; Compare
        BRzp ALLOCWHILE1E       ; End while loop

        ; -- // heapIndex + -HEAP_SIZE != positive
        LDR R0 R5 #-3           ; Load heapIndex
        LD R1 HEAP_SIZE         ; Load heap_size
        NOT R1 R1               ; -heapSize
        ADD R1 R1 #1            ; -heapSize
        ADD R0 R0 R1            ; Compare
        BRp ALLOCWHILE1E        ; End while loop

        ; int val = HEAP_POINTER[heapIndex];
        ; -- // r = pointer at HEAP_POINTER[heapIndex]
        LD R0 HEAP_POINTER      ; Load heap_pointer
        LDR R1 R5 #-3           ; Load heapIndex
        ADD R0 R0 R1            ; Add index to pointer
        
        ; -- // r = value at r
        LDR R0 R0 #0            ; Load value at pointer

        ; -- // val = r
        STR R0 R5 #-2

        ; if (val == 0) { // if 2
ALLOCIF2
        LDR R0 R5 #-2           ; Load val
        BRnp ALLOCIF2ELSE       ; Go to else if not zero

        ; if (heapPointer == NULL) { // if 3
ALLOCIF3
        LDR R0 R5 #0            ; Load heapPointer
        BRnp ALLOCIF3E          ; Go to end if not zero
        
        ; heapPointer = heapIndex;
        LDR R0 R5 #-3           ; Load heapIndex
        STR R0 R5 #0            ; Store heapIndex in heapPointer

ALLOCIF3E
        ; } // end if 3

        ; heapIndex++;
        LDR R0 R5 #-3           ; Load heapIndex
        ADD R0 R0 #1            ; ++
        STR R0 R5 #-3           ; Store result

        ; found++;
        LDR R0 R5 #-1           ; Load found
        ADD R0 R0 #1            ; ++
        STR R0 R5 #-1           ; Store result

        BRnzp ALLOCIF2E
        
ALLOCIF2ELSE
        ; } else { // if 2 else
        
        ; heapIndex += val;
        ; -- // r = heapIndex + val
        LDR R0 R5 #-3           ; Load heapIndex
        LDR R1 R5 #-2           ; Load val
        ADD R0 R0 R1            ; a + b
        
        ; -- // heapIndex = r
        STR R0 R5 #-3

        ; found = 0;
        AND R0 R0 #0            ; Get 0
        STR R0 R5 #-1           ; Store 0 at found

        ; heapPointer = 0;
        AND R0 R0 #0            ; Get 0
        STR R0 R5 #0            ; Store 0 at heapPointer

ALLOCIF2E
        ; } // end if 2

        BRnzp ALLOCWHILE1       ; Return to top of while 1

ALLOCWHILE1E
        ; } // end while 1
        BR #1

        ; if (found < space) { // if 4
ALLOCIF4
        ; -- // found + -space == zero | positive
        LDR R0 R5 #-1           ; Load found
        LDR R1 R5 #4            ; Load space
        NOT R1 R1               ; -space
        ADD R1 R1 #1            ; -space
        ADD R0 R0 R1            ; Compare
        BRzp ALLOCIF4ELSE

        ; heapPointer = NULL;
        AND R0 R0 #0            ; Get 0
        STR R0 R5 #0            ; Set heapPointer = 0

        BRnzp ALLOCIF4E

ALLOCIF4ELSE
        ; } else { // if 4 else

        ; HEAP_POINTER[heapPointer] = space
        ; -- // r = pointer at HEAP_POINTER[heapPointer]
        LD R0 HEAP_POINTER      ; Load heap_pointer
        LDR R1 R5 #0            ; Load heapPointer
        ADD R0 R0 R1            ; Add index to pointer
        
        ; -- // space
        LDR R1 R5 #4            ; Load space
        
        ; -- // r = space
        STR R1 R0 #0            ; Store space at address

        ; heapPointer = (heapPointer << 4) + HEAP_POINTER;
        ; -- // r = heapPointer << 4
        LDR R0 R5 #0            ; Load heapPointer
        ADD R0 R0 R0            ; << 1
        ADD R0 R0 R0            ; << 1
        ADD R0 R0 R0            ; << 1
        ADD R0 R0 R0            ; << 1

        ; r = r + heap_pointer
        LD R1 HEAP_POINTER      ; Load heap_pointer
        ADD R0 R0 R1

        ; heapPointer = r
        STR R0 R5 #0

ALLOCIF4E
        BR #1
        ; } // end if 4

ALLOCIF1E
        ; } // end if 1

        ; return heapPointer
        LDR R0 R5 #0            ; Load heapPointer;
        STR R0 R5 #3            ; Store in return value;

        ;; --------\\ Tear Down Stack Frame  \\-------- ;;
        ;|                                            |;
        ;| Deallocate space 4 variables               |;
           ADD R6 R6 #4                               ;|
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

HEAP_POINTER    .FILL x5000
HEAP_SIZE       .FILL xFF
HEAP_BLOCK      .FILL x10

        ; } // End of alloc()

;; ========== Sub-routines ========== ;;

PUSH    ADD R6 R6 #-1
        STR R0 R6 #0
        RET

POP     LDR R0 R6 #0
        ADD R6 R6 #1
        RET

DIVIDE  ST R2 ASAVR2

        ; ---------------------
        ; int a = 100;
        ; int b = 10;
        ; ---------------------
        ; b = -b;
        ; int times = 0;

        ; while ((a = a + b) >= 0) {
        ;   times++;
        ; }

        ; return times;

        ; ---------------------

        ; b = -b
        NOT R1 R1
        ADD R1 R1 #1

        ; times = 0;
        AND R2 R2 #0

        ; while ((a = a + b) >= 0) {
DWHILE1 ADD R0 R0 R1  ; a = a + b
        BRn DWHILE1E

        ; times++;
        ADD R2 R2 #1
        BRnzp DWHILE1

        ; }
DWHILE1E

        ; return times;
        AND R0 R0 #0
        ADD R0 R2 #0

        LD R2 ASAVR2

        RET

ASAVR2  .FILL x0

        .END
`
    }
]
