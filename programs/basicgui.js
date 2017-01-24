
var codeFiles = [
    {
        name: "main.asm",
        code: `

        .ORIG   x3000

	; Enable the GUI
	AND R0 R0 #0	; Clear R0
	ADD R0 R0 #1	; Need to make 'egui' non-zero
	STI R0 egui	; Gui now enabled

	; R0 = x
	; R1 = y
	; R2 = y&x
	; R3 = i
	AND R0 R0 #0
	AND R1 R1 #0
	AND R2 R2 #0
	AND R3 R3 #0

	; Start at x,y = (5,5)
	ADD R0 R0 #5
	ADD R1 R1 #5

	; Iterate 10 times
	ADD R3 R3 #10

for1	ADD R3 R3 #-1
	BRn end		; Check if we're done with drawing line.

	AND R2 R2 #0
	; Add y to R2 and move over to 0xff00.
	ADD R2 R1 #0
	
	; Move R2 from 0xff to 0xff00
	ADD R2 R2 R2
	ADD R2 R2 R2
	ADD R2 R2 R2
	ADD R2 R2 R2
	ADD R2 R2 R2
	ADD R2 R2 R2
	ADD R2 R2 R2
	ADD R2 R2 R2

	; Add x to R2
	ADD R2 R2 R0

	; Draw 
	STI R2 pos
	
	; Increment X
	ADD R0 R0 #1

	; Jump back to start of loop
	BRnzp for1

end	HALT

egui	.FILL xFE16
pos	.FILL xFE11
dem	.FILL xFE12
col	.FILL xFE13

        .END

`
    }
]
