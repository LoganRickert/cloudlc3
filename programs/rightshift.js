RIGHTSHIFT
        ; int rightShift(num, times) {

        ;; --------\ Program \-------- ;;
        ;; int mask = 0;
        ;; int end = 0;
        ;; int add = 1;
        ;; shift -= 1;
        ;;
        ;; while (shift != 0) {
        ;;      shift -= 1;
        ;;      add += add;
        ;; }
        ;;
        ;; mask = add + add;
        ;;
        ;; while (mask != 0) {
        ;;      if (x & mask != 0) {
        ;;          end += add;
        ;;      }
        ;;      add += add;
        ;;      mask += mask;
        ;; }
        ;;
        ;; return end;
        ;; --------/ Program /-------- ;;

        ;; --------\ Stack \-------- ;;
        ;; | add                   | ;; #-2 | R6 - Stack Pointer
        ;; | mask                  | ;; #-1
        ;; | end                   | ;; #0  | R5 - Frame Pointer
        ;; | Frame Pointer (R5)    | ;;
        ;; | Return Address (R7)   | ;;
        ;; | Return Value          | ;; #3
        ;; | num                   | ;; #4
        ;; | times                 | ;; #5
        ;; | -- Bottom of Stack -- | ;;
        ;; --------/ Stack /-------- ;;

        ;; --------\ Build Stack Frame  \-------- ;;
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
        ;| Allocate space for 3 variables         |;
           ADD R6 R6 #-3                          ;;
        ;|                                        |;
        ;; --------/ Build Stack Frame  /-------- ;;
_RIGHTSHIFT

        ; mask = 0
        AND R0 R0 #0
        STR R0 R5 #-1   ; store mask

        ; end = 0
        STR R0 R5 #0    ; store end

        ; add = 1
        ADD R0 R0 #1
        STR R0 R5 #-2   ; store add

        ; shift -= 1
        LDR R0 R5 #5    ; load shift
        ADD R0 R0 #-1
        STR R0 R5 #5    ; store shift

        ; while (shift != 0) {
RIGHTSHIFT_WHILE1
        LDR R0 R5 #5    ; load shift
        BRz RIGHTSHIFT_WHILE1E
        
        ; shift -= 1
        ADD R0 R0 #-1
        STR R0 R5 #5    ; store shift

        ; add += add
        LDR R0 R5 #-2   ; load add
        ADD R0 R0 R0
        STR R0 R5 #-2   ; store add

        BRnzp RIGHTSHIFT_WHILE1
RIGHTSHIFT_WHILE1E
        ; } // while 1 end

        ; mask = add + add
        LDR R0 R5 #-2   ; load add
        ADD R0 R0 R0
        STR R0 R5 #-1   ; store mask

RIGHTSHIFT_WHILE2
        ; while (mask != 0) {
        ; LDR R0 R5 #-1 ; Load mask ; mask already in R0
        BRz RIGHTSHIFT_WHILE2E

        ; if (x & mask != 0) {
RIGHTSHIFT_IF1
        LDR R1 R5 #4    ; Load x
        AND R0 R0 R1
        BRz RIGHTSHIFT_IF1E

        ; end += add
        LDR R0 R5 #-2   ; Load add
	LDR R1 R5 #0	; Load end
        ADD R0 R0 R1
        STR R0 R5 #0    ; Store end

RIGHTSHIFT_IF1E
        ; } // end if 1

        ; add += add
	LDR R0 R5 #-2	; load add
        ADD R0 R0 R0
        STR R0 R5 #-2   ; store add

        ; mask += mask
        LDR R0 R5 #-1   ; store mask
        ADD R0 R0 R0
        STR R0 R5 #-1   ; store mask

        BRnzp RIGHTSHIFT_WHILE2
        ; } // while 2 end
RIGHTSHIFT_WHILE2E

        ; return end
        LDR R0 R5 #0    ; load end
        STR R0 R5 #3    ; store return value

        ;; --------\ Tear Down Stack Frame  \-------- ;;
        ;|                                            |;
        ;| Deallocate space 3  variables              |;
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

        ; } // End of rightShift()