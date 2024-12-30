import { createMockEditor } from "./__mocks__/createMockEditor";
import "./__mocks__/main";

import { getCheckboxInfo } from "src/utils";
import { getCheckboxEndIndex } from "src/checkbox";
import SettingsManager from "src/SettingsManager";

describe("getCheckboxInfo checkbox tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const testCases = [
        {
            name: "Test with unchecked checkbox at the start of a line",
            input: "- [ ] text",
            index: 0,
            isNumberDetected: false,
            expected: { isCheckbox: true, isChecked: false },
        },
        {
            name: "Test with checked checkbox at the start of a line",
            input: "- [x] text",
            index: 0,
            isNumberDetected: false,
            expected: { isCheckbox: true, isChecked: true },
        },
        {
            name: "Test with unchecked checkbox with space at the start",
            input: " - [ ] text",
            index: 0,
            isNumberDetected: false,
            expected: { isCheckbox: true, isChecked: false },
        },
        {
            name: "Test with checked checkbox with space at the start",
            input: " - [x] text",
            index: 0,
            isNumberDetected: false,
            expected: { isCheckbox: true, isChecked: true },
        },
        {
            name: "Test with unchecked checkbox with tab indentation",
            input: "\t- [ ] text",
            index: 0,
            isNumberDetected: false,
            expected: { isCheckbox: true, isChecked: false },
        },
        {
            name: "Test with checked checkbox with tab indentation",
            input: "\t- [x] text",
            index: 0,
            isNumberDetected: false,
            expected: { isCheckbox: true, isChecked: true },
        },
        {
            name: "Test with unchecked checkbox in numbered list",
            input: "123. [ ] text",
            index: 5,
            isNumberDetected: true,
            expected: { isCheckbox: true, isChecked: false },
        },
        {
            name: "Test with checked checkbox in numbered list",
            input: "123. [x] text",
            index: 5,
            isNumberDetected: true,
            expected: { isCheckbox: true, isChecked: true },
        },
        {
            name: "Test with unchecked checkbox and leading space in numbered list",
            input: " 123. [ ] text",
            index: 6,
            isNumberDetected: true,
            expected: { isCheckbox: true, isChecked: false },
        },
        {
            name: "Test with checked checkbox and leading space in numbered list",
            input: " 123. [x] text",
            index: 6,
            isNumberDetected: true,
            expected: { isCheckbox: true, isChecked: true },
        },
        {
            name: "Test with unchecked checkbox and tab indentation in numbered list",
            input: "\t123. [ ] text",
            index: 6,
            isNumberDetected: true,
            expected: { isCheckbox: true, isChecked: false },
        },
        {
            name: "Test with checked checkbox and tab indentation in numbered list",
            input: "\t123. [x] text",
            index: 6,
            isNumberDetected: true,
            expected: { isCheckbox: true, isChecked: true },
        },
    ];

    testCases.forEach(({ name, input, index, isNumberDetected, expected }) => {
        test(name, () => {
            const result = getCheckboxInfo(input, index, isNumberDetected);
            expect(result).toEqual(expected);
        });
    });
});

