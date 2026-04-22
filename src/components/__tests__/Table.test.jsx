import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../ui/table';

describe('Table', () => {
  // Renders a complete table with all subcomponents
  it('should render a complete table with all subcomponents', () => {
    render(
      <Table>
        <TableCaption>Test Table Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Item 1</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Item 2</TableCell>
            <TableCell>200</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>300</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText('Test Table Caption')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });

  // Renders Table with correct HTML structure
  it('should render table element inside a wrapper div', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const wrapper = container.firstChild;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.querySelector('table')).toBeTruthy();
  });

  // Applies className to Table
  it('should apply className to Table', () => {
    const { container } = render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = container.querySelector('table');
    expect(table.className).toContain('custom-table');
  });

  // Applies className to TableHeader
  it('should apply className to TableHeader', () => {
    const { container } = render(
      <table>
        <TableHeader className="custom-header">
          <TableRow>
            <TableHead>H</TableHead>
          </TableRow>
        </TableHeader>
      </table>
    );

    const thead = container.querySelector('thead');
    expect(thead.className).toContain('custom-header');
  });

  // Applies className to TableBody
  it('should apply className to TableBody', () => {
    const { container } = render(
      <table>
        <TableBody className="custom-body">
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    const tbody = container.querySelector('tbody');
    expect(tbody.className).toContain('custom-body');
  });

  // Applies className to TableFooter
  it('should apply className to TableFooter', () => {
    const { container } = render(
      <table>
        <TableFooter className="custom-footer">
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </table>
    );

    const tfoot = container.querySelector('tfoot');
    expect(tfoot.className).toContain('custom-footer');
  });

  // Applies className to TableRow
  it('should apply className to TableRow', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow className="custom-row">
            <TableCell>Row</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    const tr = container.querySelector('tr');
    expect(tr.className).toContain('custom-row');
  });

  // Applies className to TableHead
  it('should apply className to TableHead', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead className="custom-th">Header</TableHead>
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th.className).toContain('custom-th');
  });

  // Applies className to TableCell
  it('should apply className to TableCell', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-td">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td.className).toContain('custom-td');
  });

  // Applies className to TableCaption
  it('should apply className to TableCaption', () => {
    const { container } = render(
      <table>
        <TableCaption className="custom-caption">Caption</TableCaption>
      </table>
    );

    const caption = container.querySelector('caption');
    expect(caption.className).toContain('custom-caption');
  });

  // Verify displayName on all forwardRef components
  it('should have displayName on Table', () => {
    expect(Table.displayName).toBe('Table');
  });

  it('should have displayName on TableHeader', () => {
    expect(TableHeader.displayName).toBe('TableHeader');
  });

  it('should have displayName on TableBody', () => {
    expect(TableBody.displayName).toBe('TableBody');
  });

  it('should have displayName on TableFooter', () => {
    expect(TableFooter.displayName).toBe('TableFooter');
  });

  it('should have displayName on TableRow', () => {
    expect(TableRow.displayName).toBe('TableRow');
  });

  it('should have displayName on TableHead', () => {
    expect(TableHead.displayName).toBe('TableHead');
  });

  it('should have displayName on TableCell', () => {
    expect(TableCell.displayName).toBe('TableCell');
  });

  it('should have displayName on TableCaption', () => {
    expect(TableCaption.displayName).toBe('TableCaption');
  });

  // Renders with correct semantic HTML elements
  it('should render correct semantic HTML elements', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>H1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>C1</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>F1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(container.querySelector('div')).toBeTruthy();
    expect(container.querySelector('table')).toBeTruthy();
    expect(container.querySelector('thead')).toBeTruthy();
    expect(container.querySelector('tbody')).toBeTruthy();
    expect(container.querySelector('tfoot')).toBeTruthy();
    expect(container.querySelector('tr')).toBeTruthy();
    expect(container.querySelector('th')).toBeTruthy();
    expect(container.querySelector('td')).toBeTruthy();
  });
});
