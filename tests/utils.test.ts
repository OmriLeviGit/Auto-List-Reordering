import "./__mocks__/main";
import { createMockEditor } from "./__mocks__/createMockEditor";

import { getLineInfo, getListStart, getLastListStart, isFirstInNumberedList } from "src/utils";

describe("getLineInfo tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const testCases = [
        {
            name: "single digit line",
            input: "1. text",
            expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: false },
        },
        {
            name: "multiple digits line",
            input: "123. text",
            expected: { spaceCharsNum: 0, spaceIndent: 0, number: 123, textIndex: 5, isCheckBox: false },
        },
        {
            name: "no digits line",
            input: ". text",
            expected: { spaceCharsNum: 0, spaceIndent: 0, number: undefined, textIndex: undefined, isCheckBox: false },
        },
        {
            name: "line with leading spaces",
            input: "  1. test",
            expected: { spaceCharsNum: 2, spaceIndent: 2, number: 1, textIndex: 5, isCheckBox: false },
        },
        {
            name: "line with leading tab",
            input: "\t1. test",
            expected: { spaceCharsNum: 1, spaceIndent: 4, number: 1, textIndex: 4, isCheckBox: false },
        },
        {
            name: "line with leading two spaces and a tab",
            input: "  \t12. test",
            expected: { spaceCharsNum: 3, spaceIndent: 6, number: 12, textIndex: 7, isCheckBox: false },
        },
        {
            name: "line with leading space and two tab",
            input: " \t\t12. test",
            expected: { spaceCharsNum: 3, spaceIndent: 9, number: 12, textIndex: 7, isCheckBox: false },
        },
        {
            name: "line without number and with trailing spaceCharsNum",
            input: "  . text   ",
            expected: { spaceCharsNum: 2, spaceIndent: 2, number: undefined, textIndex: undefined, isCheckBox: false },
        },
        {
            name: "line with invalid format",
            input: "A text",
            expected: { spaceCharsNum: 0, spaceIndent: 0, number: undefined, textIndex: undefined, isCheckBox: false },
        },
    ];

    testCases.forEach(({ name, input, expected }) => {
        test(name, () => {
            const result = getLineInfo(input);
            expect(result).toEqual(expected);
        });
    });
});

// describe("getLineInfo checkbox tests", () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     const testCases = [
//         {
//             name: "",
//             input: "- [ ] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: false },
//         },
//         {
//             name: "",
//             input: "- [x] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: true },
//         },
//         {
//             name: "",
//             input: " - [ ] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: false },
//         },
//         {
//             name: "",
//             input: " - [x] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: true },
//         },
//         {
//             name: "",
//             input: "\t- [ ] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: false },
//         },
//         {
//             name: "",
//             input: "\t- [x] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: true },
//         },
//         {
//             name: "",
//             input: "123. [ ] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: false },
//         },
//         {
//             name: "",
//             input: "123. [x] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: true },
//         },
//         {
//             name: "",
//             input: " 123. [ ] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: false },
//         },
//         {
//             name: "",
//             input: " 123. [x] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: true },
//         },
//         {
//             name: "",
//             input: "\t123. [ ] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: false },
//         },
//         {
//             name: "",
//             input: "\t123. [x] text",
//             expected: { spaceCharsNum: 0, spaceIndent: 0, number: 1, textIndex: 3, isCheckBox: true, isChecked: true },
//         },
//     ];

//     testCases.forEach(({ name, input, expected }) => {
//         test(name, () => {
//             const result = getLineInfo(input);
//             expect(result).toEqual(expected);
//         });
//     });
// });

describe("getListStart tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const testCases = [
        {
            name: "start of a list",
            content: ["1. item 1", "2. item 2"],
            index: 1,
            expected: 0,
        },
        {
            name: "middle of a list",
            content: ["1. item 1", "2. item 2", "3. item 3"],
            index: 2,
            expected: 0,
        },
        {
            name: "no number in the line",
            content: ["1. item 1", "2. item 2", "not a number"],
            index: 2,
            expected: undefined,
        },
        {
            name: "accessing a negative line index",
            content: ["1. item 1", "2. item 2"],
            index: -1,
            expected: undefined,
        },
        {
            name: "out of bounds line index",
            content: ["1. item 1", "2. item 2"],
            index: 3,
            expected: undefined,
        },
        {
            name: "only empty lines above",
            content: ["", "", "3. item 3"],
            index: 2,
            expected: 2,
        },
        {
            name: "indented",
            content: ["1. text", " 1. text", "2. text"],
            index: 2,
            expected: 0,
        },
    ];

    testCases.forEach(({ name, content, index, expected }) => {
        test(name, () => {
            const editor = createMockEditor(content);
            const result = getListStart(editor, index);
            expect(result).toBe(expected);
        });
    });
});

describe("getLastListStart tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const testCases = [
        {
            name: "Does not end in numbered list",
            content: ["1. b", "c"],
            expected: undefined,
        },
        {
            name: "Numbered lines at the end",
            content: ["a", "b", "1. c", "2. d"],
            expected: 2,
        },
        {
            name: "Interrupted numbered list at the end",
            content: ["a", "1. b", "2. c", "d", "3. e"],
            expected: 4,
        },
        {
            name: "Single number",
            content: ["1. a"],
            expected: 0,
        },
        {
            name: "Single non number",
            content: ["a"],
            expected: undefined,
        },
        {
            name: "Empty string",
            content: [""],
            expected: undefined,
        },
    ];

    testCases.forEach(({ name, content, expected }) => {
        test(name, () => {
            const res = getLastListStart(content);
            expect(res).toBe(expected);
        });
    });
});

describe("isFirstInNumberedList tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const testCases = [
        {
            name: "First",
            content: ["1. a", "2. b"],
            index: 0,
            expected: true,
        },
        {
            name: "Not first",
            content: ["1. a", "2. b"],
            index: 1,
            expected: false,
        },
        {
            name: "One item",
            content: ["1. a"],
            index: 0,
            expected: true,
        },
        {
            name: "One item indented",
            content: [" 1. a"],
            index: 0,
            expected: true,
        },
        {
            name: "First indented",
            content: ["1. a", " 2. b"],
            index: 1,
            expected: true,
        },
        {
            name: "Second indented",
            content: ["1. a", " 2. b", " 3. b"],
            index: 2,
            expected: false,
        },
        {
            name: "Second indented",
            content: ["1. a", " 2. b", " 3. b"],
            index: 2,
            expected: false,
        },
        {
            name: "Second with indent in the middle",
            content: ["1. a", " 2. b", "3. c"],
            index: 2,
            expected: false,
        },
        {
            name: "Lower indent in the middle",
            content: ["1. a", " 2. b", "3. c", " 4. d"],
            index: 3,
            expected: true,
        },
        {
            name: "Text alone",
            content: ["text"],
            index: 0,
            expected: false,
        },
        {
            name: "Text before",
            content: ["text", "1. a"],
            index: 1,
            expected: true,
        },
        {
            name: "Text before indented",
            content: ["text", " 1. a"],
            index: 1,
            expected: true,
        },
        {
            name: "Text before indented",
            content: ["text", " 1. a"],
            index: 1,
            expected: true,
        },
    ];

    testCases.forEach(({ name, content, index, expected }) => {
        test(name, () => {
            const editor = createMockEditor(content);
            const res = isFirstInNumberedList(editor, index);
            expect(res).toBe(expected);
        });
    });
});
