import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import {
    dataGridTemplate,
    DataGrid,
    DataGridRow,
    dataGridRowTemplate,
    DataGridCell,
    dataGridCellTemplate
} from "./index";
import type { ColumnDefinition } from "./data-grid";
import { DataGridRowTypes, GenerateHeaderOptions } from "./data-grid.options";
import { DOM } from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp, keyEnd, keyHome, keySpace } from "@microsoft/fast-web-utilities";

const FASTDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate
})

const FASTDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate
})

const FASTDataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate
})

// Utility functions to generate test data
export function newDataSet(rowCount: number): object[] {
    const newRows: object[] = [];
    for (let i = 0; i < rowCount; i++) {
        newRows.push(newDataRow(`${i + 1}`));
    }
    return newRows;
}

export function newDataRow(id: string): object {
    return {
        item1: `value 1-${id}`,
        item2: `value 2-${id}`,
        item3: `value 3-${id}`,
        item4: `value 4-${id}`,
        item5: `value 5-${id}`,
        item6: `value 6-${id}`,
    };
}

const arrowUpEvent = new KeyboardEvent("keydown", {
    key: keyArrowUp,
    bubbles: true,
} as KeyboardEventInit);

const arrowDownEvent = new KeyboardEvent("keydown", {
    key: keyArrowDown,
    bubbles: true,
} as KeyboardEventInit);

const homeEvent = new KeyboardEvent("keydown", {
    key: keyHome,
    bubbles: true,
    ctrlKey: true,
} as KeyboardEventInit);

const endEvent = new KeyboardEvent("keydown", {
    key: keyEnd,
    bubbles: true,
    ctrlKey: true,
} as KeyboardEventInit);

const spaceEvent = new KeyboardEvent("keydown", {
    key: keySpace,
    bubbles: true,
} as KeyboardEventInit);

const cellQueryString = '[role="cell"], [role="gridcell"], [role="columnheader"]';

async function setup() {
    const { document, element, connect, disconnect} = await fixture(
        [FASTDataGrid(), FASTDataGridRow(), FASTDataGridCell()]
    );
    return { document, element, connect, disconnect};
}