describe("getCheckboxEndIndex - unchecked end detection tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const testCases = [
        {
            name: "Test with a single non-checkbox line",
            content: ["a"],
            index: 0,
            expected: undefined,
        },
        {
            name: "Test with numbered list containing a single item",
            content: ["1. a"],
            index: 0,
            expected: undefined,
        },
        {
            name: "Test with a single unchecked checkbox",
            content: ["- [ ] a"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test with two unchecked checkboxes",
            content: ["- [ ] a", "- [ ] b"],
            index: 0,
            expected: 2,
        },
        {
            name: "Test with two unchecked checkboxes, selecting second checkbox",
            content: ["- [ ] a", "- [ ] b"],
            index: 1,
            expected: 2,
        },
        {
            name: "Test with mixed checkboxes and non-checkbox lines",
            content: ["- [ ] a", "- [ ] b", "c", "- [ ] d"],
            index: 0,
            expected: 2,
        },
        {
            name: "Test with space indented checkbox and text",
            content: ["- [ ] a", " text", "- [ ] c"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test with tab indented checkbox and text",
            content: ["- [ ] a", "\ttext", "- [ ] c"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test with space nested checkbox and item",
            content: ["- [ ] a", " - [ ] b", "- [ ] c", "d"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test with tab nested checkbox and item",
            content: ["- [ ] a", "\t- [ ] b", "- [ ] c", "d"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test with space nested numbers and checkboxes",
            content: ["1. [ ] a", "2. [ ] b", " t1. [ ] c", "3. [ ] d"],
            index: 0,
            expected: 2,
        },
        {
            name: "Test with tab nested numbers and checkboxes",
            content: ["1. [ ] a", "2. [ ] b", "\t1. [ ] c", "3. [ ] d"],
            index: 0,
            expected: 2,
        },
        {
            name: "Test with space nested checkboxes and multiple levels",
            content: ["1. [ ] a", " 1. [ ] b", " 2. [ ] c", "2. [ ] d"],
            index: 1,
            expected: 3,
        },
        {
            name: "Test with tab nested checkboxes and multiple levels",
            content: ["1. [ ] a", "\t1. [ ] b", "\t2. [ ] c", "2. [ ] d"],
            index: 1,
            expected: 3,
        },
        {
            name: "Test with nested checkboxes and text",
            content: ["1. [ ] a", "\t1. [ ] b", "\t2. [ ] c", "\ttext", "2. [ ] d"],
            index: 1,
            expected: 3,
        },
        {
            name: "Test with nested checkboxes and numbered text",
            content: ["1. [ ] a", "\t1. [ ] b", "\t2. [ ] c", "\t3. text", "\ttext", "2. [ ] d"],
            index: 1,
            expected: 3,
        },
    ];

    testCases.forEach(({ name, content, index, expected }) => {
        test(name, () => {
            const editor = createMockEditor(content);
            const res = getCheckboxEndIndex(editor, index);
            expect(res).toBe(expected);
        });
    });
});

describe("getCheckboxEndIndex - sort to top tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const testCases = [
        {
            name: "Test index 0 checked",
            content: ["- [x] a"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test index 0 unchecked",
            content: ["- [ ] a"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test default",
            content: ["- [ ] a", "- [x] b", "- [x] c"],
            index: 0,
            expected: 2,
        },
        {
            name: "Test sort to top with indent",
            content: ["- [ ] a", "- [x] b", "\t- [x] c", "- [ ] d"],
            index: 0,
            expected: 2,
        },
        {
            name: "Test indented sort to top",
            content: ["- [ ] a", "\t- [ ] b", "\t- [x] c", "\t- [x] d", "- [x] e"],
            index: 1,
            expected: 3,
        },
        {
            name: "Test no checked item",
            content: ["- [ ] a", "- [ ] b", "- [ ] c"],
            index: 0,
            expected: 3,
        },
        {
            name: "Test all items checked",
            content: ["- [x] a", "- [x] b", "- [x] c"],
            index: 0,
            expected: 1,
        },
    ];

    testCases.forEach(({ name, content, index, expected }) => {
        test(name, () => {
            SettingsManager.getInstance().setSortCheckboxesBottom(false);
            const editor = createMockEditor(content);
            const res = getCheckboxEndIndex(editor, index);

            expect(res).toBe(expected);
        });
    });
});

describe("getCheckboxEndIndex - sort to bottom tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const testCases = [
        {
            name: "Test index 0 checked",
            content: ["- [x] a"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test index 0 unchecked",
            content: ["- [ ] a"],
            index: 0,
            expected: 1,
        },
        {
            name: "Test default",
            content: ["- [ ] a", "- [x] b", "- [x] c"],
            index: 0,
            expected: 3,
        },
        {
            name: "Test sort to bottom with indent",
            content: ["- [ ] a", "- [x] b", "\t- [x] c", "- [ ] d"],
            index: 0,
            expected: 2,
        },
        {
            name: "Test indented sort to bottom",
            content: ["- [ ] a", "\t- [ ] b", "\t- [x] c", "\t- [x] d", "- [x] e"],
            index: 1,
            expected: 4,
        },
        {
            name: "Test no checked item",
            content: ["- [ ] a", "- [ ] b", "- [ ] c"],
            index: 0,
            expected: 3,
        },
        {
            name: "Test no checked item",
            content: ["- [ ] a", "- [ ] b", "- [ ] c", "d"],
            index: 0,
            expected: 3,
        },
        {
            name: "Test all items checked",
            content: ["- [x] a", "- [x] b", "- [x] c"],
            index: 0,
            expected: 3,
        },
    ];

    testCases.forEach(({ name, content, index, expected }) => {
        test(name, () => {
            SettingsManager.getInstance().setSortCheckboxesBottom(true);
            const editor = createMockEditor(content);
            const res = getCheckboxEndIndex(editor, index);

            expect(res).toBe(expected);
        });
    });
});
