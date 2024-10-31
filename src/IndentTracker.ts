import { Editor } from "obsidian";
import { getLineInfo } from "./utils";

export default class IndentTracker {
    private stack: (number | undefined)[];
    private lastStackIndex: number;

    constructor(editor: Editor, currLine: number) {
        this.stack = [];

        if (currLine < 0) return;

        const offset = getLineInfo(editor.getLine(currLine)).spaceIndent;

        let prevIndex = currLine - 1;
        while (prevIndex > 0) {
            const prevOffset = getLineInfo(editor.getLine(currLine)).spaceIndent;
            if (prevOffset <= offset) {
                break;
            }
            prevIndex--;
        }

        for (let i = Math.max(prevIndex, 0); i < currLine; i++) {
            this.insert(editor.getLine(i));
        }

        this.lastStackIndex = this.stack.length - 1;
        //console.debug("stack after creation: ", this.stack);
    }

    get(): (number | undefined)[] {
        return this.stack;
    }

    setLastValue(value: number) {
        if (this.lastStackIndex > 0) {
            this.stack[this.lastStackIndex] = value;
        } else {
            //console.debug("the stack is empty");
        }
    }

    insert(textLine: string) {
        const info = getLineInfo(textLine);
        this.lastStackIndex = info.spaceIndent;

        this.stack[this.lastStackIndex] = info.number; // undefined means no numbered list in that offset
        this.stack.length = this.lastStackIndex + 1;
        //console.debug("stack after insertion: ", this.stack, "last index: ", this.lastStackIndex);
    }
}