describe("Data grid", () => {
    it("should set role to 'grid'", async () => {
        const { document, element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("role")).to.equal("grid");

        await disconnect();
    });

    it("should have a tabIndex of 0 by default", async () => {
        const {  document, element, connect, disconnect } = await setup();
        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should have a tabIndex of -1 when no-tabbing is true", async () => {
        const {  document, element, connect, disconnect } = await setup();
        element.noTabbing = true;
        await connect();

        expect(element.getAttribute("tabindex")).to.equal("-1");

        await disconnect();
    });

    it("should have a tabIndex of -1 when a cell is focused", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();

        expect(element.getAttribute("tabindex")).to.equal("-1");

        await disconnect();
    });

    it("should generate basic column definitions when generateColumns is called", async () => {
        const columns: ColumnDefinition[] = DataGrid.generateColumns(newDataRow("test"));
        expect(columns.length).to.equal(6);
        expect(columns[0].columnDataKey).to.equal("item1");
        expect(columns[5].columnDataKey).to.equal("item6");
    });

    it("should generate a basic grid with a row header based on rowsdata only", async () => {
        const {  document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        expect(rows.length).to.equal(6);
        expect(rows[0].rowType).to.equal(DataGridRowTypes.header);

        await disconnect();
    });

    it("should not generate a header when generateHeader is set to 'none'", async () => {
        const {  document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        element.generateHeader = GenerateHeaderOptions.none;
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        expect(rows.length).to.equal(5);
        expect(rows[0].rowType).to.equal(DataGridRowTypes.default);

        await disconnect();
    });

    it("should not generate a header when rowsData is empty", async () => {
        const {  document, element, connect, disconnect } = await setup();
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        expect(rows.length).to.equal(0);

        await disconnect();
    });

    it("should generate a sticky header when generateHeader is set to 'sticky'", async () => {
        const {  document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        element.generateHeader = GenerateHeaderOptions.sticky;
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        expect(rows.length).to.equal(6);
        expect(rows[0].rowType).to.equal(DataGridRowTypes.stickyHeader);

        await disconnect();
    });

    it("should set the row index attribute of child rows'", async () => {
        const { document, element, connect, disconnect } = await setup();
        element.rowsData = newDataSet(5);
        element.generateHeader = GenerateHeaderOptions.sticky;
        await connect();

        const rows: DataGridRow[] = Array.from(element.querySelectorAll('[role="row"]'));

        await DOM.nextUpdate();

        expect(rows.length).to.equal(6);
        expect(rows[0].rowIndex).to.equal(0);
        expect(rows[1].rowIndex).to.equal(1);
        expect(rows[2].rowIndex).to.equal(2);
        expect(rows[3].rowIndex).to.equal(3);
        expect(rows[4].rowIndex).to.equal(4);
        expect(rows[5].rowIndex).to.equal(5);

        await disconnect();
    });

    it("should move focus with up/down arrow key strokes", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-1");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.textContent).to.contain("value 1-1");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.textContent).to.contain("item1");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.textContent).to.contain("item1");

        await disconnect();
    });

    it("should move focus to first/last cells with ctrl + home/end key strokes", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        document.activeElement?.dispatchEvent(endEvent);
        expect(document.activeElement?.textContent).to.contain("value 6-2");

        document.activeElement?.dispatchEvent(homeEvent);
        expect(document.activeElement?.textContent).to.contain("item1");

        await disconnect();
    });

    it("should move focus by setting focusRowIndex", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        element.focusRowIndex = 1;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("value 1-1");

        element.focusRowIndex = 2;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        element.focusRowIndex = 3;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("value 1-2");

        await disconnect();
    });

    it("should move focus by setting focusColumnIndex", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(2);

        await connect();

        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        expect(rows.length).to.equal(3);
        const cells: Element[] = Array.from(rows[0].querySelectorAll(cellQueryString));
        expect(cells.length).to.equal(6);

        (cells[0] as HTMLElement).focus();
        expect(document.activeElement?.textContent).to.contain("item1");

        element.focusColumnIndex = 1;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("item2");

        element.focusColumnIndex = 6;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("item6");

        element.focusColumnIndex = 7;
        await DOM.nextUpdate();
        expect(document.activeElement?.textContent).to.contain("item6");

        await disconnect();
    });

    it("should auto generate grid-columns from a manual row", async () => {
        const {  document, element, connect, disconnect } = await setup();

        const row = new DataGridRow();
        row.appendChild(new DataGridCell());
        row.appendChild(new DataGridCell());
        element.appendChild(row);
        await connect();
        await DOM.nextUpdate();

        expect(row.gridTemplateColumns).to.equal("1fr 1fr");

        await disconnect();
    });

    it("should not apply initial selection in default 'none' selection mode", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("initial-selection", "1")

        await connect();
        await DOM.nextUpdate();

        const selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));

        expect(selectedRows.length).to.equal(0);
        expect((element as DataGrid).selectedRowIndexes.length).to.equal(0);

        await disconnect();
    });

    it("should apply initial selection in 'single-row' selection mode", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("initial-selection", "1")
        element.setAttribute("selection-mode", "single-row")

        await connect();
        await DOM.nextUpdate();

        const selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));

        expect(selectedRows.length).to.equal(1);
        expect((element as DataGrid).selectedRowIndexes[0]).to.equal(1);

        await disconnect();
    });

    it("should apply initial selection in 'multi-row' selection mode", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("initial-selection", "1, 2")
        element.setAttribute("selection-mode", "multi-row")

        await connect();
        await DOM.nextUpdate();

        const selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));

        expect(selectedRows.length).to.equal(2);
        expect((element as DataGrid).selectedRowIndexes[0]).to.equal(1);
        expect((element as DataGrid).selectedRowIndexes[1]).to.equal(2);

        await disconnect();
    });

    it("should apply user set selection in 'single-row' selection mode" , async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("selection-mode", "single-row")

        await connect();
        await DOM.nextUpdate();

        let selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(0);

        (element as DataGrid).selectedRowIndexes = [1];
        await DOM.nextUpdate();
        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(1);
        expect((selectedRows[0] as DataGridRow).rowIndex).to.equal(1);

        (element as DataGrid).selectedRowIndexes = [4];
        await DOM.nextUpdate();
        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(1);
        expect((selectedRows[0] as DataGridRow).rowIndex).to.equal(4);

        (element as DataGrid).selectedRowIndexes = [];
        await DOM.nextUpdate();
        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(0);

        await disconnect();
    })

    it("should not allow selection of header row by default" , async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("selection-mode", "single-row")

        await connect();
        await DOM.nextUpdate();

        let selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(0);

        (element as DataGrid).selectedRowIndexes = [0];
        await DOM.nextUpdate();
        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(0);

        await disconnect();
    })

    it("should allow selection of header row when 'select-row-header' is true" , async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("selection-mode", "single-row");
        element.setAttribute("select-row-header", "true");

        await connect();
        await DOM.nextUpdate();

        let selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(0);

        (element as DataGrid).selectedRowIndexes = [0];
        await DOM.nextUpdate();
        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(1);

        await disconnect();
    })

    it("should select and deselect rows with space bar key", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("selection-mode", "single-row");
        element.setAttribute("select-row-header", "true");

        await connect();
        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        let cells: Element[] = Array.from(rows[1].querySelectorAll(cellQueryString));

        (cells[0] as HTMLElement).focus();
        document.activeElement?.dispatchEvent(spaceEvent);

        await DOM.nextUpdate();

        let selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(1);
        expect((element as DataGrid).selectedRowIndexes[0]).to.equal(1);

        cells = Array.from(rows[2].querySelectorAll(cellQueryString));
        (cells[0] as HTMLElement).focus();
        document.activeElement?.dispatchEvent(spaceEvent);

        await DOM.nextUpdate();

        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(1);
        expect((element as DataGrid).selectedRowIndexes[0]).to.equal(2);

        document.activeElement?.dispatchEvent(spaceEvent);

        await DOM.nextUpdate();

        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(0);

        await disconnect();
    });

    it("should select and deselect rows with click", async () => {
        const { document, element, connect, disconnect } = await setup();

        element.rowsData = newDataSet(5);
        element.setAttribute("selection-mode", "single-row");
        element.setAttribute("select-row-header", "true");

        await connect();
        await DOM.nextUpdate();

        const rows: Element[] = Array.from(element.querySelectorAll('[role="row"]'));
        let cells: Element[] = Array.from(rows[1].querySelectorAll(cellQueryString));

        (cells[0] as HTMLElement).click();

        await DOM.nextUpdate();

        let selectedRows: Element[] = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(1);
        expect((element as DataGrid).selectedRowIndexes[0]).to.equal(1);

        cells = Array.from(rows[2].querySelectorAll(cellQueryString));
        (cells[0] as HTMLElement).click();

        await DOM.nextUpdate();

        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(1);
        expect((element as DataGrid).selectedRowIndexes[0]).to.equal(2);

        (cells[0] as HTMLElement).click();

        await DOM.nextUpdate();

        selectedRows = Array.from(element.querySelectorAll('[aria-selected="true"]'));
        expect(selectedRows.length).to.equal(0);

        await disconnect();
    });
});
