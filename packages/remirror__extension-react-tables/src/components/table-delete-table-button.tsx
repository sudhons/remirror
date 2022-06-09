import React, { CSSProperties, MouseEventHandler, useCallback } from 'react';
import type { FindProsemirrorNodeResult } from '@remirror/core';
import { findParentNodeOfType, isElementDomNode, last } from '@remirror/core';
import {
  defaultAbsolutePosition,
  hasStateChanged,
  isPositionVisible,
  Positioner,
} from '@remirror/extension-positioner';
import { TableMap } from '@remirror/pm/tables';
import { Icon, PositionerPortal } from '@remirror/react-components';
import { useCommands } from '@remirror/react-core';
import type { UsePositionerReturn } from '@remirror/react-hooks';
import { usePositioner } from '@remirror/react-hooks';
import { ExtensionTablesTheme } from '@remirror/theme';

import { mergeDOMRects } from '../utils/dom';

interface DeleteTableButtonPositionerData {
  tableResult: FindProsemirrorNodeResult;
}

function createDeleteTableButtonPositioner(): Positioner<DeleteTableButtonPositionerData> {
  return Positioner.create<DeleteTableButtonPositionerData>({
    hasChanged: hasStateChanged,

    getActive(props) {
      const { selection } = props.state;
      const tableResult = findParentNodeOfType({ types: 'table', selection });

      if (tableResult) {
        const positionerData: DeleteTableButtonPositionerData = {
          tableResult,
        };
        return [positionerData];
      }

      return Positioner.EMPTY;
    },

    getPosition(props) {
      const { view, data } = props;

      const { node, pos } = data.tableResult;
      const map = TableMap.get(node);

      const firstCellDOM = view.nodeDOM(pos + map.map[0] + 1);
      const lastCellDOM = view.nodeDOM(pos + last(map.map) + 1);

      if (
        !firstCellDOM ||
        !lastCellDOM ||
        !isElementDomNode(firstCellDOM) ||
        !isElementDomNode(lastCellDOM)
      ) {
        return defaultAbsolutePosition;
      }

      const rect = mergeDOMRects(
        firstCellDOM.getBoundingClientRect(),
        lastCellDOM.getBoundingClientRect(),
      );
      const editorRect = view.dom.getBoundingClientRect();

      // The top and left relative to the parent `editorRect`.
      const left = view.dom.scrollLeft + rect.left - editorRect.left;
      const top = view.dom.scrollTop + rect.top - editorRect.top;
      const visible = isPositionVisible(rect, view.dom);

      const margin = 16;

      return {
        rect,
        visible,
        height: 0,
        width: 0,
        x: left + rect.width / 2,
        y: top + rect.height + margin,
      };
    },
  });
}

export interface TableDeleteInnerButtonProps {
  /**
   * The position of the button
   */
  position: UsePositionerReturn;

  /**
   * The action when the button is pressed.
   */
  onClick: MouseEventHandler;
}

export const TableDeleteInnerButton: React.FC<TableDeleteInnerButtonProps> = ({
  position,
  onClick,
}) => {
  const size = 18;
  return (
    <div
      ref={position.ref}
      onMouseDown={(e) => {
        // onClick doesn't work. I don't know why.
        onClick(e);
      }}
      style={
        {
          '--remirror-table-delete-button-y': `${position.y}px`,
          '--remirror-table-delete-button-x': `${position.x}px`,
        } as CSSProperties
      }
      className={ExtensionTablesTheme.TABLE_DELETE_ROW_COLUMN_INNER_BUTTON}
    >
      <Icon name='deleteBinLine' size={size} color={'#ffffff'} />
    </div>
  );
};

export interface TableDeleteButtonProps {
  Component?: React.ComponentType<TableDeleteInnerButtonProps>;
}

const deleteButtonPositioner = createDeleteTableButtonPositioner();

function usePosition() {
  const position = usePositioner(deleteButtonPositioner, []);
  return position;
}

export const TableDeleteButton: React.FC<TableDeleteButtonProps> = ({ Component }) => {
  const position = usePosition();
  const { deleteTable } = useCommands();

  const handleClick = useCallback(() => {
    deleteTable();
  }, [deleteTable]);

  Component = Component ?? TableDeleteInnerButton;

  return (
    <PositionerPortal>
      <Component position={position} onClick={handleClick} />
    </PositionerPortal>
  );
};
